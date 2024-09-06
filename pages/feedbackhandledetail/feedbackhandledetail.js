// pages/feedbackhandledetail/feedbackhandledetail.js
var url = getApp().globalData.wxRequestBaseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 未处理的反馈
    feekbackInfo: [],
    // 本页面收到的哪个未处理订单
    feedbackid: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var feedbackInfo = wx.getStorageSync('feekbackInfo');
    console.log(feedbackInfo);
    var that = this;
    that.setData({
      feedbackInfo: feedbackInfo,
      feedbackid: options.feedbackid
    })
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

  },

  onCheckfeedback(e) {
    console.log(e);
    var that = this;
    wx.request({
      url: url + '/feedback/updatefeedback.do',
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data: {
        "id": e.currentTarget.dataset.feedbackid,
        "feedbackstatus": 1
      },
      success(res) {
        console.log("更新成功！");
        wx.showToast({
          title: '处理成功！',
          icon: "success",
          duration: 1000,
          success() {
            setTimeout(function () {
              wx.navigateBack({
                url: '/pages/feedbackhandle/feedbackhandle',
              })
            }, 1000);
          }
        });

      }
    })
  }
})