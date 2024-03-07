<template>
  <div>
    <!-- 轮播图 -->
    <a-carousel arrows autoplay>
      <!-- 左跳转按钮 -->
      <div slot="prevArrow" class="custom-slick-arrow br" style="left: 20px; z-index: 1">
        <a-icon type="arrow-left"/>
      </div>
      <!-- 右跳转按钮 -->
      <div slot="nextArrow" class="custom-slick-arrow br" style="right: 20px">
        <a-icon type="arrow-right" />
      </div>
      <!-- 轮播内容 -->
      <div v-for="item in banners" :key="item.targetId" :style="{backgroundImage: `url(&quot;${item.imageUrl}?imageView&blur=40x20&quot;)`, backgroundRepeat: 'no-repeat', backgroundSize: '11000px', backgroundPosition: 'center center'}">
        <a :href="item.url" @click="getBannerSong({id :item.targetId, typeTitle: item.typeTitle, url: item.url})"><img :src="item.imageUrl" :style="{ height: '355px', margin: '0 auto'}"></a>
      </div>
    </a-carousel>
    <!-- 主容器 -->
    <div class="container-main">
      <!-- 推荐歌单 -->
      <div class="play-lists-container containers">
        <div :style="{ fontSize: '25px'}">推荐歌单<a-icon type="double-right"/></div>
        <!-- 推荐歌单主体 -->
        <play-list :data="playList"></play-list>
      </div>
      <!-- 新碟上架 -->
      <div class="new-album-container containers" :style="{ width: '990px'}">
        <div :style="{ fontSize: '25px', marginLeft: '15px'}">新碟上架<a-icon type="double-right"/></div>
        <new-album :data="newAlbumList"></new-album>
      </div>
      <!-- 排行榜 -->
      <div class="top-lists-container containers">
        <div :style="{ fontSize: '25px'}">排行榜<a-icon type="double-right"/></div>
        <top-list-item :data="topLists"></top-list-item>
      </div>
      <!-- 最新MV -->
      <div class="mv-container containers">
        <div :style="{ fontSize: '25px'}">最新MV<a-icon type="double-right"/></div>
          <mv-list-item :data="mvLists"></mv-list-item>
        </div>
    </div>
  </div>
</template>

<script>
import PlayList from '@/components/found-page/PlayList.vue'
import NewAlbum from '@/components/found-page/NewAblum.vue'
import TopListItem from '@/components/found-page/TopLists.vue'
import MvListItem from '@/components/found-page/MvLists.vue'
import { mapActions, mapState } from 'vuex'

import { cleanSongForWY, cleanAlbumForWY, cleanPlaylist, changePlayCount } from '@/utils/index/formant-data-wy'

