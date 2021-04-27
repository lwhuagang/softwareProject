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

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: "",
    history: false, //显示历史记录
    historyArray: ["中证","广发"], //历史记录数组,
    newArray: ["中证","广发"], //添加历史记录数组
    funds: []
  },

  //清除历史记录
  cleanhistory: function (e) {
    this.setData({
      history: false, //隐藏历史记录
      historyArray: [], //清空历史记录数组
      newArray: [],
    })
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
        this.data.historyArray.push(searchtext);
      }
      this.setData({
        history: false, //隐藏历史记录
        shoppinglist: true, //显示商品列表
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
        shoppinglist: true, //显示商品列表
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

  }
})