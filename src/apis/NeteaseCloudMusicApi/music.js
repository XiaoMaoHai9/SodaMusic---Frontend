import request from '@/utils/axios/request'

// 音乐是否可用
const checkMusic = ({ id = '', br = '' }) => {
  return request.get(`/check/music?id=${id}&br=${br}`, {})
}

// 获取音乐 url - 新版
const getSong = ({ id = '', level = 'standard' }) => {
  return request.get(`/song/url/v1?id=${id}&level=${level}`)
}

// 获取歌曲详情
const getSongDetail = ({ ids = '' }) => {
  return request.get(`/song/detail?ids=${ids}`)
}

// 获取歌单所有歌曲
const getPlayListAllSongs = ({ id = '', limit = '', offset = '' }) => {
  return request.get(`/playList/track/all?id=${id}&limit=${limit}&offset=${offset}`)
}

// 获取专辑内容
const getAlbumInfo = (id = '') => {
  return request.get(`/album?id=${id}`)
}

// 获取MV地址
const getMvUrl = ({ id = '', r = '' }) => {
  return request.get(`/mv/url?id=${id}&r=${r}`)
}

export { checkMusic, getSong, getSongDetail, getPlayListAllSongs, getAlbumInfo, getMvUrl }
