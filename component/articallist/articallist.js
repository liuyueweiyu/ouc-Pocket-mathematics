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
        data: e.currentTarget.dataset.link,
        success:function(res){
          wx.navigateTo({
            url: '../article/article',
          })
        },
      })
    }
  }
})
