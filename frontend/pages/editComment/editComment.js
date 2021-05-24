// pages/fundDiscuss/fundDiscuss.js
const app = getApp();
let {
  getFundDetail,
} = require("../../api/getFoundation.js")

let config = require("../../config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    fundCode: "161005",
    fundInfo: {},
    min: 5,
    max: 200,
    currentWordNumber: 0,
    texts: "",
    inputValue: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var code = options.fundCode;
    this.setData({
      fundCode: code, //全局变量
    });
    getFundDetail({
        code: this.data.fundCode,
        token: "atTPd9c8sA"
      },
      res => {
        this.setData({
          fundInfo: res.data.data
        });
        console.log("获取到的基金详情===>");
        console.log(this.data.fundInfo)
      }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      isLogin: app.globalData.isLogin
    })
    if (app.globalData.isLogin == false) {
      console.log("isFalse!!!!");
      wx.showModal({
        cancelColor: 'cancelColor',
        title: '请先登录',
        content: '点击确定跳转到登录界面',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          } else if (res.cancel) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    }
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

  },

  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最少字数限制
    if (len < this.data.min) {
      this.setData({
        texts: "加油，至少要输入5个字哦"
      })
    } else if (len >= this.data.min) {
      this.setData({
        texts: " ",
        inputValue: value
      })
    }
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });
  },

  addComment: function (e) {
    console.log(this.data.inputValue);
    console.log("个人信息：", {
      userEmail: app.globalData.userInfo.email,
      nickname: app.globalData.userInfo.nickname,
      fundCode: this.data.fundCode,
      comment: this.data.inputValue
    })
    if (this.data.inputValue.length < this.data.min) {
      wx.showToast({
        title: '您的输入过短!',
      })
    } else {
      wx.request({
        url: config.service + '/comment/addComment',
        method: "POST",
        data: {
          userEmail: app.globalData.userInfo.email,
          nickname: app.globalData.userInfo.nickname,
          fundCode: this.data.fundCode,
          comment: this.data.inputValue
        },
        success: res => {
          console.log(res);
          if (res.statusCode == "200") {
            wx.showToast({
              title: '评论成功!',
            })
            
            setTimeout(function () {
              wx.navigateBack({
                delta: 1,
              })
            }, 1000)
          } else {
            wx.showModal({
              title: "评论失败!",
              content: '该基金暂不支持评论',
              cancelColor: 'cancelColor',
            });
          }
        }
      })
    }

  },
})