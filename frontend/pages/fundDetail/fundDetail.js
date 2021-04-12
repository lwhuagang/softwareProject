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
    // 调用时url为: /pages/fundDetail/fundDetail?fundCode=202015 这种带参数的形式
    var tmpCode = options.fundCode;
    console.log("传入页面的参数:fundCode===>")
    console.log(tmpCode)
     getFundDetail(
      {code:tmpCode,
       token:"atTPd9c8sA"
      },
      res=>{
        this.setData({
          fundInfo:res.data.data
        });
        console.log("获取到的基金详情===>");
        console.log(this.data.fundInfo)
      }
    )
    getFundPosition(
      tmpCode,
      res=>{
        this.setData({
          fundPosition:res.data.data,
        })
        console.log("获取到的持仓详情===>");
        console.log(this.data.fundPosition);
      }
    )
    this.setData({
      ec:{
        onInit:this.initChart
      }
    })
    //特别注意！这里是异步的！即真实执行顺序并不一定是从上往下的。比如在这里console.log(this.data.fundInfo)，大概率为空
    //如果要对数据进行操作，建议放在别的函数里面！
    for(var i=0;i<100000000;++i);
    this.calcTotalGrowthRatio();
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
    console.log(this.data.fundInfo)
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
  // calcTotalGrowthRatio:function() {
  //   console.log(this.data)
  //   console.log(this.data.fundInfo)
  // },
  initChart:function(canvas, width, height, dpr) {
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);
  
    var option = {
      title: {
        text: '测试下面legend的红色区域不应被裁剪',
        left: 'center'
      },
      color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
      legend: {
        data: ['A', 'B', 'C'],
        top: 50,
        left: 'center',
        backgroundColor: 'red',
        z: 100
      },
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
        // show: false
      },
      series: [{
        name: 'A',
        type: 'line',
        smooth: true,
        data: [18, 36, 65, 30, 78, 40, 33]
      }, {
        name: 'B',
        type: 'line',
        smooth: true,
        data: [12, 50, 51, 35, 70, 30, 20]
      }, {
        name: 'C',
        type: 'line',
        smooth: true,
        data: [10, 30, 31, 50, 40, 20, 10]
      }]
    };
  
    chart.setOption(option);
    return chart;
  }
})