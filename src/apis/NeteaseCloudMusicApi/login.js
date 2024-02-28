import request from '@/utils/axios/request'

// 发送验证码
const sendCode = ({ phoneNum = '', ctcode = '' }) => {
  return request.get(`/captcha/sent?phone=${phoneNum}&ctcode=${ctcode}`)
}

// 验证验证码
const verifyCode = ({ phoneNum = '', captcha = '' }) => {
  return request.get(`/captcha/verify?phone=${phoneNum}&captcha=${captcha}`)
}

// 手机号、验证码登录
const loginByPhone = ({ phoneNum = '', captcha = '' }) => {
  return request.get(`/login/cellphone?phone=${phoneNum}&captcha=${captcha}`)
}

// 手机号、验证码登录
const loginByPwd = ({ phoneNum = '', password = '' }) => {
  return request.get(`/login/cellphone?phone=${phoneNum}&password=${password}`)
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
