let config = require("../config.js")
function getHold(email, callback) {
  wx.request({
    url: config.service+'/user/havingList',
    method: "GET",
    data: {
      email: email
    },
    success: res => {
      callback(res);
    }
  })
}

function getSelfSelect(email, callback) {
  wx.request({
    url: config.service+'/user/watchList',
    method: "GET",
    data: {
      email: email
    },
    success: res => {
      callback(res);
    }
  })
}

function getSearch(fundCode, name, callback) {
  if (fundCode != "") {
    wx.request({
      url: config.service+'/fund/searchFund',
      method: "POST",
      data: {
        code: fundCode,
        name: ""
      },
      success: res => {
        callback(res);
      }
    })
  } else {
    wx.request({
      url: config.service+'/fund/searchFund',
      method: "POST",
      data: {
        name: name
      },
      success: res => {
        callback(res);
      }
    })
  }
}

function getDealRecord(email, callback) {
  wx.request({
    url: config.service+'/user/getRecordsOfUser',
    method: "GET",
    data: {
      email: email
    },
    success: res => {
      callback(res);
    }
  })
}

function getFundRecord(email, code, callback) {
  wx.request({
    url: config.service+'/user/getRecordsOfFund',
    method: "GET",
    data: {
      userEmail: email,
      fundCode: code,
    },
    success: res => {
      callback(res);
    }
  })
}

module.exports = {
  getHold: getHold,
  getSelfSelect: getSelfSelect,
  getSearch: getSearch,
  getDealRecord: getDealRecord,
  getFundRecord: getFundRecord
}