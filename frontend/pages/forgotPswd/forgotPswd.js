// pages/forgotPswd/forgotPswd.js
const app = getApp();
let config = require("../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
      email:'',
      newPswd:'',
      confirmPswd:'',
      captcha:'',
      smsFlag:false,
      snsMsgWait:60,
      sendTime:'发送验证码'
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

  },
  sendCaptcha:function() {
    if(this.data.email=='') {
      wx.showToast({
        title: '邮箱不能为空',
        duration:2000,
        icon:"error",
      })
    } else {
      console.log("发送验证码===>");
      var that = this;
      var inter = setInterval(function(){
        that.setData({
          smsFlag:true,
          sendTime:that.data.snsMsgWait+'s后重发',
          snsMsgWait:that.data.snsMsgWait-1
        });
        if(that.data.snsMsgWait<0) {
          clearInterval(inter);
          that.setData({
            smsFlag:false,
            sendTime:'获取验证码',
            snsMsgWait:60
          });
        }
      }.bind(that),1000);
      wx.request({
        url: config.service+'/user/captcha',
        method:"GET",
        data:{
          email:this.data.email
        },
        success:res=>{
          console.log(res);
        }
      })
    }
  },
  submit:function() {
    var that = this;
    if(this.data.newPswd!=this.data.confirmPswd) {
      wx.showToast({
        title: '密码不一致',
        duration:2000,
        icon:"error",
      })
    } else {
      wx.request({
        url: config.service+'/user/resetPassword',
        method:"POST",
        data:{
          email:that.data.email,
          password:that.data.newPswd,
          captcha:that.data.captcha
        },
        success:res=>{
          console.log(res);
          if(res.data.code==200 && res.data.message=="修改密码成功") {
            wx.showToast({
              title: '修改密码成功',
              duration:2000,
              icon:"success",
            });
            setTimeout(function(){
              wx.navigateBack({
                delta: 1,
              })
            },1000)
          } else {
            wx.showToast({
              title: '修改密码失败',
              duration:2000,
              icon:"error",
            })
          }
        },
        fail:res=>{
          console.log(res);
          wx.showToast({
            title: '修改密码失败',
            duration:2000,
            icon:"error"
          })
        }
      })
    }
  }
})