export default {
  name: 'FoundMusic',
  components: {
    PlayList,
    NewAlbum,
    TopListItem,
    MvListItem
  },
  data () {
    return {
      banners: [],
      playList: [],
      newAlbumList: [
        {
          row: 1,
          info: []
        },
        {
          row: 2,
          info: []
        }
      ],
      topLists: {
        lists: [],
        hasSongs: false
      },
      mvLists: []
    }
  },
  watch: {
    isLogin () {
      this.getPersonalized()
    },

    topLists: {
      // 开启深度监测 --> 复杂数据类型
      deep: true,
      handler (newValue) {
        if (this.topLists.lists[0].songs) {
          this.topLists.hasSongs = true
        }
      }
    }
  },
  computed: {
    ...mapState(['isLogin'])
  },
  methods: {
    ...mapActions(['checkMusic', 'getListAllSongs', 'getAlbumAllSongs', 'getMvUrl']),
    // 获取轮播图
    async getBanner () {
      try {
        const { data: res } = await this.$http.foundPage.getBanner()

        if (res.code !== 200) {
          return this.$message.error('数据请求失败')
        }

        this.banners = res.banners
      } catch (error) {
        console.log(error)
      }
    },

    // 获取推荐歌单
    async getPersonalized () {
      let res = null
      // 已登录
      if (this.$store.state.isLogin) {
        res = await this.$http.foundPage.getRecommendRes()
        const newRes = res.data.recommend.map(item => cleanPlaylist(item))
        this.playList = changePlayCount(newRes)
      } else { // 未登录
        res = await this.$http.foundPage.getPersonalized({ limit: 13 })
        const newRes = res.data.result.map(item => cleanPlaylist(item))
        this.playList = changePlayCount(newRes)
      }
    },

    // 获取新碟数据
    async getNewAlbum () {
      const list1 = []
      const list2 = []
      // 请求新碟上架列表
      const { data } = await this.$http.foundPage.getNewAlbum({ area: 'ALL', limit: '18' })
      // 清洗列表数据
      const newData = data.albums.map(item => cleanAlbumForWY(item))
      // 列表分栏
      newData.forEach((item, index) => {
        if (index < data.albums.length / 2) {
          list1.push(item)
        } else {
          list2.push(item)
        }
      })
      this.newAlbumList[0].info = list1
      this.newAlbumList[1].info = list2
    },

    // 获取所有榜单
    async getTopLists () {
      const { data } = await this.$http.foundPage.getTopList()
      // 数据整理 -> 取前5作为展示
      data.list.slice(0, 5).forEach(item => {
        this.topLists.lists.push({
          id: item.id,
          name: item.name,
          songs: []
        })
      })

      this.topLists.lists.forEach((item, index) => {
        this.getPlayList(item.id).then(value => {
          this.topLists.lists[index].songs = value
        })
      })
    },

    // 获取歌单所有歌曲
    async getPlayList (value) {
      const { data } = await this.$http.foundPage.getPlayList({ id: value, limit: '3', offset: '0' })
      return data.songs.map(item => cleanSongForWY(item))
    },

    // 获取最新MV
    async getNewMv () {
      const { data } = await this.$http.foundPage.getNewMv({ area: 'all', limit: '10' })
      changePlayCount(data.data)
      this.mvLists = data.data
    },

    // 显示推荐歌单翻页按钮
    turnButtonShow (showState) {
      document.querySelectorAll('.turn-button').forEach((item) => {
        item.style.display = showState
      })
    },

    // 获取音乐
    async getBannerSong ({ id, typeTitle, url }) {
      // 如果自带超链接 -> 返回
      if (url) return false
      /*
        歌单推荐：歌单
        独家策划：视频
        热碟推荐：专辑
        新碟首发：专辑
        新歌首发：单曲
        热歌推荐：单曲
      */
      // 判断 banner资源类型
      if (typeTitle === '新歌首发' || typeTitle === '热歌推荐') {
        // 检查播放列表是否已存在该歌曲
        const { isHas, arrIndex } = this.$store.getters.songIsExist(id)
        // 如果该歌曲已在播放列表
        if (isHas) {
        // 如果歌曲已在末尾
          if (arrIndex === this.$store.state.audioPlayer.songsList.length - 1) {
          // 重新播放
            this.$store.commit('changePlayNow', 'replay')
            return
          }
          // 歌曲置尾
          this.$store.commit('endSong', arrIndex)
          // 切歌
          this.$store.commit('changePlayNow', 'end')
          return
        }

        //  检查歌曲是否可用
        this.checkMusic({ id: id }).then(res => {
          if (res.success) return this.$store.dispatch('getSongDetail', id)
          else {
            this.$message.warning(res.message)
            return false
          }
        }).catch(error => {
          console.log(error)
        })
      } else if (typeTitle === '热碟推荐' || typeTitle === '新碟首发') {
        this.getAlbumAllSongs({ id: id })
      } else if (typeTitle === '歌单推荐') {
        this.getListAllSongs({ id: id })
      } else if (typeTitle === '独家策划') {
        this.getMvUrl({ id: id, r: '1080' })
      }
    }
  },
  created () {
    this.getBanner()
    this.getPersonalized()
    this.getNewAlbum()
    this.getTopLists()
    this.getNewMv()
  },
  activated () {
    console.log('actived 激活 → 进入页面')
  },
  deactivated () {
    console.log('deactived 失活 → 离开页面')
  }
}
</script>

<style lang="less" scoped>

// 轮播图样式
.ant-carousel{
  /deep/ .slick-slide {
    text-align: center;
    height: 355px;
    line-height: 350px;
    overflow: hidden;
  }

  /deep/ .custom-slick-arrow {
  width: 70px;
  height: 200px;
  line-height: 200px;
  text-align: center;
  top: 50%;
  margin-top: -100px;
  font-size: 50px;
  color: #fff;
  background-color:rgba(64,64,64,0.25);
  backdrop-filter: saturate(150%) blur(10px);
  opacity: 0.6;
  transition: .4s;
}

  /deep/.custom-slick-arrow:before {
    display: none;
  }

  /deep/ .custom-slick-arrow:hover {
  opacity: 1;
  }
}

.container-main{
  width: 1000px;
  margin: 0 auto;
  // padding: 0 20px 20px 20px;

  .containers{
    position: relative;
    width: 960px;
    // margin-top: 20px;
    margin: 20px auto 0 auto;
  }

  .mv-container{
    margin-bottom: 20px;
  }
}
</style>
