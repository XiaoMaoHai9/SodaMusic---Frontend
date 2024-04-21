// 格式化时间
function formatTime (time) {
  const h = time / 3600 > 0 ? Math.floor(time / 3600) : 0
  const m = time % 3600 / 60 > 0 ? Math.floor(time % 3600 / 60) : 0
  const s = time % 60 > 0 ? Math.floor(time % 60) : 0

  return (h < 10 ? '' : h + ':') + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s
}

function formatLanguage (lang) {
  switch (lang) {
    case 'zh-CN':
      return '中文-普通话'
    case 'zh-YUE':
      return '中文-粤语'
    case 'en':
      return '英文'
    case 'ko':
      return '韩语'
    case 'jap':
      return '日语'
    default:
      return '-'
  }
}

function formatDetail (detail) {
  detail.song_time = formatTime(detail.song_time)
  detail.language = formatLanguage(detail.language)
  return detail
}

export { formatTime, formatDetail }
