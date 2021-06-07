// pages/sellOut/sellOut.js
const app = getApp();
let {
  getFund,
  getFundPosition,
  getFundRank,
  getFundDetail,
  getAllFund,
  getHotFund,
} = require("../../api/getFoundation.js")
let config = require("../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fundCode: 0,
    fundName: "易方达蓝筹精选混合",
    maxUnit: 1000,
    grey: "#666666",
    blue: "#0081FF",
    btn1Color: "",
    btn2Color: "",
    btn3Color: "",
    btn3Color: "",
    chooseUnit: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var fundCode = options.fundCode;
    var fundName = options.fundName;
    console.log("卖出===>", fundCode);
    this.setData({
      fundCode: fundCode,
      fundName: fundName,
      btn1Color: this.data.grey,
      btn2Color: this.data.grey,
      btn3Color: this.data.grey,
      btn4Color: this.data.grey,
      maxUnit: parseFloat(options.share).toFixed(2)
    })
    this.loadFundDetail(function () {})
  },
  loadFundDetail: function (callback) {
    var that = this;
    getFundDetail({
        code: this.data.fundCode,
        token: "atTPd9c8sA"
      },
      res => {
        this.setData({
          fundInfo: res.data.data,
        });
      }
    );; //同步不知道怎么搞，只好人为设置定时器了
  },
  unitBtn1: function () {
    if (this.data.btn1Color == this.data.grey) {
      var num = this.data.maxUnit * 0.2;
      this.setData({
        btn1Color: this.data.blue,
        chooseUnit: Math.floor(num * 100) / 100
      })
    } else {
      this.setData({
        btn1Color: this.data.grey
      })
    }
    this.setData({
      btn2Color: this.data.grey,
      btn3Color: this.data.grey,
      btn4Color: this.data.grey
    })

  },
  unitBtn2: function () {
    if (this.data.btn2Color == this.data.grey) {
      var num = this.data.maxUnit * 0.3;
      this.setData({
        btn2Color: this.data.blue,
        chooseUnit: Math.floor(num * 100) / 100
      })
    } else {
      this.setData({
        btn2Color: this.data.grey
      })
    }
    this.setData({
      btn1Color: this.data.grey,
      btn3Color: this.data.grey,
      btn4Color: this.data.grey
    })

  },
  unitBtn3: function () {
    if (this.data.btn3Color == this.data.grey) {
      var num = this.data.maxUnit * 0.5;
      this.setData({
        btn3Color: this.data.blue,
        chooseUnit: Math.floor(num * 100) / 100
      })
    } else {
      this.setData({
        btn3Color: this.data.grey
      })
    }
    this.setData({
      btn1Color: this.data.grey,
      btn2Color: this.data.grey,
      btn4Color: this.data.grey
    })
  },
  unitBtn4: function () {
    if (this.data.btn4Color == this.data.grey) {
      var num = this.data.maxUnit;
      this.setData({
        btn4Color: this.data.blue,
        chooseUnit: Math.floor(num * 100) / 100
      })
    } else {
      this.setData({
        btn4Color: this.data.grey
      })
    }
    this.setData({
      btn1Color: this.data.grey,
      btn2Color: this.data.grey,
      btn3Color: this.data.grey
    })

  },
  deleteUnit: function () {
    this.setData({
      chooseUnit: null,
      btn1Color: this.data.grey,
      btn2Color: this.data.grey,
      btn3Color: this.data.grey,
      btn4Color: this.data.grey
    })
  },
  moneyInput: function (e) {
    var money;
    //console.log("type:",typeof(this.data.maxUnit));
    if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) { //正则验证，提现金额小数点后不能大于两位数字
      money = parseFloat(e.detail.value);
      if (money > this.data.maxUnit){
        money = this.data.maxUnit
      }
    } else {
      money = parseFloat(e.detail.value.substring(0, e.detail.value.length - 1));
      if (money > this.data.maxUnit){
        money = this.data.maxUnit
      }
    }

    this.setData({
      chooseUnit: money,
    })
  },
  sellSubmit: function () {
    console.log("卖出份额=======>" + this.data.chooseUnit)
    wx.request({
      url: config.service + '/fundOperation/sell',
      method: "POST",
      data: {
        email: app.globalData.userInfo.email,
        fundCode: this.data.fundCode,
        sellShare: this.data.chooseUnit
      },
      success: res => {
        console.log(res)
        if (res.statusCode == "200") {
          if (res.data.message == "卖出操作记录成功") {
            wx.showModal({
              title: "卖出成功!",
              cancelColor: 'cancelColor',
            });
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 1000)
          } else {
            wx.showModal({
              title: "份额不足！",
              cancelColor: 'cancelColor',
            })
            var num = this.data.maxUnit;
            this.setData({
              chooseUnit: Math.floor(num * 100) / 100
            })
          }
        } else {
          wx.showModal({
            title: "操作失败！",
            cancelColor: 'cancelColor',
          })
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