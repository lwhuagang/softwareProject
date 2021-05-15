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
    isLogin: true,
    email: "18231096@buaa.edu.cn",
    fundCode: "161005",
    fundInfo: {},
    comments: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //TODO: onLoad和onShow调用接口得到comments
  onLoad: function (options) {
    this.setData({
      isLogin: app.globalData.isLogin
    })
    if (app.globalData.isLogin == true) {
      this.setData({
        email: app.globalData.email
      })
    }
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
    wx.request({
      url: config.service + '/comment/getCommentsByFundCode',
      method: "GET",
      data: {
        fundCode: this.data.fundCode,
      },
      success: res => {
        console.log("评论：", res);
        this.setData({
          comments: res.data.obj,
        })
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
    this.setData({
      isLogin: app.globalData.isLogin
    })
    if (app.globalData.isLogin == true) {
      this.setData({
        email: app.globalData.email
      })
    }
    wx.request({
      url: config.service + '/comment/getCommentsByFundCode',
      method: "GET",
      data: {
        fundCode: this.data.fundCode,
      },
      success: res => {
        console.log("评论：", res);
        this.setData({
          comments: res.data.obj,
        })
      }
    })

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
    wx.request({
      url: config.service + '/comment/getCommentsByFundCode',
      method: "GET",
      data: {
        fundCode: this.data.fundCode,
      },
      success: res => {
        console.log("评论：", res);
        this.setData({
          comments: res.data.obj,
        })
      }
    })
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
  deleteComment: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.request({
      url: config.service + '/comment/deleteComment',
      method: "GET",
      data: {
        id: id,
      },
      success: res => {
        if (res.statusCode == "200") {
          wx.showModal({
            title: "删除评论成功!",
            cancelColor: 'cancelColor',
          });
          wx.request({
            url: config.service + '/comment/getCommentsByFundCode',
            method: "GET",
            data: {
              fundCode: this.data.fundCode,
            },
            success: res => {
              console.log("评论：", res);
              this.setData({
                comments: res.data.obj,
              })
            }
          })
        } else {
          wx.showModal({
            title: "删除失败!",
            cancelColor: 'cancelColor',
          });
        }
      }
    })

  },
})