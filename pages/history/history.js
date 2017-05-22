//logs.js
var util = require('../../utils/util.js')
Page({
  data: {
      histories: [
          {
                applicant: "张紧轮",
                time: "2017-5-22 11:04:26",
                name: "脱落",
                desc: "关于脱落的详细描述"
          },
          {
              applicant: "林和",
              time: "2017-5-23 11:04:26",
              name: "管床",
              desc: "关于管床的详细描述"
          },
          {
              applicant: "李俊峰",
              time: "2017-5-24 11:04:26",
              name: "压疮",
              desc: "关于压疮的详细描述"
          },
          {
              applicant: "李易峰",
              time: "2017-5-24 11:04:26",
              name: "压疮",
              desc: "关于李易峰的详细描述"
          },
          {
              applicant: "鹿晗",
              time: "2017-5-24 11:04:26",
              name: "压疮",
              desc: "关于鹿晗的详细描述"
          },
          {
              applicant: "林俊杰",
              time: "2017-5-24 11:04:26",
              name: "压疮",
              desc: "关于林俊杰的详细描述"
          }
      ]
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(function (log) {
        return util.formatTime(new Date(log))
      })
    })
  }
})
