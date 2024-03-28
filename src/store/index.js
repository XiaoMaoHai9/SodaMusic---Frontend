import Vue from 'vue'
import Vuex from 'vuex'
import { checkMusic, getSong, getSongDetail, getPlayListAllSongs, getAlbumInfo, getMvUrl } from '@/apis/NeteaseCloudMusicApi/music'
import { cleanSongForWY } from '@/utils/index/formant-data-wy'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    platform: 'neteasecloud', // 登录平台
    sodaAccount: { // soda 账户
      loginFlag: false,
      isLogin: false, // 登陆状态
      userInfo: { // 用户数据
        avatarUrl: ''
      }
    },
    thirdParty: { // 第三方账户
      isLogin: false, // 登陆状态
      platform: 'neteasecloud', // 登录平台
      loginModel: 'account', // 登录的模式
      userInfo: { // 用户数据
        avatarUrl: ''
      }
    },
    audioPlayer: { // 音频播放器数据
      isStart: false, // 是否启动
      // 播放列表
      songsList: [],
      // 是否在播放
      isPlay: false,
      // 当前播放
      playNow: 0,
      // 是否在切歌
      isToggle: false,
      // 循环模式
      cycleMode: 'order'
    },
    videoPlayer: { // 视频播放器
      isStart: false, // 是否启动
      // 视频id
      id: null,
      // 视频链接
      url: null
    }
  },
  getters: {
    // 歌曲是否重复
    songIsExist: (state) => (id) => {
      if (state.audioPlayer.songsList.length === 0) return { isHas: false, arrIndex: null }
      // 判断播放列表是否为空 --> 判断当前歌曲 id 是否已在播放列表 （findIndex没有找到 返回-1，找到了返回索引号）
      const arrIndex = state.audioPlayer.songsList.findIndex((item, index) => item.id === id)
      // 歌曲不存在
      if (arrIndex === -1) {
        return { isHas: false, arrIndex: null }
      } else {
        return { isHas: true, arrIndex: arrIndex }
      }
    }
  },
  mutations: {
    // 改变登录模式
    checkLoginModel (state) {
      state.thirdParty.loginModel = state.thirdParty.loginModel === 'phone' ? 'account' : 'phone'
    },

    // 更新当前平台
    updatePlatform (state, platformName) {
      state.platform = platformName
    },

    // 设置用户信息
    setUserInfo (state, { data, platform }) {
      if (platform === 'sodamusic') state.sodaAccount.userInfo = data
      if (platform === 'neteasecloud') state.thirdParty.userInfo = data
    },

    // 改变 soda 账户登录标识 -> true 为开启登录 false为关闭登录
    changeLoginFlag (state, value) {
      state.platform = value ? 'sodamusic' : 'neteasecloud'
      state.sodaAccount.loginFlag = value
    },

    // 改变登录状态
    changeLoginState (state, { data, platform }) {
      if (platform === 'sodamusic') state.sodaAccount.isLogin = data
      if (platform === 'neteasecloud') state.thirdParty.isLogin = data
    },

    // 退出登录
    logout (state, platform) {
      if (platform === 'sodamusic') {
        window.localStorage.clear()
        state.sodaAccount.userInfo = {}
        state.sodaAccount.isLogin = false
      }
      if (platform === 'neteasecloud') {
        this.commit('clearCookies')
        window.sessionStorage.clear()
        state.thirdParty.userInfo = { avatarUrl: '' }
        state.thirdParty.isLogin = false
      }
    },

    // 清除本地cookie
    clearCookies () {
      const cookies = document.cookie.split('; ')
      for (let i = 0; i < cookies.length; i++) {
        const cookieName = cookies[i].split('=')[0]
        document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC'
      }
    },

    // 注入单曲 -> 来源于搜索
    addAudio (state, payLoad) {
      state.audioPlayer.songsList.push(payLoad)
    },

    // 注入歌单歌曲
    addPlayList (state, payLoad) {
      // 将当前播放列表替换为歌单曲目
      state.audioPlayer.songsList = payLoad
      // 播放第一首
      state.audioPlayer.playNow = 0
    },

    // 改变播放状态
    changeIsStart (state, value) {
      state.audioPlayer.isStart = value
    },
    // 改变播放状态
    changePlayState (state, value) {
      state.audioPlayer.isPlay = value
    },

    // 改变切歌状态
    changeToggle (state, value) {
      state.audioPlayer.isToggle = value
    },

    // 切换音频当前播放
    changePlayNow (state, value) {
      // 暂停播放
      state.audioPlayer.isPlay = false
      // 下一首
      if (value === '+') {
        // 若果当前是最后一首
        if (state.audioPlayer.playNow === state.audioPlayer.songsList.length - 1) {
          // 播放第一首
          state.audioPlayer.playNow = 0
        } else {
          // 否则播放下一首
          state.audioPlayer.playNow++
        }
        // 上一首
      } else if (value === '-') {
        // 如果当前是第一首
        if (state.audioPlayer.playNow === 0) {
          // 播放列表最后一首
          state.audioPlayer.playNow = state.audioPlayer.songsList.length - 1
        } else {
          // 否则播放上一首
          state.audioPlayer.playNow--
        }
        // 新添加 || 已存在列表
      } else if (value === 'end' || value === 'replay') {
        // 播放最后一首
        state.audioPlayer.playNow = state.audioPlayer.songsList.length - 1
      }
      // 开启切歌状态
      state.audioPlayer.isToggle = true
    },

    // 歌曲置尾
    endSong (state, index) {
      // 如果该歌曲不是最后一首
      if (index !== state.audioPlayer.songsList.length - 1) {
        // 去除数组中该歌曲 并得到歌曲信息
        const songInfo = state.audioPlayer.songsList.splice(index, 1)[0]
        // 将歌曲信息重新推入数组最后一位
        state.audioPlayer.songsList.push(songInfo)
      }
    },

    // 改变视频播放状态
    changeVideoState (state, value) {
      // 暂停音频播放
      state.audioPlayer.isPlay = false
      // 开启视频播放器
      state.videoPlayer.isStart = value
      // 如果关闭视频播放器
      if (!value) {
        // 清空储存
        state.videoPlayer.id = null
        state.videoPlayer.url = null
      }
    }
  },
  actions: {
    // 检查歌曲是否可用
    async checkMusic (context, info) {
      const { data } = await checkMusic(info)
      return data
    },

    // 获取音源 --> url
    async getSong (context, { info, flag }) {
      // 获取歌曲url
      const { data } = await getSong({ id: info.id })
      if (data.code !== 200) {
        Vue.prototype.$message.warning(data.message)
        return false
      }
      // 判断返回的url是否为空
      if (data.data[0].url != null) {
        // 仅获取url 与 time
        if (flag === 'get') {
          info.audioUrl = data.data[0].url
          info.time = data.data[0].time
          return info
          // 直接注入列表播放
        } else if (flag === 'play') {
          // 歌曲url、time注入播放列表
          context.state.audioPlayer.songsList.forEach(item => {
            if (item.id === data.data[0].id) {
              item.audioUrl = data.data[0].url
              item.time = data.data[0].time
            }
          })
        }
      }
    },

    // 获取歌曲详情
    async getSongDetail (context, ids) {
      // 获取歌曲detail
      const { data } = await getSongDetail({ ids: ids })
      // 返回的songs不为空
      if (data.songs) {
        // 如果播放器已启动
        if (context.state.audioPlayer.isStart) {
          // 单曲注入播放器
          context.state.audioPlayer.songsList.push(cleanSongForWY(data.songs[0]))
          // 切歌
          context.commit('changePlayNow', 'end')
        } else {
          // 获取url与time
          context.dispatch('getSong', { info: cleanSongForWY(data.songs[0]), flag: 'get' }).then(res => {
            if (!res) return false
            // 单曲注入播放器
            context.state.audioPlayer.songsList.push(res)
            // 启动播放器
            context.commit('changeIsStart', true)
          })
        }
      }
    },

    // 获取歌单所有歌曲详情
    async getListAllSongs (context, info) {
      const { data } = await getPlayListAllSongs(info)
      if (data.code === 200) {
        // 数据清洗
        const cleanData = data.songs.map(item => cleanSongForWY(item))
        // 如果播放器已启动
        if (context.state.audioPlayer.isStart) {
        // 歌单注入播放器
          context.commit('addPlayList', cleanData)
          // 切歌
          context.commit('changePlayNow')
        } else {
        // 获取第一首歌的url与time
          context.dispatch('getSong', { info: cleanData[0], flag: 'get' }).then(res => {
            if (!res) return false
            cleanData[0] = res
            // 歌单注入播放器
            context.commit('addPlayList', cleanData)
            // 启动播放器
            context.commit('changeIsStart', true)
          })
        }
      }
    },

    // 获取专辑内容
    async getAlbumAllSongs (context, { id }) {
      const { data } = await getAlbumInfo(id)
      // 清洗歌曲数据
      const songsDetial = data.songs.map(item => cleanSongForWY(item))
      // 歌曲信息无封面图
      if (!songsDetial[0].imgUrl) {
        // 加入专辑封面 -> 从专辑途径获取的单曲详情无封面图片
        songsDetial.forEach(item => {
          item.imgUrl = data.album.picUrl
        })
      }
      // 如果播放器已启动
      if (context.state.audioPlayer.isStart) {
        // 歌单注入播放器
        context.commit('addPlayList', songsDetial)
        // 切歌
        context.commit('changePlayNow')
      } else {
        // 获取第一首歌的url与time
        context.dispatch('getSong', { info: songsDetial[0], flag: 'get' }).then(res => {
          if (!res) return false
          songsDetial[0] = res
          // 歌单注入播放器
          context.commit('addPlayList', songsDetial)
          // 启动播放器
          context.commit('changeIsStart', true)
        })
      }
    },

    // 获取MV地址
    async getMvUrl (context, info) {
      const { data } = await getMvUrl(info)
      context.state.videoPlayer.id = data.data.id
      context.state.videoPlayer.url = data.data.url
      context.commit('changeVideoState', true)
    }
  },
  modules: {
  }
})
