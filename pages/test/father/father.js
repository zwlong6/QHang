Page({
  /**
   * 页面的初始数据
   */
  data: {
    ids:[
      {
        id:1,
        name:"长江"
      },
      {
        id:1,
        name:"大学"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  onListTap(e) {
    wx.setStorageSync('username', this.data.ids)
    // 1. 传递参数-通过url的方式传递当前页面数据到子页面当中去,在子页面的onload的options中可以拿到
    wx.navigateTo({
      url: '/pages/test/son/son?id=${ids}',

    });

  },
});
