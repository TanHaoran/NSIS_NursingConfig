//index.js
//获取应用实例
Page({
    data: {
        indexInfo: '申请添加大屏主界面没有的护理项目，请认真填写！',
        apply: '申请'
    },    
    // 点击申请按钮
    onApply: function() {
        wx.navigateTo({
            url: '../apply/apply',
        })

    }
})
