<template>
  <div class="html-container no-scroll">
    <!-- 顶部导航栏 -->
    <div class='banner'>
      <ul class='top-banner'>
        <li>
          <img class="web-logo" src="@/assets/images/logos/sodamusic.png" alt="logo" @click="routerGo('found')">
          <div class="top-nav-container" ref="topNav">
            <span class="top-nav" @click="routerGo('found', '-')">发现音乐</span>
            <span class="top-nav" @click="routerGo('myMicLib', '+')">私人乐库</span>
          </div>
        </li>
        <li>
          <search-bar></search-bar>
          <a-button type="primary" :style="{ width: '80px', height: '40px', fontSize: '15px', verticalAlign: 'middle'}" @click="isLoginShow = true" v-if="!isLogin">登录</a-button>
          <a-popover trigger="hover">
            <template slot="content">
              <ul class="bannner-popover-ul">
                <li class="br">
                  <span>
                    <a-icon type="api" :style="{ marginRight: '7px'}"/>切换接口</span>
                </li>
                <li class="br" @click="handleLogout">
                  <span>
                    <a-icon type="poweroff" :style="{ marginRight: '7px'}"/>退出登录</span>
                </li>
              </ul>
            </template>
            <a-avatar :size="40" :src="userInfo.avatarUrl" v-show="isLogin"/>
          </a-popover>
        </li>
      </ul>
    </div>
    <!-- 主内容区 -> 路由跳转 -->
    <div class='container'>
      <!-- 组件缓存 -->
      <keep-alive :include='keepArr'>
        <router-view></router-view>
      </keep-alive>
    </div>
    <!-- 页脚 -->
    <div class='footer'>
      <div class="footer-content">
          <div class="songs-link footer-info">
            <ul>
              <li class="info-title">歌源链接</li>
              <li>
                <a class="info-link" href="https://music.163.com/">网易云音乐
                  <img src="@/assets/images/logos/neteasecloud.svg" alt="">
                </a>
              </li>
              <li>
                <a class="info-link" href="https://y.qq.com/">QQ音乐
                  <img src="@/assets/images/logos/QQmusic.svg" alt="">
                </a>
              </li>
              <li>
                <a class="info-link" href="https://www.kugou.com/">酷狗音乐
                  <img src="@/assets/images/logos/kugoumusic.svg" alt="">
                </a>
              </li>
            </ul>
          </div>
          <div class="my-link footer-info">
             <ul>
              <li class="info-title">与我联系</li>
              <li>
                <a class="info-link"  href="https://github.com/XiaoMaoHai9">Github
                  <img src="@/assets/images/logos/Github.svg" alt="">
                </a>
              </li>
              <li>
                <a class="info-link" href="https://space.bilibili.com/66681654?spm_id_from=333.337.0.0">Blibili
                  <img src="@/assets/images/logos/Bilibili.svg" alt="">
                </a>
              </li>
              <li>
                <a class="info-link" href="https://weibo.com/u/5125621060">Weibo
                  <img src="@/assets/images/logos/Weibo.svg" alt="">
                </a>
              </li>
            </ul>
          </div>
          <div class="other-link footer-info">
            <ul>
              <li><a class="info-link">©  2024 小毛孩</a></li>
              <li><a class="info-link">版权声名</a></li>
              <li><a class="info-link">捐助我</a></li>
            </ul>
          </div>
      </div>
    </div>
    <!-- 登录界面 -->
    <transition name="mask-fade">
      <login-window v-if="isLoginShow" @openWindow="openWindow()"></login-window>
    </transition>
    <!-- 音频播放器 -->
    <audio-player  v-if="audioPlayer.isStart"></audio-player>
    <!-- 视频播放器 -->
    <transition name="mask-fade">
      <video-player v-if="videoPlayer.isStart"></video-player>
    </transition>
    <!-- 模糊背景蒙版 -->
    <div class="win-bk-mask mask-style-b" v-if="isLoginShow || videoPlayer.isStart" @click="openWindow()">
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import LoginWindow from '@/components/common/LoginWindow.vue'
import AudioPlayer from '@/components/common/AudioPlayer.vue'
import VideoPlayer from '@/components/common/VideoPlayer.vue'
import SearchBar from '@/components/common/SearchBar.vue'

