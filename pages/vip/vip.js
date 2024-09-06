// pages/vip/vip.js
var url = getApp().globalData.wxRequestBaseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    userInfo: {},
    // 默认所选择的导航栏
    tagId: '1',
    products: ''
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
  onShow: function (e) {
    console.log("onshow 开始");
    var that = this;
    that.setData({
      userInfo: getApp().globalData.userInfo,
    })
    var that = this;
    wx.request({
      url: url + "/vip/selectAllVips.do",
      method: "POST",
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data: {
        "tagId": that.data.tagId
      },
      // 请求成功返回什么
      success(res) {
        console.log(res);
        that.setData({
          products: res.data
        })
        // console.log(that.data.products[0]);
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

  // 点击选项的方法
  getChoose(e) {
    var app = getApp();
    var that = this;
    console.log(e);
    that.setData({
      // 微信小程序前端传的参数只能是全部小写
      tagId: e.currentTarget.dataset.tagids
    });
    wx.request({
      url: url + "/vip/selectAllVips.do",
      method: "POST",
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data: {
        "tagId": that.data.tagId
      },
      // 请求成功返回什么
      success(res) {
        console.log(res);
        that.setData({
          products: res.data
        })
        // console.log(that.data.products[0]);
      }
    })
  }

})

