import request from '@/utils/axios/request-sodamusic'

const register = ({ phone = '', username = '', password = '', avatar = '' }) => {
  return request.post('/api/register', {
    phone,
    username,
    password,
    avatar
  })
}

const login = ({ phone = '', password = '' }) => {
  return request.post('/api/login', {
    phone,
    password
  })
}

const getUserInfo = () => {
  return request.get('/my/userinfo', {})
}

export {
  register,
  login,
  getUserInfo
}
