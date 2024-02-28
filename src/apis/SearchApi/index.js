import requestSearch from '@/utils/axios/search-request.js'

// 网易云搜索API
const searchWY = ({ value = '' }) => {
  return requestSearch.get(`/v1/wy/search?key=${value}`)
}
// QQ音乐搜索API
const searchQQ = ({ value = '' }) => {
  return requestSearch.get(`/v1/qq/search?key=${value}`)
}
// 酷狗音乐搜索API
const searchKG = ({ value = '' }) => {
  return requestSearch.get(`/v1/kugou/mobileSearch?key=${value}`)
}

// 获取网易云音频url
const getWYAudioUrl = ({ id = '' }) => {
  return requestSearch.get(`/v1/wy/song?id=${id}`)
}

// 获取QQ音乐音频url
const getQQAudioUrl = ({ mid = '' }) => {
  return requestSearch.get(`/v1/qq/song?mid=${mid}`)
}

// 获取酷狗音乐音频url
const getKGAudioUrl = ({ aid = '' }) => {
  return requestSearch.get(`/v1/kugou/getsong?id=${aid}`)
}

export { searchWY, searchQQ, searchKG, getWYAudioUrl, getQQAudioUrl, getKGAudioUrl }
