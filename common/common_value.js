
/**
 * 服务配置信息
 */
var service = {
    jscodeToSession: 'https://api.weixin.qq.com/sns/jscode2session',
    ip: 'https://nsisapply.buzzlysoft.com'
}

/**
 * 服务方法
 */
var method = {
    insertApplication: '/api/NSISAppInfor/Insert',
    getApplication: '/api/NSISAppInfor/GetAppInfo',
    updateApplication: '/api/NSISAppInfor/Update',
    deleteApplication: '/api/NSISAppInfor/Delete',
    getQrCode: '/api/NSISAppQRCode/GetJsonInfo'
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