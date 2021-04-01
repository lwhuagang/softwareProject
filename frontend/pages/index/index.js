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
    // 功能列表，暂时全用排行代替
      sectionList:[{
          name:'排行',
          url:'/pages/rank/rank',
          img:'/image/rank_b.jpg'
      },{
        name:'排行',
          url:'/pages/rank/rank',
          img:'/image/rank_b.jpg'
      },{
        name:'排行',
          url:'/pages/search/search',
          img:'/image/rank_b.jpg'
      },{
        name:'排行',
          url:'/pages/rank/rank',
          img:'/image/rank_b.jpg'
      },{
        name:'排行',
          url:'/pages/rank/rank',
          img:'/image/rank_b.jpg'
      },{name:'排行',
      url:'/pages/rank/rank',
      img:'/image/rank_b.jpg'
      }],
      // 展示部分热门基金.hotFunds中得到的是所有热门基金，但是在wxml中仅展示部分
      //希望有能力时，将首页加载时得到的所有热门基金传递到热门基金详情页，而不用再重复访问.暂时先不做这个
      hotFunds:[],
      hotFundNum:2,
      //AI预测部分，暂时也以热门基金替代
      aiForecast:[]
  },  
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // 测试接口函数
      console.log("getFoundation===>");

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
