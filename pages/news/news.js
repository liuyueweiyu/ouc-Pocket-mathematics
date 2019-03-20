// pages/news/news.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: {
      imgsrc: '/images/banner-yellow.png',
      text: '最新资讯'
    },
    navlist: ['通知公告', '讲座信息'], 
    select: 0,
    type: '',
    list: [],
    loading: 0,
    can:1
  },
  changeCate: function (e) {
    this.setData({
      list: [],
      can: 1,
      loading: 0
    })
    this.getInfor(e.target.dataset.index, e.target.dataset.category,0,false);
  },
  getInfor(index, category,head,isBottom) {
    const that = this;
    const data = head == 0 ? { type: category, number:8 } : { type: category,head,number:8};
    wx.request({
      url: app.hostapi + "getPushArticle/",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data,
      success: function (res) {
        const data = res.data;
        if (data.state == 1) {
          // if (data.result.length != 0) {
            that.setData({
              list: isBottom ? that.data.list.concat(data.result) : data.result,
              select: index,
              loading: data.result.length < 5 ? 0 : 1,
            })
          // }
          // else {s
          //   that.setData({
          //     select: index,
          //     can: 0,
          //     loading:0
          //   })
          // }
        }
        else {
          wx.showModal({
            title: 'ouc掌上数学',
            content: '获取信息失败!',
          })
        }

      },
      fail: function (err) {

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    setTimeout(() => {
      this.setData({
        loading: 1
      });
    }, 100);
    this.getInfor(0, this.data.navlist[0],0,false);
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
    this.getInfor(this.data.select, this.data.navlist[this.data.select], this.data.list[this.data.list.length - 1].id, true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})