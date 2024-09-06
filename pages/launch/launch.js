// pages/launch/launch.js
var url = getApp().globalData.wxRequestBaseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //加载静态资源
    static: getApp().globalData.static,
    //加载(未消费)订单信息
    orderNoConsumeInfo: [],
    //加载已经消费订单信息，入座 未入座都有
    orderAlreadyConsumeInfo: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      userInfo: getApp().globalData.userInfo,
    })
    var timer = setTimeout(() => {
      clearTimeout(timer)
      that.direct()
    }, 1000);
    // if(that.data.userInfo.id!=0){
    //查询所有订单，并返回更新所有订单
    var fader = setInterval(function () {
      // 定时查询未消费订单状态
      that.selectOrderByOrderStatus();
      //定时查询已消费订单状态 入座 未入座均有
      that.selectOrderByOrderStatusAlreadyConsume();
    }, 5000);
    // }

    //更新订单状态
    // updateAllOrders();
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
    that.setData({
      userInfo: getApp().globalData.userInfo,
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
  // 启动页启动后跳转主页
  direct: function () {
    // 跳转到主页面
    wx.switchTab({
      url: "/pages/index/index"
    })
  },
  //如果座位使用完 就释放座位 座位使用了  使用：orderStatus==1 并且 sitflag==1来标识
  selectOrderByOrderStatusAlreadyConsume: function () {
    // console.log("如果座位使用完 就释放座位");
    var that = this;
    wx.request({
      // 根据订单状态查询订单信息
      url: url + '/order/selectOrderByOrderStatus.do',
      method: "POST",
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data: {
        // 查询所有已消费顶订单  （入座，未入座均有）
        "orderStatus": 1,
      },
      success(res) {
        that.setData({
          orderAlreadyConsumeInfo: res.data,
        });
        // 更新座位信息
        that.updateAllOrdersAlreadyConsume();
        // console.log(that.data.orderAlreadyConsumeInfo);
      },
      fail(res) {
        console.log("请求失败");
        console.log(res);
      }
    })
  },
  updateAllOrdersAlreadyConsume() {
    // console.log("更新已经消费的订单");
    var that = this;
    //获取座位开始时间
    var i = 0;
    for (i = 0; i < that.data.orderAlreadyConsumeInfo.length; i++) {
      var timeStart = new Date(that.data.orderAlreadyConsumeInfo[i].orderBeginTime);
      var timeStop = new Date(that.data.orderAlreadyConsumeInfo[i].orderStopTime);
      var timeNow = new Date();
      var timeSub = timeStart - timeNow;
      var orderAlreadyConsumeInfo = that.data.orderAlreadyConsumeInfo[i];
      // 如果超过时间30min用户还没来，并且没有入座，那么直接设置失约
      if (timeSub < -1800000 && orderAlreadyConsumeInfo.sitflag == 0) {
        console.log("失约");
        that.updateAllOrdersNoConsumerUnAppointMysql(orderAlreadyConsumeInfo);
        //如果入座了，并且超过时间
      } else if (timeStop < timeNow && orderAlreadyConsumeInfo.sitflag == 1) {
        console.log("订单完成");
        that.updateAllOrderAlreadyConsumeMysql(orderAlreadyConsumeInfo);
        // 并且更新座位的状态  只需要更新后台的订单状态
        that.updateSeatStyle(orderAlreadyConsumeInfo, 0);
        // 如果到时间了，并且点击扫码入座
      } else if (timeSub >= -1800000 && timeSub <= 1800000 && orderAlreadyConsumeInfo.sitflag == 1) {
        //更新座位的状态
        that.updateSeatStyle(orderAlreadyConsumeInfo, 1);

      }
    }
  },
  //如果在约定时间来了
  updateAllOrderAlreadyConsumeMysql(res) {
    // 更新订单中的消费信息
    wx.request({
      url: url + '/order/updateOrdersAlreadyConsumeById.do',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        "id": res.id,
        "orderStatus": 4
      },
      success(res) {
        console.log("成功更新订单中的消费信息");
        console.log(res);
      },
      fail(res) {
        console.log("失败更新订单中的消费信息");
        console.log(res);
      }
    })
    //更新座位信息
    // wx.request({
    //   url:url+'/seat/updataSeatAlreadyConsumeBySeatId.do',
    //   method:'POST',
    //   header:{
    //     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    //   },
    //   data:{
    //     "seatId":res.orderSeatId
    //   },
    //   success(res){
    //     console.log("成功更新已消费座位信息");
    //     console.log(res);
    //   },
    //   fail(res){
    //     console.log("失败更新已消费座位信息");
    //     console.log(res);
    //   }
    // })
  },
  //如果未按约定时间到达，则更新订单信息 
  updateAllOrdersNoConsumerUnAppointMysql(res) {
    console.log("如果未按约定时间到达，则更新订单信息");
    console.log(res);
    wx.request({
      url: url + '/order/updateAllOrdersNoConsumerUnAppoint.do',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        "id": res.id,
        "orderStatus": 3
      },
      success(res) {
        console.log("成功3");
        console.log(res);
      },
      fail(res) {
        console.log("失败3");
        console.log(res);
      }
    })
  },
  // 更新座位的状态
  updateSeatStyle(res, id) {
    //更新座位的状态
    console.log("更新座位的状态");
    var style1 = "";
    var style2 = "";
    if (id == 1) {
      style1 = "chair_5";
      style2 = "chair_6";
    } else if (id == 0) {
      style1 = "chair_1";
      style2 = "chair_2";
    }
    // wx.request({
    //   url:url+'/seat/updateSeatStyleBySeatId.do',
    //   method:'POST',
    //   header:{
    //     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    //   },
    //   data:{
    //     "seatId":res.orderSeatId,
    //     "style1":style1,
    //     "style2":style2,
    //   },
    //   success(res){
    //     console.log("成功2");
    //     console.log(res);
    //   },
    //   fail(res){
    //     console.log("失败2");
    //     console.log(res);
    //   }
    // })
  },

  //查询未消费的订单
  selectOrderByOrderStatus: function () {
    // console.log("定时查询未消费订单状态");
    var that = this;
    wx.request({
      // 根据订单状态查询订单信息
      url: url + '/order/selectOrderByOrderStatus.do',
      method: "POST",
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data: {
        // 未消费订单
        "orderStatus": 0,
      },
      success(res) {
        that.setData({
          orderNoConsumeInfo: res.data,
        });
        // 更新座位信息到点 将所有的orderStatus设置成1就完成了
        that.updateAllOrders();    //未消费  》已消费（但未入座）
        // console.log(that.data.orderNoConsumeInfo);
      },
      fail(res) {
        console.log("请求失败");
        console.log(res);
      }
    })
  },
  //根据座位id更新未消费座位状态   
  updateAllOrders: function () {
    var that = this;
    //获取座位开始时间
    var timeStart;
    var timeStop;
    var timeNow = new Date();
    var timeSub = 0;
    var i = 0;
    var orderNoConsumeInfo;
    for (i = 0; i < that.data.orderNoConsumeInfo.length; i++) {
      timeStart = new Date(that.data.orderNoConsumeInfo[i].orderBeginTime);
      timeStop = new Date(that.data.orderNoConsumeInfo[i].orderStopTime);
      timeSub = timeStart - timeNow;
      orderNoConsumeInfo = that.data.orderNoConsumeInfo[i];
      //到达消费时间
      if (timeSub >= -1800000 && timeSub <= 1800000) {
        console.log("到了可以入座的时间");
        //orderStatus设置为1
        that.updateAllOrdersNoConsumerMysql(orderNoConsumeInfo);
        // }
      }
    }
  },
  // 更新数据库中座位信息   更新订单以及座位信息
  updateAllOrdersNoConsumerMysql(res) {
    console.log("更新数据库中的订单以及座位信息");
    console.log(res);
    //更新订单状态信息
    wx.request({
      url: url + '/order/updateOrdersById.do',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        "id": res.id,
        "orderStatus": 1
      },
      success(res) {
        console.log("成功1");
        console.log(res);
      },
      fail(res) {
        console.log("失败1");
        console.log(res);
      }
    })

  },
})