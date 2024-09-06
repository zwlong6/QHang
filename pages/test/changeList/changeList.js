// pages/test/changeList/changeList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab 栏数据
    tabs:[
      {
        id:0,
        name:'已开始',
        isActive:true,
      },
      {
        id: 1,
        name: '未开始',
        isActive: false,
      },
      {
        id: 2,
        name: '待审批',
        isActive: false,
      },
    ]
  },
// 切换 tab栏 选项
changeTab(e){
  console.log(e)
  let index = e.currentTarget.dataset.index;
  let {tabs} = this.data;
  tabs.forEach((item)=>{
    item.id===index ? item.isActive=true : item.isActive=false;
  });
  this.setData({
    tabs
  });
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

  }
})