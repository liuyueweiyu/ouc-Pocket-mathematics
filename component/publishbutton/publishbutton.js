// component/publistbutton/publishbutton.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text:String,
    isUrl:Number,
    isExperience:String,
    // submit:Function
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
    url:function(){
      wx.navigateTo({
        url: '/pages/pubcoumu/pubcoumu?isExperience=' + this.data.isExperience,
      });
    },
    submit:function(){
      console.log(12);
    }
  }
})
