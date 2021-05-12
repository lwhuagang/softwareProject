import common from "../../utils/public.js";
const app = getApp();
let {
  getFundRecord
} = require("../../api/getUserFunds.js");
let {
  getFundDetail
} = require("../../api/getFoundation.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fundCode: "",
    fundName: "",
    records: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fundCode: options.fundCode,
      fundName: options.fundName
    })
    var tempRecords;
    getFundRecord(
      app.globalData.userInfo.email,
      this.data.fundCode,
      res => {
        var i;
        tempRecords = res.data.obj;
        var length = tempRecords.length;
        for (i = 0; i < length; i++) {
          tempRecords[i]["showTime"] = this.UTCformat(tempRecords[i].time);
        }
        this.setData({
          records: tempRecords
        })
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

  },

  UTCformat: function (utc) {
    var date = new Date(utc),
      year = date.getFullYear(),
      month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + parseInt(date.getMonth() + 1),
      day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate(),
      hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours(),
      minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes(),
      seconds = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds();
    var res = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds; //将上述拆分的数据整合，连接符可以自己决定，如ios无法识别2xxx-xx-xx格式可将'-'改为'/'
    return res;
  },

  deleteRecord: function () {
    wx.showModal({
      title: "撤销交易记录",
      content: "此处应链接撤销交易记录的后端接口",
      cancelColor: 'cancelColor',
    })
  },
})