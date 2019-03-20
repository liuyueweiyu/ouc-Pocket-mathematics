import WxValidate from '../../utils/WxValidate.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: {
      imgsrc: '/images/banner-blue.png',
      text: '数学交流',
      isExperience:1,
      frequent:0
    },
    array: ['线性代数', '高等数学', '概率统计', '数学分析', '高等代数','其他'],
    index: 0,
    imgs: [],
    placeholder:0,
    id:-1
  },



  submit(e){
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
    const formdata = e.detail.value;
    if (!this.WxValidate.checkForm(formdata) && this.data.imgs.length != 1) {
      console.log(this.WxValidate.errorList);
      wx.showToast({
        title: this.WxValidate.errorList[0].msg,
        icon: 'none'
      });
      return;
    }
    const that = this;
    const url = app.hostapi + (this.data.isExperience == 1 ? "postExpSharePost/" : "postMathCCPost/"),
          sendData = Object.assign(formdata, {
            session: app.user.session,
            type: Number(this.data.index) + 1
          });
    if (this.data.isExperience == 1)
      delete sendData.type;
    wx.request({
      url,
      data: sendData,
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      success: function (res) {
        const data = res.data;
        if(data.state == 1){
          that.setData({
            id: data.id
          })
          if (that.data.imgs.length == 0){
            const msg = that.data.isExperience == 1 ? '管理员审核后即可发布' : '发布成功';
            wx.showModal({
              title: 'ouc掌上数学',
              content: msg,
              success:function(res){
                if (that.data.isExperience != 1){
                  wx.redirectTo({
                    url: '../conmulist/conmulist?type=' + that.data.array[that.data.index],
                  });
                }
                else{
                  wx.redirectTo({
                    url: '../experience/experience' ,
                  });
                }
              }
            });
            
          }
          else
            that.submitImage(0);
        }
        else
          wx.showModal({
            title: 'ouc掌上数学',
            content: data.msg,
          });
      },
      fail: function (err) {

      }
    })
  },
  submitImage(i) {
    const that = this;
    if (i == this.data.imgs.length) {
      const msg = that.data.isExperience == 1 ? '管理员审核后即可发布':'发布成功';
      wx.showModal({
        title: 'ouc掌上数学',
        content: msg,
        success: function (res) {
          if (that.data.isExperience != 1) {
            wx.redirectTo({
              url: '../conmulist/conmulist?type=' + that.data.array[that.data.index],
            });
          }
          else {
            wx.redirectTo({
              url: '../experience/experience',
            });
          }
        }
      })
      
      return;
    };
    wx.showToast({
      title: '上传图片' + (i + 1) + '/' + this.data.imgs.length,
    })
    console.log(this.data.imgs[i]);
    wx.uploadFile({
      url: app.hostapi + "uploadPhoto/",
      filePath: this.data.imgs[i],
      header: { 'content-type': 'multipart/form-data' },
      method: 'POST',
      name: 'photo',
      formData: {
        toId: this.data.id,
        type: this.data.isExperience == 1 ? "ExpShare" : "MathCC",
        session: app.user.session
      },
      success: function (res) {
        if (JSON.parse(res.data).state == 1) {
          that.submitImage(i + 1);
        }
        else {
          wx.showModal({
            title: 'ouc掌上数学',
            content: '图片上传出错!',
          })
        }
      }
    })
  },
  textFocus(e){
    this.setData({
      placeholder:1
    })
  },
  textBlur(e){
    let placeholder = 1;
    if (e.detail.value == "")
      placeholder = 0;
    this.setData({
      placeholder
    })
  },
  chooseImg: function (e) {
    const that = this;
    wx.chooseImage({
      count: 5, 
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], 
      success: function (res) {
        console.log(res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          imgs: tempFilePaths
        });
      }
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  initValidate() {
    const rules = {
      title: {
        required: true,
        rangelength: [1, 18],
        spaceall: true,
      },
      content: {
        required: true,
        rangelength: [1, 5000],
        spaceall: true,
      },
    }
    const messages = {
      title: {
        required: '请输入标题',
        rangelength: '标题长度超出范围',
        spaceall: '标题不能纯为空格',
      },
      content: {
        required: '请输入内容',
        rangelength: '内容长度超出范围',
        spaceall: '内容不能纯为空格',
      },
    }
    this.WxValidate = new WxValidate(rules, messages)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let text = '数学交流', color = '#10AEFF';
    if (options.isExperience == 1)
      text = '经验分享', color = '#09BB07';
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: color,
    });
    wx.setNavigationBarTitle({
      title: text,
    });
    
    this.setData({
      isExperience: options.isExperience
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