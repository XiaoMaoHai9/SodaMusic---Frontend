// 清洗歌曲信息
function cleanSongForSoda (info) {
  return {
    id: info.sid, // 用于获取音频 URL
    name: info.song_name, // 歌名
    singer: info.singer, // 歌手名 -> 可能有多名歌手
    imgUrl: info.cover_url, // 歌曲封面
    audioUrl: info.file_url, // 音频 Url
    time: info.duration // 歌曲时长
  }
}

export { cleanSongForSoda }
