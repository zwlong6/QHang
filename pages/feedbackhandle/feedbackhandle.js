// pages/feedbackhandle/feedbackhandle.js
var url = getApp().globalData.wxRequestBaseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 反馈的数组
    feekbackInfo: [],

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
    var that = this;
    wx.request({
      url: url + '/feedback/selectAllnocheckfeedback.do',
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data: {
        "feedbackstatus": 0
      },
      success(res) {
        console.log("查询未处理的反馈成功");
        that.setData({
          feekbackInfo: res.data,
        });
        console.log(that.data.feekbackInfo);
        wx.setStorageSync('feekbackInfo', that.data.feekbackInfo);
      },
      fail(res) {
        console.log("查询未处理的反馈失败");
      }

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
  // 点击跳转到反馈详情页面
  onfeedbackhandledetail(e) {
    // 点击跳转详情
    console.log("跳转到反馈详情页面")
    console.log(e);
    wx.navigateTo({
      url: '/pages/feedbackhandledetail/feedbackhandledetail?feedbackid=' + e.currentTarget.dataset.feedbackid,
    })
  }
})