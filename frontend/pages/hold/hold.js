// pages/hold/hold.js
const app = getApp();
let {
  getHold
} = require("../../api/getUserFunds.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "user": {
    },
    "funds": [
    ],
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
          //console.log(app.globalData.userInfo.email)
    getHold(
      app.globalData.userInfo.email,
      res => {
        this.setData({
          user: res.data.obj.user,
          funds: res.data.obj.funds
        });
        console.log("获得hold===>");
        console.log(res);
      }
    )
    }
  },
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
      console.log("获得hold===>");
      getHold(
        app.globalData.userInfo.email,
        res => {
          this.setData({
            user: res.data.obj.user,
            funds: res.data.obj.funds
          });
          console.log(res);
        }
      )
    }
  }
})