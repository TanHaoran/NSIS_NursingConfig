//index.js
//获取应用实例
Page({
    data: {
        indexInfo: '申请添加大屏主界面没有的护理项目，请认真填写！',
        apply: '申请',
        userInfo: {}
    },    
    onLoad: function() {
        var index = this;
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
                index.setData({
                    userInfo: userInfo
                });
            }
        });
    },
    // 点击申请按钮
    onApply: function() {
        wx.navigateTo({
            url: '../apply/apply',
        })

    }
})
