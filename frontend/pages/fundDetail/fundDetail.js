import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

// function initChart(canvas, width, height, dpr) {
//   console.log(canvas);
//   const chart = echarts.init(canvas, null, {
//     width: 500,
//     height: 500,
//     devicePixelRatio: dpr // new
//   });
//   canvas.setChart(chart);

//   var option = {
//     backgroundColor: "#ffffff",
//     color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
//     series: [{
//       label: {
//         normal: {
//           fontSize: 14
//         }
//       },
//       type: 'pie',
//       center: ['50%', '50%'],
//       radius: ['40%', '60%'],
//       data: [{
//         value: 55,
//         name: '北京'
//       }, {
//         value: 20,
//         name: '武汉'
//       }, {
//         value: 10,
//         name: '杭州'
//       }, {
//         value: 20,
//         name: '广州'
//       }, {
//         value: 38,
//         name: '上海'
//       }]
//     }]
//   };

//   chart.setOption(option);
//   return chart;
// }

let {
  getFund,
  getFundPosition,
  getFundRank,
  getFundDetail,
  getAllFund,
  getHotFund,
} = require("../../api/getFoundation.js")
Page({

  /**
   * 页面的初始数据
   */

  data: {
    fundCode:0,
    fundInfo:{},//基金详情
    fundPosition:{},//基金持仓
    ec:{
      onInit: null
    },
    totalGrowthRatio:0//累计涨幅
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
    var code = options.fundCode;
    var that = this;
    this.setData({
      fundCode:code //全局变量
    });
    //回调灾难，名不虚传
    this.loadFundDetail(function(){
      that.loadFundPosition(function(){
        //图表取数据要放在这里面！前面设置了延时，到这里大概率已经拿到数据了
        console.log("finally!");
        that.test()
      })
    });
  },

// 加载基金详情
loadFundDetail:function(callback) {
    var that = this;
    getFundDetail(
      {
        code:this.data.fundCode,
        token:"atTPd9c8sA"
      },
      res=>{
        this.setData({
          fundInfo:res.data.data
        });
        console.log("获取到的基金详情===>");
        console.log(this.data.fundInfo)
      }
    );
    setTimeout(
      function() {
        callback()
      },1000
    );//同步不知道怎么搞，只好人为设置定时器了
  },

//加载基金持仓详情
loadFundPosition:function(callback) {
    getFundPosition(
      this.data.fundCode,
      res=>{
        this.setData({
          fundPosition:res.data.data,
        })
        console.log("获取到的持仓详情?===>");
        console.log(res);
      }
    );
    setTimeout(function(){
      callback()
    },1000)
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
  test:function() {
    console.log("It's a test");
    console.log(this.data)
    console.log(this.data.fundPosition)//如果输出是null，去看getFundPosition里面，极有可能是没有基金的持仓详情
    console.log("test over!");
  },
})