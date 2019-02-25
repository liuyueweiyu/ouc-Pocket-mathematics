// pages/experience/experience.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: {
      imgsrc: '/images/banner-green.png',
      text: '经验分享'
    },
    list:[],
    loading:0,
    can:1,
    empty:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    setTimeout(() => {
      this.setData({
        empty: true
      })
    }, 1000)
    wx.request({
      url: app.hostapi + "getExpSharePosts/",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        const data = res.data;
        console.log(data);
        if (data.state == 1){
          that.setData({
            list: data.result,
            loading: data.result.length < 5 ? 0 : 1,
          });
        }
        else{
          wx.showModal({
            title: 'ouc掌上数学',
            content: '未知错误!',
          })
        }
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
    if (this.data.can == 0)
      return;
    const that = this;
    wx.request({
      url: app.hostapi + "getExpSharePosts/",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data:{
        head: this.data.list[this.data.list.length - 1].id,
      }, 
      success: function (res) {
        const data = res.data;
        console.log(data);
        if (data.state == 1){
          that.setData({
            list: that.data.list.concat(data.result)
          });
          if (data.result.length != 5)
            that.setData({
              loading: 0,
              can: 0
            })
        }
        else {
          wx.showModal({
            title: 'ouc掌上数学',
            content: '未知错误!',
          })
        }
      },
      fail: function (err) {

      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})