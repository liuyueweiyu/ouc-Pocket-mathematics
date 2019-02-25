// component/intro/intro.js
const app = getApp();
import TimeHelp from '../../utils/getTime.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    author:String,
    Time:String,
    headImage:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    hostimg: app.hostimg,
    TimeStr:''
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      // console.log(this.properties.Time)
      this.setData({
        TimeStr: TimeHelp.getTime(this.properties.Time)
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    bindTime(str) {
      TimeHelp.getTime(str)
    },
  }
})
