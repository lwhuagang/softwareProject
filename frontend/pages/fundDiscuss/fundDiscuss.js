// pages/fundDiscuss/fundDiscuss.js
const app = getApp();
let {
  getFundDetail,
} = require("../../api/getFoundation.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:true,
    email:"18231096@buaa.edu.cn",
    fundCode: "161005",
    fundInfo: {},
    comments:[{
      username: "木槿",
      userEmail:"18231096@buaa.edu.cn",
      commentText:"基金，英文是fund，广义是指为了某种目的而设立的具有一定数量的资金。主要包括信托投资基金、公积金、保险基金、退休基金，各种基金会的基金。从会计角度透析，基金是一个狭义的概念，意指具有特定目的和用途的资金。我们提到的基金主要是指证券投资基金。"
    },{
      username: "皮卡",
      userEmail:"18231041@buaa.edu.cn",
      commentText:"困了困了困了耶 困了困了困了耶 困了困了困了耶 困了困了困了耶"
    },{
      username: "pikachu",
      userEmail:"18231041@buaa.edu.cn",
      commentText:"乌鱼子，能不能别跌了"
    }
  ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //TODO: onLoad和onShow调用接口得到comments
  onLoad: function (options) {
    this.setData({
      isLogin:app.globalData.isLogin
    })
    if(app.globalData.isLogin==true) {
      this.setData({
        email:app.globalData.email
      })
    }
    var code = options.fundCode;
    this.setData({
      fundCode: code, //全局变量
    });
    getFundDetail({
        code: this.data.fundCode,
        token: "atTPd9c8sA"
      },
      res => {
        this.setData({
          fundInfo: res.data.data
        });
        console.log("获取到的基金详情===>");
        console.log(this.data.fundInfo)
      }
    );
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
  deleteComment: function (e) {
    wx.showModal({
      title:"删除评论成功!",
      content:'此处尚未调用后端接口函数',
      cancelColor: 'cancelColor',
    });
  },
})