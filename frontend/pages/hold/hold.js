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
    funds:[
      {
          "name": "华夏成长混合",
          "type": "混合型",
          "buyMin": 100.0,
          "buySourceRate": 1.5,
          "buyRate": 0.15,
          "manager": "阳琨",
          "netWorth": 1.401,
          "hold": 38823.34047109207,
          "userEmail": "18231106@buaa.edu.cn",
          "fundCode": "000001",
          "holdProfit": -8152.901498929333,
          "yesProfit": -271.7633832976445,
          "holdCost": 38250.0,
          "share": 27301.927194860815,
          "holdProfitRate": -21.314775160599563,
          "perHoldCost": 1.401,
          "totalProfit": [
              "-543.526766595289",
              "-815.2901498929335",
              "-1087.053533190578",
              "-1358.8169164882224",
              "-1630.5802997858668",
              "-1902.3436830835112"
          ],
          "toVerifyMoney": 0.0
      }
  ],
    // funds: [{
    //     "code": "111444",
    //     "name": "银河创新成长混合",
    //     "type": "股票型",
    //     "buyMin": 200.0,
    //     "buyMoney": 10000.89,
    //     "yesProfit": 7.89,
    //     "holdProfit": 102.79,
    //     "holdProfitRate": 3.23,
    //     "buySourceRate": 0.2,
    //     "buyRate": 0.2,
    //     "manager": "张强"
    //   },
    //   {
    //     "code": "111444",
    //     "name": "银河创新成长混合",
    //     "type": "股票型",
    //     "buyMin": 200.0,
    //     "buyMoney": 10000.89,
    //     "yesProfit": 7.89,
    //     "holdProfit": 102.79,
    //     "holdProfitRate": 3.23,
    //     "buySourceRate": 0.2,
    //     "buyRate": 0.2,
    //     "manager": "张强"
    //   }
    // ],
    isLogin:null,
    totalMoney:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onReady: function (options) {
    this.setData({
      isLogin:app.globalData.isLogin
    })
    if(app.globalData.isLogin==false) {
      console.log("isFalse!!!!");
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
    wx.showLoading({
      title: '加载中',
    })
    console.log("用户邮箱------>")
    console.log(app.globalData.userInfo.email)
    getHold(
      app.globalData.userInfo.email,
      res => {
        console.log("----------------->")
        console.log(res)
        this.setData({
          user: res.data.obj.user,
          funds: res.data.obj.holdVOS
        });
        var tmpMoney = 0;
        console.log("atHold:",res);
        res.data.obj.holdVOS.forEach(element => {
          tmpMoney+=element.holdCost+element.holdProfit+element.toVerifyMoney
        });
        console.log("tmpMoney==>",tmpMoney)
        this.setData({
          totalMoney:tmpMoney
        })
        console.log("获得hold===>");
        console.log(res);
        wx.hideLoading();
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
      wx.showLoading({
        title: '加载中', 
      })
      getHold(
        app.globalData.userInfo.email,
        res => {
          this.setData({
            user: res.data.obj.user,
            funds: res.data.obj.holdVOS
          });
          var tmpMoney = 0;
          res.data.obj.holdVOS.forEach(element => {
            tmpMoney+=element.holdProfit+element.holdCost+element.toVerifyMoney
          });
          console.log("tmpMoney==>",tmpMoney)
          this.setData({
            totalMoney:tmpMoney
          })
          console.log("获得hold===>");
          console.log(res);
          wx.hideLoading();
        }
      )
    }
  }
})