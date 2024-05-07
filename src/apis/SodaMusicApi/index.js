import request from '@/utils/axios/request-sodamusic'

// 注册
const register = ({ phone = '', username = '', password = '', avatarUrl = '' }) => {
  return request.post('/account/register', {
    phone,
    user_name: username,
    password,
    avatar_url: avatarUrl
  })
}

// 登录
const login = ({ phone = '', password = '' }) => {
  return request.post('/account/login', {
    phone,
    password
  })
}

// 获取用户信息
const getUserInfo = () => {
  return request.get('/my/userinfo', {})
}

// 歌曲上传
const uploadSong = (info) => {
  return request.post('/song/set', info)
}

// 歌曲上传
const getSongLib = (lid = '') => {
  return request.get(`/song/songlib?lid=${lid}`)
}

// 歌曲上传
const modifySongDetail = (modifyInfo) => {
  return request.post('/song/modify', modifyInfo)
}

// 歌曲上传
const deleteSong = ({ lid, sid }) => {
  return request.delete(`/song/delete?lid=${lid}&sid=${sid}`)
}

export {
  register,
  login,
  getUserInfo,
  uploadSong,
  getSongLib,
  modifySongDetail,
  deleteSong
}
