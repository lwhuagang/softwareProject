// pages/register/register.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      nickname:'', 
      email:'',
      password:'',
      confirmPswd:'',
      captcha:'',
      pic_url:'',
      money:10, 
      sendTime:'发送验证码',
      smsFlag:false,
      snsMsgWait: 60,
      maxMoney:20,//用户设置的最大初始金额
      defaultMoney:10,//默认用户的初始金额
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
  getCaptcha:function(data) {
      console.log("发送验证码=====>")
      var that = this;
      var inter = setInterval(function(){
        that.setData({
          smsFlag:true,
          capBGColor:'#f5f5f5',
          capTxtColor:'black',
          sendTime:that.data.snsMsgWait+'s后重发',
          snsMsgWait:that.data.snsMsgWait-1
        });
        if(that.data.snsMsgWait<0) {
          clearInterval(inter);
          that.setData({
            smsFlag:false,
            capBGColor:'#4285f4',
            capTxtColor:'white',
            sendTime:'获取验证码',
            snsMsgWait:60
          });
        }
      }.bind(that),1000);
      wx.request({
        url: 'http://10.136.94.184:8080/user/captcha',
        method:"GET",
        data:{
          email:this.data.email
        },
        success:res=>{
          console.log(res)
        }
      })
  },
checkPswd:function() {
    console.log('检查密码是否一致===>')
    if(this.data.password!=this.data.confirmPswd) {
      wx.showToast({
        title: '密码不一致',
        icon:'error',
        duration:1000
      })
    }
  },
register:function() {
    console.log("注册====>");
    var that = this;
    if(this.data.confirmPswd=='' || this.data.email=='' || this.data.nickname=='' || this.data.confirmPswd!=this.data.password) {
      wx.showToast({
        title: '存在非法字段',
        icon:'error',
        duration:1000
      });
      return;
    }
    wx.showLoading({
      title: '请稍后',
    });
    wx.request({
      url: 'http://10.136.94.184:8080/user/register',
      method:"POST",
      data:{
        user:{
            email:that.data.email,
            password:that.data.password,
            nickname:that.data.nickname,
            money:that.data.money*1000,
            pic_url:that.data.pic_url
        },
        captcha:that.data.captcha
      },
      success:res=>{
        console.log(res);
        console.log(res.data.message);
        // wx.hideLoading();
        if(res.data.message=="注册失败,验证码输入错误") {
          wx.showToast({
            title: '验证码错误',
            icon:"none",
            duration:2000
          });
          return;
        } else if(res.data.message=="注册失败,该账户已被注册") {
          wx.showToast({
            title: '账户已被注册',
            icon:"error",
            duration:2000
          });
          return;
        } else if(res.data.message=="注册成功") {
          wx.showToast({
            title: '注册成功',
            icon:"success",
            duration:2000
          });
          app.globalData.isLogin = true;
          app.globalData.userInfo.email=that.data.email
          app.globalData.userInfo.password=that.data.password
          app.globalData.userInfo.nickname=that.data.nickname
          app.globalData.userInfo.money=that.data.money*1000
          app.globalData.userInfo.pic_url=that.data.pic_url
          setTimeout(
            function() {
              wx.switchTab({
                url: '/pages/mine/mine',
              })
            },1000
          )
          return;
        }
      },
      fail:res=>{
        console.log("注册失败");
        wx.hideLoading();
        wx.showToast({
          title: '注册失败',
          icon:"error",
          duration:1000
        });
      }
    })
  },
setMoney:function(e) {
  // console.log(e.detail)
  this.setData({
    money:e.detail
  })
}
})