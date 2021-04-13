// pages/rank/rank.js
let {
  getFundRank
} = require("../../api/getFoundation.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectTypeArray: [{
      "fundType": "all",
      "text": "全部"
    }, {
      "fundType": "gp",
      "text": "股票型"
    }, {
      "fundType": "hh",
      "text": "混合型"
    },{
      "fundType": "zq",
      "text": "债券型"
    },{
      "fundType": "zs",
      "text": "指数型"
    },{
      "fundType": "qdii",
      "text": "QDII"
    },{
      "fundType": "fof",
      "text": "FOF"
    }
    ],
    selectPeriodArray:[{
      "periodType": "r",
      "text": "日涨幅"
    }, {
      "periodType": "z",
      "text": "周涨幅"
    }, {
      "periodType": "1y",
      "text": "近一月"
    },{
      "periodType": "3y",
      "text": "近三月"
    },{
      "periodType": "6y",
      "text": "近六月"
    },{
      "periodType": "1n",
      "text": "近一年"
    },
    ],
    searchFunds: [],
    searchParam: {
      fundType: ["gp"],
      sort: "r",
      pageSize: 20,
      token:"atTPd9c8sA",
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getFundRank(this.data.searchParam, res => {
      console.log(res);
      this.setData({
        searchFunds:res.data.data.rank
      });
      console.log(this.data.searchFunds)
    });
  },
  
  select: function(e) {
    console.log(e.detail);
    if (e.detail.fundType) {
      if (e.detail.fundType == "all") {
        this.setData({
          searchParam: {
            token:"atTPd9c8sA",
            sort: this.data.searchParam.sort,
            pageSize: this.data.searchParam.pageSize,
          }
        });
      } 
      else {
        this.setData({
          searchParam: {
            token:"atTPd9c8sA",
            fundType:[e.detail.fundType],
            sort: this.data.searchParam.sort,
            pageSize: this.data.searchParam.pageSize,
          }
        });
      }
      console.log(this.data.searchParam);
    }
    if (e.detail.periodType) {
      this.setData({
        searchParam: {
          token:"atTPd9c8sA",
          fundType: this.data.searchParam.fundType,
          sort: e.detail.periodType,
          pageSize: this.data.searchParam.pageSize,
        }
      });
    }
    getFundRank(this.data.searchParam, res => {
      this.setData({
        searchFunds:res.data.data.rank
      });
    });
  }

})