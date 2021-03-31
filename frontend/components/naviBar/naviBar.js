// components/naviBar/naviBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      ifSearch:{
        type:Boolean,
        value:false,
      },
      // 标题
      title:{
        type: String,
        value:''
      },
      showBack:{
        type:Boolean,
        value:true
      },
      openType:{
        type:String,
        value:'navigateBack'
      }
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

  }
})
