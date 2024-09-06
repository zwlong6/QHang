// pages/user/user.js
var url=getApp().globalData.wxRequestBaseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 公告
    noticeInfo:[],
    //加载静态资源
    static:getApp().globalData.static,
    userInfo:getApp().globalData.userInfo,
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
    // 刷新当前用户信息，
    that.setData({
      static:getApp().globalData.static,
      userInfo:getApp().globalData.userInfo,
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
  // 获取微信用户的昵称 头像 性别
  getUserInfo() {
    var that=this;
    wx.showModal({
      title: '温馨提示',
      content: '亲，授权微信登录后才能正常使用小程序功能',
      success(res) {
        //如果用户点击了确定按钮
        if (res.confirm) {
          wx.getUserProfile({
            desc: '获取你的昵称、头像、地区及性别',
            success: res => {
              console.log("获取昵称，头像，地区，性别成功！");
              //给当前页面数组赋值
              that.setData({
                ['userInfo.nickName']:res.userInfo.nickName,
                ['userInfo.avatarUrl']:res.userInfo.avatarUrl,
                ['userInfo.gender']:res.userInfo.gender,
              })
              var userInfo=res.userInfo;
              console.log("用户："+res.userInfo.nickName);

              wx.showToast({
                title: '正在处理...',
                icon: 'loading',
                duration: 1000
              });
              //登录
              wx.login({
                
                // 如果成功的话，success中就会返回 res.code，主要用的就是res.code 用来传到后端，再通过code3json接口获取openid(微信唯一标识) 和session_key
                success(res){
                  wx.request({
                    url: url+'/user/userLoginAndRegister.do',
                    method:"POST",
                    header:{
                      // 'Content-Type': 'text/plain;charset=ISO-8859-1'
                      'content-type': 'application/x-www-form-urlencoded;charset=utf-8', // 默认值
                      // 'content-type':'application/json;'
                    },
                    //后台通过request.getPatameter("name")来接受
                    data:{
                      "nickName":userInfo.nickName,
                      "avatarUrl":userInfo.avatarUrl,
                      "gender":userInfo.gender,
                      "code":res.code,
                    },
                    // 请求成功返回什么
                    success(res){
                      console.log(res);
                      that.setData({
                        //虽然说回传了很多信息，但是我只要id，openid对前台需隐私
                        // ['userInfo.id']:res.data.id,
                      })
                      getApp().globalData.userInfo=res.data;
                      that.onShow();
                    },
                    fail(res){
                      console.log("登录/注册失败，请稍后再试！");
                    }
                  })
                },
                
              })
            },
            fail: res => {
              //拒绝授权
              wx.showToast({
                title: '您拒绝了请求！',
                icon: 'error',
                duration: 2000
              });
              return;
            }
          });
        } else if (res.cancel) {
          //如果用户点击了取消按钮
          wx.showToast({
            title: '您拒绝了请求！',
            icon: 'error',
            duration: 2000
          });
          return;
        }
      }
    });    
  },

  onSwitchNotice(){
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
        wx.setStorageSync('noticeInfo', that.data.noticeInfo);
        wx.navigateTo({
          url: '/pages/notice/notice',
        })
      },
      fail(res){
        console.log(res);
      }
    })
  },
  




  // 管理员管理
  //1.用户管理
  onManageUser(){
    wx.navigateTo({
      url: '/pages/manageuser/manageuser',
    })
  },
  // 2.订单管理
  onManageOrder(){
    wx.navigateTo({
      url:'/pages/manageorder/manageorder',
    })
  },
  //3.公告管理
  onManageNotice(){
    wx.navigateTo({
      url: '/pages/managenotice/managenotice',
    })
  },
  // 4.反馈管理
  onManageFeedbackHandle(){
    wx.navigateTo({
      url: '/pages/feedbackhandle/feedbackhandle',
    })
  },
  // 5.签到管理
  onManageScanCode(e){
    wx.navigateTo({
      url: '/pages/scancode/scancode',
    })
  }


})