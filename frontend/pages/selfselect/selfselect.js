// pages/selfselect/selfselect.js
const app = getApp();
let {
  getSelfSelect
} = require("../../api/getUserFunds.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "funds": []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("获得selfSelect===>");
    getSelfSelect(
      app.globalData.userInfo.email,
      res => {
        this.setData({
          funds: res.data.obj.funds
        });
        console.log("获得selfSelect===>");
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
    getSelfSelect(
      app.globalData.userInfo.email,
      res => {
        this.setData({
          funds: res.data.obj.funds
        });
        console.log("获得selfSelect===>");
        console.log(res);
      }
    )
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