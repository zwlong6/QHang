// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    //微信用户信息
    userInfo:{
      appid:"",
      // 用户唯一标识
      id:0,
      // 头像地址
      // imgurl:"https://thirdwx.qlogo.cn/mmopen/vi_32/c8rIZx4IF9snQViamhgVHcC534YQZJXfNyVNohibUh2RpgayuHSXzy7ew2GGKia7C8gVaiczZIhwgILlqA8JUQRrYA/132",
      imgurl:"",
      //电话号码
      mobile:null,
      // 性别 0未知 1男 2女
      sex:0,
      //类型  1前台  0后台
      type:1,
      //用户名
      // username:"·J·要努力",
      username:"",
    },
    // 远程
    wxRequestBaseUrl:"https://www.zwlserver.top",
    // 本地
    // wxRequestBaseUrl:"http://localhost:8080",

    //静态文件的位置
    // static:"/static",
    static:"https://www.zwlserver.top/pictures"
  }
})
