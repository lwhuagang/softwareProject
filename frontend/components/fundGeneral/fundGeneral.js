// components/fundGeneral/fundGeneral.js
// 只负责最基本的展示，详情要跳转到详情页
let {
  getFund,
  getFundPosition,
  getFundRank,
  getFundDetail,
  getAllFund,
  getHotFund,
} = require("../../api/getFoundation")
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 展示方式：showType='netWorth' 净值;showType='expectWorth' 估算
    showType:{
      type:String,
      val:''
    },
    //时期：'r','z','1y','3y','6y','1n'
    periodType: {
      type:String,
      val:'',
    },
    fundInfo:{
      type:JSON,
      val:{}
    },
    onlyCode:{
      type:String,
      val:'',
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

  },
})
