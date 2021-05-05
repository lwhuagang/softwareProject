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
    user: {
      "email": "18231106@buaa.edu.cn",
      "password": "e10adc3949ba59abbe56e057f20f883e",
      "nickname": "yangxi",
      "money": 1.0000009E5,
      "pic_url": null,
      "hold_profit": 0.0,
      "total_profit": 0.0
    },
    funds: [{
        "code": "111444",
        "name": "银河创新成长混合",
        "type": "股票型",
        "buyMin": 200.0,
        "buyMoney": 10000.89,
        "yesProfit": 7.89,
        "holdProfit": 102.79,
        "holdProfitRate": 3.23,
        "buySourceRate": 0.2,
        "buyRate": 0.2,
        "manager": "张强"
      },
      {
        "code": "111444",
        "name": "银河创新成长混合",
        "type": "股票型",
        "buyMin": 200.0,
        "buyMoney": 10000.89,
        "yesProfit": 7.89,
        "holdProfit": 102.79,
        "holdProfitRate": 3.23,
        "buySourceRate": 0.2,
        "buyRate": 0.2,
        "manager": "张强"
      }
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