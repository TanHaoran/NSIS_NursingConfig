
/**
 * 服务配置信息
 */
var service = {
    jscodeToSession: 'https://api.weixin.qq.com/sns/jscode2session',
    nursingConfig: 'http://NSIS_NursingConfig.service',
    ip: 'http://192.168.0.66:800/'
}

/**
 * 服务方法
 */
var method = {
 //   insertApplication: '/NsisWebService/WebService.asmx?op=InsertNSISApp_Information',
    insertApplication: 'api/NSISAppInfor/Insert',
    getApplication: 'api/NSISAppInfor/GetAppInfo',
    updateApplication: 'api/NSISAppInfor/Update',
    deleteApplication: 'api/NSISAppInfor/Delete'
}

/**
 * 应用信息
 */
var appInfo = {
    appId: 'wx32b908ea5667c67f',
    appSecret: 'fdab74d9cbfe51de843b5d3f8e9e1332',
    grantType: 'authorization_code'
}

/**
 * 用户信息
 */
var userInfo = {
    openId: 'open_id',
    sessionKey: 'session_key'
}

module.exports = {
    service: service,
    method: method,
    appInfo: appInfo,
    userInfo: userInfo,
}