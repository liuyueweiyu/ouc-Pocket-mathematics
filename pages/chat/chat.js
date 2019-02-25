// pages/chat/chat.js
import '../../utils/time.js' ;
const app = getApp();
const style = 'bottom:21rpx;';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAndroid:true,
    chaterimg:'',
    size:[],
    text:'',
    img:[],
    upinput: '',
    
  },
  send:function(e){
    console.log('formid')
    console.log(e)
    this.submitText(e.detail.formId);
  },
  cusImageLoad: function (e) {
    const list = this.data.size;
    list[e.target.dataset.index] = this.wxAutoImageCal(e);
    this.setData({
      size: list
    }); 
  },
  inputchange: function(e) {
    this.setData({
      text:e.detail.value
    })
  },
inputFocus(){
  this.setData({
    upinput: style
  });
},
inputBlur(){
  this.setData({
    upinput: ''
  });
},
  chooseImg: function (e) {
    const that = this;
    wx.chooseImage({
      count: 5,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          img: tempFilePaths
        });
        that.submitImage(0);
      }
    });
  },
  submitImage(i) {
    const len = this.data.img.length;
    if (len == 0)
      return;
    if (len == i){
      this.setData({
        img:[]
      })
      return;
    }
    const that = this;
    wx.uploadFile({
      url: app.hostapi + "sendMsgToUser/",
      filePath: this.data.img[i],
      header: { 'content-type': 'multipart/form-data' },
      method: 'POST',
      name: 'image',
      formData: {
        isPhoto: 'True',
        toUserId: this.data.id,
        session: app.user.session,
        Content: this.data.text,
        // formId
      },
      success: function (res) {
        const data = JSON.parse(res.data);
        if (data.state != 1){
          wx.showModal({
            title: 'ouc掌上数学',
            content: '图片发送失败!',
          })
        }
        else{
          const time = new Date().pattern("yyyy-MM-dd HH:mm:ss");
          const newchat = {
            Content: "",
            Time: time,
            image: data.image,
            isMe: 1,
            timetext:that.data.list.length == 0? time.substr(11,5):that.getTimestr(that.data.list[that.data.list.length - 1].Time,time)
          };
          wx.setStorage({
            key: app.user.stuCode+'-user-' + that.data.id,
            data: that.data.list.concat([newchat]),
          });
          that.setData({
            list: that.data.list.concat([newchat]),
            text: ''
          })
          that.submitImage(i+1);
        }
      },
      fail:function(err){
      }
    })
  },
  submitText(formId) {
    if (this.data.text.trim() == '')
      return;
    if(this.data.text.length >= 140){
      wx.showToast({
        title: '发送文本不超过140个字',
        icon:'none'
      })
      return;
    }
    const that = this;
    wx.request({
      url: app.hostapi + "sendMsgToUser/",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: 'POST',
      data:{
        photo:'',
        toUserId: this.data.id,
        session: app.user.session,
        isPhoto: '',
        Content:this.data.text,
        formId 
      },
      success: function (res) {
        if (res.data.state != 1) {
          wx.showModal({
            title: 'ouc掌上数学',
            content: '发送失败!',
          })
        }
        else{
          const time = new Date().pattern("yyyy-MM-dd HH:mm:ss");
          console.log(time)
          const newchat = {
            Content: that.data.text,
            Time: time,
            image: "",
            isMe: 1,
            timetext:that.data.list.length == 0? time.substr(11,5):that.getTimestr(that.data.list[that.data.list.length - 1].Time,time)
          };
          wx.setStorage({
            key: app.user.stuCode +'-user-' + that.data.id,
            data: that.data.list.concat([newchat]),
          })
          that.setData({
            list:that.data.list.concat([newchat]),
            text:''
          })
        }
      }
    })
  },
  wxAutoImageCal(e) {
    //获取图片的原始长宽
    var originalWidth = e.detail.width;
    var originalHeight = e.detail.height;
    var windowWidth = 0, windowHeight = 0;
    var autoWidth = 0, autoHeight = 0;
    var results = {};
    wx.getSystemInfo({
      success: function (res) {
        windowWidth =  res.windowWidth / 750 * 424;
        windowHeight = res.windowHeightd;
        //判断按照那种方式进行缩放
        if (originalWidth > windowWidth) {
          autoWidth = windowWidth ;
          autoHeight = (autoWidth * originalHeight) / originalWidth;
          results.imageWidth = autoWidth + 'px';
          results.imageheight = autoHeight + 'px';
        } else {//否则展示原来的数据
          results.imageWidth = originalWidth + 'px';
          results.imageheight = originalHeight + 'px';
        }
      }
    })

    return results;

  },
  openImg(event) {
    const urls = [],
      list = this.data.list;
    for (let i = 0, len = list.length; i < len; i++)
      if (list[i].image != '')
        urls.push(this.data.hostimg + list[i].image);
    wx.previewImage({
      current: this.data.hostimg+ event.target.dataset.imgsrc,
      urls // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#10AEFF',
    })
    wx.setNavigationBarTitle({
      title: options.name,
    })
    const that = this;
    this.setData({
      chaterimg:options.img,
      hostimg:app.hostimg,
      myimg: app.user.headImage,
      id:options.id
    })
    wx.getStorage({
      key: app.user.stuCode +'-user-'+options.id,
      success: function(res) {
        that.onloadAll(res.data,options.id);
      },
      fail:function(){
        that.onloadAll([],options.id);
      },
    });
    
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.platform);
        //ios
        if (res.platform == "ios") {
          that.setData({
            isAndroid: false
          });
        };
        wx.pageScrollTo({
          // scrollTop: res.windowHeight
        
        })
      }
    })
  },

  getTimestr: function (pre, now) {
    const pretime = new Date(pre).valueOf(),
      newtime = new Date(now).valueOf(),
      space = Math.floor((newtime - pretime) / 1000);
    if (Math.abs(space) < 600)
      return "";
    if (newtime - new Date().setHours(0, 0, 0, 0).valueOf() >= 0)
      return now.substr(11, 5);
    else if (newtime - new Date(new Date().setMonth(0, 1).valueOf()).setHours(0, 0, 0, 0).valueOf() < 0)
      return now.substr(0, 16);
    else
      return now.substr(5, 11);
  },

  onloadAll: function (msglist, id) {
    const that = this;
    wx.request({
      url: app.hostapi + "getMsgFromUser/",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      data: {
        session: app.user.session,
        fromUserId:id
      },
      success: function (res) {
        const data = res.data.result;
        const msg = msglist.concat(data);
        if (msg.length != 0){
          msg.reduce((pre,cur)=>{
            cur.timetext = that.getTimestr(pre.Time,cur.Time);
            return cur;
          })
          let str = that.getTimestr(new Date().valueOf(), msg[0].Time) ;
          msg[0].timetext = str == "" ? msg[0].Time.substr(11,5):str ;
          wx.setStorage({
            key: app.user.stuCode + '-user-' + id,
            data: msg
          })
        }
        that.setData({
          list: msg
        });
        
        var query = wx.createSelectorQuery();
        //选择id
        query.select('#chat').boundingClientRect()
        query.exec(function (res) {
          //res就是 所有标签为mjltest的元素的信息 的数组
          //取高度
          // console.log(res[0].height)
          wx.pageScrollTo({
            scrollTop: res[0].height,
          })
        })
      },
      fail: function (err) {

      }
    })
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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