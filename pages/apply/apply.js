// apply.js

var commonValue = require('../../common/common_value.js');
var util = require('../../common/util.js');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        telePhoneHint: '请填写11位手机号码或者固定电话'
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
                
                // 保存最近一次提交信息
                apply.saveHistory(postData);

                // 跳转到成功页面
                wx.redirectTo({
                    url: '../apply_success/apply_success',
                })
            },
            fail: function () {
                console.log("提交失败");
                // 隐藏加载框
                wx.hideLoading();
                
                // 保存最近一次提交信息
                apply.saveHistory(postData);

                // 跳转到失败页面
                wx.navigateTo({
                    url: '../apply_failure/apply_failure',
                })
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