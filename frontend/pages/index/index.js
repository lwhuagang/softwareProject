// index.js
// 获取应用实例
const app = getApp()
let {
  getFund,
  getFundPosition,
  getFundRank,
  getFundDetail,
  getAllFund,
  getHotFund,
} = require("../../api/getFoundation.js")
let {
  formatTime
} = require("../../utils/util.js")
Page({
  data: {
      sectionList:[{
          name:'净值',
          url:'/pages/netWorth/netWorth',
          img:'/image/netWorth.jpg'
      },{
        name:'估值',
          url:'/pages/evaluate/evaluate',
          img:'/image/evaluate.jpg'
      },{
        name:'排行',
          url:'/pages/rank/rank',
          img:'/image/rank_b.jpg'
      },{
        name:'热门',
          url:'/pages/hot/hot',
          img:'/image/hot.jpg'
      },{
        name:'新品',
        url:'/pages/newFund/newFund',
        img:'/image/new.jpg'
      },{
        name:'AI推荐',
        url:'/pages/aiForecast/aiForecast',
        img:'/image/AI.jpg'
      }],
      hotFunds:[],
      hotFundNum:4,
      aiForecast:[]
  },  
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // 测试接口函数
      console.log("getFoundation===>");
      // wx.request({
      //   url: 'http://10.136.87.111:8080/user/captcha',
      //   method:"GET",
      //   data:{
      //     email:'2428541469@qq.com'
      //   },
      //   success:res=>{
      //     console.log(res)
      //   }
      // })

      // getFund("202015,007339",res=>console.log(res));

      //getFundRank({},res=>console.log(res));

      // 注意坑：js中的月份是从0~11月
      // getFundDetail(
      //   {
      //     code:"202015",
      //     startDate:formatTime(new Date(2021,2-1,10)),
      //     endDate:formatTime(new Date(2021,3-1,30))
      //   },
      //   res=>console.log(res)
      // );

      //得到热门基金
      getHotFund(
        res=>{
          this.setData({
            hotFunds:res.data.data.rank
          });
          console.log("获得热门基金===>");
          console.log(res);
        }
      )
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
      // console.log(app.globalData)
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
