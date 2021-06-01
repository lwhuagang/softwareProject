// pages/buyIn/buyIn.js
const app = getApp();
let {
  getFund,
  getFundPosition,
  getFundRank,
  getFundDetail,
  getAllFund,
  getHotFund,
} = require("../../api/getFoundation.js");
let config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fundName:"",
    fundCode:0,
    fundInfo:{},//基金详情
    buyMin:null,
    money:null,
    shortCutList:[2000,3000,5000]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var fundCode = options.fundCode;
      var fundName = options.fundName;
      console.log("买入===>",fundCode);
      this.setData({
        fundCode:fundCode,
        fundName:fundName
      });
      this.loadFundDetail(function(){
      });
  },
  loadFundDetail:function(callback) {
    var that = this;
    getFundDetail(
      {
        code:this.data.fundCode,
        token:"atTPd9c8sA"
      },
      res=>{
        this.setData({
          fundInfo:res.data.data,
          buyMin: parseInt(res.data.data.buyMin)
        });    
      }
    );
    ;//同步不知道怎么搞，只好人为设置定时器了
  },
  cancel:function(){
    this.setData({
      money:null
    })
  },
  shortCut:function(e) {
    console.log(e)
    this.setData({
      money:parseInt(e.currentTarget.dataset.item)//wxml中用了data-item
    })
  },
  moneyInput: function (e) {
    var money;
    if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) { //正则验证，提现金额小数点后不能大于两位数字
      money = e.detail.value;
    } else {
      money = e.detail.value.substring(0, e.detail.value.length - 1);
    }
    this.setData({
      money: money,
    })
  },
  buySubmit:function(){
      wx.request({
        url: config.service+'/fundOperation/buy',
        method:"POST",
        data:{
          email:app.globalData.userInfo.email,
          fundCode:this.data.fundCode,
          money:this.data.money
        },
        success:res=>{
          if(res.statusCode=="200") {
            if(res.data.message=="买入操作记录成功") {
              wx.showModal({
                title:"买入成功!",
                cancelColor: 'cancelColor',
              });
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1,
                })
              },1000)
            } else {
              wx.showModal({
                title:"余额不足！",
                cancelColor: 'cancelColor',
              })
            }
          } else {
            wx.showModal({
              title:"操作失败！",
              cancelColor: 'cancelColor',
            })
          }
        }
      })
      // wx.request({
      //   url: config.service+'/user/calculate',
      //   method:"GET",
      //   success:res=>{
      //     wx.request({
      //       url: config.service+'/fundOperation/update',
      //       method:"GET",
      //       success:(res)=>{
      //           console.log("calculate,update成功")
      //       }
      //     })
      //   }
      // })
      // wx.request({
      //   url: config.service+'/user/calculate',
      //   method:"GET",
      //   success:res=>{
      //     wx.request({
      //       url: config.service+'/fundOperation/update',
      //       method:"GET",
      //       success:(res)=>{
      //           console.log("calculate,update成功")
      //       }
      //     })
      //   }
      // })
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