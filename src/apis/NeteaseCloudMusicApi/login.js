import request from '@/utils/axios/request'

// 发送验证码
const sendCode = ({ phone = '', ctcode = '' }) => {
  return request.get(`/captcha/sent?phone=${phone}&ctcode=${ctcode}`)
}

// 验证验证码
const verifyCode = ({ phone = '', captcha = '' }) => {
  return request.get(`/captcha/verify?phone=${phone}&captcha=${captcha}`)
}

// 手机号、验证码登录
const loginByPhone = ({ phone = '', captcha = '' }) => {
  return request.get(`/login/cellphone?phone=${phone}&captcha=${captcha}`)
}

// 手机号、验证码登录
const loginByPwd = ({ phone = '', password = '' }) => {
  return request.get(`/login/cellphone?phone=${phone}&password=${password}`)
}

// 手机号、验证码登录
const getUserInfo = ({ uid = '' }) => {
  return request.get(`/user/detail?uid=${uid}`)
}

// 手机号、验证码登录
const logout = () => {
  return request.get('/logout')
}

export { sendCode, verifyCode, loginByPhone, loginByPwd, getUserInfo, logout }
