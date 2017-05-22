//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        
    },
    // 点击申请按钮
    onApply: function() {
        wx.navigateTo({
            url: '../apply/apply',
        })

    }
})
