// pages/myComments/myComments.js

const app = getApp();
let config = require("../../config.js");
let {
  getFundDetail
} = require("../../api/getFoundation.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comments: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  deleteComment: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.request({
      url: config.service + '/comment/deleteComment',
      method: "GET",
      data: {
        id: id,
      },
      success: res => {
        if (res.statusCode == "200") {
          wx.showModal({
            title: "删除评论成功!",
            cancelColor: 'cancelColor',
          });
          var comments = this.data.comments;
          var i;
          var length = comments.length;
          for (i = 0; i < length; i++) {
            if (comments[i].id == id) {
              break;
            }
          }
          comments.splice(i, 1);
          this.setData({
            comments:comments
          })
          /*
          var comments;
          var tempNames = new Array();
          wx.request({
            url: config.service + '/comment/getCommentByUserEmail',
            method: "GET",
            data: {
              userEmail: app.globalData.userInfo.email
            },
            success: res => {
              console.log("------------------>")
              console.log(res)
              comments = res.data.obj
              for (var commentIndex in comments) {
                console.log(comments[commentIndex].time);
                comments[commentIndex].time = this.BeijingTime(comments[commentIndex].time)
                getFundDetail({
                    code: comments[commentIndex].fundCode,
                    token: "atTPd9c8sA"
                  },
                  res => {
                    console.log(res)
                    tempNames[res.data.data.code] = res.data.data.name;
                    if (commentIndex == comments.length - 1) {
                      for (var i = 0; i < comments.length; i++) {
                        comments[i]["fundName"] = tempNames[comments[i].fundCode];
                      }
                      console.log(tempNames)
                      this.setData({
                        comments: comments,
                      })
                    }
                  })
              }
            },
            fail: res => {
              console.log("fail!!!!!!!!!!")
            }
          })*/
        } else {
          wx.showModal({
            title: "删除失败!",
            cancelColor: 'cancelColor',
          });
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
    var comments;
    var tempNames = new Array();
    var alreadySet = 0;
    wx.request({
      url: config.service + '/comment/getCommentByUserEmail',
      method: "GET",
      data: {
        userEmail: app.globalData.userInfo.email
      },
      success: res => {
        console.log("------------------>")
        console.log(res)
        comments = res.data.obj
        for (var commentIndex in comments) {
          comments[commentIndex].time = this.BeijingTime(comments[commentIndex].time)
          getFundDetail({
              code: comments[commentIndex].fundCode,
              token: "atTPd9c8sA"
            },
            res => {
              tempNames[res.data.data.code] = res.data.data.name;
              alreadySet += 1;
              if (commentIndex == comments.length - 1 && alreadySet == comments.length) {
                console.log(commentIndex);
                for (var i = 0; i < comments.length; i++) {
                  comments[i]["fundName"] = tempNames[comments[i].fundCode];
                }
                comments.reverse();
                this.setData({
                  comments: comments
                })
                console.log("comments:", comments)
              }
            })
        }
      },
      fail: res => {
        console.log("fail!!!!!!!!!!")
      }
    })
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