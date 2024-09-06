// // pages/managenoticeinsert/managenoticeinsert.js
var url=getApp().globalData.wxRequestBaseUrl;
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     //公告标题
//     noticetitle:"",
//     //缩略图的图片
//     imgpath:'/static/insertPic.svg',
//     //公告详情的图片
//     imgpaths:0,
    
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {

//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   },
//   //公告标题
//   onNoticeInput(e){
//     var that=this;
//     that.setData({
//       noticetitle:e.detail.value,
//     })
//     console.log(that.data.noticetitle);
//   },


//   // 添加公告缩略图以及详情
//   onInsertNoticeContentPic(){
//     var that=this;
//     console.log("添加公告缩略图");
//     wx.chooseImage({
//       count: 9, // 默认9
//       sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
//       sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
//       success: function (res) {
//         // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
//         var tempFilePaths = res.tempFilePaths
//         console.log(tempFilePaths);
//         console.log("上传成功！");
//         var i=0;
//         for(i=0;i<tempFilePaths.length;i++){
//           wx.uploadFile({
//             url: url+'/notice/upload/insertNotice.do', //仅为示例，非真实的接口地址
//             filePath: tempFilePaths[i],
//             name: 'file',
//             // formData阉割了
//             // formData:{
//             // }
//             header: {'content-type': 'multipart/form-data'},
//             success: function(res){
//               var data = res.data
//               //do something
//               console.log("上传到后台成功！");
//               console.log(res);
//             },
//             fail(res){
//               console.log("上传到后台失败！");
//               console.log(res);
//             }
//           })
//         }
//         that.setData({
//           imgpaths:tempFilePaths
//         })
//       }
//     })
//   }
// })


Page({
  data: {
    imgpath:'/static/insertPic.svg',
    imgpaths: [],
    uploadList:[],
    aabase:[],
    noticetitle:"",
  },
      //公告标题
  onNoticeInput(e){
    var that=this;
    that.setData({
      noticetitle:e.detail.value,
    })
    console.log(that.data.noticetitle);
  },
  onInsertNoticeContentPic: function (e) {
    var that = this
    wx.chooseImage({
      count:9, // 默认3
      sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        var uploadList=that.data.uploadList.concat(tempFilePaths);
        var i=0;
        for(i=0;i<uploadList.length;i++){
          console.log(that.data.imgpaths);
          const element=uploadList[i];
          console.log(element,"88888888");
          wx.getFileSystemManager().readFile({
            filePath:element,
            encoding:'base64',
            success(res){
              var AAA=String('data:image/png;base64,'+res.data);
              console.log(Object.prototype.toString.call(AAA),"AAABBBCCC");
              that.data.aabase.push(AAA);
            }
          })
        }
        that.setData({
          imgpaths:tempFilePaths,
        })
        console.log(that.data.aabase,"that.data.aabase");
      }
    })
  },

  submitt(){
    wx.showToast({
      title: '正在添加请稍等！',
      icon:'loading',
      duration:5000,
    });
    console.log("提交");
    var that=this;
    var noticeCreateTime=new Date();
    var noticeCreateTimeToString=noticeCreateTime.getFullYear()+'-'+(noticeCreateTime.getMonth()+1)+'-'+noticeCreateTime.getDate()+' '+noticeCreateTime.getHours()+':'+noticeCreateTime.getMinutes()+':'+noticeCreateTime.getSeconds();
    wx.request({
      url: url+'/notice/insertNotice.do',
      method:'POST',
      header:{
        'content-type': 'application/json', // 默认值
      },
      data:{
        "noticeTitle":that.data.noticetitle,
        "noticeCreateTime":noticeCreateTimeToString,
        base64Data:that.data.aabase,
      },
      success(res){
        wx.showToast({
          title: '添加公告成功',
          icon:'success',
          duration:1000,
          success(res){
            setTimeout(function(){
              wx.navigateBack({
                url: '/pages/managenotice/managenotice',
              })
            },1000);
          }
        })
      },
      fail(res){
        console.log("失败");
        console.log(res);
      }
    })
  }












  
  // // 删除图片
  // deleteImg: function (e) {
  //   var that = this
  //   wx.showModal({
  //     title: "提示",
  //     content: "是否删除",
  //     success: function (res) {
  //       if (res.confirm) {
  //         for (var i = 0; i < that.data.imgs.length; i++) {
  //           if (i == e.currentTarget.dataset.index) that.data.imgs.splice(i, 1)
  //         }
  //         that.setData({
  //           imgs: that.data.imgs
  //         })
  //       } else if (res.cancel) {
  //         console.log("用户点击取消")
  //       }
  //     }
  //   })
  // }
  
})