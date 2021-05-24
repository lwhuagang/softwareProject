// pages/register/register.js
const app = getApp();
let config = require("../../config.js")
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
      pswdToosimple:'',
      wrongEmail:'',
      nameEmpty:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
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
      pswdToosimple:'',
      wrongEmail:'',
      nameEmpty:'',
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
      pswdToosimple:'',
      wrongEmail:'',
      nameEmpty:'',
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
      if(this.data.email=='') {
        wx.showToast({
          title: '邮箱不能为空',
          duration:2000,
          icon:"error",
        })
      } else {
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
          url: config.service+'/user/captcha',
          method:"GET",
          data:{
            email:this.data.email
          },
          success:res=>{
            console.log(res)
          }
        })
      }

  },
checkPswd:function() {
    console.log('检查密码是否一致===>')
    if(this.data.password!=this.data.confirmPswd && this.data.confirmPswd!='') {
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
    } else if(!this.checkPswdStrength()) {
      wx.showModal({
        cancelColor: 'cancelColor',
        content:"密码强度过低!"
      })
    } else {
      wx.showLoading({
        title: '请稍后',
      });
      wx.request({
        url: config.service+'/user/register',
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
            console.log("thatdata:",that.data)
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
    }

  },
setMoney:function(e) {
  // console.log(e.detail)
  this.setData({
    money:e.detail
  })
},
checkPswdStrength:function() {
  let pswd = this.data.password;
  console.log("检查密码===>",pswd);
  // if(pswd=='') {
  //   this.setData({
  //     pswdToosimple:'密码不能为空'
  //   });
  //   return false;
  // } else 
  if(pswd=='') {

  }else if(  pswd.length<6) {
    console.log("密码长度小于6位");
    this.setData({
      pswdToosimple:'密码过于简单',
    })
    return false;
  } else if(/[0-9]/.test(pswd)==false) {
    console.log("密码缺少数字");
    this.setData({
      pswdToosimple:'密码过于简单',
    })
    return false;
  } else if(/[a-z]/.test(pswd)==false) {
    console.log("密码缺少小写字母");
    this.setData({
      pswdToosimple:'密码过于简单',
    })
    return false;
  } else if(/[A-Z]/.test(pswd)==false) {
    console.log("密码缺少大写字母");
    this.setData({
      pswdToosimple:'密码过于简单',
    })
    return false;
  } else {
    console.log("密码合格");
    this.setData({
      pswdToosimple:'',
    })
    return true;
  }
},
checkEmail:function(e) {
  console.log(e);
  let mail = e.detail.value;
  // if(mail=='') {
  //   this.setData({
  //     wrongEmail:'邮箱不能为空'
  //   });
  //   return false;
  // } else 
  if(mail!='' && !(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(mail))) {
    this.setData({
      wrongEmail:'邮箱格式错误',
    })
  } else {
    this.setData({
      wrongEmail:'',
    })
  }
},
// checkNameEmpty:function(e) {
//   if(e.detail.value=='') {
//     this.setData({
//       nameEmpty:'昵称不能为空',
//     });
//     return true;
//   } else {
//     this.setData({
//       nameEmpty:'',
//     })
//     return false;
//   }
// },
resetPswdFlag:function() {
  this.setData({
    pswdToosimple:''
  })
},
resetMailFlag:function() {
  this.setData({
    wrongEmail:'',
  })
},
resetNameFlag:function() {
  this.setData({
    nameEmpty:''
  })
}
})