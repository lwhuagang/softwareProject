// pages/myInfo/myInfo.js
const app = getApp();
const { service } = require("../../config.js");
let config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo:{},
      edit:false,
      changePswd:false,
      canCancel:false,
      nickname:'',
      oldPswd:'',
      newPswd:'',
      confirmPswd:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: config.service+'/user/message',
      method:"GET",
      data:{
        email:app.globalData.userInfo.email
      },
      success:res=>{
        console.log(res);
        if(res.data.code==200 && res.data.message=="获取用户信息") {
          that.setData({
            userInfo:res.data.obj
          })
        }
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
    var that = this;
    wx.request({
      url: config.service+'/user/message',
      method:"GET",
      data:{
        email:app.globalData.userInfo.email
      },
      success:res=>{
        console.log(res);
        if(res.data.code==200 && res.data.message=="获取用户信息") {
          that.setData({
            userInfo:res.data.obj
          })
        }
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
  editUserInfo:function() {
    if(this.data.changePswd==false) {
      this.setData({
        edit:true,
        canCancel:true,
      })
    }
  },
  changePswd:function(){
    if(this.data.edit==false) {
      this.setData({
        changePswd:true,
        canCancel:true,
      })
    }
  },
  cancel:function() {
    this.setData({
      edit:false,
      changePswd:false,
      canCancel:false,
      nickname:'',
      oldPswd:'',
      newPswd:'',
      confirmPswd:'',
    })
  },
  subMitEdit:function() {
      var that = this;
      if(this.data.nickname=='') {
        wx.showModal({
          cancelColor: 'cancelColor',
          content:'昵称不能为空'
        })
      } else {
        var tmpParam = {
          email:this.data.userInfo.email,
          name:this.data.nickname,
          money:this.data.userInfo.money,
          avatarLink:''
        };
        console.log(tmpParam);
        wx.request({
          url: config.service+'/user/update',
          method:"POST",
          data:tmpParam,
          success:res=>{
            console.log(res);
            if(res.data.code==200 && res.data.message=="用户信息修改成功!") {
              wx.showToast({
                title: '用户信息修改成功!',
                duration:2000,
                icon:"success"
              });
              that.cancel();
              that.onShow();
            } else {
              wx.showToast({
                title: '网络错误',
                duration:2000,
                icon:"error"
              })
            }
          }
        })
      }
  },
  subMitChangePswd:function() {
    var that = this;
    if(this.data.oldPswd=='' || this.data.newPswd=='' || this.data.confirmPswd=='') {
      wx.showToast({
        title: '密码不能为空',
        duration:2000,
        icon:"error",
      })
    } else if(this.data.newPswd!=this.data.confirmPswd){
      wx.showToast({
        title: '确认密码错误',
        duration:2000,
        icon:"error",
      })
    } else {
        wx.request({
          url: config.service+'/user/login',
          method:"POST",
          data:{
            email:that.data.userInfo.email,
            password:that.data.oldPswd
          },
          success:res=>{
            console.log(res);
            if(res.data.code==200 && res.data.message=="登陆成功") {
              wx.request({
                url: config.service+'/user/modify',
                method:"POST",
                data:{
                  email:that.data.userInfo.email,
                  password:that.data.newPswd
                },
                success:res=>{
                  console.log(res);
                  if(res.data.code==200 && res.data.message=="用户密码修改成功!") {
                    wx.showToast({
                      title: '修改密码成功',
                      duration:2000,
                      icon:"success",
                    });
                    that.onShow();
                  } else {
                    wx.showToast({
                      title: '网络错误',
                      duration:2000,
                      icon:"error",
                    })
                  }
                }
              })
            } else {
              wx.showToast({
                title: '原始密码错误',
                duration:2000,
                icon:"error",
              })
            }
          }
        })
    }
  }
})