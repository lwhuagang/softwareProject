// pages/feedback/feedback.js
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
    textVal:""   //文本域输入内容
  },

  // 文本域的输入的事件
  handleTextInput(e){
    this.setData({
      textVal:e.detail.value
    })
  },

  //提交按钮的点击
  handleFormSubmit(){
    // 1 获取文本域的内容
    const {textVal, }=this.data;
    console.log("反馈===========>")
    console.log(textVal)
    console.log(app.globalData)
    // 2 合法性的验证
    if(!textVal.trim()){
      // 不合法
      wx.showToast({
        title:'输入不合法',
        icon:'none',
        // 防止反复点击
        mask: true
      });
      return;
    }
    wx.showLoading({
      title:"正在上传中...",
      mask: true,
    });
    //此处调用接口
    wx.request({
      url: config.service + '/user/addFD',
      method: "POST",
      data: {
        userEmail: app.globalData.userInfo.email,
        message:textVal
      },
      success: res => {
        console.log(res);
        wx.hideLoading();
        this.setData({
          textVal:"",
        })
        // 返回上一个页面
        wx.navigateBack({
          delta: 1
        });
        console.log("向后端发送成功")
      },
      fail:res=>{
        console.log("向后端发送失败")
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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