export default {
  name: 'IndexPage',
  components: {
    LoginWindow,
    AudioPlayer,
    VideoPlayer,
    SearchBar
  },
  data () {
    return {
      keepArr: ['FoundMusic', 'MusicLibPage'],
      isLoginShow: false
    }
  },
  computed: {
    ...mapState(['isLogin', 'userInfo', 'audioPlayer', 'videoPlayer'])
  },
  watch: {

    isLogin (to, from) {
      if (this.isLogin === true) {
        this.isLoginShow = !this.isLogin
      }
    },

    isLoginShow (newValue, oldValue) {
      // 切换禁止滚动的类
      if (newValue) {
        document.body.classList.add('no-scroll')
      } else {
        document.body.classList.remove('no-scroll')
      }
    },

    'videoPlayer.isPlay' (newValue, oldValue) {
      // 切换禁止滚动的类
      if (newValue) {
        document.body.classList.add('no-scroll')
      } else {
        document.body.classList.remove('no-scroll')
      }
    }

  },
  methods: {
    ...mapMutations(['setUserInfo', 'changeLoginState', 'logout']),

    // CSS获取DOM样式不同浏览器兼容性适配
    getStyle (oElement, sName) {
      return oElement.currentStyle ? oElement.currentStyle[sName] : getComputedStyle(oElement, null)[sName]
    },

    // 导航栏选中后跳转路由
    routerGo (arrive, positionGo) {
      if (arrive !== this.$route.name) {
        if (positionGo === '+') {
          this.$refs.topNav.style.backgroundPositionX = parseFloat(this.getStyle(this.$refs.topNav, 'backgroundPositionX')) + 120 + 'px'
        } else {
          this.$refs.topNav.style.backgroundPositionX = parseFloat(this.getStyle(this.$refs.topNav, 'backgroundPositionX')) - 120 + 'px'
        }
        this.$router.push(`/${arrive}`)
      }
    },

    // 退出登录
    async handleLogout () {
      // 请求登出
      const { data } = await this.$http.login.logout()
      // 成功后 -> 执行本地退出操作
      if (data.code === 200) {
        this.logout()
        this.$message.success('成功退出!')
      }

      // 失败捕获
      // ...
    },

    // 关闭窗口
    openWindow () {
      // 关闭登录窗口
      if (this.isLoginShow) this.isLoginShow = false
      // 关闭MV窗口
      if (this.videoPlayer.isStart) {
        this.$store.commit('changeVideoState', false)
      }
    }
  },
  created () {
    this.$router.push('/found')

    if (window.sessionStorage.userInfo) {
      this.setUserInfo(JSON.parse(window.sessionStorage.getItem('userInfo')))
    }
    if (window.sessionStorage.isLogin) {
      this.changeLoginState(window.sessionStorage.getItem('isLogin'))
    }
  },
  mounted () {
  }
}
</script>

<style lang='less' scoped>
.html-container{
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #f7f9fc;
}

.top-banner{
  display: flex;
  width: 960px;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0 20px;
  border-bottom: 1px solid #e8e8e8;

  li{
    height: 100px;
    line-height: 100px;
    font-size: 0;
    flex-shrink: 0;

    .web-logo{
      width: 170px;
      margin-right: 15px;
      vertical-align: middle;
      cursor: pointer;
    }
    .top-nav-container{
      display: inline-block;
      vertical-align: middle;
      height: 100px;
      background: linear-gradient(90deg, rgb(0, 117, 194) 5px , rgb(188, 232, 239)) no-repeat 15px bottom;
      background-size: 90px 4px;
      transition: background .5s;

      .top-nav{
        display: inline-block;
        width: 90px;
        margin: 0 15px;
        font-size: 22px;
        cursor: pointer;

        &:hover{
          color: @font-color-hover;
        }
      }
    }
  }
}

.nav-checked{
    border-bottom: 4px solid #0075c2;
    color: #0075c2;
}

.bannner-popover-ul{
  margin: 0;
  text-align: center;

  li{
      width: 115px;
      height: 45px;
      line-height: 45px;
      cursor: pointer;

      span{
        font-size: 15px;
        flex-shrink: 0;
      }
  }

  li:hover{
    background-color: #f2f5f6;
  }
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
// #region
// .slide-fade-enter-active {
//   transition: all .4s cubic-bezier(0.65, 0, 0.35, 1);
// }
// .slide-fade-leave-active {
//   transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
// }
// .slide-fade-enter, .slide-fade-leave-to
// /* .slide-fade-leave-active for below version 2.1.8 */ {
//   transform: translateY(120px);
//   opacity: 0;
// }

.mask-fade-enter-active {
  transition: all .4s cubic-bezier(0.65, 0, 0.35, 1);
}
.mask-fade-leave-active {
  transition: all .5s;
}
.mask-fade-enter, .mask-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
// #endregion

.footer{
  background-color: #f2f2f2;

  .footer-content{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 1000px;
    height: 500px;
    margin: 0 auto;
    padding: 100px;

    .footer-info{
      width: 140px;
      height: 300px;
    }

    .songs-link, .my-link{
      ul{
        position: relative;
        padding: 20px 0;

        .info-title{
          margin-bottom: 40px;
          font-size: 30px;
          font-weight: 500;
        }

        .info-link{
          display: block;
          height: 40px;
          line-height: 40px;
          margin-top: 10px;
          font-size: 18px;
          color: #999;
          cursor: pointer;
        }

        img{
          position: absolute;
          right: 0;
          width: 40px;
        }
      }
    }

    .other-link{

      ul{
        padding: 60px 0;

        .info-link{
          display: block;
          height: 40px;
          line-height: 40px;
          margin-top: 10px;
          font-size: 18px;
          color: #999;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
