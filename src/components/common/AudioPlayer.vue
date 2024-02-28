<template>
<!-- 播放器容器 -->
  <div class="player-container br bs tran-05s">
    <!-- 试听标识 -->
    <div class="audition-icon br bs" v-if="isAudition" title="试听歌曲，VIP账号登录可播放完整歌曲">试听</div>
    <!-- 歌曲封面 -->
    <div class="record-cover" ref="recordCover" :style= "{ transform : `rotate(${this.routate}deg)`}">
      <!-- 封面照片 -->
      <img class="record-bg f-ds" src="@/assets/images/common/record-bg.png">
      <!-- 唱片背景图 -->
      <img class="record-img" :src="playNowInfo.imgUrl">
    </div>
    <!-- 歌曲信息 -->
    <div class="song-info">
      <!-- 歌名 -->
      <span class="name to-dot">{{playNowInfo.name}}</span>
      <!-- 歌手 -->
      <span class="singer to-dot">{{playNowInfo.singer.join(' / ')}}</span>
    </div>
    <!-- 控制器 -->
    <div class="player-controller br bs">
      <!-- 上一首 -->
      <a-icon type="step-backward" class="is is-10  tran-03s" @click="changePlayNow('-')"/>
      <!-- 暂停 -->
      <a-icon v-if="isPlay" @click="changePlayState(false)" type="pause" class="is is-10  tran-03s"/>
      <!-- 播放 -->
      <a-icon v-else type="caret-right" @click="changePlayState(true)" class="is is-10  tran-03s"/>
      <!-- 下一首 -->
      <a-icon type="step-forward" class="is is-10  tran-03s" @click="changePlayNow('+')"/>
    </div>
    <!-- 进度条 -->
    <div class="player-bar">
      <!-- 进度时间 -->
      <div class="progress-time">
        <!-- 当前进度时间 -->
        <span class="time-now">{{ this.currentTime }}</span>
        <!-- 总时长 -->
        <span class="time-all">{{ this.duration }}</span>
      </div>
      <!-- 进度条主体 -->
      <div class="bar-body br bs" ref="barBody" @click="clickProgress">
        <!-- 现进度 -->
        <div class="audio-style-progress br bs tran-02s" ref="aduioStyleProgress">
          <!-- 拖拽球 -->
          <span class="drag-ball br bs tran-01s" ref="dragBall" @mousedown="dragProgress"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
