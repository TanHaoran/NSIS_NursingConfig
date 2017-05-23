//app.js

var commonValue = require('common/common_value.js')

App({
    // 小程序启动后调用
    onLaunch: function () {
        var app = this;
        // 用户登陆
        wx.login({
            // 登陆成功后，会在res中获得一个code
            success: function (res) {
                console.log('登陆成功获取的code的值是：' + res.code);
                if (res.code) {
                    //发起网络请求，换取openid和session_key
                    wx.request({
                        url: commonValue.service.jscodeToSession,
                        data: {
                            appid: commonValue.appInfo.appId,
                            secret: commonValue.appInfo.appSecret,
                            js_code: res.code,
                            grant_type: commonValue.appInfo.grantType
                        },
                        success: function (r) {
                            console.log('换取openid和session_key成功!');
                            var openId = r.data.openid;
                            var sessionKey = r.data.session_key;
                            console.log('openid：' + openId);
                            console.log('session_key：' + sessionKey);
                            app.saveUserInfo(openId, sessionKey);
                        }, 
                        fail: function () {
                            console.log('换取openid和session_key失败！');
                        }
                    });
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg);
                }
            }
        });
    },

    // 保存用户的信息
    saveUserInfo: function(openId, sessionKey) {
        wx.setStorage({
            key: commonValue.userInfo.openId,
            data: openId,
            success: function () {
                console.log('保存openid成功!');
            }
        });

        wx.setStorage({
            key: commonValue.userInfo.sessionKey,
            data: sessionKey,
            success: function () {
                console.log('保存session_key成功!');
            }
        });

    }
})