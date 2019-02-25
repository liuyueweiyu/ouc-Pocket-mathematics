// pages/login/login.js
import WxValidate from '../../utils/WxValidate.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    frequent:0,
    success:0
  },

  submit:function(e){
    const that = this;
    if(this.data.frequent == 1){
      return;
    }
    this.setData({
      frequent:1
    })
    setTimeout(()=>{
      this.setData({
        frequent:0
      });
    },3000);
    if (!this.WxValidate.checkForm(e.detail.value)){
      console.log(this.WxValidate.errorList);
      wx.showToast({
        title: this.WxValidate.errorList[0].msg,
        icon:'none'
      });
      return;
    }
    wx.getUserInfo ({
      success: function (userInfo) {
        const data = e.detail.value;
        wx.login({
          success:function(res){
            data.jscode = res.code;
            wx.request({
              url: app.hostapi + "login/",
              data,
              method: 'POST',
              dataType: 'JSON',
              header: { "Content-Type": "application/x-www-form-urlencoded" },
              success: function (res) {
                const data = JSON.parse(res.data)[0];
                let msg;
                switch (data.statu) {
                  case -1: msg = '账号不存在!'; break;
                  case -2: msg = '密码不正确!'; break;
                  case -3: msg = '账号被禁用!'; break;
                  case 1: msg = '登录成功!'; break;
                  default: msg = '未知错误!'; break;
                }
                wx.showModal({
                  title: 'ouc掌上数学',
                  content: msg,
                  showCancel: false,
                  success: function () {
                    if (data.statu == 1 && that.data.success == 0) {
                      if (data.statu == 1){
                        that.setData({
                          success: 1
                        })
                      }
                      delete data.statu;
                      wx.setStorage({
                        key: "user",
                        data
                      });
                      wx.redirectTo({
                        url: '../index/index',
                      });
                    }
                  }
                })

              },
              fail: function (err) { }
            })
          }
        })
      },
      fail: function () {
        wx.showModal({
          title: 'ouc掌上数学',
          content: '获取用户头像失败',
        })
      }
    })
  },
  //验证函数
  initValidate() {
    const rules = {
      stuCode: {
        required: true,
        digits: true,
        rangelength: [11, 12]
      },
      password: {
        required: true,
        rangelength: [6, 20],
        space: true,
      }
    }
    const messages = {
      stuCode: {
        required: '请填写学号',
        digits: '学号非法字符',
        rangelength: '学号长度不符'
      },
      password: {
        required: '请填写密码',
        rangelength: '密码长度不符',
        space: '不能含有空格'
      }
    }
    this.WxValidate = new WxValidate(rules, messages)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#61D1E9',
    });
    this.initValidate();
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