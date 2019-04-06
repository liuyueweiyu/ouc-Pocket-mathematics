//app.js
const ip = 'https://www.mathwechat.top/';
const hostapi = ip +'api/';
App({
  onLaunch: function () {
    // 展示本地存储能力

    

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow:function(){
    changeStage('onLine');
  },
  onHide:function(){
    changeStage('offLine');
  },
  globalData: {
    unread:0,
    unReadPeply:[],
    unReadMsg:[]
  },
  hostapi,
  hostimg: ip + 'media/',
  user:{}
})

function changeStage(state){
  wx.getStorage({
    key: 'user',
    success: function (res) {
      const user = res.data;
      wx.request({
        url: hostapi + 'onlineState/',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        data: {
          session: user.session,
          state
        },
        method: "POST",
        success: function (res) {
          if (res.data.state == 1) {
            user.isOnline = true;
            wx.setStorage({
              key: 'user',
              data: user,
            })
          }

        },
        fail: function (err) { }
      })

    },
  })
}