// pages/holdFundDetail/holdFundDetail.js
import * as echarts from '../../ec-canvas/echarts';
import common from "../../utils/public.js";
const app = getApp();
let {
  getFund,
  getFundPosition,
  getFundRank,
  getFundDetail,
  getAllFund,
  getHotFund,
} = require("../../api/getFoundation.js");
let config = require("../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fundCode: 0,
    fundInfo: {}, //基金详情
    ec_line_acc: null, //折线图
    ec_line_worth: null,
    ec_line_exp: null,
    loadLine_worth_OK: false, //取到数据，才能绘制折线图
    loadLine_acc_OK: false,
    loadLine_exp_OK: false,
    // moneyValue:20,//金额
    // yesIncomeValue:0,//昨日收益
    // holdIncomeValue:0,//持有收益
    // holdIncomeRationValue:0,//持有收益率
    foldded: true, //是否折叠
    // holdMoney:0,//持有金额
    // unAckMoney:20,//待确认金额
    // posCost:0,//持仓成本价
    // holdPart:0,//持有份额
    lineChoice: "业绩走势",
    holdDetail: null,
    totalProfit: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var code = options.fundCode;
    var that = this;
    console.log("code===>", code)
    this.setData({
      fundCode: code, //全局变量
      totalProfit: options.totalProfit.split(",").map(Number) //这块真的太难受了，传的是个字符串，数字以逗号间隔
    });
    console.log("30天净值数据------------>")
    console.log(this.data.totalProfit)
    // console.log(this.data.totalProfit[2])
    console.log([1, 2, 3, 4])
    wx.request({
      url: config.service + '/fund/selfMsg',
      method: "POST",
      data: {
        userEmail: app.globalData.userInfo.email,
        fundCode: options.fundCode
      },
      success: (res) => {
        if (res.data.code == 200 && res.data.message == "获取用户单个基金的资产详情") {
          console.log("holdFundDetail===>", res);
          this.setData({
            holdDetail: res.data.obj
          })
        }
      }
    })
    this.loadFundDetail(function () {
      that.loadEcLine_acc(); //累计盈亏
      that.loadEcLine_worth(); //业绩走势
      that.loadEcLine_exp(); //净值估算
    });
  },
  loadFundDetail: function (callback) {
    var that = this;
    getFundDetail({
        code: this.data.fundCode,
        token: "atTPd9c8sA"
      },
      res => {
        this.setData({
          fundInfo: res.data.data
        });
        // console.log("获取到的基金详情===>");
        // console.log(this.data.fundInfo)
        // console.log(this.data.fundInfo.netWorthDate)  
        callback()
      }
    );
    // setTimeout(
    //   function () {
    //     callback()
    //   }, 1000
    // );
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
    console.log("30天净值数据------------>")
    console.log(this.data.totalProfit)
    // console.log(this.data.totalProfit[2])
    console.log([1, 2, 3, 4])
    wx.request({
      url: config.service + '/fund/selfMsg',
      method: "POST",
      data: {
        userEmail: app.globalData.userInfo.email,
        fundCode: this.data.fundCode
      },
      success: (res) => {
        if (res.data.code == 200 && res.data.message == "获取用户单个基金的资产详情") {
          console.log("holdFundDetail===>", res);
          this.setData({
            holdDetail: res.data.obj
          })
        }
      }
    })
    this.loadFundDetail(function () {
      that.loadEcLine_acc(); //累计盈亏
      that.loadEcLine_worth(); //业绩走势
      that.loadEcLine_exp(); //净值估算
    });
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
  loadEcLine_worth: function () { //有可能后端也没有数据
    if (this.data.fundInfo != null) {
      this.setData({
        ec_line_worth: {
          onInit: this.drawLineChart_worth
        },
        loadLine_worth_OK: true
      })
    }
  },
  loadEcLine_acc: function () { //有可能后端也没有数据
    if (this.data.fundInfo != null) {
      this.setData({
        ec_line_acc: {
          onInit: this.drawLineChart_acc
        },
        loadLine_acc_OK: true
      })
    }
  },
  loadEcLine_exp: function () { //有可能后端也没有数据
    if (this.data.fundInfo != null) {
      this.setData({
        ec_line_exp: {
          onInit: this.drawLineChart_worth
        },
        loadLine_exp_OK: true
      })
    }
  },
  getCertainDimension: function (twoDimArr, num) { //从二维数组里面拿去数据，做一些处理
    var i;
    var arr = [];
    if (twoDimArr) {
      var length = twoDimArr.length;
      let firstNetWorth = twoDimArr[0][1];
      for (i = 0; i < length; i++) {
        if (num == 0 && (i != 0 && i != length - 1)) {
          //arr.push('');  //针对横坐标日期进行特殊的存取，只取第一个和最后一个日子，防止横坐标太乱
          arr.push(twoDimArr[i][num]);
        } else if (num == 1) { //将净值转化为净值涨幅百分比（相对于第一个点的）
          var percent = (twoDimArr[i][num] - firstNetWorth) / firstNetWorth * 100;
          arr.push(percent.toFixed(2));
        } else {
          arr.push(twoDimArr[i][num]);
        }
      }
    }
    return arr;
  },

  drawLineChart_acc: function (canvas, width, height, dpr) {
    var date = new Date();
    var timestamp = date.getTime() / 1000

    console.log(common.getMyData(timestamp, "Y-m-d"))
    var x = []
    var totalProfit = this.data.totalProfit
    var length = totalProfit.length
    var totalProfitFlag
    wx.request({
      url: config.service+'/user/totalProfitFlag',
      method:"GET",
      success:(res)=>{
        console.log(res)
        totalProfitFlag = res.data.obj
        var back = 0
        if (totalProfitFlag == 0){
          back = back+3600*24
        }
        back = back+3600*24*(length-1)
        for (var index in totalProfit) {
          x.push(common.getMyData(timestamp-back,"Y-m-d"))
          back = back - 3600*24

        }
        console.log(x)
        var y = this.data.totalProfit
        var i
        var length = y.length
        for (i = 0; i < y.length; i++) {
          y[i] = Math.floor(y[i]*100)/100;
        }
        console.log("y:", y)
        // console.log("netWorth===>",netWorth)

        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });
        canvas.setChart(chart);

        // var option = {
        //   color: ["#5484dd"],
        //   // legend: {
        //   //   data: ['本基金'],
        //   //   top: 20,
        //   //   left: 'center',
        //   //   z: 100
        //   // },
        //   grid: {
        //     containLabel: true,
        //     bottom: 20,
        //     left: 10,
        //     y: 20
        //   },
        //   tooltip: {
        //     show: true,
        //     trigger: 'axis'
        //   },
        //   xAxis: {
        //     type: 'category',
        //     boundaryGap: false,
        //     data: x,
        //     axisLabel: {
        //       showMaxLabel: true,
        //       showMinLable: true
        //     },
        //     axisTick: {
        //       show: false
        //     },
        //     axisLine: {
        //       lineStyle: {
        //         type: 'dashed',
        //         opacity: 0
        //       },
        //     }
        //     //show: false
        //   },
        //   toolbox: {
        //     show: true,
        //     feature: {
        //         dataZoom: {
        //             yAxisIndex: 'none'
        //         },
        //         restore: {},
        //     },
        //     orient: 'vertical'
        //   },
        //   yAxis: {
        //     x: 'center',
        //     type: 'value',
        //     splitLine: {
        //       lineStyle: {
        //         type: 'dashed'
        //       }
        //     },

        //     //show: false
        //   },
        //   series: [{
        //     symbol: 'none',
        //     name: '本基金',
        //     type: 'line',
        //     smooth: false,
        //     data: y
        //   }]
        // };
        var option = {
          color: ["#37A2DA"],
          // legend: {
          //   data: ['本基金'],
          //   top: 20,
          //   left: 'center',
          //   z: 100
          // },
          grid: {
            containLabel: true,
            bottom: 20,
            left: 10,
            y: 20
          },
          tooltip: {
            show: true,
            trigger: 'axis'
          },
          toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
            },
            orient: 'vertical'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: x,
            axisLabel: {
              showMaxLabel: true,
              showMinLable: true
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                type: 'dashed',
                opacity: 0
              },
            }
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
            symbol: 'none',
            name: '盈亏幅度(%)',
            type: 'line',
            smooth: false,
            data: y
          }]
        };
        chart.setOption(option);
        return chart;
      }
    })
    
  },
  drawLineChart_worth: function (canvas, width, height, dpr) {
    var fundInfo = this.data.fundInfo;
    var netWorthData = fundInfo.totalNetWorthData;
    var netWorth = this.getCertainDimension(netWorthData, 1);
    var netDate = this.getCertainDimension(netWorthData, 0);
    // console.log("netDate===>",netDate)
    // console.log("netWorth===>",netWorth)

    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);

    var option = {
      color: ["#37A2DA"],
      // legend: {
      //   data: ['本基金'],
      //   top: 20,
      //   left: 'center',
      //   z: 100
      // },
      grid: {
        containLabel: true,
        bottom: 20,
        left: 10,
        y: 20
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      toolbox: {
        show: true,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
        },
        orient: 'vertical'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: netDate,
        axisLabel: {
          showMaxLabel: true,
          showMinLable: true
        },
        axisTick: {
          show: false
        },
        axisLine: {
          lineStyle: {
            type: 'dashed',
            opacity: 0
          },
        }
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
        axisLabel: {
          formatter: '{value} %'
        }
        //show: false
      },
      series: [{
        symbol: 'none',
        name: '基金涨幅(%)',
        type: 'line',
        smooth: false,
        data: netWorth
      }]
    };

    chart.setOption(option);
    return chart;
  },
  changeFold: function () {
    var tmp = this.data.foldded;
    this.setData({
      foldded: !tmp
    });
  },
  swap2Acc: function () {
    this.setData({
      lineChoice: "累计盈亏"
    })
  },
  swap2Worth: function () {
    this.setData({
      lineChoice: "业绩走势"
    })
  },
  swap2Exp: function () {
    this.setData({
      lineChoice: "净值估算"
    })
  },
})