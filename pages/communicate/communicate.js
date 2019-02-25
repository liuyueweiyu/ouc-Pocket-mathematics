// pages/communicate/communicate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:{
      imgsrc:'/images/banner-blue.png',
      text:'数学交流'
    },
    navlist: [
      {
        text: '线性代数', 
        src: '/pages/conmulist/conmulist?type=线性代数' 
      }, { 
        text: '高等数学',
        src: '/pages/conmulist/conmulist?type=高等数学'
      }, { 
        text: '概率统计',
        src: '/pages/conmulist/conmulist?type=概率统计' 
      }, {
        text: '数学分析',
        src: '/pages/conmulist/conmulist?type=数学分析',
      }, {
        text: '高等代数',
        src: '/pages/conmulist/conmulist?type=高等代数'
      }, {
        text: '其他',
        src: '/pages/conmulist/conmulist?type=其他'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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