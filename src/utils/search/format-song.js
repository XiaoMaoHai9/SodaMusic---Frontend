const SEARCH_API_DEFAULT = 'NeteaseCloudMusic'

// 匹配歌曲平台（默认为 网易云） -> 清洗歌曲信息
function cleanSong ({ info, api = SEARCH_API_DEFAULT }) {
  switch (api) {
    // 网易云搜索 API
    case 'NeteaseCloudMusic': return cleanForWY(info)
    // QQ音乐搜索 API
    case 'QQMusic': return cleanForQQ(info)
    // 酷狗音乐搜索 API
    case 'SouGouMusic': return cleanForKG(info)
    default: break
  }
}

// 清洗歌曲信息
function cleanForWY (info) {
  return {
    id: info.id, // 用于获取音频 URL
    name: info.name, // 歌名
    singer: info.ar.map(item => item.name), // 歌手名 -> 可能有多名歌手
    imgUrl: info.al.picUrl, // 歌曲封面
    audioUrl: null, // 音频 Url
    time: null // 歌曲时长
  }
}
function cleanForQQ (info) {}
function cleanForKG (info) {}

export { cleanSong }
