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
        applicationId: '',

        hospitals: [],
        hospitalIndex: 0,

        offices: [],
        officeIndex: 0
    },

    /**
     * 页面加载
     */
    onLoad: function (option) {

        this.getHospitalList(option);

    },

    /**
     * 从服务器读取所有科室
     */
    getHospitalList: function (option) {
        var apply = this;
        wx.showLoading({
            title: '加载中，请稍后...',
        });
        var url = commonValue.service.ip + commonValue.method.getHospitalList;
        wx.request({
            url: url,

            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                apply.setHospitalList(res);
                apply.getOfficeList(option);
            },

            fail: function () {
                wx.showToast({
                    title: '医院列表读取失败',
                });
            },
            complete() {
                wx.hideLoading();
            }
        });
    },


    setHospitalList: function (res) {
        for (var i = 0; i < res.data.length; i++) {
            this.data.hospitals.push(res.data[i]);
        }
        this.setData({
            hospitals: this.data.hospitals
        });
    },

    /**
     * 从服务器读取所有科室
     */
    getOfficeList: function (option) {
        var apply = this;
        wx.showLoading({
            title: '加载中，请稍后...',
        });
        var url = commonValue.service.ip + commonValue.method.getOfficeList;
        wx.request({
            url: url,
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                apply.setOfficeList(res);
                apply.initData(option);
            },

            fail: function () {
                wx.showToast({
                    title: '科室列表读取失败',
                });
            },
            complete() {
                wx.hideLoading();
            }
        });
    },

    setOfficeList: function(res) {
        for (var i = 0; i < res.data.length; i++) {
            this.data.offices.push(res.data[i]);
        }
        this.setData({
            offices: this.data.offices
        });
    },

    /**
     * 初始化数据
     */
    initData(option) {
        // 首先从缓存中获取上一次提交的医院和科室信息
        var hospitalName = util.loadHospitalName();
        var officeName = util.loadOfficeName();

        this.data.applicationId = option.applicationid;
        var applicant = option.applicant;
        var name = option.name;
        var desc = option.desc;
        var telephone = option.telephone;

        if (option.applicationid) {
            hospitalName = option.hospital;
            officeName = option.office;
        }

        this.setData({
            applicant: applicant,
            name: name,
            desc: desc,
            telephone: telephone
        });

        this.setDisplayRight(hospitalName, officeName);
    },

    /**
     * 设置医院和科室显示正确
     */
    setDisplayRight: function (hospitalName, officeName) {
        for (var i = 0; i < this.data.hospitals.length; i++) {
            if (this.data.hospitals[i].HName == hospitalName) {
                this.data.hospitalIndex = i;
                break;
            }
        }

        for (var i = 0; i < this.data.offices.length; i++) {
            if (this.data.offices[i].ItemOfficeName == officeName) {
                this.data.officeIndex = i;
                break;
            }
        }

        this.setData({
            hospitalIndex: this.data.hospitalIndex,
            officeIndex: this.data.officeIndex
        });
    },

    /**
     * 切换医院
     */
    hospitalChange: function (e) {
        console.log('医院选择：', e.detail.value)
        this.setData({
            hospitalIndex: e.detail.value
        });
    },

    /**
     * 切换科室
     */
    officeChange: function (e) {
        console.log('科室选择：', e.detail.value)
        this.setData({
            officeIndex: e.detail.value
        });
    },

    /**
     * 提交按钮
     */
    onSubmit: function (e) {

        var postData = e.detail.value;
        // 获取用户的openId
        var openId = this.loadUserOpenId(e);
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

    /**
     * 检测信息是否完整
     */
    checkInfoCompleted: function (postData) {
        var errorMsg;
        if (!this.data.hospitals[this.data.hospitalIndex].HName) {
            errorMsg = '医院名不能为空';
        } else if (!this.data.offices[this.data.officeIndex].ItemOfficeName) {
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


    /**
     * 获取用户openId
     */
    loadUserOpenId: function (e) {
        return wx.getStorageSync(commonValue.userInfo.openId);
    },

    /**
     * 向服务提交数据
     */
    postDataToServer: function (postData) {
        var apply = this;

        this.saveLastData();

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
        console.log('医院名：' + this.data.hospitals[this.data.hospitalIndex].HName);
        console.log('科室：' + this.data.offices[this.data.officeIndex].ItemOfficeName);
        console.log('申请人：' + postData.applicant);
        console.log('联系电话：' + postData.telephone);
        console.log('申请项目：' + postData.name);
        console.log('描述：' + postData.desc);

        wx.request({
            url: url,
            data: {
                ApplicationID: postData.applicationId,
                WeixinID: postData.openId,
                HospitalName: this.data.hospitals[this.data.hospitalIndex].HName,
                OfficeName: this.data.offices[this.data.officeIndex].ItemOfficeName,
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
    },

    /**
     * 保存上一次提交的医院和科室的数据，以便下次加载的时候初始化
     */
    saveLastData: function () {
        util.saveHospitalName(this.data.hospitals[this.data.hospitalIndex].HName);
        util.saveOfficeName(this.data.offices[this.data.officeIndex].ItemOfficeName);
        console.log('保存医院和科室信息成功！');
    }
})