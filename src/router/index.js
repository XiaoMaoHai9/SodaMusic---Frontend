import Vue from 'vue'
import VueRouter from 'vue-router'

// import IndexPage from '@/views/index/IndexPage.vue'

Vue.use(VueRouter)

const routes = [
  // {
  // path: '/',
  // // 路由懒加载 -> 分块为 group-index
  // component: IndexPage,
  // redirect: '/found',
  // children: [

  // 默认重定向
  {
    path: '/',
    redirect: '/found'
  },
  {
    name: 'FoundMusic',
    path: '/found',
    // 路由懒加载 -> 分块为 group-found
    component: () => import(/* webpackChunkName: "group-found" */ '@/views/index/FoundPage.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    name: 'MusicLibPage',
    path: '/myMicLib',
    redirect: '/myMicLib/libIndex',
    // 路由懒加载 -> 分块为 group-lib
    component: () => import(/* webpackChunkName: "group-lib" */'@/views/index/MyMusicLibPage.vue'),
    meta: {
      keepAlive: true
    },
    // 二级路由
    children: [
      {
        name: 'LibIndexPage',
        path: 'libIndex',
        // 路由懒加载 -> 分块为 group-lib
        component: () => import(/* webpackChunkName: "group-lib-index" */'@/views/musicLib/LibIndexPage.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        name: 'MicManagePage',
        path: 'micMangage',
        // 路由懒加载 -> 分块为 group-lib
        component: () => import(/* webpackChunkName: "group-lib-index" */'@/views/musicLib/MicManagePage.vue'),
        meta: {
          keepAlive: true
        }
      },
      {
        name: 'SettingPage',
        path: 'setting',
        // 路由懒加载 -> 分块为 group-lib
        component: () => import(/* webpackChunkName: "group-lib-index" */'@/views/musicLib/SettingPage.vue'),
        meta: {
          keepAlive: true
        }
      }
    ]
  },
  {
    name: 'download',
    path: '/download',
    // 路由懒加载 -> 分块为 group-download
    component: () => import(/* webpackChunkName: "group-download" */'@/views/MyDownPage.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    name: 'mymusic',
    path: '/mymusic',
    // 路由懒加载 -> 分块为 group-mymic
    component: () => import(/* webpackChunkName: "group-mymic" */'@/views/MyMusicPage.vue'),
    meta: {
      keepAlive: true
    }
  }
  // ]
  // }
]

const router = new VueRouter({
  routes
})

export default router
