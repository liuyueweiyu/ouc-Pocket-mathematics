// pages/editor/editor.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:''
  },
  cleartext:function(e){
    this.setData({
      text:''
    })
  },
  textbind:function(e){
    this.setData({
      text:e.detail.value
    })
  },
  submit:function(e){
    let text = e.detail.value.input,
        that = this,
        data = {
          session: app.user.session,
          [this.data.para]: text,
        }
    if(text.length == 0){
      wx.showToast({
        title: '昵称不能为空!',
        icon: 'none'
      })
      return;
    }
    if (text.trim() == '') {
      wx.showToast({
        title: '昵称不能为全空格!',
        icon:'none'
      })
      return;
    }
    if(text.trim() == ''){
      wx.showToast({
        title: '昵称不能为空或全空格!',
      })
      return;
    }
    wx.request({
      url: app.hostapi + this.data.urlpara,
      data,
      method: 'POST',
      dataType: 'JSON',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res);
        res = JSON.parse(res.data)
        if(res.state == 1){
          wx.getStorage({
            key: 'user',
            success: function (res) {
              app.user[that.data.para] = text;
              wx.setStorage({
                key: 'user',
                data: app.user,
              });
              
              setTimeout(() => {
                wx.navigateBack();
              }, 1000);
            },
          });
        }
        wx.showToast({
          title: res.msg,
        });

      },
      fail: function (err) {
        console.log(err);
      }
    })
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      para: 'nickName',
      urlpara: 'changeNickName/',
      title: '修改昵称',
      text:options.name
    })
    console.log(this.data.title);
    wx.setNavigationBarTitle({
      title: this.data.title,
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