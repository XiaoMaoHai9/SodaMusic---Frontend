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

// 获取歌曲列表
const getSongLib = (lid = '') => {
  return request.get(`/song/songlib?lid=${lid}`)
}

// 歌曲修改
const modifySongDetail = (modifyInfo) => {
  return request.post('/song/modify', modifyInfo)
}

// 歌曲删除
const deleteSong = ({ lid, sid }) => {
  return request.delete(`/song/delete?lid=${lid}&sid=${sid}`)
}

// 歌曲删除
const searchList = ({ lid, song, singer, style, lang }) => {
  return request.post(`/song/search?lid=${lid}&song_name=${song}&singer=${singer}&style_name=${style}&language=${lang}`)
}

// 用户信息修改
const updateUserInfo = (userInfo) => {
  return request.post('/my/update', userInfo)
}

export {
  register,
  login,
  getUserInfo,
  uploadSong,
  getSongLib,
  modifySongDetail,
  deleteSong,
  searchList,
  updateUserInfo
}
