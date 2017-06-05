/**
 * 检测手机号码是否合法
 */
function checkPhone(phone) {
    var isTelePhone = /^(0\\d{2}-\\d{8}(-\\d{1,4})?)|(0\\d{3}-\\d{7,8}(-\\d{1,4})?)$/;
    var isMobilePhone = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
    if (isTelePhone.test(phone) || isMobilePhone.test(phone)) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * 保存已选择的医院
 */
function saveHospitalName(hospitalName) {
    wx.setStorageSync('hospitalName', hospitalName);
}

/**
 * 保存已选择的科室
 */
function saveOfficeName(officeName) {
    wx.setStorageSync('officeName', officeName);
}

/**
 * 获取已保存的医院
 */
function loadHospitalName() {
    return wx.getStorageSync('hospitalName');
}

/**
 * 获取已保存的科室
 */
function loadOfficeName() {
    return wx.getStorageSync('officeName');
}

module.exports = {
    checkPhone: checkPhone,
    saveHospitalName: saveHospitalName,
    saveOfficeName: saveOfficeName,
    loadHospitalName: loadHospitalName,
    loadOfficeName: loadOfficeName
}