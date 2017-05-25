// apply.js

var commonValue = require('../../common/common_value.js');
var util = require('../../common/util.js');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        popErrorMsg: '',
        telePhoneHint: '请填写11位手机号码或者固定电话',
        applicant: '',
        name: '',
        desc: ''
    },

    onLoad: function (option) {
        console.log('接收到的参数');
        var applicant = option.applicant;
        var name = option.name;
        var desc = option.desc;
        this.setData({
            applicant: applicant,
            name: name,
            desc: desc
        });
    },

    // 提交按钮
    onSubmit: function (e) {

        var postData = e.detail.value;
        // 获取用户的openId
        var openId = this.loadUserInfo(e);
        postData.openId = '123';

        // 检测信息是否完整
        this.checkInfoCompleted(postData);
        if (this.data.popErrorMsg) {
            return;
        }

        this.postDataToServer(postData);
    },

    // 检测信息是否完整
    checkInfoCompleted: function (postData) {
        var errorMsg;
        if (!postData.hospital) {
            errorMsg = '医院名不能为空';
        } else if (!postData.office) {
            errorMsg = '科室不能为空';
        } else if (!postData.applicant) {
            errorMsg = '申请人不能为空';
        } else if (!postData.telephone) {
            errorMsg = '联系电话不能为空';
        } else if (postData.telephone && !util.checkPhone(postData.telephone)) {
            errorMsg = '联系电话输入有误';
        } else if (!postData.name) {
            errorMsg = '申请项目不能为空';
        }

        if (errorMsg) {
            this.setData(
                { popErrorMsg: errorMsg }
            );
        }

        // 3秒过后提示框消失
        var fadeOutTimeOut = setTimeout(() => {
            this.setData(
                { popErrorMsg: '' }
            );
            clearTimeout(fadeOutTimeOut);
        }, 3000);
    },


    // 获取用户openId
    loadUserInfo: function (e) {
        return wx.getStorageSync(commonValue.userInfo.openId);
    },

    // 向服务提交数据
    postDataToServer: function (postData) {
        var apply = this;
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
        });
        wx.showLoading({
            title: '正在提交',
            mask: 'false',
        });
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