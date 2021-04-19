// pages/hold/hold.js
let {
  getHold
} = require("../../api/getUserFunds.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "user": {
      "email": "18231106@buaa.edu.cn",
      "password": "e10adc3949ba59abbe56e057f20f883e",
      "nickname": "yangxi",
      "money": 1.0000009E5,
      "pic_url": null,
      "hold_profit": 0.0,
      "total_profit": 0.0
    },
    "funds": [{
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
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getHold(
      "18231041@buaa.edu.cn",
      res => {
        this.setData({
          user: res.data.obj.user,
          funds: res.data.obj.funds
        });
        console.log("获得hold===>");
        console.log(res);
      }
    )
  },
})