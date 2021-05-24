import * as echarts from '../../ec-canvas/echarts';

const app = getApp();
let {
  getFund,
  getFundPosition,
  getFundRank,
  getFundDetail,
  getAllFund,
  getHotFund,
} = require("../../api/getFoundation.js")
let {
  getHold,
  getSelfSelect
} = require("../../api/getUserFunds.js")
let config = require("../../config.js")

Page({

  /**
   * 页面的初始数据
   */

  data: {
    fundCode: 0,
    fundInfo: {}, //基金详情
    fundPosition: {}, //基金持仓
    ec_position: null, //绘制饼状图
    loadPositionOK: false, //只有这样设置才能等后端数据加载完成之后再渲染前端(前端放在了block里面)
    ec_line_1: null, //非货币折线图
    ec_line_2: null,//货币七日年化
    ec_line_3: null,//货币万分收益
    loadLineOK_1: false, //取到数据，才能绘制折线图
    loadLineOK_2:false,
    loadLineOK_3:false,
    totalGrowthRatio: 0, //累计涨幅
    isSelfSelect: false,
    isHold: false,
    lineChoice:'七日年化',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
    })
    var code = options.fundCode;
    var that = this;
    this.setData({
      fundCode: code, //全局变量
    });
    this.loadFundDetail(function () {
      if(that.data.fundInfo.type!='货币型') {
        that.loadEcLine_1();
      } else {
        that.loadEcLine_2();
        that.loadEcLine_3();
      }
    });
    this.loadFundPosition(function () {
      that.loadEcPosition();
    })
    if (app.globalData.isLogin == false) {
      this.setData({
        isSelfSelect: false,
      });
    } else {
      getSelfSelect(
        app.globalData.userInfo.email,
        res => {
          if (res.data.obj.funds != "") {
            var funds = res.data.obj.funds.data;
            var i = 0;
            for (i = 0; i < funds.length; i++) {
              if (funds[i].code == this.data.fundCode) {
                this.setData({
                  isSelfSelect: true,
                });
              }
            }
          } else {
            this.setData({
              isSelfSelect: false
            })
          }

        }
      )
    }

  },

  // 加载基金详情
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
        console.log("获取到的基金详情===>");
        console.log(this.data.fundInfo)
        console.log(this.data.fundInfo.netWorthDate)
        callback()
      }
    );
    // setTimeout(
    //   function () {
    //     callback()
    //   }, 1000
    // ); //同步不知道怎么搞，只好人为设置定时器了
  },

  //加载基金持仓详情
  loadFundPosition: function (callback) {
    getFundPosition(
      this.data.fundCode,
      res => {
        this.setData({
          fundPosition: res.data.data,
        })
        console.log("获取到的持仓详情?===>");
        console.log(res);
      }
    );
    setTimeout(function () {
      callback()
    }, 1000)
  },

  //绘制饼状图
  loadEcPosition: function () {
    // console.log("loadEcPosition")
    // console.log(this.data.fundPosition)
    this.setData({
      ec_position: {
        onInit: this.drawPostionPie
      },
      loadPositionOK: true
    })
  },

  loadEcLine_1: function () { //有可能后端也没有数据
    if (this.data.fundInfo != null) {
      this.setData({
        ec_line_1: {
          onInit: this.drawLineChart_1
        },
        loadLineOK_1: true
      })
    }
  },
  loadEcLine_2: function () { //有可能后端也没有数据
    if (this.data.fundInfo != null) {
      this.setData({
        ec_line_2: {
          onInit: this.drawLineChart_2
        },
        loadLineOK_2: true
      })
    }
  },
  loadEcLine_3: function () { //有可能后端也没有数据
    if (this.data.fundInfo != null) {
      this.setData({
        ec_line_3: {
          onInit: this.drawLineChart_3
        },
        loadLineOK_3: true
      })
    }
  },
  getCertainDimension: function (twoDimArr, num) { //从二维数组里面拿去数据，做一些处理
    var i;
    var arr = [];
    var length = twoDimArr.length;
    let firstNetWorth = twoDimArr[0][1];
    for (i = 0; i < length; i++) {
      if (num == 0 && (i != 0 && i != length - 1)) {
        //arr.push(''); //针对横坐标日期进行特殊的存取，只取第一个和最后一个日子，防止横坐标太乱
        arr.push(twoDimArr[i][num]);
      } else if (num == 1) { //将净值转化为净值涨幅百分比（相对于第一个点的）
        var percent = (twoDimArr[i][num] - firstNetWorth) / firstNetWorth * 100;
        arr.push(percent.toFixed(2));
      } else if(num==2){//万分收益，不做百分比
        var tmp = twoDimArr[i][1]-0;
        arr.push(tmp.toFixed(2));
      }else{
        arr.push(twoDimArr[i][num]);
      }
    }
    return arr;
  },

  drawLineChart_1: function (canvas, width, height, dpr) {
    var fundInfo = this.data.fundInfo;
    var netWorthData = fundInfo.totalNetWorthData;
    var netWorth = this.getCertainDimension(netWorthData, 1);
    var netDate = this.getCertainDimension(netWorthData, 0);
    //console.log("netDate===>",netDate)

    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);

    var option = {
      // title: {
      //   text: '业绩走势',
      //   left:'center',
      //   top:0
      // },
      color: ["#5484dd"],
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
        trigger: 'axis',
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
        name: '涨幅(%)',
        type: 'line',
        smooth: false,
        data: netWorth
      }]
    };

    chart.setOption(option);
    return chart;
  },
  //七日年化
  drawLineChart_2: function (canvas, width, height, dpr) {
    var fundInfo = this.data.fundInfo;
    var netWorthData = fundInfo.sevenDaysYearIncomeData;
    var netWorth = this.getCertainDimension(netWorthData, 1);
    var netDate = this.getCertainDimension(netWorthData, 0);
    //console.log("netDate===>",netDate)

    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);

    var option = {
      // title: {
      //   text: '业绩走势',
      //   left:'center',
      //   top:0
      // },
      color: ["#5484dd"],
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
        trigger: 'axis',
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
        name: '涨幅(%)',
        type: 'line',
        smooth: false,
        data: netWorth
      }]
    };

    chart.setOption(option);
    return chart;
  },
  //万分收益
  drawLineChart_3: function (canvas, width, height, dpr) {
    var fundInfo = this.data.fundInfo;
    var netWorthData = fundInfo.millionCopiesIncomeData;
    var netWorth = this.getCertainDimension(netWorthData, 2);
    var netDate = this.getCertainDimension(netWorthData, 0);
    //console.log("netDate===>",netDate)

    const chart = echarts.init(canvas, null, {
      width: width,
      height: height,
      devicePixelRatio: dpr // new
    });
    canvas.setChart(chart);

    var option = {
      // title: {
      //   text: '业绩走势',
      //   left:'center',
      //   top:0
      // },
      color: ["#5484dd"],
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
        trigger: 'axis',
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
          formatter: '{value}'
        }
        //show: false
      },
      series: [{
        symbol: 'none',
        name: '涨幅(%)',
        type: 'line',
        smooth: false,
        data: netWorth
      }]
    };

    chart.setOption(option);
    return chart;
  },

  drawPostionPie: function (canvas, width, height, dpr) {
    var that = this;
    var position = this.data.fundPosition;
    if (position == null) { //绘制空饼状图
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
      var bondPct = position.bond == "---" ? 0 : parseFloat(position.bond.substring(0, 5)).toFixed(2);
      var stockPct = position.stock == "---" ? 0 : parseFloat(position.stock.substring(0, 5)).toFixed(2);
      var cashPct = position.cash == "---" ? 0 : parseFloat(position.cash.substring(0, 5)).toFixed(2);
      var other = (100 - bondPct - stockPct - cashPct) > 0 ? (100 - bondPct - stockPct - cashPct).toFixed(2) : 0;
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      canvas.setChart(chart);

      var option = {
        backgroundColor: "#ffffff",
        color: ["#a9bdda", "#eeb329", "#006fbe", "#33a1f0", "#32a0ee"],
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
            name: '股票  ' + stockPct + "%"
          }, {
            value: bondPct,
            name: '债券 ' + bondPct + "%"
          }, {
            value: cashPct,
            name: '现金 ' + cashPct + "%"
          }, {
            value: other,
            name: '其他 ' + other + '%'
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
    wx.hideToast();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.isLogin == false) {
      this.setData({
        isSelfSelect: false,
      });
    } else {
      getSelfSelect(
        app.globalData.userInfo.email,
        res => {
          if (res.data.obj.funds != "") {
            var funds = res.data.obj.funds.data;
            var i = 0;
            for (i = 0; i < funds.length; i++) {
              if (funds[i].code == this.data.fundCode) {
                this.setData({
                  isSelfSelect: true,
                });
              }
            }
          } else {
            this.setData({
              isSelfSelect: false
            })
          }
        }
      )
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
  selfSelect: function () {
    if (app.globalData.isLogin == false) {
      wx.showModal({
        cancelColor: 'cancelColor',
        title: '请先登录',
        content: '点击确定跳转到登录界面',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          } else if (res.cancel) {

          }
        }
      })
    } else {
      wx.request({
        url: config.service + '/fund/addWatch',
        method: "POST",
        data: {
          email: app.globalData.userInfo.email,
          fundCode: this.data.fundCode
        },
        success: res => {
          console.log("==>", res);
          if (res.statusCode == "200") {
            // wx.showModal({
            //   title: "关注成功",
            //   content: "您已成功关注该基金!",
            //   cancelColor: 'cancelColor',
            // })
            wx.showToast({
              title: '关注成功!',
              mask:true
            })
            this.setData({
              isSelfSelect: true
            })
          } else {
            wx.showModal({
              title: "关注失败",
              content: "该基金尚未上架，请耐心等待！",
              cancelColor: 'cancelColor',
            })
          }
        }
      })
    }

  },

  deleteSelfSelect: function () {
    wx.request({
      url: config.service + '/fund/deleteWatch',
      method: "POST",
      data: {
        email: app.globalData.userInfo.email,
        fundCode: this.data.fundCode
      },
      success: res => {
        if (res.statusCode == "200") {
          // wx.showModal({
          //   title: "删除成功",
          //   content: "您已取消关注该基金!",
          //   cancelColor: 'cancelColor',
          // })
          wx.showToast({
            title: '取消成功!',
          })
          this.setData({
            isSelfSelect: false
          })
        } else {
          wx.showModal({
            title: "操作失败",
            content: "您未关注该基金或该基金不在数据库中，请检查您的操作！",
            cancelColor: 'cancelColor',
          })
        }
      }
    })
  },
  test: function () {
    console.log("It's a test");
    console.log(this.data)
    console.log(this.data.fundPosition) //如果输出是null，去看getFundPosition里面，极有可能是没有基金的持仓详情
    console.log("test over!");
  },
  gotoBuy: function (e) {
    if (app.globalData.isLogin == false) {
      wx.showModal({
        cancelColor: 'cancelColor',
        title: '请先登录',
        content: '点击确定跳转到登录界面',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/mine/mine',
            })
          } else if (res.cancel) {

          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/buyIn/buyIn?fundCode=' + this.data.fundCode + '&fundName=' + this.data.fundInfo.name,
      })
    }
  },
  swap2Seven:function() {
    this.setData({
      lineChoice:"七日年化"
    })
  },
  swap2Million:function() {
    this.setData({
      lineChoice:"万分收益"
    })
  }
})