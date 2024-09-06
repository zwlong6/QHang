// pages/test/wxlogin/wxlogin.js
var url=getApp().globalData.wxRequestBaseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:0,
    openid:0,
    session_key:0,
  },
  onL:function(e){
    console.log("开始");
    var that=this;
    wx.login({
      success (res) {
        // console.log(res);
        if (res.code) {
          //发起网络请求
          wx.request({
            url:url+"/test/testopenid.do",
            data:{
              code:res.code,
            },
            method:'GET',
            header:{
              // 请求头部
              // 'content-type':'application/x-www-form-urlencoded'
              'content-type':'application/json'
          },
            success(res){
              console.log(res);
            },
            fail(res){
              console.log("请求openid失败！");
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    console.log(that.data.openid);
    console.log(that.data.session_key);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})