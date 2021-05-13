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
    fundCode: "161005",
    fundInfo: {},
    min: 5,
    max: 400,
    currentWordNumber: 0,
    texts:"",
    inputValue:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最少字数限制
    if (len <this.data.min){
      this.setData({
        texts: "加油，至少要输入5个字哦"
      })
    }else if (len >= this.data.min){
      this.setData({
        texts: " ",
        inputValue: value
      })
    }
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len //当前字数  
    });
  },

  addComment: function (e) {
    wx.showModal({
      title:"评论成功!",
      content:'此处尚未调用后端接口函数',
      cancelColor: 'cancelColor',
    });
  },
})