//logs.js
Page({
    data: {
        qrCodeSrc: '../../images/qr_code.png',
        qrCodeUrls: [
            '../../images/qr_code_1.jpg',
            '../../images/qr_code_2.jpg'
        ],
        applications: [
            {
                applicant: "张紧轮",
                time: "2017-5-22 11:04:26",
                name: "脱落",
                desc: "关于脱落的详细描述，如果这部分很长很长怎么办呢，看看如果换行了会不会有影响呢。",
                state: 2
            },
            {
                applicant: "李易峰",
                time: "2017-5-24 11:04:26",
                name: "压疮",
                desc: "关于李易峰的详细描述",
                state: 1
            },
            {
                applicant: "林俊杰",
                time: "2017-5-24 11:04:26",
                name: "压疮",
                desc: "关于林俊杰的详细描述",
                state: 0
            },
            {
                applicant: "鹿晗",
                time: "2017-5-24 11:04:26",
                name: "压疮",
                desc: "关于鹿晗的详细描述",
                state: -1
            }
        ],
        showBigQrCode: false
    },

    // 用户点击编辑按钮
    onEdit: function (e) {
        var index = e.currentTarget.dataset.index;
        var application = this.data.applications[index];
        console.log(application);
        var url = '../apply/apply?applicant=' + application.applicant + '&name=' + application.name + '&desc=' + application.desc;
        wx.navigateTo({
            url: url,
        })
    },

    // 用户点击删除按钮
    onDelete: function () {
        wx.showModal({
            title: '提示',
            content: '确定要撤销这条记录吗？',
            showCancel: true,
            confirmText: '撤销',
            confirmColor: '#E64340',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定');
                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        })
    },

    // 点击小二维码
    onQrCode: function (e) {
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
                this.setData(
                    {
                        showBigQrCode: false
                    }
                );
            }
        }.bind(this), 300)

        // 显示 
        if (currentStatus == 'open') {
            this.setData(
                {
                    showBigQrCode: true
                }
            );
        }
    }, 

    // 下拉刷新的事件
    onPullDownRefresh: function() {
        wx.showLoading({
            title: '玩命加载中...',
        });

        // 3秒后停止刷新
        setTimeout(() => {
            wx.hideLoading();
            wx.stopPullDownRefresh();
        }, 3000);       
    }
})
