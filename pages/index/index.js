// pages/index/index.js
import regeneratorRuntime from '../../utils/runtime.js';
import TimeHelper from '../../utils/getTime.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    helplist: [],    //在线咨询列表
    hostimg: app.hostimg,
    Title: '',
    menuindex: 0,
    //消息回复相关data
    msgnumber: 0,   //未读消息总数
    replynumber: 0,  //未读回复总数
    unReadMsg: [],    //咨询列表
    unReadReply: [],  //回复列表
    storageMsg: [],
    // storageMsgUserMap:{},
    storageReply: [],
    // storageReplyUserMap:{}
    array: ['离线', '在线'],
    index: 1,
    isIPX:false,
    interval:1
  },
  help: function (e) {
    wx.navigateTo({
      url: '/pages/chat/chat?name=' + e.target.dataset.name + '&id=' + e.target.dataset.id + '&img=' + e.target.dataset.img,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const that = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        if(res.windowHeight > 800){
          that.setData({
            isIPX: true
          })
        }
      },
    })
    this.load(options);

  },
  bindPickerChange: function (e) {
    const that = this,
          index = e.detail.value;
    wx.request({
      url: app.hostapi + 'onlineState/',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        session: app.user.session,
        state: index == 1 ? 'onLine' :'offLine'
      },
      method: "POST",
      success: function (res) { 
        if(res.data.state == 1){
          // console.log(res);
          const user = that.data.user;
          user.isOnline = index == 1 ? true:false;
          that.setData({
            index: e.detail.value,
            user
          });
          wx.setStorage({
            key: 'user',
            data: user,
          })
        }
        
      },
      fail: function (err) { }
    })

  },
  home: async function(){
    const res = await this.getOnlinehelp();
    const data = res.data;
    this.setData({
      helplist: data.result,
      menuindex:0
    })
  },
  //页面加载函数
  load: async function (options) {
    try {
      //获取本地用户信息
      app.user = await this.getLocakInfor('user');
      if (app.user.session == undefined) {
        wx.redirectTo({
          url: '../login/login',
        });
        return;
      }
      this.setData({
        user: app.user,
        index:app.user.isOnline == false ? 0:1
      })
      let res;
      res = await this.getOnlinehelp();
      const data = res.data;
      let Title = '', TitleNav = '';
      if ((new Date().valueOf()) - (new Date(app.user.registerTime).valueOf()) < 86400000 * 3)
        Title = '使用说明', TitleNav = 'xxx';
      else
        Title = '最新资讯', TitleNav = '../news/news';
      this.setData({
        helplist: data.result,
        Title,
        TitleNav
      });
      await this.bindMsg();
      await this.bindReply();
      this.run();
    }
    catch (e) {
      console.log('err:')
      console.log(e);
      wx.redirectTo({
        url: '../login/login',
      });
    }
  },
  run:function(){
    if (this.data.user.isOnline) {
      const time = 1 * 60 * 1000;
      const interval = setInterval(() => {
        this.bindMsg();
      }, time);
      const replyinter = setInterval(()=>{
        this.bindReply();
      },time);
      this.setData({
        interval,
        replyinter
      });
    }
  },
  // 从本地获取用户信息
  getLocakInfor: function (key) {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key,
        success: function (res) { resolve(res.data) },
        fail: function (e) { reject(e); }
      });
    });
  },
  // 获取在线答疑列表
  getOnlinehelp: function () {
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.hostapi + "getTeacherInfo/",
        success: function (res) { return resolve(res); }
      });
    })

  },
  changeCover: function (e) {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0];
        wx.uploadFile({
          url: app.hostapi + "changeHeadImage/",
          filePath: tempFilePaths,
          header: { 'content-type': 'multipart/form-data' },
          method: 'POST',
          name: 'headImage',
          formData: {
            session: app.user.session,
          },
          success: function (res) {
            res = JSON.parse(res.data);
            console.log(res);
            if(res.state == 1){
              app.user.headImage = res.imageHead;
              getApp().user = app.user;
              that.setData({
                user: app.user
              })
              wx.setStorage({
                key: 'user',
                data: app.user,
              })
            }
          },
          fail: function (err) {
          }
        })
      }
    });
  },
  //获取有未读的文章列表
  getUnReadReply: function (session) {

    return new Promise((resolve, reject) => {
      wx.request({
        url: app.hostapi + "getUnReadReply/",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          session: session,
        },
        method: "POST",
        success: function (res) { resolve(res); },
        fail: function (err) { }
      })
    })
  },
  //获取未读的消息列表
  getUnReadMsg: function (session) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: app.hostapi + "getUnReadMsg/",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          session: session,
        },
        method: "POST",
        success: function (res) { resolve(res); },
      });
    })
  },
  //切换菜单
  changeMenu: function (e) {
    this.setData({
      menuindex: typeof e == 'number' ? e : typeof e == 'string' ? e : e.currentTarget.dataset.index
    });

  },
  //绑定消息列表
  bindMsg: async function () {
    let newlist = [],
      unReadMsg = await this.getUnReadMsg(app.user.session),
      storage,
      number = 0,
      userIndex = new Map();
    try {
      storage = await this.getLocakInfor('unReadMsg-' + app.user.stuCode);
    }
    catch (e) {
      storage = [];
    }
    if(unReadMsg.data.state != 1){
      wx.showToast({
        title: unReadMsg.data.msg,
        icon:'none'
      })
      wx.redirectTo({
        url: '../login/login',
      });
      return;
    }
    else{
      unReadMsg = unReadMsg.data.result;
    }
    let sum = 0;
    unReadMsg.forEach((v, i) => {
      sum += v.unReadNums;
      if (v.message.length > 15) 
        v.message = v.message.substr(0, 15);
      if (!userIndex.has(v.fromUserId))
        userIndex.set(v.fromUserId, i);
    });
    storage.forEach((v, i) => {
      if (userIndex.has(v.fromUserId)) {
        storage.splice(i, 1);
      }
    });
    this.setData({
      unReadMsg: unReadMsg.concat(storage),
      msgnumber: sum
    });
  },
  //打开咨询聊天框
  advisory: function (e) { 
    const index = e.currentTarget.dataset.index,
          list = this.data.unReadMsg,
          number = this.data.msgnumber - list[index].unReadNums;
    list[index].unReadNums = 0;

    this.setData({
      unReadMsg:list,
      msgnumber:number
    });
    const stolist = list.filter((v, i) => { return v.unReadNums == 0});
    console.log(stolist);
    wx.setStorage({
      key: 'unReadMsg-' + app.user.stuCode,
      data: stolist
    });
    wx.navigateTo({
      url: '../chat/chat?id=' + e.currentTarget.dataset.id + '&name=' + e.currentTarget.dataset.name + '&img=' + e.currentTarget.dataset.img,
    });
  },
  
  //绑定回复列表
  bindReply: async function (e) {
    let newlist = [],
      unReadReply = await this.getUnReadReply(app.user.session),
      storage,
      number = 0,
      userIndex = new Map();

    try {
      storage = await this.getLocakInfor('unReadReply-' + app.user.stuCode);
    }
    catch (e) {
      storage = [];
    }
    if (unReadReply.data.state != 1) {
      wx.showToast({
        title: unReadReply.data.msg,
        icon: 'none'
      })
      wx.redirectTo({
        url: '../login/login',
      });
      return;
    }
    else {
      unReadReply = unReadReply.data.result;
    }
    this.setData({
      unReadReply: unReadReply.concat(storage),
      replynumber: unReadReply.length
    });
  },
  //打开回复
  reply: function (e) {
    let index = e.currentTarget.dataset.index,
      list = this.data.unReadReply,
      count = 0,
      article = list[index].id;
    if (list[index].unReadNums != 0) {
      list.forEach((v,i)=>{
        if (v.unReadNums != 0 && v.id == article)
          v.unReadNums = 0,count++;
      })
      this.setData({
        unReadReply: list,
        replynumber: this.data.replynumber - count,
      });
      let slist = list.filter((v, i) => { return v.unReadNums == 0 });
      wx.setStorage({
        key: 'unReadReply-' + app.user.stuCode,
        data: slist
      });
      
    }

    wx.navigateTo({
      url: `/pages/detail/detail?commit=1&&id=${e.currentTarget.dataset.id}`
    });
  },
  logout: function () {
    wx.request({
      url: app.hostapi + 'logoff/',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        session: app.user.session,
        stuCode:app.user.stuCode
      },
      method: "POST",
      success: function (res) {
        console.log(res);
        if (res.data[0].statu == 1) {
          wx.setStorage({
            key: 'user',
            data: {},
          });
          wx.redirectTo({
            url: '../login/login',
          })
        }

      },
      fail: function (err) { }
    })

  },
  deleteadvisory:function(e){
    // console.log(e);
    const list = this.data.unReadMsg;
    list[e.target.dataset.index].delete = 'true';
    this.setData({
      unReadMsg:list
    });
    wx.getStorage({
      key: 'unReadMsg-'+app.user.stuCode,
      success: function(res) {
        //console.log(res);
        const data = res.data,
              id = list[e.target.dataset.index].fromUserId;
        for(let i = 0,len = data.length ; i<len ;i++){
          if(data[i].fromUserId == id){
            data[i].delete = 'true';
            break;
          }
        }
        wx.setStorage({
          key: 'unReadMsg-' + app.user.stuCode,
          data,
        })
      },
    })
    // console.log('delete')
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      user:getApp().user
    })
    this.run();
    //this.bindMsg(this.data.menuindex);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.interval);
    clearInterval(this.data.replyinter);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})