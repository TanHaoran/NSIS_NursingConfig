// apply.js

var commonValue = require('../../common/common_value.js');
var util = require('../../common/util.js');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        telePhoneHint: '固话区号请用"-"隔开'
    },

    onLoad: function () {
        // 获取用户信息
        wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
                var encryptedData = res.encryptedData;
                var userInfo = res.userInfo;
                var iv = res.iv;
                console.log(userInfo);
                console.log('encryptedData：' + encryptedData);
                console.log('iv：' + iv);
            }
        });
    },

    onSubmit: function (e) {

        var apply = this;
        var postData = e.detail.value;
        // 获取用户的openId
        var openId = this.loadUserInfo(e);
        postData.openId = '123';

        // 验证手机号码
        var isPhoneLegal = util.checkPhone(postData.telephone);
        if (!isPhoneLegal) {
            wx.showToast({
                title: '联系电话输入有误',
                image: '../../images/failure.png',
                duration: 3000
            });
            return;
        }

        console.log('提交的数据为：');
        console.log('openId：' + postData.openId);
        console.log('医院名：' + postData.hospital);
        console.log('科室：' + postData.office);
        console.log('申请人：' + postData.applicant);
        console.log('联系电话：' + postData.telephone);
        console.log('申请项目：' + postData.name);
        console.log('描述：' + postData.desc);
        wx.request({
            url: commonValue.service.nursingConfig,
            data: postData,
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function () {
                console.log("提交成功");
                // 隐藏加载框
                wx.hideLoading();
                wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 3000
                });
                // 保存最近一次提交信息
                apply.saveHistory(postData);
            },
            fail: function () {
                console.log("提交失败");
                // 隐藏加载框
                wx.hideLoading();
                wx.showToast({
                    title: '提交失败',
                    image: '../../images/failure.png',
                    duration: 3000
                });
                // 保存最近一次提交信息
                apply.saveHistory(postData);
            }
        })
        wx.showLoading({
            title: '正在提交',
            mask: 'false',
        })
    }, 

    // 获取用户openId
    loadUserInfo: function(e) {
        return wx.getStorageSync(commonValue.userInfo.openId);
    },

    // 保存最近一次提交信息
    saveHistory: function (postData) {
        wx.setStorageSync(commonValue.history.hospital, postData.hospital);
        wx.setStorageSync(commonValue.history.office, postData.office);
        wx.setStorageSync(commonValue.history.applicant, postData.applicant);
        wx.setStorageSync(commonValue.history.telephone, postData.telephone);
        wx.setStorageSync(commonValue.history.name, postData.name);
        wx.setStorageSync(commonValue.history.desc, postData.desc);
        console.log('存储本地记录成功！');
    }
})