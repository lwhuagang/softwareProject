// pages/sellOut/sellOut.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fundCode:0,
    fundName:"易方达蓝筹精选混合",
    maxUnit:10,
    grey:"#666666",
    blue:"#0081FF",
    btn1Color:"",
    btn2Color:"",
    btn3Color:"",
    btn3Color:"",
    chooseUnit:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var fundCode = options.fundCode;
    var fundName = options.fundName;
    console.log("卖出===>",fundCode);
    this.setData({
      fundCode:fundCode,
      fundName:fundName,
      btn1Color:this.data.grey,
      btn2Color:this.data.grey,
      btn3Color:this.data.grey,
      btn4Color:this.data.grey,
    })
  },
  unitBtn1:function(){
    if (this.data.btn1Color == this.data.grey){
      this.setData({
        btn1Color:this.data.blue,
        chooseUnit:this.data.maxUnit*0.2
      })
    }else{
      this.setData({
        btn1Color:this.data.grey
      })
    }
    this.setData({
      btn2Color:this.data.grey,
      btn3Color:this.data.grey,
      btn4Color:this.data.grey
    })
    
  },
  unitBtn2:function(){
    if (this.data.btn2Color == this.data.grey){
      this.setData({
        btn2Color:this.data.blue,
        chooseUnit:this.data.maxUnit*0.3
      })
    }else{
      this.setData({
        btn2Color:this.data.grey
      })
    }
    this.setData({
      btn1Color:this.data.grey,
      btn3Color:this.data.grey,
      btn4Color:this.data.grey
    })
    
  },
  unitBtn3:function(){
    if (this.data.btn3Color == this.data.grey){
      this.setData({
        btn3Color:this.data.blue,
        chooseUnit:this.data.maxUnit*0.5
      })
    }else{
      this.setData({
        btn3Color:this.data.grey
      })
    }
    this.setData({
      btn1Color:this.data.grey,
      btn2Color:this.data.grey,
      btn4Color:this.data.grey
    })
    
  },
  unitBtn4:function(){
    if (this.data.btn4Color == this.data.grey){
      this.setData({
        btn4Color:this.data.blue,
        chooseUnit:this.data.maxUnit
      })
    }else{
      this.setData({
        btn4Color:this.data.grey
      })
    }
    this.setData({
      btn1Color:this.data.grey,
      btn2Color:this.data.grey,
      btn3Color:this.data.grey
    })
    
  },
  deleteUnit:function(){
    console.log(1)
    this.setData({
      chooseUnit:null
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

  }
})