export default {
  name: 'FloatPlayer',
  data () {
    return {
      // 当前播放信息
      playNowInfo: {
        id: null, // 用于获取音频 URL
        name: null, // 歌名
        singer: [], // 歌手名 -> 可能有多名歌手
        imgUrl: null, // 歌曲封面
        audioUrl: null, // 音频 Url
        time: null // 音频时长
      },
      // 音频对象
      audio: null,
      // 音频播放状态
      isPlay: false,
      // 音频总时长
      duration: '00:00',
      // 当前播放时长
      currentTime: '00:00',
      // 唱片旋转角度
      routate: 0,
      // 是否处于进度条改变状态
      isChangeProgress: false,
      // 操作类型
      mouseMode: 'click',
      // 唱片旋转计时器
      recordTimer: null,
      // 进度条计时器
      autoProgressTimer: null
    }
  },
  watch: {
    // 监听播放状态
    isPlay (newVal, oldVal) {
      // 如果在播放
      if (newVal) {
        // 播放音频
        this.audio.play()
        // 同步 Vuex
        this.$store.commit('changePlayState', true)
        // 唱片旋转
        this.coverRotate()
        // 进度条同步 音频 -> 图形
        this.changeFigureProcess()
      } else {
        // 暂停音频播放
        this.audio.pause()
        // 同步 Vuex
        this.$store.commit('changePlayState', false)
        // 清除唱片旋转计时器
        clearInterval(this.recordTimer)
        this.recordTimer = null
        // 清除进度条计时器
        clearInterval(this.autoProgressTimer)
        this.autoProgressTimer = null
      }
    },

    // 监听当前的播放
    'audioPlayer.isToggle' (newValue) {
      if (newValue) {
        // 当前歌曲无 url， 发送请求获取url
        if (!this.audioPlayer.songsList[this.audioPlayer.playNow].url) {
          this.getSong({ info: this.audioPlayer.songsList[this.audioPlayer.playNow], flag: 'play' }).then(() => {
            // 样式复位
            this.playerStyleReset()
            // 将当前播放歌曲的信息导入组件
            this.playNowInfo = this.audioPlayer.songsList[this.audioPlayer.playNow]
            // 注入 音频源
            this.audio.src = this.playNowInfo.audioUrl
            // 关闭切歌状态
            this.$store.commit('changeToggle', false)
          })
        } else {
          // 样式复位
          this.playerStyleReset()
          // 将当前播放歌曲的信息导入组件
          this.playNowInfo = this.audioPlayer.songsList[this.audioPlayer.playNow]
          // 注入 音频源
          this.audio.src = this.playNowInfo.audioUrl
          // 关闭切歌状态
          this.$store.commit('changeToggle', false)
        }
      }
    },

    // 监听音频播放状态
    'audioPlayer.isPlay' (newVal, oldVal) {
      this.isPlay = newVal
    }
  },
  computed: {
    // 导入 Vuex中的 player对象
    ...mapState(['audioPlayer']),

    // 是否为试听歌曲
    isAudition () {
      // 歌曲时长小于32s -> 当前歌曲为试听歌曲
      if (this.playNowInfo.time < 32000) {
        return true
      }
      return false
    }

  },
  methods: {
    ...mapMutations(['changePlayNow']),
    ...mapActions(['getSong']),

    // 格式化时间
    formatTime (time) {
      const h = time / 3600 > 0 ? Math.floor(time / 3600) : 0
      const m = time % 3600 / 60 > 0 ? Math.floor(time % 3600 / 60) : 0
      const s = time % 60 > 0 ? Math.floor(time % 60) : 0

      return (h < 10 ? '' : h + ':') + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s
    },

    // player 样式复位
    playerStyleReset () {
      // 进度条复位
      this.$refs.aduioStyleProgress.style.width = '0%'
      // 唱片旋转角度归零
      this.routate = 0
      // 音频进度复位
      this.audio.currentTime = 0
      // 时间进度归零
      this.currentTime = '00:00'
    },

    // audio 音频监听
    watchAudio () {
      // 监听 audio 数据加载完毕
      this.audio.addEventListener('loadeddata', () => {
        // 更新音频时长文字样式
        this.duration = this.formatTime(this.audio.duration)
        // 音频播放
        // 播放状态: true
        this.isPlay = true
        this.audio.play()
      })

      // 监听 audio 结束
      this.audio.addEventListener('ended', () => {
        if (this.audioPlayer.cycleMode === 'order') {
          // 播放状态: 暂停
          this.isPlay = false
          // player 样式复位
          this.playerStyleReset()
          // 当前播放 -> 下一首
          this.$store.commit('changePlayNow', '+')
        }
      })
    },

    // 进度条同步 音频 -> 图形
    changeFigureProcess () {
      // 播放且在非操作进度条状态下 => 开启同步
      if (this.isPlay && !this.isChangeProgress) {
        this.autoProgressTimer = setInterval(() => {
          // 进度条样式同步
          const percent = (this.audio.currentTime / this.audio.duration * 100)
          this.$refs.aduioStyleProgress.style.width = percent + '%'
          // 当前时间显示同步
          this.currentTime = this.formatTime(this.audio.currentTime)
        }, 1000)
      }
    },

    // 进度条同步 图形 -> 音频
    changeAudioProcess (percent) {
      this.audio.currentTime = this.audio.duration * percent
    },

    // 改变播放状态
    changePlayState (state) {
      this.isPlay = state
    },

    // 封面转动
    coverRotate () {
      this.recordTimer = setInterval(() => {
        // this.$refs.recordCover.style.transform = `rotate(${this.routate++}deg)`
        this.routate++
        // 一圈转完 -> 复位
        if (this.routate === 360) {
          this.routate = 0
        }
      }, 70)
    },

    // 进度条拖拽
    dragProgress (e) {
      this.isChangeProgress = true

      // 格式化bar的宽度 -> 去除 'px'
      const barWidth = getComputedStyle(this.$refs.barBody, false).width.replace(/[^0-9.]/g, '')

      // 进度条起点坐标 -> 相对于视口 -> 8是 dragBall的左偏移量
      const startX = e.clientX - (this.$refs.dragBall.offsetLeft + 8)
      // 鼠标当前距离在总进度条长度中的占比
      let progressX = 0

      // 添加 hover 效果 -> 使得鼠标离开进度条时仍有 hover 效果
      this.$refs.aduioStyleProgress.classList.add('audio-style-progress-hover')
      this.$refs.dragBall.classList.add('drag-ball-hover')

      // 禁止鼠标全选事件 -> 防止滑动时选中页面其他内容
      document.onselectstart = () => { return false }
      // 为页面绑定鼠标移动事件
      document.onmousemove = (e) => {
        // 将当前操作状态设为 拖拽
        this.mouseMode = 'drag'
        // 清除进度条计时器
        clearInterval(this.autoProgressTimer)
        this.autoProgressTimer = null
        // 鼠标当前相较于起点的距离
        const mouseX = e.clientX - startX
        progressX = (mouseX / barWidth) * 100
        // 限定拖拽范围
        if (progressX <= 0) {
          progressX = 0
        } else if (progressX >= 100) {
          progressX = 100
        }
        // 同步进度条样式
        this.$refs.aduioStyleProgress.style.width = progressX + '%'
        // 该进度下 当前时间显示
        this.currentTime = this.formatTime(progressX / 100 * this.audio.duration)
      }

      // 为页面绑定鼠标抬起事件
      document.onmouseup = () => {
        // 如果是拖拽操作
        if (this.mouseMode === 'drag') {
          // 取消进度改变状态
          this.isChangeProgress = false
          // 移除类名
          this.$refs.aduioStyleProgress.classList.remove('audio-style-progress-hover')
          this.$refs.dragBall.classList.remove('drag-ball-hover')
          // 进度条同步 图形 -> 音频
          this.changeAudioProcess(progressX / 100)
          // 进度条同步 音频 -> 图形
          this.changeFigureProcess()
          // 取消各类事件
          document.onselectstart = null
        }
        // 取消各类事件
        document.onmouseup = null
        document.onmousemove = null
      }
    },

    // 进度条点击调整进度
    clickProgress (e) {
      // 判断当前是拖拽还是点击
      if (this.mouseMode === 'drag') {
        this.mouseMode = 'click'
        return
      }

      // 格式化bar的宽度 -> 去除 'px'
      const barWidth = getComputedStyle(this.$refs.barBody, false).width.replace(/[^0-9.]/g, '')
      // 鼠标当前距离在总进度条长度中的占比
      let progressX = 0

      // 当前进度百分比 -> (鼠标较视口的x - bar较视口的x) 得到鼠标当前相较于起点的距离 / bar宽
      progressX = (e.clientX - this.$refs.barBody.getBoundingClientRect().left) / barWidth * 100
      // 限定拖拽范围
      if (progressX <= 0) {
        progressX = 0
      } else if (progressX >= 100) {
        progressX = 100
      }

      // 同步进度条样式
      this.$refs.aduioStyleProgress.style.width = progressX + '%'
      // 进度条同步 图形 -> 音频
      this.changeAudioProcess(progressX / 100)
      // 同步当前时间显示
      this.currentTime = this.formatTime(this.audio.currentTime)
    }

  },
  mounted () {
    // 创建音频对象
    this.audio = new Audio()
    // 开启音频监听
    this.watchAudio()
    // 将当前播放歌曲的信息导入组件
    this.playNowInfo = this.audioPlayer.songsList[this.audioPlayer.playNow]
    // 注入音频源
    this.audio.src = this.playNowInfo.audioUrl
    // 关闭切歌状态
    this.$store.commit('changeToggle', false)
  }
}
</script>

