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
    funds: [],
    isLogin:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isLogin:app.globalData.isLogin
    })
    if(app.globalData.isLogin==false) {
      wx.showModal({
        cancelColor: 'cancelColor',
        title:'请先登录',
        content:'点击确定跳转到登录界面',
        success(res) {
          if(res.confirm) {
           wx.switchTab({
             url: '/pages/mine/mine',
           })
          } else if(res.cancel) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    } else {

      getSelfSelect(
        app.globalData.userInfo.email,
        res => {
          console.log("selfselect==>",res)
          if(res.data.obj.funds!="") {
            this.setData({
              funds: res.data.obj.funds.data
            });
          } else {
            this.setData({
              funds:[]
            })
          }
        }
      )
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
      isLogin:app.globalData.isLogin
    })
    if(app.globalData.isLogin==false) {
      wx.showModal({
        cancelColor: 'cancelColor',
        title:'请先登录',
        content:'点击确定跳转到登录界面',
        success(res) {
          if(res.confirm) {
           wx.switchTab({
             url: '/pages/mine/mine',
           })
          } else if(res.cancel) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    } else {

      getSelfSelect(
        app.globalData.userInfo.email,
        res => {
          console.log("selfselect==>",res)
          if(res.data.obj.funds!="") {
            this.setData({
              funds: res.data.obj.funds.data
            });
          } else {
            this.setData({
              funds:[]
            })
          }
        }
      )
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