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
        desc: '',
        applicationId: ''
    },

    // 页面加载
    onLoad: function (option) {
        console.log('接收到的参数');
        this.data.applicationId = option.applicationid;
        var applicant = option.applicant;
        var name = option.name;
        var desc = option.desc;
        var hospital = option.hospital;
        var office = option.office;
        var telephone = option.telephone;
        this.setData({
            applicant: applicant,
            name: name,
            desc: desc,
            hospital: hospital,
            office: office,
            telephone: telephone
        });
    },

    // 提交按钮
    onSubmit: function (e) {

        var postData = e.detail.value;
        // 获取用户的openId
        var openId = this.getUserOpenId(e);
        postData.openId = openId;

        // 取得applicationId
        postData.applicationId = this.data.applicationId;

        // 检测信息是否完整
        this.checkInfoCompleted(postData);

        if (this.data.popErrorMsg) {
            return;
        }

        // 将数据提交到服务器
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
        } else if (!postData.desc) {
            errorMsg = '描述不能为空';
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
    getUserOpenId: function (e) {
        return wx.getStorageSync(commonValue.userInfo.openId);
    },

    // 向服务提交数据
    postDataToServer: function (postData) {
        var apply = this;

        // 如果applicationId不为空，表示在编辑状态
        if (postData.applicationId) {
            var url = commonValue.service.ip + commonValue.method.updateApplication;
        } else {
            var url = commonValue.service.ip + commonValue.method.insertApplication;
        }     

        console.log('插入数据服务地址：' + url);
        console.log('提交的数据为：');
        console.log('openId：' + postData.openId);
        console.log('applicationId：' + postData.applicationId);
        console.log('医院名：' + postData.hospital);
        console.log('科室：' + postData.office);
        console.log('申请人：' + postData.applicant);
        console.log('联系电话：' + postData.telephone);
        console.log('申请项目：' + postData.name);
        console.log('描述：' + postData.desc);

        wx.request({
            url: url,
            data: {
                ApplicationID: postData.applicationId,
                WeixinID: postData.openId,
                HospitalName: postData.hospital,
                OfficeName: postData.office,
                Applicant: postData.applicant,
                Telphone: postData.telephone,
                ProJectName: postData.name,
                Describe: postData.desc,
                App_Date: '',
                State: 0,
                Prompt: ''
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                // 隐藏加载框
                wx.hideLoading();

                console.log('返回值是：' + res.data);

                if (res.data == '1') {
                    // 跳转到成功页面
                    console.log("提交成功");
                    wx.redirectTo({
                        url: '../apply_success/apply_success',
                    });
                } else {
                    // 跳转到失败页面
                    console.log("提交失败");
                    wx.navigateTo({
                        url: '../apply_failure/apply_failure',
                    });
                }
            },
            fail: function () {
                console.log("提交失败");
                // 隐藏加载框
                wx.hideLoading();

                // 跳转到失败页面
                wx.navigateTo({
                    url: '../apply_failure/apply_failure',
                })
            }
        });
        wx.showLoading({
            title: '正在提交',
            mask: true,
        });
    }
})