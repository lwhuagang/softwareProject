function getHold(email,callback) {
  wx.request({
    url: 'http://localhost:8080/user/havingList',
    method: "GET",
    data:{
      email: email
    },
    success: res=>{
      callback(res);
    }
  })
}

module.exports={
  getHold:getHold,
}