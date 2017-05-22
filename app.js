//app.js

var service = require('common/service.js')

App({
    // 进入前台的回调函数
    onShow: function () {
        // console.log("进入前台")
    },
    // 进入后台的回调函数
    onHide: function () {
        // console.log("进入后台")
    },
    onLaunch: function () {
        // 获取用户登陆状态
        wx.login({
            success: function (res) {
                console.log('code的值是：' + res.code);
                if (res.code) {
                    //发起网络请求，换取session_key
                    var appId = 'wx32b908ea5667c67f';
                    var appSecret = 'fdab74d9cbfe51de843b5d3f8e9e1332';
                    
                    wx.request({
                        url: service.service.jscodeToSession,
                        data: {
                            appid: appId,
                            secret: appSecret,
                            js_code: res.code,
                            grant_type: 'authorization_code'
                        },
                        success: function (r) {
                            console.log('换取成功！' );
                        }, 
                        fail: function () {
                            console.log('换取失败！');
                        }
                    });
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg);
                }
            }
        });
    }
})