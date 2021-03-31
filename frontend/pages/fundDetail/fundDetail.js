// pages/fundDetail/fundDetail.js
let {
  getFund,
  getFundPosition,
  getFundRank,
  getFundDetail,
  getAllFund,
  getHotFund,
} = require("../../api/getFoundation.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fundInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 调用时url为: /pages/fundDetail/fundDetail?fundCode=202015 这种带参数的形式
    getFundDetail(
      {code:options.fundCode},
      res=>{
        this.setData({
          fundInfo:res.data.data
        });
        console.log("获取到的基金详情===>");
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