// pages/hot/hot.js
const app = getApp();
let config = require("../../config.js");
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
    funds:[],
    searchParam:{
      pageIndex:1,
      pageSize:11,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: config.service+'/fund/getAllPre',
      method:"GET",
      data:this.data.searchParam,
      success:res=>{
          console.log(res);
          if(res.data.code==200 && res.data.message=="获取所有基金的AI预测排序结果，包括十五天的涨幅和最后一天的涨幅") {
            that.setData({
              funds:res.data.obj,
            });
            wx.hideLoading({
              success: (res) => {},
            })
          }
      }
    })
  },
  loadMore:function(){
    var that = this;
    console.log("加载更多===>");
    wx.showLoading({
      title: '加载中',
    })
    let tmpSearchParam={
      pageIndex:this.data.searchParam.pageIndex+1,
      pageSize:this.data.searchParam.pageSize,
    };
    this.setData({
      searchParam:tmpSearchParam
    });
    let tmpList = this.data.funds;
    wx.request({
      url: config.service+'/fund/getAllPre',
      method:"GET",
      data:tmpSearchParam,
      success:res=>{
          console.log(res);
          if(res.data.code==200 && res.data.message=="获取所有基金的AI预测排序结果，包括十五天的涨幅和最后一天的涨幅") {
              res.data.obj.forEach(function(e){
                  tmpList.push(e);
              });
              this.setData({
                funds:tmpList,
              });
              wx.hideLoading({
                success: (res) => {},
              })
          }

      }
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
      this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})