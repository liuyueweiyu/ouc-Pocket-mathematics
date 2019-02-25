// pages/forget/forget.js
import WxValidate from '../../utils/WxValidate.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    email:'',
    stuCode:'',
    frequent:0,
    frequently:0,
  },
  submit:function(e){   //修改密码
    if (this.data.frequently == 1) {
      return;
    }
    this.setData({
      frequently: 1
    })
    setTimeout(() => {
      this.setData({
        frequently: 0
      });
    }, 1500);
    const data = e.detail.value;
    delete data.email;
    if (!this.WxValidate.checkForm(data)) {
      wx.showToast({
        title: this.WxValidate.errorList[0].msg,
        icon: 'none'
      });
      return;
    }
    wx.request({
      url: app.hostapi + "changePwd/",
      data,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        wx.showModal({
          title: 'ouc掌上数学',
          content: res.data[0].msg,
          success:function(){
            if(res.data[0].statu == 1){
              wx.redirectTo({
                url: '../login/login',
              })
            }
          }
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '未知错误!',
          icon: 'none'
        })
      }
    })
  },
  bindEmail:function(e){
    this.setData({
      email:e.detail.value
    })
  },
  bindStuCode: function (e) {
    this.setData({
      stuCode: e.detail.value
    })
  },
  sendEmail:function(e){  //发送邮件
    if (this.data.frequent == 1) {
      return;
    }
    this.setData({
      frequent: 1
    })
    setTimeout(() => {
      this.setData({
        frequent: 0
      });
    }, 1500);
    if (!/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(this.data.email)){
      wx.showToast({
        title: '邮件格式不符',
        icon: 'none'
      })
      return;
    }
    const that = this;
    wx.request({
      url: app.hostapi + "LookForPwd/",
      data:{
        stuCode: this.data.stuCode,
        email:this.data.email
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method:'POST',
      success: function (res) {
        const data = res.data[0];
        wx.showToast({
          title: data.msg,
          icon:'none'
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '发送失败!',
          icon: 'none'
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
      checkCode: {
        required: true,
        number: true,
        rangelength: [5, 5],
      },
      newPwd:{
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
      checkCode: {
        required: '请填写验证码',
        rangelength: '验证码长度不符',
        number: '验证码为纯数字',
      },
      newPwd:{
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
    })
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