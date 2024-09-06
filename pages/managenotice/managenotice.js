// pages/notice/notice.js
var url=getApp().globalData.wxRequestBaseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
        // 公告
        noticeInfo:[],
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
    wx.request({
      url: url+'/notice/selectAllNotices.do',
      method:"POST",
      header:{
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8', // 默认值
      },
      success(res){
        console.log(res);
        that.setData({
          noticeInfo:res.data,
        })
      },
      fail(res){
        console.log(res);
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
  // 跳转公告详情
  onSwitchNoticeDetail(e){
    console.log(e);
    console.log("公告详情")
    wx.setStorageSync('index', e.currentTarget.dataset.index);
    wx.navigateTo({
      url: '/pages/noticedetail/noticedetail',
    })
  },
  // 删除公告
  onDeleteNotice(e){
    console.log(e);
    var that=this;
    console.log("删除公告");
    wx.showModal({
      title:"提示",
      content:"是否确认删除公告？",
      success(res){
        if(res.confirm){
          console.log("用户点击确认");
          that.onDeleteNoticeMysql(e.currentTarget.dataset.id);
        }else if(res.cancel){
          console.log("用户点击取消");
        }
      }
    })
  },
  // 删除公告请求
  onDeleteNoticeMysql(id){
    var that=this;
    wx.request({
      url:url+'/notice/deleteNoticeById.do',
      method:'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data:{
        "id":id,
      },
      success(res){
        console.log("删除公告成功");
        wx.showToast({
          title: '删除公告成功！',
          icon:'success',
          duration:1000,
          success(){
            that.onShow();
          }
        })
        that.onLoad();
      },
      fail(res){
        wx.showToast({
          title: '删除公告失败！',
          icon:'error',
          duration:1000
        })
      }
    })
  },
  // 添加公告
  insertNotice(){
    wx.navigateTo({
      url: '/pages/managenoticeinsert/managenoticeinsert',
    })
  },
})