// pages/detail/detail.js
const app = getApp();
import '../../utils/time.js';
const style = 'bottom:21rpx;';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article:{},
    upinput: '',
    list:[],
    isAndroid:true,
    img:'',
    text:'',
    commit:0
  },
  inputFocus() {
    this.setData({
      upinput: style
    });
  },
  inputBlur() {
    this.setData({
      upinput: ''
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.setNavigationBarTitle({
      title: '详情',
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#10AEFF',
    })
    wx.getSystemInfo({
      success: function (res) {
        if (res.platform == "ios") {
          that.setData({
            isAndroid: false
          })
        };
        wx.pageScrollTo({
          scrollTop: res.windowHeight
        })
      }
    })
    // const that = this;
    if (options.commit == 1){
      wx.request({
        url: app.hostapi + "getPointMathCCPost/",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          session: app.user.session,
          id: options.id
        },
        method: "POST",
        success: function (res) {
          const data = res.data;
          that.setData({
            article: data.result
          });
          wx.request({
            url: app.hostapi + "getPointMathCCReply/",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            data: {
              session: app.user.session,
              id: options.id
            },
            method: "POST",
            success: function (res) {
              const data = res.data;
              that.setData({
                list: data.reply,
                commit:1
              })
            },
            fail: function (err) {

            }
          })
        },
        fail: function (err) {

        }
      })

    }
    else{
      wx.request({
        url: app.hostapi + "getPointExpSharePost/",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          id: options.id
        },
        method: "GET",
        success: function (res) {
          const data = res.data;
          that.setData({
            article: data.result
          })
        },
        fail: function (err) {

        }
      })
    }
    
  },
  bindinput(event) {
    this.setData({
      text: event.detail.value
    })
  },
  reply(event) {
    const that = this;
    if (this.data.text.length >= 500) {
      wx.showToast({
        title: '发送评论不超过500个字',
        icon: 'none'
      })
      return;
    }
    if (this.data.img != ''){
      console.log('评论')
      console.log(that.data.img);
      wx.uploadFile({
        url: app.hostapi + "replyMathCCPost/",
        header: { 'content-type': 'multipart/form-data' },
        filePath: that.data.img,
        name: 'photo',
        formData: {
          toPostId: that.data.article.id,
          session: app.user.session,
          content: this.data.text,
          havePhoto: 'True'
        },
        method: "POST",
        success: function (res) { that.success(res); },
        fail: function (err) { }
      });
    }
    else if (this.data.text.trim() != '') {
      wx.request({
        url: app.hostapi + "replyMathCCPost/",
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          toPostId: that.data.article.id,
          session: app.user.session,
          content: this.data.text,
          havePhoto: 'None',
        },
        method: "POST",
        success: function (res) { that.success(res); },
        fail: function (err) { }
      })
    }
  },
  success: function (res) {
    const data = typeof res.data == 'string' ? JSON.parse(res.data) : res.data,
          that = this;
    wx.showToast({
      title: data.msg,
    });
    if (data.state == 1) {
      const time = new Date().pattern("yyyy-MM-dd HH:mm:ss");
      const newdata = {
        nickName: app.user.nickName,
        Time: time,
        Content:that.data.text,
        image:that.data.img == '' ? "": [that.data.img],
        headImage:app.user.headImage
      }
      that.setData({
        text: '',
        img: '',
        list:[newdata].concat(that.data.list)
      })
    }
  },
  chooseImg: function (e) {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        that.setData({
          img: tempFilePaths,
          // imgindex: e.target.dataset.index
        });
      }
    });
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