// pages/feedback/feedback.js
var url=getApp().globalData.wxRequestBaseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    userInfo:getApp().globalData.userInfo,
    // 反馈的标题
    feedbacktitle:"",
    // 反馈的内容
    feedbackcontent:"",
    // 反馈的联系人
    feedbackname:"",
    // 反馈的联系电话
    feedbackphone:"",
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
    // 加载用户信息
    var that=this;
    that.setData({
      userInfo:getApp().globalData.userInfo
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
  // //获取输入的反馈
  // onBindinput(res){
  //   var that=this;
  //   that.setData({
  //     inputValue:res.detail.value,
  //   })
  // },
  // 获取反馈的标题
  onbindinputfeedbacktitle(res){
    var that=this; 
    that.setData({
      feedbacktitle:res.detail.value,
    })
    console.log(that.data.feedbacktitle);
  },
  // 获取反馈的内容
  onbindinputfeedbackcontent(res){
    var that=this; 
    that.setData({
      feedbackcontent:res.detail.value,
    })
    console.log(that.data.feedbackcontent);
  },
    // 获取反馈的联系人
    onbindinputfeedbackname(res){
      var that=this; 
      that.setData({
        feedbackname:res.detail.value,
      })
      console.log(that.data.feedbackname);
    },
      // 获取反馈的联系电话
  onbindinputfeedbackphone(res){
    var that=this; 
    that.setData({
      feedbackphone:res.detail.value,
    })
    console.log(that.data.feedbackphone);
  },



  onFeedbackCommit(){
    var that=this;
    console.log("提交用户的反馈！");
    var feedbackCreateTime=new Date();
    var feedbackCreateTimeToString=feedbackCreateTime.getFullYear()+'-'+(feedbackCreateTime.getMonth()+1)+'-'+feedbackCreateTime.getDate()+' '+feedbackCreateTime.getHours()+':'+feedbackCreateTime.getMinutes()+':'+feedbackCreateTime.getSeconds();
    wx.request({
      url:url+'/feedback/insertFeedback.do',
      method:'POST',
      header:{
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8', // 默认值
      },
      data:{
        "userId":that.data.userInfo.id,
        "feedbacktitle":that.data.feedbacktitle,
        "feedbackcontent":that.data.feedbackcontent,
        "feedbackname":that.data.feedbackname,
        "feedbackphone":that.data.feedbackphone,
        "feedbackCreateTime":feedbackCreateTimeToString,
      },
      success(res){
        console.log("反馈成功！");
        // wx.showToast({
        //   title: '您拒绝了请求！',
        //   icon: 'error',
        //   duration: 2000
        // });
        wx.showToast({
          title: '感谢您的反馈！',
          icon:'success',
          duration:2000,
          success:function(){
            setTimeout(function(){
            wx.switchTab({
              url: '/pages/index/index',
            })
            },1000);
          }
        })
      },
      fail(res){
        console.log("反馈失败");
      }
    })
  }
})