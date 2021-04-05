// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      nickname:'',
      email:'',
      password:'',
      confirmPswd:'',
      captha:'',
      pic_url:'',
      money:0,
      capBGColor:'#4285f4',
      capTxtColor:'white',
      sendTime:'发送验证码',
      smsFlag:false,
      snsMsgWait: 60
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
        url: 'http://localhost:8080/user/captcha',
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
    console.log('检查密码是否一致')
    if(this.data.password!=this.data.confirmPswd) {
      wx.showToast({
        title: '密码不一致',
        icon:'error',
        duration:1000
      })
    }
  }
})