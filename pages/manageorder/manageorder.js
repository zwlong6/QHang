// pages/record/record.js
var url=getApp().globalData.wxRequestBaseUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户record_top的显示
    recordlist:[
      {
        recordtopid:1,
        recordname:"全部",
        isactive:1
      },
      {
        recordtopid:2,
        recordname:"未消费",
        isactive:0
      },
      {
        recordtopid:3,
        recordname:"已消费",
        isactive:0
      },
      {
        recordtopid:4,
        recordname:"已取消",
        isactive:0
      }
    ],

    // 属性 订单id id    订单创建时间   create_time  订单开始时间 order_begin_time 订单结束时间 order_stop_time  订单持续时间 bespeakduration    订单座位号  order_seat_id      金额 money     订单所属的用户   user_id    订单的状态 order_status     订单的套餐名 还是个联合查询
    orderInfo:[],
    userInfo:getApp().globalData.userInfo,
    // 二维码存储
    scancode:[],
    //搜索的订单id
    searchId:0,
    searchId1:0,
    // 当前订单所在的序号
    orderInfoId:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      userInfo:getApp().globalData.userInfo,
    })
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
    // 每次点击该页面 页面都刷新（每次进入该页面）
    //每次进入该页面，就刷新订单记录页面
    var that=this;
    //每次加载都要新的userInfo
    that.setData({
      userInfo:getApp().globalData.userInfo
    })
    wx.request({
      url:url+'/order/selectOrdersByUserId.do',
      method:'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      success(res){
        that.setData({
          orderInfo:res.data
        })
        // 设置是否消费，以及设置在哪个房间
        var i=0;
        for(i=0;i<that.data.orderInfo.length;i++){
          var time=that.data.orderInfo[i].orderBeginTime;
          var str=time.split(" ");
          that.setData({
            [`orderInfo[${i}].orderBeginTimeToStringDate`]:str[0],
            [`orderInfo[${i}].orderBeginTimeToStringTime`]:str[1],
          })
          var time1=that.data.orderInfo[i].orderStopTime;
          var str1=time1.split(" ");
          that.setData({
            [`orderInfo[${i}].orderStopTimeToStringDate`]:str1[0],
            [`orderInfo[${i}].orderStopTimeToStringTime`]:str1[1],
          })
        }
        console.log(that.data.orderInfo);
      },
      fail(res){
        console.log("查询失败！");
      },
      data:{
        "userid":that.data.userInfo.id,
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
  onChangeRecord:function(e){
    console.log("change record-top...");
    var that=this;
    var recordtopid=e.target.dataset.recordtopid;
    var recordlist=that.data.recordlist;
    var i=0;
    for(i=0;i<recordlist.length;i++){
      //1. 将所有的isactive设为false
      that.setData({
        //设置数组中属性的值
        [`recordlist[${i}].isactive`]:0,
      })
      //2.将选中的recordtopid的isactive设置为1
      if(recordlist[i].recordtopid==recordtopid)
      that.setData({
        [`recordlist[${i}].isactive`]:1,
      })
    }
  },
  // 点击扫码入座
  onSitDown:function(res){
    console.log("扫码入座！");
    var that=this;
    wx.scanCode({
      onlyFromCamera: true,
      success(e){
        var result=e.result;
        // 请求后台当前的scancode
        that.selectScanCodeUrlMysql(result,res);
      }
    })

  },

  // 请求后台存储的scancode
  selectScanCodeUrlMysql(result,res1){
    var that=this;
    wx.request({
      url:url+'/scancode/selectScanCodeUrl.do',
      method:'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data:{},
      success(res){
        console.log("请求后台存储的scancode成功！");
        console.log(res);
        that.setData({
          scancode:res.data,
        })
        console.log(res.data);
        console.log(that.data.scancode);

        // 检查两者是否相同
        if(that.data.scancode[0].url==result){
          console.log("扫码入座成功");
          // 更新flag的值为1 说明占座了，
          console.log(res1);
          wx.request({
            url:url+'/order/updateOrderSitflagByUserId.do',
            method:'POST',
            header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
            data:{
              "sitflag":1,
              "id":res1.target.dataset.id,
            },
            success(res){
              console.log("更新sitflag成功");
              wx.showToast({
                title: '入座成功',
                icon: 'success',
                duration: 1000
              })
              that.onShow();
            },
            fail(res){
              console.log("更新sitflag失败");
            }
          })
        }else{
          wx.showToast({
            title: '扫码入座失败！',
            icon:'error',
            duration:5000,
            success:function(){
              setTimeout(function(){
                that.onShow();
              },1000);
            }
          })
        }
      },
      fail(res){
        console.log("请求后台存储的scancode失败！");
      }
    })
  },
  // 取消订单
  onCancelOrderById(res){
    var that=this;
    var id=res.target.dataset.id;
    wx.showModal({
      title:"提示",
      content:"是否确认取消预约？",
      success(res){
        if(res.confirm){
          console.log("用户点击确认");
          that.onCancelOrderByIdMysql(id);
        }else if(res.cancel){
          console.log("用户点击取消");
        }
      }
    })
  },
  onCancelOrderByIdMysql(id){
    var that=this;
    //向后台发请求
    wx.request({
      url:url+'/order/updateOrderCancelById.do',
      method:'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data:{
        'orderStatus':2,
        'id':id
      },
      success(res){
        console.log(res);
        wx.showToast({
          title: '取消预约成功！',
          icon: 'success',
          duration: 1000,
          success:function(){
            setTimeout(function(){
              that.onShow();
            },1000);
          }
        })
      },
      fail(res){
        console.log(res);
      }
    })
  },
  // 管理 入座
  onManageSitDownById(res){
    var that=this;
    console.log(res);
    wx.request({
      url:url+'/order/updateOrderSitflagByUserId.do',
      method:'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data:{
        "sitflag":1,
        "id":res.currentTarget.dataset.id,
      },
      success(res){
        console.log("更新sitflag成功");
        wx.showToast({
          title: '入座成功',
          icon: 'success',
          duration: 1000
        })
        that.onShow();
      },
      fail(res){
        console.log("更新sitflag失败");
      }
    })
  },

  // 管理 释放座位（用户提前走了）
  onManageReleaseById(res){
    var that=this;
    //向后台发请求
    wx.request({
      url:url+'/order/updateOrderCancelById.do',
      method:'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data:{
        'orderStatus':4,
        'id':res.currentTarget.dataset.id,
      },
      success(res){
        console.log(res);
        wx.showToast({
          title: '释放座位成功！',
          icon: 'success',
          duration: 1000,
          success:function(){
            setTimeout(function(){
              that.onShow();
            },1000);
          }
        })
      },
      fail(res){
        console.log(res);
      }
    })
  },

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
    var orderInfo=that.data.orderInfo;
    console.log(orderInfo);
    var i=0;
    for(i=0;i<orderInfo.length;i++){
      if(that.data.searchId==orderInfo[i].id){
        that.setData({
          orderInfoId:i
        })
        break;
      }
      if(i==orderInfo.length-1){
        that.setData({
          searchId:0,
        })
        wx.showToast({
          title: '未找到相关订单！',
          icon:'error',
          duration:2000,
          success(){
              that.onShow();
          }
        })
      }
    }
  },
})


