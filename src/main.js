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
import { Input, Button, Icon, Select, message, Avatar, Popover, Carousel, Menu, Pagination } from 'ant-design-vue'
// import VueResource from 'vue-resource'
import * as getApi from '@/apis/NeteaseCloudMusicApi/index'

Vue.config.productionTip = false
Vue.prototype.$message = message
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
Vue.prototype.$http = getApi

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
