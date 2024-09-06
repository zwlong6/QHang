// pages/manageuserdetail/manageuserdetail.js
var url=getApp().globalData.wxRequestBaseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 上个页面传过来的目标用户
    userInfoTarget:{},
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
    var userInfoTarget=wx.getStorageSync('userInfoTarget');
    that.setData({
      userInfoTarget:userInfoTarget
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

  // 功能
  // 拉黑
  onBlacklist(e){
    var that=this;
    wx.request({
      url: url+'/user/updateUserStatusById.do',
      method:'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data:{
        "id":e.currentTarget.dataset.id,
        "status":1,
      },
      success(res){
        console.log("拉黑成功");
        wx.showToast({
          title: '拉黑成功!',
          icon:'success',
          duration:1000,
          success(){
            setTimeout(function(){
              that.setData({
                [`userInfoTarget.status`]:1,
              })
              console.log(that.data.userInfoTarget.status);
              that.onLoad();
            },1000)
          }
        })
      },
      fail(res){
        console.log("拉黑成功");
        wx.showToast({
          title: '拉黑失败,请稍后再试!',
          icon:'error',
          duration:1000,
          success(){
            setTimeout(function(){
              that.onLoad();
            },1000)
          }
        })
      }
    })
    that.onShow();
  },
  onUnBlacklist(e){
    var that=this;
    wx.request({
      url: url+'/user/updateUserStatusById.do',
      method:'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data:{
        "id":e.currentTarget.dataset.id,
        "status":0,
      },
      success(res){
        console.log("解除拉黑成功");
        wx.showToast({
          title: '解除拉黑成功!',
          icon:'success',
          duration:1000,
          success(){
            setTimeout(function(){
              that.setData({
                [`userInfoTarget.status`]:0,
              })
              that.onLoad();
            },1000)
          }
        })
      },
      fail(res){
        console.log("解除拉黑失败");
        wx.showToast({
          title: '解除拉黑失败,请稍后再试!',
          icon:'error',
          duration:1000,
          success(){
            setTimeout(function(){
              that.onLoad();
            },1000)
          }
        })
      }
    })
  }
})