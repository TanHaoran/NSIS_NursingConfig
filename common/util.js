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

module.exports = {
    checkPhone: checkPhone
}