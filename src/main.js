import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import VueLazyload from 'vue-lazyload'

import '@/assets/css/common.css'
import '@/assets/css/antd-personal.less'

// 按需引入：babel-plugin-import会帮你转换为import Input from 'ant-design-vue/lib/input'
import { Input, Button, Icon, Select, message, Avatar, Popover, Carousel, Menu, Pagination, Upload, Modal } from 'ant-design-vue'
// import VueResource from 'vue-resource'
import * as neteasecloudApi from '@/apis/NeteaseCloudMusicApi/index'
import * as sodamusicApi from '@/apis/SodaMusicApi/index'

// 读取本地信息 -> 进行存储
if (window.sessionStorage.isLogin_thirdPart) {
  store.commit('changeLoginState', { data: window.sessionStorage.getItem('isLogin_thirdPart'), platform: 'neteasecloud' })
}
if (window.sessionStorage.userInfo_neteasecloud) {
  store.commit('setUserInfo', { data: JSON.parse(window.sessionStorage.getItem('userInfo_neteasecloud')), platform: 'neteasecloud' })
}
if (window.localStorage.isLogin_sodamusic) {
  store.commit('changeLoginState', { data: window.localStorage.getItem('isLogin_sodamusic'), platform: 'sodamusic' })
}
if (window.localStorage.userInfo_sodamusic) {
  store.commit('setUserInfo', { data: JSON.parse(window.localStorage.getItem('userInfo_sodamusic')), platform: 'sodamusic' })
}

// 路由全局前置守卫 -> 进行路由拦截
router.beforeEach((to, from, next) => {
  if (to.name === 'MicManagePage' && !store.state.sodaAccount.isLogin) {
    next({ path: '/found' })
    // 开启登录窗口
    store.commit('changeLoginFlag', true)
    message.warn('请登录苏打账号！')
  } else {
    next()
  }
})

Vue.config.productionTip = false
Vue.prototype.$message = message
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$video = videojs

message.config({
  top: '35px',
  duration: 3,
  maxCount: 3
})

Vue.use(Input)
Vue.use(Button)
Vue.use(Icon)
Vue.use(Select)
Vue.use(Avatar)
Vue.use(Popover)
Vue.use(Carousel)
Vue.use(Menu)
Vue.use(Pagination)
Vue.use(Upload)

// 图片懒加载
// 导入加载、失败图片
const loadimage = require('@/assets/images/common/loading_static.png')
const errorimage = require('@/assets/images/common/error_square.png')

// 配置懒加载
Vue.use(VueLazyload, {
  preLoad: 1.3, // 预加载的宽高比
  error: errorimage, // 图片加载状态下显示的图片
  loading: loadimage, // 图片加载失败时显示的图片
  attempt: 1 // 加载错误后最大尝试次数
})

// Vue.use(VueResource)
Vue.prototype.$http = {
  neteasecloudApi,
  sodamusicApi
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
