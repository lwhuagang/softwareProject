// pages/dealRule/dealRule.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fundInfo:null,
    selectRule:"买入规则",
    buyInStart:"15:00",
    buyInRateList:[
      {step:"0≤买入金额<100万",srcRate:"1.50%",rate:"0.15%"},
      {step:"100万≤买入金额<300万",srcRate:"0.90%",rate:"0.09%"},{step:"300万≤买入金额<500万",srcRate:"0.30%",rate:"0.03%"},{step:"500万≤买入金额<1000万",srcRate:"0.10%",rate:"0.01%"},{step:"1000万≤买入金额",srcRate:"1000元",rate:"1000元"}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  swap2BuyIn:function() {
    this.setData({
      selectRule:"买入规则"
    })
  },
  swap2SellOut:function() {
    this.setData({
      selectRule:"卖出规则"
    })
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