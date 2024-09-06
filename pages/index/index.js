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
months.push(date.getMonth() + 1);
months.push(date.getMonth() + 2);
//日
var day = date.getDate();
for (let i = 1; i < 31; i++) {
  days.push(i);
}
// 获取小时
var hour = date.getHours();
for (let i = 0; i <= 23; i++) {
  var k = i;
  if (0 <= i && i < 10) {
    k = "0" + i;
  }
  hours.push(k)
}
// 获取分钟
var minute = date.getMinutes();
for (let i = 0; i <= 59; i++) {
  var k = i;
  if (0 <= i && i < 10) {
    k = "0" + i
  }
  minutes.push(k)
}


Page({
  data: {
    // 地图的地点
    place: {
      address: "湖北省荆州市荆州区城南街道99号起航自习室",
      lat: 39.90469,
      lng: 116.40717,
    },
    //优先加载座位
    chairInfo: [],
    static: getApp().globalData.static,
    swipers: ["swiper-1.jpg", "swiper-2.jpg", "swiper-3.jpg", "swiper-4.jpg", "swiper-5.jpg", "swiper-6.jpg", "swiper-7.jpg"],
    //当前选中的预约方式
    bespeakway: [
      {
        wayName: '在线预约',
        isactive: 1
      },
      {
        wayName: '直接入座',
        isactive: 0
      }
    ],
    bespeakways: "1",

    // 设置预约时长数组
    bespeakwaytime0: [
      {
        id: 2,
        name: "2小时",
        isactive: 0
      },
      {
        id: 4,
        name: "4小时",
        isactive: 0
      },
      {
        id: 6,
        name: "6小时",
        isactive: 0
      },
      {
        id: 8,
        name: "8小时",
        isactive: 0
      }
    ],
    // 设置预约时长数组
    bespeakwaytime1: [
      {
        id: 1,
        name: "1小时",
        isactive: 0
      },
      {
        id: 2,
        name: "2小时",
        isactive: 0
      },
      {
        id: 3,
        name: "3小时",
        isactive: 0
      },
      {
        id: 4,
        name: "4小时",
        isactive: 0
      },
      {
        id: 6,
        name: "6小时",
        isactive: 0
      },
      {
        id: 8,
        name: "8小时",
        isactive: 0
      },
      {
        id: 10,
        name: "10小时",
        isactive: 0
      },
      {
        id: 12,
        name: "12小时",
        isactive: 0
      }
    ],

    //预约开始时间
    bespeaktimeStart: 0,
    //预约时间的字符串类型
    bespeaktimeToString: "",

    //预定的时长
    bespeakduration1: 0,
    //预定的时长
    bespeakduration2: 0,
    // 预定的时长
    bespeakduration: 0,
    //预约结束时间
    bespeaktimeEnd: 0,
    //预约结束时间的字符串类型
    bespeaktimeEndToString: "",
    //设置当前预约结束时间的格式
    bespeaktimeEndIsActive: 0,


    //当前可能冲突的订单
    maybeConfiltOrders: [],
    //当前的座位信息


    //微信用户信息(数组类型)
    userInfo: {
    },

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

  },
  // 获取微信用户的昵称 头像 性别
  getUserInfo() {
    var that = this;
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
                ['userInfo.nickName']: res.userInfo.nickName,
                ['userInfo.avatarUrl']: res.userInfo.avatarUrl,
                ['userInfo.gender']: res.userInfo.gender,
              })
              var userInfo = res.userInfo;
              console.log(res.userInfo);
              console.log("用户：" + res.userInfo.nickName);

              wx.showToast({
                title: '正在处理...',
                icon: 'loading',
                // 成功后隐藏通知栏
              });
              //登录
              wx.login({
                // 如果成功的话，success中就会返回 res.code，主要用的就是res.code 用来传到后端，再通过code3json接口获取openid(微信唯一标识) 和session_key
                success(res) {
                  wx.request({
                    url: url + '/user/userLoginAndRegister.do',
                    method: "POST",
                    header: {
                      // 'Content-Type': 'text/plain;charset=ISO-8859-1'
                      'content-type': 'application/x-www-form-urlencoded;charset=utf-8', // 默认值
                      // 'content-type':'application/json;'
                    },
                    //后台通过request.getPatameter("name")来接受
                    data: {
                      "nickName": userInfo.nickName,
                      "avatarUrl": userInfo.avatarUrl,
                      "gender": userInfo.gender,
                      "code": res.code,
                    },
                    // 请求成功返回什么
                    success(res) {
                      console.log(res);
                      that.setData({
                        //虽然说回传了很多信息，但是我只要id，openid对前台需隐私
                        // ['userInfo.id']:res.data.id,
                      })
                      getApp().globalData.userInfo = res.data;
                      wx.hideToast();
                    },
                    fail(res) {
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
  //改变预约的方式
  onChangeBespeakWay: function (e) {
    var that = this;
    //每次都要更新一次时间
    that.onShow();
    console.log("change bespeakway...");
    var isactive = e.target.dataset.isactive;
    //如果点击的是未选中的，就直接两者交换
    if (isactive == 0) {
      var isactive1 = that.data.bespeakway[0].isactive;
      var isactive2 = that.data.bespeakway[1].isactive;
      that.setData({
        [`bespeakway[0].isactive`]: isactive2,
        [`bespeakway[1].isactive`]: isactive1
      })
    }
  },

  //时间转成字符串


  // 选中预约的时长1
  onChooseBespeakDuration1: function (e) {
    console.log("choose bespeakduration1...");
    var that = this;
    var i = 0;
    var bespeakduration1 = e.target.dataset.bespeakduration1;
    // 更新样式
    for (i = 0; i < that.data.bespeakwaytime0.length; i++) {
      that.setData({
        [`bespeakwaytime0[${i}].isactive`]: 0
      })
      if (that.data.bespeakwaytime0[i].id == bespeakduration1) {
        that.setData({
          [`bespeakwaytime0[${i}].isactive`]: 1
        })
      }
    }
    //获取预约开始时间
    var bespeaktimeStart = that.data.bespeaktimeStart;
    //设置预约开始时间的  字符串格式（用于新建预约结束时间，，（为什么不直接 end=start   因为两个时间值一样，会保存在同一个常量池中，更新一个另一个也会随着更新））
    var bespeaktimeStartToString = bespeaktimeStart.format('yyyy/MM/dd h:m:s');
    //通过上面格式的字符串来新建一个Date对象（Date方法中只能通过这种格式的字符串来新建对象）
    var bespeaktimeEnd = new Date(bespeaktimeStartToString);
    //设置当前预约结束的小时
    var hourNow = bespeaktimeEnd.getHours() + bespeakduration1;
    bespeaktimeEnd.setHours(hourNow);
    //预约结束的时间字符串
    var hour = bespeaktimeEnd.getHours();
    hour = hour > 9 ? hour : '0' + hour;
    var minute = bespeaktimeEnd.getMinutes();
    minute = minute > 9 ? minute : '0' + minute;
    var second = bespeaktimeEnd.getSeconds();
    second = second > 9 ? second : '0' + second;
    var bespeaktimeEndToString = bespeaktimeEnd.getFullYear() + '/' + (bespeaktimeEnd.getMonth() + 1) + '/' + bespeaktimeEnd.getDate() + ' ' + hour + ':' + minute + ':' + second;
    //保存当前预约结束时间，预约结束时间字符串，预约持续时间
    that.setData({
      bespeaktimeEndIsActive: 1,
      bespeaktimeEnd: bespeaktimeEnd,
      bespeaktimeEndToString: bespeaktimeEndToString,
      bespeakduration1: bespeakduration1
    })
    console.log(that.data.bespeaktimeEndToString);
  },

  // 选中预约的时长2
  onChooseBespeakDuration2: function (e) {
    console.log("choose bespeakduration2...");
    var that = this;
    var i = 0;
    var bespeakduration2 = e.target.dataset.bespeakduration2;
    // 更新样式
    for (i = 0; i < that.data.bespeakwaytime1.length; i++) {
      that.setData({
        [`bespeakwaytime1[${i}].isactive`]: 0
      })
      if (that.data.bespeakwaytime1[i].id == bespeakduration2) {
        that.setData({
          [`bespeakwaytime1[${i}].isactive`]: 1
        })
      }
    }
    //保存当前预约的时间
    that.setData({
      bespeakduration2: bespeakduration2
    })
    //获取直接入座，获取当前时间
    var datenow = new Date();
    that.setData({
      bespeaktimeStart: datenow,
    })
    console.log("bespeakduration:" + bespeakduration2 + "hour");
  },

  onSwitchToBespeak: function (e) {
    var that = this;
    // 获取两个预约时长
    var bespeakduration1 = that.data.bespeakduration1;
    var bespeakduration2 = that.data.bespeakduration2;
    var bespeakduration = 0;
    //获取刚传过来的值 到地址 在线预约的 值 还是 直接入座的值
    var bespeakway = e.target.dataset.bespeakway;
    if (bespeakway == "1") {
      bespeakduration = bespeakduration1;
      that.setData({
        bespeakways: bespeakway,
      })
    } else {
      bespeakduration = bespeakduration2;
      that.setData({
        bespeakways: bespeakway,
      })
    }
    that.setData({
      bespeakduration: bespeakduration,
      // bespeakway1:bespeakway,
    })
    //如果未选择预约时间
    if (that.data.bespeakduration == 0) {
      wx.showToast({
        title: '请选择预约时间！',
        icon: 'error',
        duration: 1000
      })
    } else {
      console.log("bespeak loading...");
      console.log("duration:" + that.data.bespeakduration)
      console.log("bespeakways:" + that.data.bespeakways);
      // 设置预约开始时间
      wx.setStorageSync('bespeaktime', that.data.bespeaktimeStart);
      //设置预约时长 分享所有页面（主要bespeak order页面）
      wx.setStorageSync('bespeakduration', that.data.bespeakduration);
      //设置什么方式进入，选择哪个方式
      //bespeakway=="1"  表示第一个在线预约     =="2" 表示第二个直接入座
      wx.setStorageSync('bespeakduration1', that.data.bespeakways);


      // 选中的开始时间
      var bespeaktimeStart = that.data.bespeaktimeStart;
      var bespeaktimeStartToString = bespeaktimeStart.format('yyyy/MM/dd h:m:s');
      // 选中结束时间
      var bespeaktimeEnd = new Date(bespeaktimeStartToString);
      bespeaktimeEnd.setHours(bespeaktimeEnd.getHours() + bespeakduration);
      var bespeaktimeEndToString = bespeaktimeEnd.getFullYear() + '/' + (bespeaktimeEnd.getMonth() + 1) + '/' + bespeaktimeEnd.getDate() + ' ' + bespeaktimeEnd.getHours() + ':' + bespeaktimeEnd.getMinutes() + ':' + bespeaktimeEnd.getSeconds();
      console.log(bespeaktimeStartToString, "开始时间");
      console.log(bespeaktimeEndToString, "结束时间")
      //获取到了选中的开始时间和结束时间
      //检查与当前选中的时间冲突的订单
      //1.查询所有 未消费 和已经消费未入座 已经消费且入座的订单
      wx.request({
        url: url + '/order/selectConfiltOrders.do',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8', // 默认值
        },
        data: {
          "orderStatus1": 0,
          "orderStatus2": 1,
        },
        success(res) {
          // wx.showToast({
          //   ​     title: '取消预约成功！',
          //   ​     icon: 'loading',
          //   ​    });

          that.setData({
            maybeConfiltOrders: res.data,
          })
          console.log(that.data.maybeConfiltOrders, "可能冲突的订单");
          //查询当前选中的时间和可能冲突的订单的时间直接的冲突  orderBeginTime  7   orderStopTime  9  bespeaktimeStart 8;30   bespeaktimeEnd  10;30
          var i = 0;
          for (i = 0; i < that.data.maybeConfiltOrders.length; i++) {
            var maybeConfiltOrders = that.data.maybeConfiltOrders[i];
            var orderBeginTime = new Date(maybeConfiltOrders.orderBeginTime);
            var orderStopTime = new Date(maybeConfiltOrders.orderStopTime);
            if ((bespeaktimeStart <= orderBeginTime && bespeaktimeEnd > orderBeginTime) || (bespeaktimeEnd >= orderStopTime && bespeaktimeStart < orderStopTime) || (bespeaktimeStart >= orderBeginTime && bespeaktimeEnd <= orderStopTime)) {
              console.log("冲突");
              //找到这个订单的seatId   并设置这个seatId 为不可选中
              var seatIdConflict = maybeConfiltOrders.orderSeatId;
              //获取所有房间信息 如果 座位号相等 直接改变这个座位的样式
              if (seatIdConflict == that.data.chairInfo[seatIdConflict - 1].seatId) {
                that.setData({
                  [`chairInfo[${seatIdConflict - 1}].seatStyle1`]: 'chair_5',
                  [`chairInfo[${seatIdConflict - 1}].seatStyle2`]: 'chair_6',
                })
              }
            } else {
              console.log("不冲突")
              var seatIdNoConflict = maybeConfiltOrders.orderSeatId;
              //获取所有房间信息 如果 座位号相等 直接改变这个座位的样式
              if (seatIdNoConflict == that.data.chairInfo[seatIdNoConflict - 1].seatId) {
                that.setData({
                  [`chairInfo[${seatIdNoConflict - 1}].seatStyle1`]: 'chair_1',
                  [`chairInfo[${seatIdNoConflict - 1}].seatStyle2`]: 'chair_2',
                })
              }
            }
          }
          //所有冲突处理完
          wx.setStorageSync('chairInfo', that.data.chairInfo);
          console.log(that.data.chairInfo, "index页面的chairInfo");
          wx.showToast({
            title: '正在加载...',
            icon: 'loading',
            duration: 1000,
            success() {
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/bespeak/bespeak',
                })
              }, 1000)
            }
          })
        },
        fail(res) {
          console.log("请求可能冲突订单失败！");
          console.log(res);
        }
      })

      // wx.navigateTo({
      //   url: '/pages/loading/loading',
      //   // success(res){
      //   //   wx.showToast({
      //   //     title: "进入选座中", // 提示的内容
      //   //     icon: "loading", // 图标，默认success
      //   //     image: "", // 自定义图标的本地路径，image 的优先级高于 icon
      //   //     duration: 2000, // 提示的延迟时间，默认1500
      //   //     mask: false, // 是否显示透明蒙层，防止触摸穿透
      //   // })
      //   // },
      //   // fail(res){
      //   //   wx.showToast({
      //   //     title: "The system is wrong,please try again later!", // 提示的内容
      //   //     icon: "error", // 图标，默认success
      //   //     image: "", // 自定义图标的本地路径，image 的优先级高于 icon
      //   //     duration: 200, // 提示的延迟时间，默认1500
      //   //     mask: false, // 是否显示透明蒙层，防止触摸穿透
      //   // })
      //   // }
      // })
    }
  },

  //第一次加载
  onLoad: function (e) {
    var that = this;
    var dateTimeNow = new Date();
    var minutesNow = dateTimeNow.getMinutes();
    var hourNow = dateTimeNow.getHours();
    // 存储更新后的 小时 分钟
    var minutesAfter = 0;
    var hourAfter = 0;
    var secondAfter = 0;
    if (minutesNow > 0 && minutesNow <= 30) {
      minutesAfter = 30;
      hourAfter = hourNow;
    } else if (minutesNow > 30 && minutesNow < 60) {
      minutesAfter = 0;
      hourAfter = hourNow + 1;
    } else {
      hourAfter = hourNow;
      minutesAfter = minutesNow;
    }
    // 设置预约开始时间
    dateTimeNow.setHours(hourAfter);
    dateTimeNow.setMinutes(minutesAfter);
    dateTimeNow.setSeconds(secondAfter);


    var dateNow = dateTimeNow.getDate();
    var hourNow = dateTimeNow.getHours();
    var minuteNow = dateTimeNow.getMinutes();
    that.setData({
      valuebespeakstart: [0, 0, dateNow - 1, hourNow, minuteNow],
    })
    that.setData({
      userInfo: getApp().globalData.userInfo
    })
    // 如果没有登录
    if (that.data.userInfo.id == 0) {
      //获取用户的昵称 头像地址 性别等
      that.getUserInfo();
    }

    //查询当前座位
    wx.request({
      url: url + "/seat/selectAllSeats.do",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8', // 默认值
        // 'content-type':'application/json;'
      },
      // 请求成功返回什么
      success(res) {
        that.setData({
          chairInfo: res.data
        });
      }
    })

  },
  //每次加载时，需要加载当前时间
  onShow: function (e) {
    var that = this;
    that.setData({
      userInfo: getApp().globalData.userInfo,
    })
    console.log("index loading...");
    var dateTimeNow = new Date();
    var minutesNow = dateTimeNow.getMinutes();
    var hourNow = dateTimeNow.getHours();
    // 存储更新后的 小时 分钟
    var minutesAfter = 0;
    var hourAfter = 0;
    var secondAfter = 0;
    if (minutesNow > 0 && minutesNow <= 30) {
      minutesAfter = 30;
      hourAfter = hourNow;
    } else if (minutesNow > 30 && minutesNow < 60) {
      minutesAfter = 0;
      hourAfter = hourNow + 1;
    } else {
      hourAfter = hourNow;
      minutesAfter = minutesNow;
    }
    // 设置预约开始时间
    dateTimeNow.setHours(hourAfter);
    dateTimeNow.setMinutes(minutesAfter);
    dateTimeNow.setSeconds(secondAfter);
    //将时间转化成字符串类型
    var hour = dateTimeNow.getHours();
    hour = hour > 9 ? hour : '0' + hour;
    var minute = dateTimeNow.getMinutes();
    minute = minute > 9 ? minute : '0' + minute;
    var second = dateTimeNow.getSeconds();
    second = second > 9 ? second : '0' + second;
    var bespeaktimeToString = dateTimeNow.getFullYear() + '/' + (dateTimeNow.getMonth() + 1) + '/' + dateTimeNow.getDate() + ' ' + hour + ':' + minute + ':' + second;
    var datetime = new Date(bespeaktimeToString);
    datetime.setHours(datetime.getHours() + that.data.bespeakduration1);
    //将时间转化成字符串类型
    var hour = datetime.getHours();
    hour = hour > 9 ? hour : '0' + hour;
    var minute = datetime.getMinutes();
    minute = minute > 9 ? minute : '0' + minute;
    var second = datetime.getSeconds();
    second = second > 9 ? second : '0' + second;
    var datetimeToString = datetime.getFullYear() + '/' + (datetime.getMonth() + 1) + '/' + datetime.getDate() + ' ' + hour + ':' + minute + ':' + second;


    // //预约结束时间
    // bespeaktimeEnd:0,
    // //预约结束时间的字符串类型
    // bespeaktimeEndToString:"",
    that.setData({
      //整点时间
      bespeaktimeStart: dateTimeNow,
      bespeaktimeToString: bespeaktimeToString,
      bespeaktimeEnd: datetime,
      bespeaktimeEndToString: datetimeToString,
    })
    console.log(that.data.bespeaktimeStart);
  },

  // 反馈
  onFeedback() {
    console.log("反馈给我们!");
    wx.navigateTo({
      url: '/pages/feedback/feedback',
    })
  },
  //点击电话
  onContact() {
    console.log("点击反馈！");
    wx.showModal({
      title: '联系电话',
      content: '15272551132',
      cancelText: '呼叫',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击呼叫');
          wx.makePhoneCall({
            phoneNumber: '15272551132', //此号码并非真实电话号码，仅用于测试
            success: function () {
              console.log("拨打电话成功！")
            },
            fail: function () {
              console.log("拨打电话失败！")
            }
          })
          // wx.setClipboardData({
          //   data: '15272551132',
          //   success(res){
          //     console.log(res);
          //     console.log("复制成功");
          //   }
          // })
        }
      }
    })
  },
  // 使用说明
  onShowNotice() {
    console.log("用户点击使用说明！");
    wx.showModal({
      title: "使用说明",
      content: "1.可提前5天预约\n2.可提前一分钟取消预约，全额退款\n3.如果座位没人的情况下可提前10分钟入座\n4.过期10分钟自动释放，全额退款\n5.30天内可取消20次，超出进入黑名单",
      showCancel: false,
      confirmText: "知道了！",
      success(res) {
        if (res.confirm) {
          console.log("用户知道了！")
        }
      }
    })
  },
  navigate: function (e) {
    //使用微信内置地图查看标记点位置，并进行导航
    var that = e;
    //注意：经纬度必须是数字类型
    var latitude = parseFloat(that.currentTarget.dataset.latitude);
    var longitude = parseFloat(that.currentTarget.dataset.longitude);
    wx.openLocation({
      latitude: latitude,//要去的纬度-地址
      longitude: longitude,//要去的经度-地址
      name: that.currentTarget.dataset.address,//要导航的地址名称
      address: that.currentTarget.dataset.address,//要导航的地址地址
    })
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
  //开始的选择滚动器改变触发事件
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
      } else {
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
    const dateTime = setYear + "/" + setMonth + "/" + setDay + " " + setHour + ":" + setMinute;
    var datetime1 = new Date(dateTime);
    //将选取的时间
    // //预约开始时间
    // bespeaktimeStart:0,
    // //预约时间的字符串类型
    // bespeaktimeToString:"",
    //预约结束时间
    var bespeaktimeStart = datetime1;
    //预约结束的时间字符串
    var hour = bespeaktimeStart.getHours();
    hour = hour > 9 ? hour : '0' + hour;
    var minute = bespeaktimeStart.getMinutes();
    minute = minute > 9 ? minute : '0' + minute;
    var second = bespeaktimeStart.getSeconds();
    second = second > 9 ? second : '0' + second;
    var bespeaktimeToString = bespeaktimeStart.getFullYear() + '/' + (bespeaktimeStart.getMonth() + 1) + '/' + bespeaktimeStart.getDate() + ' ' + hour + ':' + minute + ':' + second;

    if (that.data.bespeakduration1 != 0) {
      var datetime = new Date(bespeaktimeToString);
      datetime.setHours(datetime.getHours() + that.data.bespeakduration1);
      //将时间转化成字符串类型
      var hour = datetime.getHours();
      hour = hour > 9 ? hour : '0' + hour;
      var minute = datetime.getMinutes();
      minute = minute > 9 ? minute : '0' + minute;
      var second = datetime.getSeconds();
      second = second > 9 ? second : '0' + second;
      var datetimeToString = datetime.getFullYear() + '/' + (datetime.getMonth() + 1) + '/' + datetime.getDate() + ' ' + hour + ':' + minute + ':' + second;
      that.setData({
        // //预约结束时间
        // bespeaktimeEnd:0,
        // //预约结束时间的字符串类型
        // bespeaktimeEndToString:"",
        bespeaktimeEnd: datetime,
        bespeaktimeEndToString: datetimeToString
      })
    }

    that.setData({
      //将最终的事件给js保存
      bespeaktimeStart: datetime1,
      bespeaktimeToString: bespeaktimeToString,
    })
    // 每次点击都是上次选中的
    var dateNow = datetime1.getDate();
    var hourNow = datetime1.getHours();
    var minuteNow = datetime1.getMinutes();
    that.setData({
      valuebespeakstart: [0, 0, dateNow - 1, hourNow, minuteNow],
    })
  },
  //选择 开始的时间
  onChooseBespeakStartTime(e) {
    console.log("onChooseBespeakStartTime");
    // 点击之后背景变灰色
    this.setData({
      showModal: true
    })
  },
  // 在showModel中点击确定
  go: function (e) {
    var that = this;
    //显示平面图
    that.setData({
      showModal: false
    })
    //后续操作
  },

  //结束的选择滚动器改变触发事件
  bindChange1: function (e) {
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
      } else {
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
    const dateTime = setYear + "/" + setMonth + "/" + setDay + " " + setHour + ":" + setMinute;
    var datatime1 = new Date(dateTime);
    //将选取的时间
    // bespeaktimeEnd:0,
    // //预约结束时间的字符串类型
    // bespeaktimeEndToString:"",
    that.setData({
      //将最终的事件给js保存
      bespeaktimeEnd: datatime1
    })
  },
})