//app.js
App({
	onLaunch: function () {
		//调用API从本地缓存中获取数据
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)
	},
	// 进入前台的回调函数
	onShow: function () {
		console.log("进入前台")
	},
	// 进入后台的回调函数
	onHide: function () {
		console.log("进入后台")
	},
	// 自定义任意方法
	anyFunction:  function () {

	},
	getUserInfo: function (cb) {
		var that = this
		if (this.globalData.userInfo) {
			typeof cb == "function" && cb(this.globalData.userInfo)
		} else {
			//调用登录接口
			wx.login({
				success: function () {
					wx.getUserInfo({
						success: function (res) {
							that.globalData.userInfo = res.userInfo
							typeof cb == "function" && cb(that.globalData.userInfo)
						}
					})
				}
			})
		}
	},
	globalData: {
		userInfo: null
	}
})