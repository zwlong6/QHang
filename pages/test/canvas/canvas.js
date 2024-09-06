// pages/canvas/canvas.js
// 2d对象
// function a(){


// var ctx;
// // 座位号
// var seatNumber = 0;
// var p1={
//     x:0,
//     y:350
// };
// var p2={
//     x:15,
//     y:350
// };
// var p3={
//     x:100,
//     y:350
// };
// var p4={
//     x:100,
//     y:365
// };
// var p5={
//     x:100,
//     y:515
// };
// var p6={
//     x:115,
//     y:515
// };
// var p7={
//     x:0,
//     y:65
// };
// var p8={
//     x:15,
//     y:65
// };
// var p9={
//     x:100,
//     y:65
// };
// var p10={
//     x:100,
//     y:50
// };
// var p11={
//     x:100,
//     y:0
// };
// var p12={
//     x:115,
//     y:0
// };
// var p13={
//     x:500,
//     y:0
// };
// var p14={
//     x:500,
//     y:15
// };
// var p15={
//     x:500,
//     y:715
// };
// var p16={
//     x:485,
//     y:715
// };
// var p17={
//     x:385,
//     y:715
// };
// var p18={
//     x:385,
//     y:700
// };
// var p19={
//     x:400,
//     y:220
// };
// var p20={
//     x:400,
//     y:215
// };
// var p21={
//     x:400,
//     y:80
// };
// var p22={
//     x:395,
//     y:80
// };
// var p23={
//     x:370,
//     y:80
// };
// var p24={
//     x:370,
//     y:85
// };
// var p25={
//     x:370,
//     y:220
// };
// var p26={
//     x:375,
//     y:220
// };

// // 刚加载
// const query = wx.createSelectorQuery()
// query.select('#oCanvas')
//   .fields({ node: true, size: true })
//   .exec((res) => {
//     const canvas = res[0].node
//     const ctx = canvas.getContext('2d')

//     const dpr = wx.getSystemInfoSync().pixelRatio
//     console.log(res);
//     canvas.width = 1000;
//     canvas.height = 1000;
// // 绘制圆角矩形中圆角的方法
// console.log(ctx);

// ctx.scale(1.5,1);
// ctx.translate(50,50);
// // 新建一条路径
// ctx.beginPath();

// ctx.strokeStyle="black";
// ctx.lineWidth=5;
// ctx.moveTo(0,80);
// ctx.lineTo(0,335);
// ctx.arcTo(p1.x,p1.y,p2.x,p2.y,15);

// ctx.lineTo(85,350);
// ctx.arcTo(p3.x,p3.y,p4.x,p4.y,15);

// ctx.lineTo(100,500);
// ctx.arcTo(p5.x,p5.y,p6.x,p6.y,15);

// ctx.lineTo(280,515);



// // 描边
// ctx.stroke();


// ctx.beginPath();
// ctx.moveTo(0,80);
// ctx.arcTo(p7.x,p7.y,p8.x,p8.y,15);

// ctx.lineTo(85,65);
// ctx.arcTo(p9.x,p9.y,p10.x,p10.y,15);

// ctx.lineTo(100,15);
// ctx.arcTo(p11.x,p11.y,p12.x,p12.y,15);

// ctx.lineTo(485,0);
// ctx.arcTo(p13.x,p13.y,p14.x,p14.y,15);

// ctx.lineTo(500,700);
// ctx.arcTo(p15.x,p15.y,p16.x,p16.y,15);

// ctx.lineTo(400,715);
// ctx.arcTo(p17.x,p17.y,p18.x,p18.y,15);

// ctx.lineTo(385,220);

// //文具柜
// ctx.lineTo(395,220);
// ctx.arcTo(p19.x,p19.y,p20.x,p20.y,5);

// ctx.lineTo(400,85);
// ctx.arcTo(p21.x,p21.y,p22.x,p22.y,5);

// ctx.lineTo(375,80);
// ctx.arcTo(p23.x,p23.y,p24.x,p24.y,5);

// ctx.lineTo(370,215);
// ctx.arcTo(p25.x,p25.y,p26.x,p26.y,5);

// ctx.lineTo(385,220);

// ctx.stroke();

// //线0
// ctx.moveTo(385,240);
// ctx.lineTo(400,240);
// ctx.stroke();
// //线1
// ctx.moveTo(385,315);
// ctx.lineTo(500,315);
// ctx.stroke();
// // 线2
// ctx.moveTo(385,515);
// ctx.lineTo(500,515);
// ctx.stroke();

// //储物柜
// var txt = "储物柜";
// ctx.beginPath();
// // 水平对齐
// ctx.textAlign="left";
// // 垂直对齐
// ctx.textBaseline="top";
// ctx.font="25px 宋体";
// ctx.fillStyle="black";
// // canvas绘制文本
// //          文本   起始的x,y 最大宽度，行高
// // ctx.wrapText(txt, 225, 20,20,40);
// ctx.fillText(txt,225,20);

// //景观休息区
// var txt1 = "景观休息区";
// ctx.fillText(txt1,30,115,20,40);

// //茶水间
// var txt2 = "茶水间";
// ctx.fillText(txt2,140,450);

// // 通往电脑屋
// var txt3 = "通往电脑屋↓";
// ctx.fillText(txt3,320,450,20,40);

// //前台（线0）
// var txt4 = "前台";
// ctx.fillText(txt4,400,227);

// // 文具柜
// var txt5 = "文具柜";
// ctx.fillText(txt5,372,110,20,30);

// //大门
// var txt6 = "大门";
// ctx.fillText(txt6,460,145,20,30);


// // 填充矩形（大门）
// ctx.beginPath();
// //起始x,y  长 高
// ctx.fillRect(495,95,10,150);

// // 填充矩形（景观）
// ctx.beginPath();
// //起始x,y  长 高
// ctx.fillRect(-5,100,10,215);

// // 两个小门
// ctx.beginPath();
// //起始x,y  长 高
// ctx.fillRect(380,430,10,60);
// ctx.fillRect(380,550,10,60);

// // 桌子
// ctx.fillRect(200,80,50,120);
// ctx.fillRect(200,240,50,120);

//   })
// };


Page({

  /**
   * 页面的初始数据
   */
  data: {
    x: 0,
    y: 0,
    scale: 1
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
    // a();

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  onChange(e) {
    // console.log(e)
  },

  onScale(e) {
    // console.log(e.detail)
  },
  ontap: function (event) {
    // var windowheight = wx.getSystemInfoSync().windowHeight;
    console.log(event);
  }
})