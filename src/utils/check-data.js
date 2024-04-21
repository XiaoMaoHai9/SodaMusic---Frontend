// 手机号码正则 -> 11位
const PHONE_RE = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
// 用户名正则 -> 中英文与字符-_
const USERNAME_RE = /^[\u4e00-\u9fa5a-zA-Z0-9_-]+$/
// 用户名长度正则 -> 长度不能超过15个汉字或30个数字英文字符
const USERNAMELENGTH_RE = /^[\u4e00-\u9fa5]{0,15}$|^[\dA-Za-z-_]{1,30}$/
// 密码正则 -> 至少8-16个字符，至少1个大写字母，1个小写字母和1个数字，其他可以是任意字符
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
// 验证码正则 -> 4位数字
const CAPTCHA_RE = /^\d{4}$/

// 返回对象构造函数
function ReturnObj (bool, msg = '') {
  this.bool = bool
  this.msg = msg
}

// 检查用户名
function chechUname (username) {
  if (username === '') return new ReturnObj(false, '请填写您的用户名！')
  else if (!USERNAME_RE.test(username)) return new ReturnObj(false, '用户名仅支持中英文、字符-_')
  else if (!USERNAMELENGTH_RE.test(username)) return new ReturnObj(false, '用户名长度不能超过15个汉字或30个数字英文字符！')
  return new ReturnObj(true)
}

// 检查手机号
function checkPhone (phone) {
  if (phone === '') return new ReturnObj(false, '请填写您的手机号！')
  else if (!PHONE_RE.test(phone)) return new ReturnObj(false, '请正确填写您的手机号码！')
  return new ReturnObj(true)
}

// 检查密码
function checkPwd (password) {
  if (password === '') return new ReturnObj(false, '请填写您的密码！')
  else if (!PASSWORD_RE.test(password)) return new ReturnObj(false, '密码至少包含8-16个字符，至少1个大写字母，1个小写字母和1个数字！')
  return new ReturnObj(true)
}

// 检查验证码
function checkCaptcha (captcha) {
  if (captcha === '') return new ReturnObj(false, '请填写您的验证码！')
  else if (!CAPTCHA_RE.test(captcha)) return new ReturnObj(false, '验证码格式不正确！')
  return new ReturnObj(true)
}

export { chechUname, checkPhone, checkPwd, checkCaptcha }
