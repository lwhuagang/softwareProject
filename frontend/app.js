// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo:{
        admin:false,
        buyMoney:0,
        dayProfit:0,
        email:"2428541469@qq.com",
        holdCost:0,
        holdProfit:0,
        initMoney:0,
        money:0,
        nickname:"PY",
        password:"202cb962ac59075b964b07152d234b70",
        picUrl:'',
        totalProfit:0
    },
    // userInfo: {
    //   email:"18231096@buaa.edu.cn",
    //   password:"",
    //   nickname:"liwei",
    //   money:0,
    //   pic_url:""
    // },
    isLogin: false
  }
})