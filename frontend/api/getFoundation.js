//获取用户的基础信息,code为传入的基金代码，如有多个用逗号隔开
function getFund(code,callback) {
  wx.request({
    url: 'https://api.doctorxiong.club/v1/fund',
    method: "GET",
    data:{
      code:code,
      token:"atTPd9c8sA"
    },
    success: res=>{
      callback(res);
    }
  })
}
function getFundPosition(code,callback) {
  console.log(code);
  wx.request({
    url: 'https://api.doctorxiong.club/v1/fund/position',
    method:"GET",
    data:{
      code:code,
      token:"atTPd9c8sA"
    },
    success: res=>{
      callback(res)
    }
  })
}
/**
 * 要求param是一个json对象,具体格式参考老师给的接口文档
 * (若无需求，则相应字段不需要出现。但要保持param为json格式。什么参数都不带的时候，var param={})
 */
function getFundRank(param,callback) {
  wx.request({
    url: 'https://api.doctorxiong.club/v1/fund/rank',
    method:"POST",
    data:param,
    success:res=>{
      callback(res)
    }
  })
}
// param要求见接口文档，注意日期要用utils中的formatTime格式化
function getFundDetail(param,callback) {
  wx.request({
    url: 'https://api.doctorxiong.club/v1/fund/detail',
    method:"GET",
    data:param,
    success:res=>{
      callback(res)
    }
  })
}
function getAllFund(callback) {
  wx.request({
    url: 'https://api.doctorxiong.club/v1/fund/all',
    data:{
      token:"atTPd9c8sA"
    },
    method:"GET",
    success: res=>{
      callback(res)
    }
  })
}
function getHotFund(callback) {
  wx.request({
    url: 'https://api.doctorxiong.club/v1/fund/hot',
    method:"GET",
    data:{
      token:"atTPd9c8sA"
    },
    success:res=>{
      callback(res)
    }
  })
}
module.exports={
  getFund:getFund,
  getFundPosition:getFundPosition,
  getFundRank:getFundRank,
  getFundDetail:getFundDetail,
  getAllFund:getAllFund,
  getHotFund:getHotFund,
}