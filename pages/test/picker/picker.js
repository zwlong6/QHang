const date = new Date();//获取系统日期
const years = []
const months = []
const days = []
const hours = []
const minutes = []
const bigMonth = [1, 3, 5, 7, 8, 10, 12]

//将日期分开写入对应数组
//年
// for (let i = 1990; i <= date.getFullYear(); i++) {
// years.push(i);
// }
years.push(date.getFullYear());
//月
// for (let i = 1; i <= 12; i++) {
// months.push(i);
// }
months.push(date.getMonth()+1);
//日
var day = date.getDate();
for (let i = day; i <= 31; i++) {
days.push(i);
}
// 获取小时
var hour=date.getHours();
for (let i = hour; i <= 23; i++) {
var k = i;
if (0 <= i && i < 10) {
k = "0" + i
}
hours.push(k)
}
// 获取分钟
var minute=date.getMinutes();
for (let i = minute; i <= 59; i++) {
var k = i;
if (0 <= i && i < 10) {
k = "0" + i
}
minutes.push(k)
}
Page({

data: {

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

submit: function () {
this.setData({
showModal: true
})
},

preventTouchMove: function () {

},

go: function () {
this.setData({
showModal: false
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
//选择滚动器改变触发事件
bindChange: function (e) {
  const val = e.detail.value;
  console.log(e);
  //判断月的天数
  const setYear = this.data.years[val[0]];
  const setMonth = this.data.months[val[1]];
  const setDay = this.data.days[val[2]];
  const setHour = this.data.hours[val[3]];
  const setMinute = this.data.minutes[val[4]];
  console.log(setYear + '年' + setMonth + '月' + setDay + '日');
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
}

})