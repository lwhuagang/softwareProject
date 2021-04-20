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
    fundPosition:{},//基金持仓
    ec_position:null,//绘制饼状图
    loadPositionOK:false,//只有这样设置才能等后端数据加载完成之后再渲染前端(前端放在了block里面)
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
    this.loadFundPosition(function(){
      that.loadEcPosition()
    })
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
  this.setData({
    ec_position:{
      onInit:this.drawPostionPie
    },
    loadPositionOK:true
  })
},

drawPostionPie:function(canvas, width, height, dpr) {
  var that = this;
  var position = this.data.fundPosition;
  if(position==null) { //绘制空饼状图
    console.log("isNull")
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);
  
    var option = {
      backgroundColor: "#ffffff",
      color: ["#e6e6e6"],
      title: {
        text: '暂无持仓数据',
        left: 'center',
      },
      series: [{
        label: {
          normal: {
            fontSize: 10
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['0%', '68%'],
        data: [{
          value: 100,
        }]
      }]
    };
  
    chart.setOption(option);
    return chart;
  } else {
    var bondPct = position.bond=="---"?0:parseFloat(position.bond.slice(0,5))
    var stockPct = position.stock=="---"?0:parseFloat(position.stock.slice(0,5));
    var cashPct = position.cash=="---"?0:parseFloat(position.cash.slice(0,5))
    var other = (100-bondPct-stockPct-cashPct)>0?(100-bondPct-stockPct-cashPct):0;
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);
  
    var option = {
      backgroundColor: "#ffffff",
      color: ["#ef7340", "#eeb329", "#006fbe", "#33a1f0","#32a0ee"],
      // title: {
      //   text: '持仓详情',
      //   left: 'left'
      // },
      series: [{
        label: {
          normal: {
            fontSize: 10
          }
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: ['54%', '80%'],
        data: [{
          value: stockPct,
          name: '股票  '+stockPct+"%"
        }, {
          value: bondPct,
          name: '债券 '+bondPct+"%"
        }, {
          value: cashPct,
          name: '现金 '+cashPct+"%"
        },{
          value: other,
          name: '其他 '+other+'%'
        }]
      }]
    };
  
    chart.setOption(option);
    return chart;
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
})