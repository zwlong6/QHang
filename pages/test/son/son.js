Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 页面中要渲染的数据,数据初始化
    id: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    var username = wx.getStorageSync('username')
    console.log(username);
    console.log(e);
  }
});
