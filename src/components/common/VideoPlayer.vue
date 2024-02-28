<template>
  <div class="container br win-position">
    <video
      ref="video"
      class="video-js vjs-default-skin"
      width="1200"
      height="675"
      controls
    >
  </video>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'VideoPlayer',
  data () {
    return {
      video: null
    }
  },
  computed: {
    // 导入 Vuex中的 player对象
    ...mapState(['videoPlayer'])
  },
  methods: {},
  mounted () {
    // 初始化播放器
    this.video = this.$video(this.$refs.video, { autoplay: true })
    this.video.src(this.videoPlayer.url)

    this.video.on('ended', () => {
      // 播放完成
    })
  }
}
</script>

<style lang="less" scoped>
.container{
  width: 1200px;
  height: 675px;
}
</style>
