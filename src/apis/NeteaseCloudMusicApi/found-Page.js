import request from '@/utils/axios/request'

// 获取轮播图
const getBanner = () => {
  return request.get('/banner', {})
}

// 未登录
// 获取推荐歌单
const getPersonalized = ({ limit = '' }) => {
  return request.get(`/personalized?limit=${limit}`, {})
}

// 已登录
// 获取每日推荐歌单
const getRecommendRes = () => {
  return request.get('/recommend/resource', {})
}

// 获取云音乐首页新碟上架数据
const getNewAlbum = ({ area = '', limit = '' }) => {
  return request.get(`/album/new?area=${area}&limit=${limit}`, {})
}

// 获取所有榜单
const getTopList = () => {
  return request.get('/toplist', {})
}

// 获取歌单所有歌曲 --> 获取榜单歌曲同样适用
const getPlayList = ({ id = '', limit = '', offset = '' }) => {
  return request.get(`/playlist/track/all?id=${id}&limit=${limit}&offset=${offset}`, {})
}

// 获取最新MV
const getNewMv = ({ area = '', limit = '' }) => {
  return request.get(`/mv/first?area=${area}&limit=${limit}`, {})
}

export {
  getBanner, getPersonalized, getRecommendRes, getNewAlbum, getTopList, getPlayList, getNewMv
}
