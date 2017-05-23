var service = {
    jscodeToSession: 'https://api.weixin.qq.com/sns/jscode2session',
    nursingConfig: 'http://NSIS_NursingConfig.service'
}

var appInfo = {
    appId: 'wx32b908ea5667c67f',
    appSecret: 'fdab74d9cbfe51de843b5d3f8e9e1332',
    grantType: 'authorization_code'
}

var userInfo = {
    openId: 'open_id',
    sessionKey: 'session_key'
}

var history = {
    hospital: 'hospital',
    office: 'office',
    applicant: 'applicant',
    telephone: 'telephone',
    name: 'name',
    desc: 'desc',
}

module.exports = {
    service: service,
    appInfo: appInfo,
    userInfo: userInfo,
    history: history
}