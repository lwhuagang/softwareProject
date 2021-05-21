// pages/mine/mine.js
const app = getApp();
let config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    userInfo:null,
    try2Edit:false,//是否编辑个人信息
    tmpInfo:{
      nickname:'',
      email:'',
      password:'',
      money:0,
      pic_url:''
    },
    hasMessage:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      if(app.globalData.isLogin==true) {
        that.setData({
          isLogin:app.globalData.isLogin
        })
        wx.request({
          url: config.service+'/user/message',
          method:"GET",
          data:{
            email:app.globalData.userInfo.email
          },
          success:res=>{
            console.log(res);
            if(res.data.code==200) {
              app.globalData.userInfo=res.data.obj
              that.setData({
                userInfo:res.data.obj,
                tmpInfo:res.data.obj
              });
              that.getMessage();
            }
          }
        });
      } else {
        this.setData({
          isLogin:app.globalData.isLogin,
        })
      }

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
    var that = this;
    if(app.globalData.isLogin==true) {
      that.setData({
        isLogin:app.globalData.isLogin
      })
      wx.request({
        url: config.service+'/user/message',
        method:"GET",
        data:{
          email:app.globalData.userInfo.email
        },
        success:res=>{
          console.log(res);
          if(res.data.code==200) {
            app.globalData.userInfo=res.data.obj
            that.setData({
              userInfo:res.data.obj,
              tmpInfo:res.data.obj
            });
            that.getMessage();
          }
        }
      });
    } else {
      this.setData({
        isLogin:app.globalData.isLogin,
      })
    }
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
      console.log("卸载");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading() //在标题栏中显示加载
    //模拟加载
    this.getMessage();
    setTimeout(function()
    {
      // complete
      wx.hideLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    },1500);
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
  register:function() {
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },
  
  login:function(data) {
    /**
     * 要完成的逻辑:
     * 1.向后端发送用户名和密码(暂时不考虑加密传输，有风险)
     * 2.收到后端的登录成功与否的信息，如果没有成功登录，提示"用户名或者密码错误";否则，跳转到首页/个人信息页(个人信息页其实是在另一个block里面写的)
     * 3.若成功登录，注意修改全局变量isLogin以及全局用户信息。同时可以考虑将用户名缓存到本地，便于下次直接登录(加入记住我等功能，暂时不要求实现).
     */
    var that = this;
    console.log("用户登录====>")
    console.log(data)
      wx.request({
        url: config.service+'/user/login',
        method:"POST",
        data:{
            email:data.detail.value.email,
            password:data.detail.value.password
        },
        success: res=>{
          console.log(res)
          if(res.data.code==200 && res.data.message=="登陆成功") {
            app.globalData.isLogin = true;
            app.globalData.userInfo=res.data.obj;
            that.setData({
              isLogin:true,
              userInfo:res.data.obj 
            })
            wx.showToast({
              title: '已登录',     
              icon: 'success',       
              duration: 1000,//持续的时间 
              // 跳转到个人信息主页
            });
            console.log("登录信息===>",res);
          } else {
            wx.showToast({
              title: '邮箱或密码错误',
              icon: 'error',
              duration:1500
            });
          };
          that.getMessage();     
        },
        fail:res=>{
          console.log(res);
          wx.showToast({
            title: '网络错误',
            icon: 'error',
            duration:1500
          })
        }
      })
  },
  logOut:function() {
    app.globalData.isLogin=false;
    this.setData({
      isLogin:false,
      userInfo:null
    })
  },
  getMessage:function() {
    var that = this;
    if(this.data.isLogin) {
      wx.request({
        url: config.service+'/message/getAllNotReadMsg?userEmail='+this.data.userInfo.email,
        method:"GET",
        success:res=>{
          console.log("用户未读信息",res);
          that.setData({
            hasMessage:(res.data.obj.length>0),
          })
        }
      })
    }
  },

  reset(){
    wx.showModal({
      title: '确定要重置所有用户数据吗',
      content: '会重置所有的历史数据，并重新设置一个初始总资产',
      success: (res)=> {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showModal({
            cancelColor: 'cancelColor',
            editable:true,
            title:"请输入初始用户总资产",
            success:(res)=>{
              console.log(res)
              wx.request({
                url: config.service + '/user/resetAll',
                data:{
                  email: app.globalData.userInfo.email,
                  money: parseFloat(res.content) 
                },
                method:"POST",
                success:(res)=>{
                  console.log(res)
                  wx.showToast({
                    title: '重置成功',
                    icon:"success"
                  })
                },
                fail:(res)=>{
                  console.log(res)
                }
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  addMoney(res){
    // console.log(res)
    wx.showModal({
      cancelColor: 'cancelColor',
      title:"请输入您想要增加的余额",
      editable:true,
      success(res){
        if (res.confirm){
          wx.request({
            url: config.service + '/user/addMoney',
            method:"POST",
            data:{
              email:app.globalData.userInfo.email,
              money:parseFloat(res.content)
            },
            success:(res)=>{
              console.log(res)
              wx.showToast({
                title: '增加成功',
                icon:"success"
              })
            }    
          })
        }
        // console.log(res.content)
       
      }
    })
  }
})