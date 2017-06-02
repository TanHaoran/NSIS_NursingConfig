//logs.js

var commonValue = require('../../common/common_value.js');

Page({
    data: {
        qrCodeSrc: '../../images/qr_code.png',
        qrCodeUrls: [],
        applications: [],
        showBigQrCode: false,

        // 页面配置  
        navigations: [
            0, 1, 2, 3
        ],
        // 用来设置列表显示区域的高度
        scollHeight: 0,
        // tab切换 
        currentTab: 0,
        currentCount: 0,
        qrCodeTitle: ''
    },

    // 页面加载函数
    onLoad: function () {
        // 读取所有申请
        this.getApplications();

        var history = this;
        // 获取系统信息 
        wx.getSystemInfo({
            success: function (res) {
                history.setData({
                    scollHeight: res.windowHeight - 41
                });
            }
        });
    },

    // 滑动切换tab 
    bindChange: function (e) {
        this.setData({ currentTab: e.detail.current });
        this.getApplications();
    },
    // 点击tab切换 
    swichNavigation: function (e) {
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            this.setData({
                currentTab: e.target.dataset.current
            })
        }
        this.getApplications();
    },

    // 读取所有申请
    getApplications: function () {

        var history = this;

        wx.showLoading({
            title: '玩命加载中...',
            mask: true
        });

        var url = commonValue.service.ip + commonValue.method.getApplication;
        var openId = history.getUserOpenId();
        console.log('请求地址：' + url);
        console.log('请求openId：' + openId);

        wx.request({
            url: url,
            header: {
                'content-type': 'application/json'
            },
            data: {
                WeixinID: openId
            },
            success: function (res) {
                console.log('读取成功！');
                console.log(res.data);
                history.setApplications(res.data);
            },
            fail: function () {
                console.log('读取失败！');
            },
            complete: function () {
                wx.hideLoading();
                wx.stopPullDownRefresh();
            }
        });
    },

    // 获取用户openId
    getUserOpenId: function () {
        return wx.getStorageSync(commonValue.userInfo.openId);
    },

    /***
     * 设置列表数据
     * State审核状态：
     * 审核状态：0.待审核（可编辑，可删除），1.审核中，2.审核通过，3.审核失败
     */
    setApplications: function (data) {
        if (data) {
            // 首先清空数据
            this.data.applications.splice(0, this.data.applications.length);
            this.data.currentCount = 0;
            for (var i = data.length - 1; i >= 0; i--) {
                var date = data[i].App_Date;
                date = date.replace('T', ' ');
                var length = date.length;
                date = date.substring(0, length - 4);
                data[i].App_Date = date;
                if (data[i].State == this.data.currentTab) {
                    this.data.applications.push(data[i]);
                    this.data.currentCount++;
                }
            }
            this.setData({
                applications: this.data.applications,
                currentCount: this.data.currentCount
            });
        }
    },

    // 用户点击编辑按钮
    onEdit: function (e) {
        var index = e.currentTarget.dataset.index;
        var application = this.data.applications[index];
        console.log(application);
        var url = '../apply/apply?applicant=' + application.Applicant + '&name=' + application.ProJectName + '&desc=' + application.Describe + '&applicationid=' + application.ApplicationID + '&hospital=' + application.HospitalName + '&office=' + application.OfficeName + '&telephone=' + application.Telphone;
        wx.navigateTo({
            url: url,
        })
    },

    // 用户点击删除按钮
    onDelete: function (e) {
        var history = this;
        var index = e.currentTarget.dataset.index;
        var application = this.data.applications[index];
        wx.showModal({
            title: '提示',
            content: '确定要撤销这条记录吗？',
            showCancel: true,
            confirmText: '撤销',
            confirmColor: '#E64340',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定');
                    var url = commonValue.service.ip + commonValue.method.deleteApplication;
                    wx.request({
                        url: url,
                        data: {
                            ApplicationID: application.ApplicationID,
                        },
                        method: 'POST',
                        success: function (r) {
                            history.getApplications();
                            console.log(r.data);
                            if (r.data == '1') {
                                wx.showToast({
                                    title: '撤销成功',
                                });
                            }
                        },
                        fail: function () {
                            console.log('删除失败');
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        })
    },

    // 点击小二维码
    onQrCode: function (e) {
        var history = this;
        var index = e.currentTarget.dataset.index;
        var application = this.data.applications[index];
        var url = commonValue.service.ip + commonValue.method.getQrCode + '?ApplicationID=' + application.ApplicationID;

        this.data.qrCodeTitle = application.ProJectName;

        console.log('url是：' + url);
        console.log('请求id是：' + application.ApplicationID);


        // 设置二维码的数据
        history.setQrCodeData(url);
        // 显示大二维码
        history.bigQrCode(e);

        
    },


    /**
     * 设置二维码的数据
     */
    setQrCodeData: function (url) {
        // 先清空数据
        this.data.qrCodeUrls.splice(0, this.data.qrCodeUrls.length);
        console.log(url);
        this.data.qrCodeUrls.push(url);
        this.setData({
            qrCodeTitle: this.data.qrCodeTitle,
            qrCodeUrls: this.data.qrCodeUrls
        });
    },

    // 显示大二维码
    bigQrCode: function (e) {
        // 获取此时要open或者close的状态
        var currentStatus = e.currentTarget.dataset.status;
        /* 动画部分 */
        // 第1步：创建动画实例 
        var animation = wx.createAnimation({
            duration: 200, //动画时长 
            timingFunction: 'linear', //线性 
            delay: 0 //0则不延迟 
        });

        // 第2步：这个动画实例赋给当前的动画实例 
        this.animation = animation;

        // 第3步：执行第一组动画 
        animation.opacity(0).step();

        // 第4步：导出动画对象赋给数据对象储存 
        this.setData({
            bigQrCodeAnimation: animation.export()
        })

        // 第5步：设置定时器到指定时候后，执行第二组动画 
        setTimeout(function () {
            // 执行第二组动画 
            animation.opacity(1).step();
            // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
            this.setData({
                bigQrCodeAnimation: animation
            })

            //关闭 
            if (currentStatus == 'close') {
                this.setData({
                    showBigQrCode: false
                });
            }
        }.bind(this), 300)

        // 显示 
        if (currentStatus == 'open') {
            this.setData({
                showBigQrCode: true
            });
        }
    },

    // 下拉刷新的事件
    onPullDownRefresh: function () {
        this.getApplications();
    }
})
