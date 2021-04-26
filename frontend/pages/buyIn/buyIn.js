// pages/buyIn/buyIn.js
const app = getApp();
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
    fundCode:0,
    fundInfo:{},//基金详情
    buyMin:null,
    money:null,
    shortCutList:[2000,3000,5000]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var fundCode = options.fundCode;
      console.log("买入===>",fundCode);
      this.setData({
        fundCode:fundCode
      });
      this.loadFundDetail(function(){
      });
  },
  loadFundDetail:function(callback) {
    var that = this;
    getFundDetail(
      {
        code:this.data.fundCode,
        token:"atTPd9c8sA"
      },
      res=>{
        this.setData({
          fundInfo:res.data.data,
          buyMin: parseInt(res.data.data.buyMin)
        });    
      }
    );
    ;//同步不知道怎么搞，只好人为设置定时器了
  },
  cancel:function(){
    this.setData({
      money:null
    })
  },
  shortCut:function(e) {
    console.log(e)
    this.setData({
      money:parseInt(e.currentTarget.dataset.item)//wxml中用了data-item
    })
  },
  buySubmit:function(){
    wx.showModal({
      cancelColor: 'cancelColor',
      content:"这里是确认买入函数，暂时还没有调用后端接口，请耐心等待"
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