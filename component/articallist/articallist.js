// component/articallist/articallist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:Array,
    loading:Number
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    article:function(e){
      console.log(e);
      wx.setStorage({
        key: 'article',
        data: e.currentTarget.dataste.link,
        // data:'http://mp.weixin.qq.com/s?__biz=MzUxNjkyMTA0Ng==&mid=2247483653&idx=1&sn=ce4dfdb137dfced7a162a8fb26878e7f&chksm=f9a142bcced6cbaa3fb29479ccde6f228142ab780d6ac72d9bc02a26fb4f0bebd0a64e5cdea0&scene=21&token=1542512203&lang=zh_CN#wechat_redirect',
        success:function(res){
          wx.navigateTo({
            url: '../article/article',
          })
        },
      })
    }
  }
})
