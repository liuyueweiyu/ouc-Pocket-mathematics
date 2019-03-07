// component/imagelist.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    srcs: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    hostimg: app.hostimg,
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    cusImageLoad: function (e) {
      var that = this;
      //这里看你在wxml中绑定的数据格式 单独取出自己绑定即可
      that.setData(that.wxAutoImageCal(e));
    },
    openImg(event) {
      const urls = [],
            srcs = this.properties.srcs;
      for (let i = 0, len = srcs.length; i < len ;i++)
        urls[i] = this.data.hostimg + srcs[i];
      wx.previewImage({
        current:  event.target.dataset.imgsrc ,
        urls // 需要预览的图片http链接列表
      })
    },
    wxAutoImageCal(e) {
      // console.dir(e);
      //获取图片的原始长宽
      var originalWidth = e.detail.width;
      var originalHeight = e.detail.height;
      var windowWidth = 0, windowHeight = 0;
      var autoWidth = 0, autoHeight = 0;
      var results = {};
      wx.getSystemInfo({
        success: function (res) {
          // windowWidth = 296;
          windowWidth = res.windowWidth;
          windowHeight = res.windowHeight;
          //判断按照那种方式进行缩放
          if (originalWidth > windowWidth) {//在图片width大于手机屏幕width时候
            autoWidth = windowWidth + 'rpx';
          
            autoHeight = Math.floor((windowWidth * originalHeight) / originalWidth) +'rpx';
            console.log("autoHeight" + autoHeight);
            results.imageWidth = autoWidth;
            results.imageheight = autoHeight;
          } else {//否则展示原来的数据
            results.imageWidth = originalWidth + 'rpx';
            results.imageheight = originalHeight + 'rpx';
          }
        }
      })

      return results;

    },
  }
})