<style lang="less" scoped>
.player-container{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 220px;
  height: 410px;
  padding: 30px 0 15px 0;
  bottom: 100px;
  right: 100px;
  z-index: 997;
  background-color: #FAFAFA;

  .audition-icon{
    position: absolute;
    width: 50px;
    height: 25px;
    line-height: 25px;
    left: 10px;
    top: 10px;
    z-index: 997;
    text-align: center;
    background-color: #fff;
  }

  .record-cover{
    display: inline-block;
    position: relative;
    cursor: pointer;
    .record-bg{
      position: relative;
      width: 150px;
      height: 150px;
      z-index: 2;
    }

    .record-img{
      position: absolute;
      width: 80px;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      z-index: 1;
    }
  }

  .song-info{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 70px;
    padding: 0 30px;
    text-align: center;
    .name{
      width: 100%;
      font-size: 22px;
      font-weight: 500;
    }
    .singer{
      width: 100%;
      font-size: 18px;
    }
  }

  .player-controller{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 80%;
    height: 60px;
    background-color: #fff;
  }

  .player-bar{
    width: 80%;
    .progress-time{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .bar-body{
      position: relative;
      width: 100%;
      height: 6px;
      background-color: #fff;

      .audio-style-progress{
        position: absolute;
        width: 0%;
        height: 6px;
        line-height: 6px;
        top: 0;
        bottom: 0;
        margin: auto 0;
        background: linear-gradient(90deg, rgb(0, 117, 194) 5px , rgb(188, 232, 239));

        .drag-ball{
          position: absolute;
          width: 6px;
          height: 6px;
          top: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          background-color: #9e9e9e;
          opacity: 0;
          cursor: pointer;
        }

        .drag-ball:hover{
          background-color: #313131;
        }
      }

      .audio-style-progress-hover{
        height: 9px;
        line-height: 9px;

        .drag-ball-hover{
          width: 16px;
          height: 16px;
          right: -8px;
          opacity: 1;
          background-color: #313131;
        }
      }
    }

    .bar-body:hover{

      .audio-style-progress{
        height: 9px;
        line-height: 9px;
      }

      .drag-ball{
        width: 16px;
        height: 16px;
        right: -8px;
        opacity: 1;
      }
    }
  }

}
</style>
