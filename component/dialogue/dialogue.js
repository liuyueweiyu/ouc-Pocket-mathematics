// component/dialogue/dialogue.js
const app = getApp();
import Url from '../../utils/url.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    reply:Number,
    list:Array,
    isAndroid:Boolean,
    loading:Number,
    empty:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    id:-1,
    text:'',
    img:'',
    imgindex: -1,
    textindex:-1,
    datalist:[],
    // loading:0
  },
  /**
   * 组件的方法列表
   */

  methods: {
    bindinput(event){ 
      this.setData({
        text: event.detail.value
      })
    },
    jump(event){
      // console.log(event);
      const item = event.currentTarget.dataset;
      const list = this.data.list;
      console.log(item)
      console.log(list);
      list[item.index].clickNum++; 
      this.setData({
        list
      })
      wx.navigateTo({
        url: `/pages/detail/detail?commit=${item.reply}&&id=${item.id}`,
      })
    },
    reply(event){
      
      const that = this;
      if (this.data.text.length >= 500) {
        wx.showToast({
          title: '发送评论不超过500个字',
          icon: 'none'
        })
        return;
      }
      if (this.data.img != ''){
        // console.log(this.data.img)
        wx.uploadFile({
          url: app.hostapi + "replyMathCCPost/",
          header: { 'content-type': 'multipart/form-data' },
          filePath: that.data.img,
          name: 'photo',
          formData: {
            toPostId: event.target.dataset.id,
            session: app.user.session,
            content: this.data.text,
            havePhoto: 'True'
            // havePhoto
          },
          method: "POST",
          success: function (res) { 
            that.triggerEvent('reply', event.target.dataset);
            that.success(res); },
          fail: function (err) { }
        });
      }
      else if (this.data.text.trim() != ''){
        // this.triggerEvent('reply', event.target.dataset);
        wx.request({
          url: app.hostapi + "replyMathCCPost/",
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          data: {
            toPostId: event.target.dataset.id,
            session: app.user.session,
            content: this.data.text,
            havePhoto:'None',
          },
          method: "POST",
          success: function (res) { 
            that.triggerEvent('reply', event.target.dataset);
            that.success(res); },
          fail: function (err) { }
        })
      }
    },
    success:function(res){
      const data = typeof res.data == 'string' ? JSON.parse(res.data):res.data;
      wx.showToast({
        title: data.msg,
      });
      
      if (data.state == 1) {
        
        this.setData({
          text: '',
          img: '',
          imgindex: -1,
        })
      }
    },
    chooseImg: function (e) {
      const that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths[0];
          that.setData({
            img: tempFilePaths,
            imgindex:e.target.dataset.index
          });
        }
      });
    },
    setTextindex:function(e){
      this.setData({
        textindex: e.target.dataset.index
      });
    }
  }
})


