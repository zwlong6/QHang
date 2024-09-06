// pages/scancode/scancode.js
var url=getApp().globalData.wxRequestBaseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前二维码链接
    codeUrl:"",
    // 当前二维码核验
    randomData:0,
    // 用于清除计时器用
    timer:0,

    static:getApp().globalData.static,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log("动态扫码！");
    // 产生的随机数保留三位小数
    var random=(Math.random()*1000).toFixed(0);
    wx.setStorageSync('randomdata',random);
    console.log(random);
    that.setData({
      randomData:random,
      codeUrl:"https://www.zwlserver.top/sitDown?"+random,
    })
    var codeUrl=that.data.codeUrl;
    that.updateScanCodeMysql(codeUrl);
   that.data.timer= setInterval(function() {
      // 产生的随机数保留三位小数
      random=(Math.random()*1000).toFixed(0);
      wx.setStorageSync('randomdata',random);
      console.log(random);
      that.setData({
        randomData:random,
        codeUrl:"https://www.zwlserver.top/sitDown?"+random,
      })
      codeUrl=that.data.codeUrl;
      that.updateScanCodeMysql(codeUrl);
      // that.onShow();
    }, 5000); 
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
    var that=this;
    that.setData({
      static:getApp().globalData.static
    })
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
    var that=this;
    clearInterval(that.data.timer);
    console.log(that.data.timer);
    console.log("关闭界面");
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
  // 更新二维码
  updateScanCodeMysql(e){
    console.log(e);
    wx.request({
      url:url+'/scancode/updateScanCodeById.do',
      method:'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data:{
        "id":1,
        "scancodeUrl":e
      },
      success(res){
        console.log("更新scancode成功！");
      },
      fail(res){
        console.log("更新scancode失败");
      }
    })
  }
})