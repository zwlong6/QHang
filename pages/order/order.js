// pages/order/order.js
var url = getApp().globalData.wxRequestBaseUrl;
Date.prototype.format = function (format) {
  var date = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 上一个页面传过来的
    //选择预约座位开始时间
    bespeaktime: 0,
    //预约座位结束的时间
    bespeaktimestop: 0,
    // 预定的时长
    bespeakduration: 1,
    //当前选中的座位，默认为0，就表示不能预约
    seat: 0,
    //支付的货款
    money: 0,
    //日期转化成字符串格式
    bespeaktimeToString: "",
    //当前座位所属的房间（显示第一行用的）
    roomName: "",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取bespeak传过来的数据（通过缓存ss）
    var bespeaktime = wx.getStorageSync('bespeaktime');
    console.log("当前时间");
    console.log(bespeaktime)
    var bespeaktimestop = wx.getStorageSync('bespeaktimestop');
    var bespeakduration = wx.getStorageSync('bespeakduration');
    var seat = wx.getStorageSync('seat');
    if (bespeaktime == 0) {
      var bespeaktime = new Date();
    }
    // 将日期转化成字符串类型
    //预约结束的时间字符串
    var hour = bespeaktime.getHours();
    hour = hour > 9 ? hour : '0' + hour;
    var minute = bespeaktime.getMinutes();
    minute = minute > 9 ? minute : '0' + minute;
    var second = bespeaktime.getSeconds();
    second = second > 9 ? second : '0' + second;
    var bespeaktimeToString = bespeaktime.getFullYear() + '/' + (bespeaktime.getMonth() + 1) + '/' + bespeaktime.getDate() + ' ' + hour + ':' + minute + ':' + second;
    // var bespeaktimeToString=bespeaktime.format('yyyy/MM/dd hh:mm:ss');
    that.setData({
      //座位开始时间
      bespeaktime: bespeaktime,
      //座位结束时间
      bespeaktimestop: bespeaktimestop,
      bespeakduration: bespeakduration,
      seat: seat,
      bespeaktimeToString: bespeaktimeToString,
      money: bespeakduration * 8,
    })

    //获取当前座位的房间
    wx.request({
      url: url + '/seat/selectRoomBySeat.do',
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      method: 'POST',
      data: {
        // "id":"长江大学"
        "seatId": this.data.seat
      },
      success: function (e) {
        that.setData({
          roomName: e.data.roomName
        })
      }
    });
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


  onChangeVip: function (e) {
    wx.switchTab({
      url: '/pages/vip/vip'
    })
  },
  onConfirmPay: function (e) {
    var that = this;
    var money = e.target.dataset.money;
    //订单创建时间
    var bespeakcreatetime = new Date();
    //将日期都转化成这种格式的字符串
    // var bespeakcreatetimeToString=bespeakcreatetime.format('yyyy-MM-dd h:m:s');
    var bespeakcreatetimeToString = bespeakcreatetime.getFullYear() + '-' + (bespeakcreatetime.getMonth() + 1) + '-' + bespeakcreatetime.getDate() + ' ' + bespeakcreatetime.getHours() + ':' + bespeakcreatetime.getMinutes() + ':' + bespeakcreatetime.getSeconds();
    var bespeaktime = that.data.bespeaktime;
    // var bespeakToString=bespeaktime.format('yyyy-MM-dd h:m:s');
    var bespeakToString = bespeaktime.getFullYear() + '-' + (bespeaktime.getMonth() + 1) + '-' + bespeaktime.getDate() + ' ' + bespeaktime.getHours() + ':' + bespeaktime.getMinutes() + ':' + bespeaktime.getSeconds();
    var bespeaktimestop = that.data.bespeaktimestop;
    // var bespeaktimestopToString=bespeaktimestop.format('yyyy-MM-dd h:m:s');
    var bespeaktimestopToString = bespeaktimestop.getFullYear() + '-' + (bespeaktimestop.getMonth() + 1) + '-' + bespeaktimestop.getDate() + ' ' + bespeaktimestop.getHours() + ':' + bespeaktimestop.getMinutes() + ':' + bespeaktimestop.getSeconds();

    //插入订单表
    wx.request({
      url: url + '/order/insertOrder.do',
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      method: 'POST',
      data: {
        //订单创建时间
        "bespeakcreatetime": bespeakcreatetimeToString,
        //预约座位开始的时间
        "bespeaktime": bespeakToString,
        //预约座位结束的时间
        "bespeaktimestop": bespeaktimestopToString,
        "bespeakduration": that.data.bespeakduration,
        "seat": that.data.seat,
        "money": money,
        "id": getApp().globalData.userInfo.id,
      },
      success: function (e) {
        console.log("插入成功！");
        wx.showToast({
          title: '支付成功!',
          icon: 'success',
          duration: 1000,
          success: function () {
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }, 2000);
          }
        });
      },
      fail: function (e) {
        console.log(e);
        console.log("插入失败！");
      }
    })
  }
})