import Vue from 'vue'
import VueRouter from 'vue-router'

import IndexPage from '@/views/index/IndexPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // 路由懒加载 -> 分块为 group-index
    component: IndexPage,
    redirect: '/found',
    children: [
      {
        name: 'found',
        path: '/found',
        // 路由懒加载 -> 分块为 group-found
        component: () => import(/* webpackChunkName: "group-found" */ '@/views/index/FoundPage.vue')
      },
      {
        name: 'myMicLib',
        path: '/myMicLib',
        // 路由懒加载 -> 分块为 group-lib
        component: () => import(/* webpackChunkName: "group-lib" */'@/views/MyMusicLibPage.vue')
      },
      {
        name: 'download',
        path: '/download',
        // 路由懒加载 -> 分块为 group-download
        component: () => import(/* webpackChunkName: "group-download" */'@/views/MyDownPage.vue')
      },
      {
        name: 'mymusic',
        path: '/mymusic',
        // 路由懒加载 -> 分块为 group-mymic
        component: () => import(/* webpackChunkName: "group-mymic" */'@/views/MyMusicPage.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
