// pages/search/search.js
const app = getApp()
let {
  getHotFund,
} = require("../../api/getFoundation.js")
let {
  getSearch
} = require("../../api/getUserFunds.js")
let {
  formatTime
} = require("../../utils/util.js")
let config = require("../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: "",
    isLogin: app.globalData.isLogin,
    history: true, //显示历史记录
    historyArray: [], //历史记录数组,
    newArray: [], //添加历史记录数组
    funds: []
  },

  //清除历史记录
  cleanhistory: function (e) {
    if (app.globalData.isLogin) {
      wx.request({
        url: config.service + '/user/deleteAllSearch',
        method: "GET",
        data: {
          userEmail: app.globalData.userInfo.email,
        },
        success: res => {
          if (res.statusCode == "200") {
            console.log("历史记录删除成功")
            this.setData({
              historyArray: [], //清空历史记录数组
              newArray: [],
            })
          } else {
            console.log("历史记录删除失败")
          }
        },
        fail: res => {
          console.log("历史记录添加失败")
        }
      })
    }
    
  },

  showLog: function (e) {
    if (app.globalData.isLogin) {
      this.setData({
        history: true, 
      })
    }
  },

  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  //搜索
  search: function (e) {
    var searchtext = this.data.inputValue; //搜索框的值
    if (searchtext != "") {
      //将搜索框的值赋给历史数组
      if (this.data.historyArray.indexOf(searchtext) == -1) {
        if (app.globalData.isLogin) {
          this.data.historyArray.push(searchtext);
          wx.request({
            url: config.service + '/user/addSearch',
            method: "POST",
            data: {
              userEmail: app.globalData.userInfo.email,
              searchString: searchtext
            },
            success: res => {
              if (res.statusCode == "200") {
                console.log("历史记录添加成功")
              } else {
                console.log("历史记录添加失败")
              }
            },
            fail: res => {
              console.log("历史记录添加失败")
            }
          })
        }
      }
      this.setData({
        history: false, //隐藏历史记录
        newArray: this.data.historyArray //给新历史记录数组赋值
      })
      if (searchtext.search(/[0-9][0-9][0-9][0-9][0-9][0-9]/) != -1) {
        getSearch(
          searchtext,
          "",
          res => {
            this.setData({
              funds: [res.data.obj]
            });
            console.log("通过代码查询===>");
            console.log(this.data.funds[0]);
          }
        )
      } else {
        getSearch(
          "",
          searchtext,
          res => {
            this.setData({
              funds: res.data.obj
            });
            console.log("通过名字查询===>");
            console.log(this.data.funds);
          }
        )
      }
    }
  },

  //点击历史记录赋值给搜索框
  textfz: function (e) {
    this.setData({
      inputValue: e.target.dataset.text
    })
    var searchtext = this.data.inputValue; //搜索框的值
    if (searchtext != "") {
      this.setData({
        history: false, //隐藏历史记录
        newArray: this.data.historyArray //给新历史记录数组赋值
      })
      if (searchtext.search(/[0-9][0-9][0-9][0-9][0-9][0-9]/) != -1) {
        getSearch(
          searchtext,
          "",
          res => {
            this.setData({
              funds: [res.data.obj]
            });
            console.log("通过代码查询===>");
            console.log(this.data.funds[0]);
          }
        )
      } else {
        getSearch(
          "",
          searchtext,
          res => {
            this.setData({
              funds: res.data.obj
            });
            console.log("通过名字查询===>");
            console.log(this.data.funds);
          }
        )
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.isLogin) {
      wx.request({
        url: config.service + '/user/getSearch',
        method: "GET",
        data: {
          email: app.globalData.userInfo.email
        },
        success: res => {
          console.log(res);
          var tempRes = res.data.obj;
          var length = tempRes.length;
          var i;
          var tempHistory = [];
          for (i = 0; i < length; i++) {
            tempHistory.push(tempRes[i].searchString);
          }
          console.log(tempHistory);
          this.setData({
            historyArray: tempHistory,
            newArray: tempHistory,
          })
        }
      })
    }
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
    this.setData({
      isLogin: app.globalData.isLogin
    })
    if (app.globalData.isLogin) {
      wx.request({
        url: config.service + '/user/getSearch',
        method: "GET",
        data: {
          email: app.globalData.userInfo.email
        },
        success: res => {
          console.log(res);
          var tempRes = res.data.obj;
          var length = tempRes.length;
          var i;
          var tempHistory = [];
          for (i = 0; i < length; i++) {
            tempHistory.push(tempRes[i].searchString);
          }
          console.log(tempHistory);
          this.setData({
            historyArray: tempHistory,
            newArray: tempHistory,
          })
        }
      })
    }
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