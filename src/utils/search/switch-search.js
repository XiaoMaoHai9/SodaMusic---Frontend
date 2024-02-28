import * as searchApi from '@/apis/SearchApi/index.js'

const SEARCH_API_DEFAULT = 'NeteaseCloudMusic'

// 匹配歌曲平台 （默认：网易云） -> 搜索 API 发送请求
function switchSearch ({ input, api = SEARCH_API_DEFAULT }) {
  switch (api) {
    // 网易云搜索 API
    case 'NeteaseCloudMusic': return searchForWY(input)
    // QQ音乐搜索 API
    case 'QQMusic': return searchForQQ(input)
    // 酷狗音乐搜索 API
    case 'SouGouMusic': return searchForKG(input)
  }
}

// 匹配歌曲平台 （默认：网易云） -> 搜索 API 发送请求
function switchGetAudioUrl ({ id, api = SEARCH_API_DEFAULT }) {
  switch (api) {
    // 网易云搜索 API
    case 'NeteaseCloudMusic': return getAudioUrlForWY(id)
    // QQ音乐搜索 API
    case 'QQMusic': return getAudioUrlForQQ(id)
    // 酷狗音乐搜索 API
    case 'SouGouMusic': return getAudioUrlForKG(id)
  }
}

async function searchForWY (input) {
  const { data } = await searchApi.searchWY({ value: input })
  return data.result.songs
}

async function searchForQQ (input) {
  const res = await searchApi.searchQQ({ value: input })
  console.log(res)
}

async function searchForKG (input) {
  const res = await searchApi.searchKG({ value: input })
  console.log(res)
}

async function getAudioUrlForWY (id) {
  const res = await searchApi.getWYAudioUrl({ id: id })
  return res.data[0].data[0]
}

async function getAudioUrlForQQ (mid) {
  const res = await searchApi.getQQAudioUrl({ mid: mid })
  console.log(res)
}

async function getAudioUrlForKG (aid) {
  const res = await searchApi.getKGAudioUrl({ aid: aid })
  console.log(res)
}

export { switchSearch, switchGetAudioUrl }
