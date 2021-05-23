// pages/myNews/myNews.js
const app = getApp();
let config = require("../../config.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    news: [
      /*{
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
        message: '',
        result: '',
        messageType: 0, //0表示推送消息，1表示反馈消息
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
        message: '我的反馈我的反馈我的反馈我的反馈我的反馈我的反馈',
        result: '管理员的处理管理员的处理管理员的处理管理员的处理管理员的处理管理员的处理管理员的处理管理员的处理管理员的处理管理员的处理管理员的处理管理员的处理管理员的处理',
        messageType: 1, //0表示推送消息，1表示反馈消息
      },*/
    ],
    isEmpty: false,
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
    setTimeout(function () {
      // complete
      wx.hideLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
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
  BeijingTimeAddByDay: function (time, x) {
    var firstDate = new Date(time);
    var datetime = new Date(firstDate.valueOf() - 8*60*60*1000 + x*24*60*60*1000);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
  },
  BeijingTime: function (time) {
    var firstDate = new Date(time);
    var datetime = new Date(firstDate.valueOf() - 8 * 60 * 60 * 1000);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
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
    console.log("清空所有未读消息/将所有未读消息的状态设为已读==>");
    var that = this;
    wx.request({
      url: config.service + '/message/clearAllNotReadMsg?userEmail=' + app.globalData.userInfo.email,
      method: "GET",
      success: res => {
        console.log(res);
        that.getMessage();
        wx.showToast({
          title: '全部已读',
          icon: "success",
          duration: 2000
        })
      }
    })
  },
  //清空用户消息
  clearAll: function (e) {
    console.log("清空所有消息==>");
    var that = this;
    wx.request({
      url: config.service + '/message/deleteAllMessage?userEmail=' + app.globalData.userInfo.email,
      method: "GET",
      success: res => {
        console.log(res);
        that.getMessage();
        wx.showToast({
          title: '消息已清空',
          icon: "success",
          duration: 2000
        })
      }
    })
  },
  getMessage: function () {
    var that = this;
    wx.request({
      url: config.service + '/message/getAllNotReadMsg?userEmail=' + app.globalData.userInfo.email,
      method: "GET",
      success: res => { //先获得所有的未读信息，展示在首部
        console.log("用户未读信息", res);
        if (res.data.code == 200 && res.data.message == "获取所有未读的消息") {
          that.setData({
            news: res.data.obj,
            isEmpty: (res.data.obj.length == 0)
          });
          var i;
          var tmpList = that.data.news;
          for (i = 0; i < tmpList.length; i++) {
            tmpList[i].showTime = that.BeijingTime(tmpList[i].time);
            if (tmpList[i].messageType == 0) {
              tmpList[i].expectWorthDate = that.BeijingTimeAddByDay(tmpList[i].time, 15).substring(0, 10);
              tmpList[i].netWorthDate = that.BeijingTime(tmpList[i].time).substring(0, 10);
            }
          }
          that.setData({
            news: tmpList,
          })
          wx.request({
            url: config.service + '/message/getAllMessage?userEmail=' + app.globalData.userInfo.email,
            method: "GET",
            success: res => {
              console.log("用户所有信息", res);
              if (res.data.code == 200 && res.data.message == "获取该用户的所有信息") {
                that.setData({
                  isEmpty: (res.data.obj.length == 0)
                });
                var allNews = res.data.obj;
                var i;
                for (i = 0; i < allNews.length; i++) {
                  if (allNews[i].read == 1) {
                    allNews[i].showTime = that.BeijingTime(allNews[i].time);
                    if (allNews[i].messageType == 0) {
                      allNews[i].expectWorthDate = that.BeijingTime(allNews[i].time).substring(0, 10);
                      allNews[i].netWorthDate = that.BeijingTime(allNews[i].time).substring(0, 10);
                    }
                    tmpList.push(allNews[i]);
                  }
                }
                that.setData({
                  news: tmpList,
                })
              } else {
                console.log("消息加载失败");
              }
            }
          })
        } else {
          console.log("消息加载失败");
        }
      }
    })

  }
})