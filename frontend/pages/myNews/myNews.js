// pages/myNews/myNews.js
const app = getApp();
let config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news: [
      {
      id: 1, //消息id
      userEmail: "18231096@buaa.edu.cn",
      fundCode: "000248", //基金代码
      fundName: "汇添富中证主要消费ETF联接", //基金名称
      addWarehouse: true, // 加仓 or 清仓，true表示加仓
      netWorthDate: "2021-05-18",
      netWorth: 2.718281, //当前净值
      expectWorthDate: "2021-05-21",
      expectWorth: 3.1415926, //预测净值
      time: "2021-05-18T13:03:20.000+00:00", //发送消息UTC时间
      read: false, //用户是否已经阅读过，未读过设为false
      message:'',
      result:'',
      messageType:0,//0表示推送消息，1表示反馈消息
    },
    {
      id: 2, //消息id
      userEmail: "18231096@buaa.edu.cn",
      fundCode: "000248", //基金代码
      fundName: "汇添富中证主要消费ETF联接", //基金名称
      addWarehouse: true, // 加仓 or 清仓，true表示加仓
      netWorthDate: "2021-05-18",
      netWorth: 2.718281, //当前净值
      expectWorthDate: "2021-05-21",
      expectWorth: 3.1415926, //预测净值
      time: "2021-05-18T13:03:20.000+00:00", //发送消息UTC时间
      read: false, //用户是否已经阅读过，未读过设为false
      message:'我的反馈我的反馈我的反馈我的反馈我的反馈我的反馈',
      result:'管理员的处理管理员的处理管理员的处理管理员的处理管理员的处理管理员的处理管理员的处理管理员的处理管理员的处理管理员的处理管理员的处理管理员的处理管理员的处理',
      messageType:1,//0表示推送消息，1表示反馈消息
    },
    ],
    isEmpty:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //TODO 
    //转UTC时间
    // var i;
    // var tempNews = this.data.news;
    // var length = tempNews.length;
    // for (i = 0; i < length; i++) {
    //   tempNews[i]["showTime"] = this.UTCformat(tempNews[i].time);
    // }
    // this.setData({
    //   news: tempNews,
    // })
    this.getMessage();
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
      this.getMessage();
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
    wx.showLoading() //在标题栏中显示加载
    //模拟加载
    this.getMessage();
    setTimeout(function()
    {
      // complete
      wx.hideLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    },1500);
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
  //将用户消息设为已读
  readAll: function (e) {

  },
  //清空用户消息
  clearAll: function (e) {

  },
  getMessage:function() {
    console.log("HHHHHH");
    var that = this;
    wx.request({
      url: config.service+'/message/getAllNotReadMsg?'+app.globalData.userInfo.email,
      method:"GET",
      success:res=>{
        console.log("用户未读信息",res);
        that.setData({
          news:res.data.obj,
          isEmpty:(res.data.obj.length==0)
        });
        var i;
        for (i = 0; i < that.data.news.length; i++) {
          that.data.news[i]["showTime"] = that.UTCformat(that.data.news[i].time);
        }
      }
    })
  }
})