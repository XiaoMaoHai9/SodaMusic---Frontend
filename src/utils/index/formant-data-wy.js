// 清洗歌曲信息
function cleanSongForWY (info) {
  return {
    id: info.id, // 用于获取音频 URL
    name: info.name, // 歌名
    singer: info.ar.map(item => item.name), // 歌手名 -> 可能有多名歌手
    imgUrl: info.al.picUrl || null, // 歌曲封面
    audioUrl: null, // 音频 Url
    time: null // 歌曲时长
  }
}

// 清洗专辑信息
function cleanAlbumForWY (info) {
  return {
    id: info.id, // 专辑id
    name: info.name, // 专辑名
    singer: info.artists.map(item => item.name), // 歌手名 -> 数组形式，可能有多人
    imgUrl: info.picUrl // 专辑封面
  }
}

// 清洗歌单数据
function cleanPlaylist (info) {
  return {
    id: info.id, // 歌单id
    name: info.name, // 歌单名
    imgUrl: info.picUrl, // 歌单封面
    playCount: info.playCount || info.playcount // 歌单播放量
  }
}

// 数据格式调整
function changePlayCount (info) {
  // 调整播放量格式
  for (let i = 0; i < info.length; i++) {
    if (info[i].playCount) {
      // 超出1亿
      if (info[i].playCount / 100000000 > 1) {
        info[i].playCount = (info[i].playCount / 100000000).toFixed(2) + '亿'
      } else if (info[i].playCount / 100000 > 1) {
        // 超出10万
        info[i].playCount = (info[i].playCount / 10000).toFixed(2) + '万'
      }
    } else if (info[i].playcount) {
      if (info[i].playcount / 100000000 > 1) {
        info[i].playcount = (info[i].playcount / 100000000).toFixed(2) + '亿'
      } else if (info[i].playcount / 100000 > 1) {
        // 超出10万
        info[i].playcount = (info[i].playcount / 10000).toFixed(2) + '万'
      }
    }
  }
  return info
}

export { cleanSongForWY, cleanAlbumForWY, cleanPlaylist, changePlayCount }
