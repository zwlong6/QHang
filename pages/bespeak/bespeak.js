var url=getApp().globalData.wxRequestBaseUrl;

const date = new Date();//获取系统日期
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
const bigMonth = [1, 3, 5, 7, 8, 10, 12];
//将日期分开写入对应数组
//年
years.push(date.getFullYear());
//月(添加两个月)
months.push(date.getMonth()+1);
months.push(date.getMonth()+2);
//日
var day = date.getDate();
for (let i = 1; i < 31; i++) {
days.push(i);
}
// 获取小时
var hour=date.getHours();
for (let i = 0; i <= 23; i++) {
var k = i;
if (0 <= i && i < 10) {
k = "0" + i;
}
hours.push(k)
}
// 获取分钟
var minute=date.getMinutes();
for (let i = 0; i <= 59; i++) {
var k = i;
if (0 <= i && i < 10) {
k = "0" + i
}
minutes.push(k)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前可能冲突的订单
    maybeConfiltOrders:[],
    //当前页面静态资源
    static:getApp().globalData.static,
    // 设置座位图的初始位置
    x:20, 
    y:20,
    scale:1,

    // 座位信息
    chairInfo:[],

    //设置房间的编号（那个房间）
    roomId:"0",

    // 设置平面图底部的预定按钮
    bottombespeak:"in_in_bottom_bespeak_2",

    //选择预约时间
    bespeaktime:0,
    // 预定的时长
    bespeakduration:0,
    //设置进入的方式
    bespeakwayname:"在线预约",
    
    //当前选中的座位，默认为0，就表示不能预约
    seat:0,
    //之前选中的座位
    seatBefore:0,

    // 跟日期时间相关的变量
    years: years,
    year: date.getFullYear(),
    months: months,
    month: date.getMonth(),
    days: days,
    day: date.getDate(),
    value: [9999, 1, 1],
    hours: hours,
    hour: date.getHours(),
    minutes: minutes,
    minute: date.getMinutes(),

    // 设置预约时长数组
    // time:[1,2,3,4,5,6,7,8,9]
    time:[
      {
        id:1,
        name:"1小时"
      },
      {
        id:2,
        name:"2小时"
      },
      {
        id:3,
        name:"3小时"
      },
      {
        id:4,
        name:"4小时"
      },
      {
        id:5,
        name:"5小时"
      },
      {
        id:6,
        name:"6小时"
      },
      {
        id:7,
        name:"7小时"
      },
      {
        id:8,
        name:"8小时"
      },
      {
        id:9,
        name:"9小时"
      },
      {
        id:10,
        name:"10小时"
      },
      {
        id:11,
        name:"11小时"
      },
      {
        id:12,
        name:"12小时"
      },
    ],
//房间
    room:[],
    //设置pick-view,
    valuebespeakstart:[],
    valuebespeakduration:[0],
   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that=this;
        //加载座位以及当前房间
        
    // 加载上个页面选择的预约开始时间何预约时长
    var bespeaktime=wx.getStorageSync('bespeaktime');
    var bespeakduration=wx.getStorageSync('bespeakduration');
    var bespeakways=wx.getStorageSync('bespeakduration1');
    console.log("bespeak:duration:"+bespeakduration)
    console.log("bespeak:bespeakways:"+bespeakways);
    if(bespeakways=="1"){
      that.setData({
        bespeakwayname:"在线预约",
      })
    }else{
      that.setData({
        bespeakwayname:"直接入座",
      })
    }
    
    //通过预约时长，获取数组中的位置（为 pick-view中默认值用）
    var i=0;
    var time1=that.data.time;
    for(i=0;i<time1.length;i++){
      if(time1[i].id==bespeakduration){
        that.setData({
          valuebespeakduration:[i]
        })
      }
    }
    var dateNow=bespeaktime.getDate();
    var hourNow=bespeaktime.getHours();
    var minuteNow=bespeaktime.getMinutes();
    console.log("dateNow:"+dateNow);
    that.setData({
      valuebespeakstart:[0,0,dateNow-1,hourNow,minuteNow],
    })
    //通过预约开始事件，获取数组中的位置（为 pick-view中默认值用）
    // 获取上个页面传来的chairInfo
    var chairInfo=wx.getStorageSync('chairInfo');
    
    that.setData({
      bespeaktime:bespeaktime,
      bespeakduration:bespeakduration,
      chairInfo:chairInfo,
    })
    // 刚接收
    console.log(that.data.chairInfo,"bespeak页面的chairInfo");




    //查询当前所有房间
    wx.request({
      url: url+"/room/selectAllRooms.do",
      method:'GET',
      header:{
        // 请求头部
        // 'content-type':'application/x-www-form-urlencoded'
        'content-type':'application/json'
    },
    // 请求成功返回什么
    success(res){
      that.setData({
        room:res.data
      })
    }
    })
    console.log("seats and room loading...");
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
    that.setData({
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

  // 选座位界面切换房间
  onRoom:function(e){
    console.log("change room...");
    //接受前台传来的那个room
    var roomids = e.target.dataset.roomid;
    var roomlength=this.data.room.length;
    var i=0;
    for(i=0;i<roomlength;i++){
      if(this.data.room[i].isactive==1)
      //每次只有一个为选中的状态
        this.setData({
          //修改数组中的元素
          [`room[${i}].isactive`]:0,
        })
      if(this.data.room[i].roomId==roomids){
        this.setData({
          [`room[${i}].isactive`]:1,
        })
      }
    };
    this.setData({
      //用于刷新座位图
      roomId:roomids
    });
  },


//点击座位事件
  onChooseSeat:function(e){
    var that = this;
    console.log("点击座位...");
    var id = e.target.dataset.id;
    console.log(e)
    //座位id是从1开始，二数组是从
    id=id-1;
    //设置当前选中的座位
    // 更新座位的状态
    // var cha1 = 'chairInfo['+parseInt(parseInt(id)-1)+'].seatStyle1';
    // var cha2 = 'chairInfo['+parseInt(parseInt(id)-1)+'].seatStyle2';
    // console.log(cha1);
    //当座位（空闲）可选的时候
    if(that.data.chairInfo[id].seatStyle1!="chair_5"){
      //为了使seat seatBefore有差异
      that.setData({
        seat:id+1,
      })
      //如果seat seatBefore 不相等，并且seatBefore!=0,说明 上一个选中，又想选下一个
      if((that.data.seat!=that.data.seatBefore) && (that.data.seatBefore!=0)&&(that.data.seat!=0)){
        //将seatBefore设置成 未选中
        var seatBeforeId=that.data.seatBefore-1
        that.setData({
          [`chairInfo[${seatBeforeId}].seatStyle1`]:"chair_1",
          [`chairInfo[${seatBeforeId}].seatStyle2`]:"chair_2",
        })
      }
      //当之前未选中，则变成选中的样式
      if(that.data.chairInfo[id].seatStyle1=="chair_1"){
        that.setData({
          [`chairInfo[${id}].seatStyle1`]:"chair_3",
          [`chairInfo[${id}].seatStyle2`]:"chair_4",
          bottombespeak:"in_in_bottom_bespeak_2_select",
          //选中就传当前座位的值
          seat:id+1,      //2
          seatBefore:id+1    //2
        })
        //否则如果之前是已经选中的状态，则变成未选中的样式
      }else if(that.data.chairInfo[id].seatStyle1=="chair_3"){
        that.setData({
          [`chairInfo[${id}].seatStyle1`]:"chair_1",
          [`chairInfo[${id}].seatStyle2`]:"chair_2",
          bottombespeak:"in_in_bottom_bespeak_2",
          //选中就传当前座位的值
          seat:0,
          seatBefore:0
         })
      }
    }else{
      console.log("This seat is busy!");

    }
    console.log("seat:"+that.data.seat)
    console.log("seatBefore"+that.data.seatBefore)
  },
  // 选择日期时间
  datesubmit:function(e){
    // 点击之后背景变灰色
    this.setData({
      showModal: true
      })
  },
  // 在showModel中点击确定
  go: function (e) {
    var that=this;
    //显示平面图
    that.setData({
    showModal: false
    })
    //后续操作
  },
  // 时长选取
  timesubmit:function(e){
    console.log("timesubmit...");
    // 点击之后背景变灰色
    this.setData({
      showModal1: true
      })
  },
    // 在showModel中点击确定
    go1: function () {
      this.setData({
      showModal1: false
      })
      //后续操作
    },
    bindChange1:function(e){
      var that=this;
      console.log("bindChange1...");
      var val=e.detail.value;
      var bespeakdurations = this.data.time[val[0]].id;
      that.setData({
        bespeakduration:bespeakdurations
      })
      console.log(this.data.bespeakduration);
      // 设置每次打开Modal都是上次选中的
      var time1=that.data.time;
      var i=0;
      for(i=0;i<time1.length;i++){
        if(time1[i].id==bespeakdurations){
          that.setData({
            valuebespeakduration:[i]
          })
        }
      }
      that.updateConfilctSeat();
    },
  
  //判断元素是否在一个数组
  contains: function (arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) {
      return true;
      }
    }
    return false;
  },

  setDays: function (day) {
    const temp = [];
    for (let i = 1; i <= day; i++) {
    temp.push(i);
    }
    this.setData({
      days: temp
    })
  },
  //选择滚动器改变触发事件
  bindChange: function (e) {
    var that = this;
    const val = e.detail.value;
    console.log(e);
    //判断月的天数
    const setYear = this.data.years[val[0]];
    const setMonth = this.data.months[val[1]];
    const setDay = this.data.days[val[2]];
    const setHour = this.data.hours[val[3]];
    const setMinute = this.data.minutes[val[4]];
    //闰年
    if (setMonth === 2) {
      if (setYear % 4 === 0 && setYear % 100 !== 0) {
      // console.log('闰年')
      this.setDays(29);
      }else {
      // console.log('非闰年')
      this.setDays(28);
      }
    } else {
    //大月
    if (this.contains(bigMonth, setMonth)) {
      this.setDays(31)
    } else {
      this.setDays(30)
    }
  }
    this.setData({
    year: setYear,
    month: setMonth,
    day: setDay,
    hour: setHour,
    minute: setMinute
    })
    console.log("打印时间！");
    const dateTime=setYear+"/"+setMonth+"/"+setDay+" "+setHour+":"+setMinute;
    var datatime1 = new Date(dateTime);
    //将选取的时间
    that.setData({
      //将最终的事件给js保存
      bespeaktime:datatime1
    })
    // 每次点击都是上次选中的
    var dateNow=datatime1.getDate();
    var hourNow=datatime1.getHours();
    var minuteNow=datatime1.getMinutes();
    that.setData({
      valuebespeakstart:[0,0,dateNow-1,hourNow,minuteNow],
    })
    //查看是否有冲突
    that.updateConfilctSeat();
  },
  updateConfilctSeat(){
    var that=this;
    // 选中的开始时间
    var bespeaktimeStart=that.data.bespeaktime;
    var bespeakduration=that.data.bespeakduration
    var bespeaktimeStartToString=bespeaktimeStart.getFullYear()+'/'+(bespeaktimeStart.getMonth()+1)+'/'+bespeaktimeStart.getDate()+' '+bespeaktimeStart.getHours()+':'+bespeaktimeStart.getMinutes()+':'+bespeaktimeStart.getSeconds();
    // 选中结束时间
    var bespeaktimeEnd=new Date(bespeaktimeStartToString);
    bespeaktimeEnd.setHours(bespeaktimeEnd.getHours()+bespeakduration);
    var bespeaktimeEndToString=bespeaktimeEnd.getFullYear()+'/'+(bespeaktimeEnd.getMonth()+1)+'/'+bespeaktimeEnd.getDate()+' '+bespeaktimeEnd.getHours()+':'+bespeaktimeEnd.getMinutes()+':'+bespeaktimeEnd.getSeconds();
    console.log(bespeaktimeStartToString,"开始时间");
    console.log(bespeaktimeEndToString,"结束时间")
    //获取到了选中的开始时间和结束时间
    //检查与当前选中的时间冲突的订单
    //1.查询所有 未消费 和已经消费未入座 已经消费且入座的订单
    wx.request({
      url:url+'/order/selectConfiltOrders.do',
      method:'POST',
      header:{
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8', // 默认值
      },
      data:{
        "orderStatus1":0,
        "orderStatus2":1,
      },
      success(res){
        that.setData({
          maybeConfiltOrders:res.data,
        })
        console.log(that.data.maybeConfiltOrders,"可能冲突的订单bes");
      //查询当前选中的时间和可能冲突的订单的时间直接的冲突  orderBeginTime  7   orderStopTime  9  bespeaktimeStart 8;30   bespeaktimeEnd  10;30
      var i=0;
      for(i=0;i<that.data.maybeConfiltOrders.length;i++){
        var maybeConfiltOrders=that.data.maybeConfiltOrders[i];
        var orderBeginTime=new Date(maybeConfiltOrders.orderBeginTime);
        var orderStopTime=new Date(maybeConfiltOrders.orderStopTime);
        if((bespeaktimeStart<=orderBeginTime && bespeaktimeEnd>orderBeginTime)||(bespeaktimeEnd>=orderStopTime&&bespeaktimeStart<orderStopTime)||(bespeaktimeStart>=orderBeginTime&&bespeaktimeEnd<=orderStopTime)){
          console.log("冲突");
          //找到这个订单的seatId   并设置这个seatId 为不可选中
          var seatIdConflict=maybeConfiltOrders.orderSeatId;
          //获取所有房间信息 如果 座位号相等 直接改变这个座位的样式
          if(seatIdConflict==that.data.chairInfo[seatIdConflict-1].seatId){
            that.setData({
              [`chairInfo[${seatIdConflict-1}].seatStyle1`]:'chair_5',
              [`chairInfo[${seatIdConflict-1}].seatStyle2`]:'chair_6',
            })
          }
        }else{
          console.log("不冲突")
          var seatIdNoConflict=maybeConfiltOrders.orderSeatId;
          //获取所有房间信息 如果 座位号相等 直接改变这个座位的样式
          if(seatIdNoConflict==that.data.chairInfo[seatIdNoConflict-1].seatId){
            that.setData({
              [`chairInfo[${seatIdNoConflict-1}].seatStyle1`]:'chair_1',
              [`chairInfo[${seatIdNoConflict-1}].seatStyle2`]:'chair_2',
            })
          }
        }
      }
      //所有冲突处理完
      },
      fail(res){
        console.log("请求可能冲突订单失败！");
        console.log(res);
      }
    })
  },
  submitbespeak:function(e){
    console.log("submitbespeak...");
    var that=this;
    if(that.data.seat!=0){
      // 传值给下一个页面（利用缓存）
    //    //选择预约时间
    // bespeaktime:0,
    // // 预定的时长
    // bespeakduration:1
    // //当前选中的座位，默认为0，就表示不能预约
    // seat:0,

    // const dateTime=setYear+"/"+setMonth+"/"+setDay+"/ "+setHour+":"+setMinute;
    // var datatime1 = new Date(dateTime);
    // 设置座位结束时间
    // that.data.bespeaktime
    // new time ---->  +duration=====bespeaktimestop
    //获取预约开始时间
    var bespeaktimeStart=that.data.bespeaktime;
    //设置预约开始时间的  字符串格式（用于新建预约结束时间，，（为什么不直接 end=start   因为两个时间值一样，会保存在同一个常量池中，更新一个另一个也会随着更新））
    // var bespeaktimeStartToString=bespeaktimeStart.format('yyyy/MM/dd h:m:s');
    var year=bespeaktimeStart.getFullYear();
    var month=bespeaktimeStart.getMonth();
    var date=bespeaktimeStart.getDate();
    var hour=bespeaktimeStart.getHours();
    var minute=bespeaktimeStart.getMinutes();
    // console.log(bespeaktimeStartToString);
    //通过上面格式的字符串来新建一个Date对象（Date方法中只能通过这种格式的字符串来新建对象）
    var bespeaktimeEnd=new Date(year,month,date,hour,minute);
    //设置当前预约结束的小时js
    var hourNow=bespeaktimeEnd.getHours()+that.data.bespeakduration;
    bespeaktimeEnd.setHours(hourNow);
    that.setData({
      bespeaktimestop:bespeaktimeEnd,
    })

      wx.setStorageSync('bespeaktime',that.data.bespeaktime);
      wx.setStorageSync('bespeaktimestop',that.data.bespeaktimestop);
      wx.setStorageSync('bespeakduration',that.data.bespeakduration);
      wx.setStorageSync('seat',that.data.seat);
      wx.navigateTo({
        url: '/pages/order/order',
      })
    }
  },
})