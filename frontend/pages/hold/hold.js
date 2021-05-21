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
    funds:[],
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