// pages/manageuser/manageuser.js
var url=getApp().globalData.wxRequestBaseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchId1:0,
    searchId:0,
    userInfosId:0,

    //用户信息
    userInfos:[],
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
    // 查询所有的用户信息
    wx.request({
      url:url+'/user/selectAllUsers.do',
      method:'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data:{

      },
      success(res){
        console.log("请求成功");
        console.log(res);
        that.setData({
          userInfos:res.data,
        })
      },
      fail(res){
        console.log("请求失败");
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

  // 搜索框
  onBindInput(res){
    var that=this;
    that.setData({
      searchId1:res.detail.value,
    })
  },

  // 搜索框
  onSearchbindConfirm(res){
    var that=this;
    that.setData({
      searchId:that.data.searchId1
    })
    var userInfos=that.data.userInfos;
    console.log(userInfos);
    var i=0;
    for(i=0;i<userInfos.length;i++){
      if(that.data.searchId==userInfos[i].id){
        that.setData({
          userInfosId:i
        })
        break;
      }
      if(i==userInfos.length-1){
        that.setData({
          searchId:0,
        })
        wx.showToast({
          title: '未找到相关用户！',
          icon:'error',
          duration:2000,
          success(){
              that.onShow();
          }
        })
      }
    }
  },

  // 点击某用户，将其传到下一个页面
  onbindUserDetail(e){
    var that=this;
    console.log(e.currentTarget.dataset.id);
    var i=0;
    var userInfos=that.data.userInfos;
    for(i=0;i<userInfos.length;i++){
      if(userInfos[i].id==e.currentTarget.dataset.id){
        wx.setStorageSync('userInfoTarget', userInfos[i]);
        wx.navigateTo({
          url: '/pages/manageuserdetail/manageuserdetail',
        })
        break;
      }
    }

  }
})