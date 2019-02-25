// pages/register/register.js
import WxValidate from '../../utils/WxValidate.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */ 
  data: {
    userInfor:{},
    frequent:0,
    success: 0
  },

  submit:function(e){
    const that = this;
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
    }, 3000);
    if (!this.WxValidate.checkForm(e.detail.value)) {
      wx.showToast({
        title: this.WxValidate.errorList[0].msg,
        icon: 'none'
      });
      return;
    }
    wx.getUserInfo({
      success: function (userInfo){
        const data = e.detail.value;
        Object.assign(data,{
          headImage: JSON.parse(userInfo.rawData).avatarUrl
        })
        wx.login({
          success: function (res) {
            data.openid = res.code;
            wx.request({
              url: app.hostapi + "register/",
              data,
              method: 'POST',
              dataType: 'JSON',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                console.log(res);
                if(that.data.success == 0)
                  return;
                const response = JSON.parse(res.data);
                if(response.state == 1)
                  that.setData({
                    success :1
                  })
                wx.showModal({
                  title: 'ouc掌上数学',
                  content: typeof response.msg == 'object' ? '信息填写错误' : response.msg,
                  showCancel: false,
                  success: function () {
                    if (response.state == 1) {
                      wx.login({
                        success: function (res) {
                          // data.jscode = res.code;x
                          wx.request({
                            url: app.hostapi + "login/",
                            data:{
                              stuCode:data.stuCode,
                              password:data.password,
                              jscode:res.code
                            },
                            method: 'POST',
                            dataType: 'JSON',
                            header: { "Content-Type": "application/x-www-form-urlencoded" },
                            success: function (res) {
                              const data = JSON.parse(res.data)[0];
                              if (data.statu == 1) {
                                delete data.statu;
                                console.log(data);
                                wx.setStorage({
                                  key: "user",
                                  data
                                });
                                wx.redirectTo({
                                  url: '../index/index',
                                });
                              }
                              else{
                                wx.showModal({
                                  title: 'ouc掌上数学',
                                  content: '登录失败!',
                                })
                              }

                            },
                            fail: function (err) { }
                          })
                        }
                      })
                    }
                    else if (response.state == -3) {
                      wx.redirectTo({
                        url: '../login/login',
                      })
                    }
                  }
                })

              },
              fail: function (err) { }
            })
          }
        })

      },
      fail:function(){

      }
    })

  },
  getUserInfo: function (userInfo){
  },
  initValidate() {
    const rules = {
      nickName:{
        required:true,
        rangelength: [1, 18],
        spaceall: true,
      },
      stuCode: {
        required: true,
        digits: true,
        rangelength: [11, 12]
      },
      name: {
        required: true,
        rangelength: [2, 18],
        space: true,
      },
      password: {
        required: true,
        rangelength: [6, 20],
        space: true,
      },
      email: {
        required: true,
        email:true
      }
    }
    const messages = {
      nickName: {
        required: '请输入昵称',
        rangelength: '昵称长度超出范围',
        spaceall: '昵称不能纯为空格',
      },
      stuCode: {
        required: '请填写学号',
        digits: '学号非法字符',
        rangelength: '学号长度不符'
      },
      name: {
        required: '请输入姓名',
        rangelength: '姓名长度超出范围',
        space: '姓名中不能含有空格',
      },
      password: {
        required: '请填写密码',
        rangelength: '密码长度不符',
        space: '不能含有空格'
      },
      email: {
        required: '请输入邮箱',
        email: '邮箱格式不符'
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