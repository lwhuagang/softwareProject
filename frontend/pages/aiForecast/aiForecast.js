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
    fundCodes:[],
    tmpList:[],
    searchParam:{
      pageIndex:1,
      pageSize:11,
      token:"atTPd9c8sA"//修改时删去
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      //待后端分页功能实现之后，使用注释里面的url与method
      // url: config.service+'/fund/getAllPre',
      // method:"GET",
      url:"https://api.doctorxiong.club/v1/fund/rank",
      method:"POST",
      data:this.data.searchParam,
      success:res=>{
          console.log(res);
          that.setData({
            funds:res.data.data.rank,
          })
      }
    })
  },
  loadMore:function(){
    console.log("加载更多");
    let tmpSearchParam={
      pageIndex:this.data.searchParam.pageIndex+1,
      pageSize:this.data.searchParam.pageSize,
      token:"atTPd9c8sA",
    };
    this.setData({
      searchParam:tmpSearchParam
    });
    let tmpList = this.data.funds;
    getFundRank(this.data.searchParam, res => {
      console.log(res);
      wx.showToast({
        title: '数据加载中',
        icon: 'loading',
        duration: 3000,
      });
      res.data.data.rank.forEach(i=>{
        tmpList.push(i);
      })
      this.setData({
        funds:tmpList
      });
      wx.hideToast();
    });
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