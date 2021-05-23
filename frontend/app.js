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
    userInfo: {
      //email:"18231096@buaa.edu.cn",
      //email:"906410752@qq.com",
      // email:"1767083617@qq.com",
      //email:"",
      password:"",
      nickname:"",
      money:0,
      pic_url:""
    },
    isLogin: false
  }
})