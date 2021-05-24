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
    } else if(!this.checkEmail()){
      wx.showToast({
        title: '邮箱格式错误',
        duration:2000,
        icon:"error",
      })
    }
    else{
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
  checkEmail:function() {
    let mail = this.data.email;
    if(mail!='' && !(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(mail))) {
      return false;
    } else {
      return true;
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
    } else if(!this.checkPswdStrength()){
      wx.showToast({
        title: '密码强度过低',
        duration:2000,
        icon:"error",
      })
    }
    else{
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
          if(res.data.code==200 && res.data.message=="重置密码成功!") {
            wx.showToast({
              title: '重置密码成功',
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
              title: '重置密码失败',
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
  },
  checkPswdStrength:function() {
    let pswd = this.data.newPswd;
    console.log("检查密码===>",pswd);
    // if(pswd=='') {
    //   this.setData({
    //     pswdToosimple:'密码不能为空'
    //   });
    //   return false;
    // } else 
    if(pswd=='') {
      return true;
    }else if(  pswd.length<6) {
      console.log("密码长度小于6位");
      return false;
    } else if(/[0-9]/.test(pswd)==false) {
      console.log("密码缺少数字");
      return false;
    } else if(/[a-z]/.test(pswd)==false) {
      console.log("密码缺少小写字母");
      return false;
    } else if(/[A-Z]/.test(pswd)==false) {
      console.log("密码缺少大写字母");
      return false;
    } else {
      console.log("密码合格");
      return true;
    }
  },
})