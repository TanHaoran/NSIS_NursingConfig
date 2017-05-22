// apply.js

var service = require('../../common/service.js');

Page({
    /**
     * 页面的初始数据
     */
    data: {

    },

    onLoad: function () {
        wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
                var encryptedData = res.encryptedData;
                var userInfo = res.userInfo;
                console.log(userInfo);
                console.log(encryptedData);
            }
        });
    },

    onSubmit: function (e) {
        var postData = e.detail.value
        console.log(e.detail.value)
        wx.request({
            url: service.service.nursingConfig,
            data: postData,
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function () {
                console.log("提交成功")
                // 隐藏加载框
                wx.hideLoading()
                wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: function () {
                console.log("提交失败")
                // 隐藏加载框
                wx.hideLoading()
                wx.showToast({
                    title: '提交失败',
                    image: '../../images/failure.png',
                    duration: 2000
                })
            }
        })
        wx.showLoading({
            title: '正在提交',
            mask: 'false',
        })
    }
})