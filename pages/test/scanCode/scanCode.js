// pages/test/scanCode/scanCode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeUrl:"https://www.zwlserver.top/sitDown",
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
    var that=this;
    console.log("动态扫码！");
    var fader = setInterval(function() {
      var random=Math.random()*1000;
      that.setData({
        codeUrl:"https://www.zwlserver.top/sitDown"+random,
      })
      // that.onShow();
    }, 5000);
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
  onScanCode(e){
    var that=this;
    console.log("点击扫码");
    wx.scanCode({
      onlyFromCamera: true,

      success(res){
        console.log("扫码成功："+JSON.stringify(res))
 
        // 扫码成功后  在此处理接下来的逻辑
        that.setData({
          scanCode: res.result
        })
    }
  })
  },
})