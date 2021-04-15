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
    ec_position:null,
    loadPositionOK:false,//只有这样设置才能等后端数据加载完成之后再渲染前端(前端放在了block里面)
    ec_line:null,//折线图
    loadLineOK:false,//取到数据，才能绘制折线图
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
    this.loadFundDetail(function(){
      that.loadEcLine()
    });
    this.loadFundPosition(function(){
      that.loadEcPosition()
    })
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
      console.log(this.data.fundInfo.netWorthDate)
      
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

//绘制饼状图
loadEcPosition:function() {
  // console.log("loadEcPosition")
  // console.log(this.data.fundPosition)
  if(this.data.fundPosition!=null) { //有可能后端也没有数据
    this.setData({
      ec_position:{
        onInit:this.drawPostionPie
      },
      loadPositionOK:true
    })
  }
},

loadEcLine:function(){   //有可能后端也没有数据
  if (this.data.fundInfo!=null){ 
    this.setData({
      ec_line:{
        onInit:this.drawLineChart
      },
      loadLineOK:true
    })
  }
},
getCertainDimension:function(twoDimArr,num){
  var i;
  var arr = [];
  var length = twoDimArr.length;
  for (i=0; i <length;i++){
    if (num == 0 &&(i!=0 && i!= length-1)){
      arr.push('');  //针对横坐标日期进行特殊的存取，只取第一个和最后一个日子，防止横坐标太乱
    }else{
          arr.push(twoDimArr[i][num]);
    }
  }
  console.log(arr);
  return arr;
},

drawLineChart:function(canvas, width, height, dpr){
  var fundInfo = this.data.fundInfo;
  var netWorthData = fundInfo.netWorthData;
  var netWorth = this.getCertainDimension(netWorthData,1);
  var netDate = this.getCertainDimension(netWorthData,0);
  
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    title: {
      text: '业绩走势',
      left: 'center'
    },
    color: ["#37A2DA"],
    legend: {
      data: ['本基金'],
      top: 20,
      left: 'center',
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
      data: netDate,
       //show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
       //show: false
    },
    series: [{
      name: '本基金',
      type: 'line',
      smooth: false,
      data: netWorth
    }]
  };

  chart.setOption(option);
  return chart;
},

drawPostionPie:function(canvas, width, height, dpr) {
  var that = this;
  var position = this.data.fundPosition;
  var bondPct = position.bond=="---"?0:parseFloat(position.bond.slice(0,5))
  var stockPct = position.stock=="---"?0:parseFloat(position.stock.slice(0,5));
  var cashPct = position.cash=="---"?0:parseFloat(position.cash.slice(0,5))
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    series: [{
      label: {
        normal: {
          fontSize: 10
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['0%', '100%'],
      data: [{
        value: stockPct,
        name: '股票  '+stockPct+"%"
      }, {
        value: bondPct,
        name: '债券 '+bondPct+"%"
      }, {
        value: cashPct,
        name: '现金 '+cashPct+"%"
      }]
    }]
  };

  chart.setOption(option);
  return chart;
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