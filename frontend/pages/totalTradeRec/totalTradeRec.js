import common from "../../utils/public.js";
let config = require("../../config.js");
const app = getApp();
let {
  getDealRecord
} = require("../../api/getUserFunds.js");

let {
  getFundDetail
} = require("../../api/getFoundation.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    records: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tempRecords;
    getDealRecord(
      app.globalData.userInfo.email,
      res => {
        tempRecords = res.data.obj;
        var length = tempRecords.length;
        var i;
        var tempNames = new Array();
        for (i = 0; i < length; i++) {
          if (i != length - 1) {
            getFundDetail({
                code: tempRecords[i].fundCode,
                token: "atTPd9c8sA"
              },
              res => {
                tempNames[res.data.data.code] = res.data.data.name;
              }
            );
          } else {
            getFundDetail({
                code: tempRecords[i].fundCode,
                token: "atTPd9c8sA"
              },
              res => {
                tempNames[res.data.data.code] = res.data.data.name;
                for (i = 0; i < length; i++) {
                  tempRecords[i]["showTime"] = this.UTCformat(tempRecords[i].time);
                  tempRecords[i]["fundName"] = tempNames[tempRecords[i].fundCode];
                  if (tempRecords[i].flag == 0) {
                    var buytime = new Date(tempRecords[i].time); //买入基金的时间
                    var nowtime = new Date();
                    if (buytime.getDate() == nowtime.getDate()) {
                      console.log("date:", buytime.getDate(), ' ', nowtime.getDate());
                      if (nowtime.getHours() < 15) {
                        tempRecords[i]["delete"] = true;
                      } else {
                        if (buytime.getHours() >= 15) {
                          tempRecords[i]["delete"] = true;
                        } else {
                          tempRecords[i]["delete"] = false;
                        }
                      }
                    } else if ((buytime.getDate() == nowtime.getDate() - 1) && buytime.getHours > 15) {
                      if (nowtime.getHours() < 15) {
                        tempRecords[i]["delete"] = true;
                      } else {
                        tempRecords[i]["delete"] = false;
                      }
                    } else {
                      tempRecords[i]["delete"] = false;
                    }

                  } else {
                    tempRecords[i]["delete"] = false;
                  }
                }
                console.log("Records:", tempRecords);
                this.setData({
                  records: tempRecords
                })
              }
            );
          }
        }
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
    var tempRecords;
    getDealRecord(
      app.globalData.userInfo.email,
      res => {
        tempRecords = res.data.obj;
        var length = tempRecords.length;
        var i;
        var tempNames = new Array(); //
        for (i = 0; i < length; i++) {
          if (i != length - 1) {
            getFundDetail({
                code: tempRecords[i].fundCode,
                token: "atTPd9c8sA"
              },
              res => {
                tempNames[res.data.data.code] = res.data.data.name;
              }
            );
          } else {
            getFundDetail({
                code: tempRecords[i].fundCode,
                token: "atTPd9c8sA"
              },
              res => {
                tempNames[res.data.data.code] = res.data.data.name;
                for (i = 0; i < length; i++) {
                  tempRecords[i]["showTime"] = this.UTCformat(tempRecords[i].time);
                  tempRecords[i]["fundName"] = tempNames[tempRecords[i].fundCode];
                  if (tempRecords[i].flag == 0) {
                    var buytime = new Date(tempRecords[i].time); //买入基金的时间
                    var nowtime = new Date();
                    if (buytime.getDate() == nowtime.getDate()) { //当天买入
                      console.log("date:", buytime.getDate(), ' ', nowtime.getDate());
                      if (nowtime.getHours() < 15) { //现在时间：当天收盘前，当天收盘前买入，可取消
                        tempRecords[i]["delete"] = true;
                      } else { //当天收盘后
                        if (buytime.getHours() >= 15) { //当天收盘后买入，仍可取消 
                          tempRecords[i]["delete"] = true;
                        } else { // 当天收盘前买入，不可取消
                          tempRecords[i]["delete"] = false;
                        }
                      }
                    } else if ((buytime.getDate() == nowtime.getDate() - 1) && buytime.getHours > 15) { //昨天收盘后买入
                      if (nowtime.getHours() < 15) {
                        tempRecords[i]["delete"] = true;
                      } else {
                        tempRecords[i]["delete"] = false;
                      }
                    } else {
                      tempRecords[i]["delete"] = false;
                    }

                  } else {
                    tempRecords[i]["delete"] = false;
                  }
                }
                console.log("Records:", tempRecords);
                this.setData({
                  records: tempRecords
                })
              }
            );
          }
        }
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

  deleteRecord: function (e) {
    var code = e.currentTarget.dataset.code;
    var time = e.currentTarget.dataset.time;
    console.log("email & fundcode & time: ", app.globalData.userInfo.email," ", code, " ", time)
    wx.request({
      url: config.service + '/user/deleteOneRecord',
      method: "POST",
      data: {
        userEmail: app.globalData.userInfo.email,
        fundCode: code,
        time: time
      },
      success: res => {
        if (res.statusCode == "200") {
          if (res.data.message == "删除一条未完成的处理记录") {
            wx.showModal({
              title: "删除成功!",
              cancelColor: 'cancelColor',
            });
            var tempRecords;
            getDealRecord(
              app.globalData.userInfo.email,
              res => {
                tempRecords = res.data.obj;
                var length = tempRecords.length;
                var i;
                var tempNames = new Array(); //
                for (i = 0; i < length; i++) {
                  if (i != length - 1) {
                    getFundDetail({
                        code: tempRecords[i].fundCode,
                        token: "atTPd9c8sA"
                      },
                      res => {
                        tempNames[res.data.data.code] = res.data.data.name;
                      }
                    );
                  } else {
                    getFundDetail({
                        code: tempRecords[i].fundCode,
                        token: "atTPd9c8sA"
                      },
                      res => {
                        tempNames[res.data.data.code] = res.data.data.name;
                        for (i = 0; i < length; i++) {
                          tempRecords[i]["showTime"] = this.UTCformat(tempRecords[i].time);
                          tempRecords[i]["fundName"] = tempNames[tempRecords[i].fundCode];
                          if (tempRecords[i].flag == 0) {
                            var buytime = new Date(tempRecords[i].time); //买入基金的时间
                            var nowtime = new Date();
                            if (buytime.getDate() == nowtime.getDate()) { //当天买入
                              console.log("date:", buytime.getDate(), ' ', nowtime.getDate());
                              if (nowtime.getHours() < 15) { //现在时间：当天收盘前，当天收盘前买入，可取消
                                tempRecords[i]["delete"] = true;
                              } else { //当天收盘后
                                if (buytime.getHours() >= 15) { //当天收盘后买入，仍可取消 
                                  tempRecords[i]["delete"] = true;
                                } else { // 当天收盘前买入，不可取消
                                  tempRecords[i]["delete"] = false;
                                }
                              }
                            } else if ((buytime.getDate() == nowtime.getDate() - 1) && buytime.getHours > 15) { //昨天收盘后买入
                              if (nowtime.getHours() < 15) {
                                tempRecords[i]["delete"] = true;
                              } else {
                                tempRecords[i]["delete"] = false;
                              }
                            } else {
                              tempRecords[i]["delete"] = false;
                            }

                          } else {
                            tempRecords[i]["delete"] = false;
                          }
                        }
                        console.log("Records:", tempRecords);
                        this.setData({
                          records: tempRecords
                        })
                      }
                    );
                  }
                }
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
  },
})