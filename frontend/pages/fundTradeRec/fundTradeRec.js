import common from "../../utils/public.js";
let config = require("../../config.js");
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
          if (tempRecords[i].flag == 0) {
            var buytime = new Date(tempRecords[i].time); //买入基金的时间
            tempRecords[i]["delete"] = this.canDelete(buytime);
          } else {
            tempRecords[i]["delete"] = false;
          }
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
  onShow: function () {},

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

  canDelete: function (buytime) {
    var nowtime = new Date();
    var result = false;
    //console.log(tempRecords[i].fundName," ",buytime.getDate()," ",buytime.getHours()," ",nowtime.getDate()," ")
    if (this.isFriday(buytime)) {
      if (buytime.getDate() == nowtime.getDate()) {
        if (nowtime.getHours() < 15) {
          result = true;
        } else {
          if (buytime.getHours() >= 15) {
            result = true;
          } else {
            result = false;
          }
        }
      } else if (((buytime.getDate() == nowtime.getDate() - 1)||(buytime.getDate() == nowtime.getDate() - 2)) && buytime.getHours() >= 15) { //周五晚上交易，现在周六周天
        result = true;
      } else if ((buytime.getDate() == nowtime.getDate() - 2) && buytime.getHours() >= 15) { //现在周一
        if (nowtime.getHours() < 15) {
          result = true;
        } else {
          result = false;
        }
      } else {
        result = false;
      }
    } else if (this.isSaturday(buytime)) {
      if (buytime.getDate() == nowtime.getDate() || buytime.getDate() == nowtime.getDate() - 1) {
        result = true;
      } else if (buytime.getDate() == nowtime.getDate() - 2) { //周六购买，现在周一
        if (nowtime.getHours() < 15) {
          result = true;
        } else {
          result = false;
        }
      } else {
        result = false;
      }
    } else if (this.isSunday(buytime)) {
      if (buytime.getDate() == nowtime.getDate()) {
        result = true;
      } else if (buytime.getDate() == nowtime.getDate() - 1) { //周六购买，现在周一
        if (nowtime.getHours() < 15) {
          result = true;
        } else {
          result = false;
        }
      } else {
        result = false;
      }
    } else {
      if (buytime.getDate() == nowtime.getDate()) {
        if (nowtime.getHours() < 15) {
          result = true;
        } else {
          if (buytime.getHours() >= 15) {
            result = true;
          } else {
            result = false;
          }
        }
      } else if ((buytime.getDate() == nowtime.getDate() - 1) && buytime.getHours() >= 15) {
        if (nowtime.getHours() < 15) {
          result = true;
        } else {
          result = false;
        }
      } else {
        result = false;
      }
    }
    return result;
  },
  isFriday: function (date) {
    if ("天一二三四五六".charAt(new Date(date).getDay()) == "五") return true;
  },
  isSaturday: function (date) {
    if ("天一二三四五六".charAt(new Date(date).getDay()) == "六") return true;
  },
  isSunday: function (date) {
    if ("天一二三四五六".charAt(new Date(date).getDay()) == "天") return true;
  },
  deleteRecord: function (e) {
    var code = e.currentTarget.dataset.code;
    var time = e.currentTarget.dataset.time;
    var count = e.currentTarget.dataset.count;
    var canBeDelete = e.currentTarget.dataset.delete;
    //console.log("email & fundcode & time: ", app.globalData.userInfo.email," ", code, " ", time)
    if (canBeDelete) {
      wx.request({
        url: config.service + '/user/deleteOneRecord',
        method: "POST",
        data: {
          userEmail: app.globalData.userInfo.email,
          fundCode: code,
          time: time,
          count: count,
        },
        success: res => {
          if (res.statusCode == "200") {
            if (res.data.message == "删除一条未完成的处理记录") {
              wx.showModal({
                title: "删除成功!",
                cancelColor: 'cancelColor',
              });
              getFundRecord(
                app.globalData.userInfo.email,
                this.data.fundCode,
                res => {
                  var i;
                  var tempRecords = res.data.obj;
                  var length = tempRecords.length;
                  for (i = 0; i < length; i++) {
                    tempRecords[i]["showTime"] = this.UTCformat(tempRecords[i].time);
                    if (tempRecords[i].flag == 0) {
                      var buytime = new Date(tempRecords[i].time); //买入基金的时间
                      tempRecords[i]["delete"] = this.canDelete(buytime);
                    } else {
                      tempRecords[i]["delete"] = false;
                    }
                  }
                  this.setData({
                    records: tempRecords
                  })
                }
              )
            } else {
              wx.showModal({
                title: "删除失败！",
                cancelColor: 'cancelColor',
              })
            }
          } else {
            wx.showModal({
              title: "删除失败！",
              cancelColor: 'cancelColor',
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: "不可撤销!",
        content: "已收盘，按照基金交易规则，不可删除",
        cancelColor: 'cancelColor',
      });
    }},
})