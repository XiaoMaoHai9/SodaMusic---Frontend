<template>
  <div class="manage-container">
    <!-- <span>歌曲管理</span> -->
    <div class="search-container">
      <!-- 条件索引 -> 歌曲名 -->
      <a-input class="input-search" name="search-song" size="large" :allowClear="true" placeholder="歌曲名" v-model="searchInfo.song" autocomplete="off"/>
      <!-- 条件索引 -> 歌手名 -->
      <a-input class="input-search" name="search-singer" size="large" :allowClear="true" placeholder="歌手名" v-model="searchInfo.singer" autocomplete="off"/>
      <!-- 条件索引 -> 歌曲风格 -->
      <a-input class="input-search" name="search-style" size="large" :allowClear="true" placeholder="歌曲风格" v-model="searchInfo.style" autocomplete="off"/>
      <!-- 条件索引 -> 歌曲语言 -->
      <a-input class="input-search" name="search-lang" size="large" :allowClear="true" placeholder="歌曲语言" v-model="searchInfo.lang" autocomplete="off"/>
    </div>
    <div class="btn-area">
      <a-button :style="{width: '90px', marginRight: '15px'}" type="primary" size="large">搜索</a-button>
      <a-button class="upload-btn" type="primary" size="large" @click="showCard({type: 'update'})" title="点击上传"><a-icon type="upload"/> 歌曲上传 </a-button>
    </div>
    <new-album-item class="album-item" v-for="item in libList.songList[libList.pageNow - 1]" :data="item" :cardMode="cardMode" :key="item.sid">
      <a-icon class="tools-icon" type="info-circle" :style="{fontSize: '25px'}" title="详情" @click="showCard({ sid: item.sid, type: 'detail'})"/>
      <a-icon class="tools-icon" type="edit" :style="{fontSize: '25px', marginLeft: '15px'}" @click="showCard({ sid: item.sid, type: 'edit'})" title="编辑"/>
      <a-icon class="tools-icon" type="cloud-download" :style="{fontSize: '25px', marginLeft: '15px'}" title="下载" @click="downloadFile(item)"/>
      <a-icon class="tools-icon" type="delete" :style="{fontSize: '25px', margin: '0 30px 0 15px'}" title="删除" @click="showConfirm({lid: $store.state.sodaAccount.userInfo.lid, sid: item.sid})"/>
    </new-album-item>
    <a-pagination class="pagination" v-model="libList.pageNow" :pageSize="libList.pageSize" hideOnSinglePage :total="libList.songNum"/>
    <transition name="mask-fade">
      <song-detail-card v-if="detailFlag" @closeWindow="closeWindow()" :data="nowDetail"></song-detail-card>
    </transition>
    <transition name="mask-fade">
      <song-detail-edit-card v-if="editFlag" @closeWindow="closeWindow" @refreshLibList="getLibList" :data="nowDetail" :cardMode="cardMode"></song-detail-edit-card>
    </transition>
    <div class="win-bk-mask mask-style-b" v-if="detailFlag || editFlag" @click="closeWindow()">
    </div>
  </div>
</template>

<script>
import NewAlbumItem from '@/components/found-page/AlbumItem.vue'
import SongDetailCard from '@/components/common/SongDetailCard.vue'
import SongDetailEditCard from '@/components/common/SongDetailEditCard.vue'
import axios from 'axios'

export default {
  components: { NewAlbumItem, SongDetailCard, SongDetailEditCard },
  name: 'MicManagePage',
  data () {
    return {
      libList: {
        pageNow: 1, // 当前页数
        pageSum: 10, // 总页数
        pageSize: 5, // 每页数量
        songNum: 50, // 总数量
        songList: [] // 歌曲列表
      },
      nowDetail: '',
      searchInfo: {
        song: '',
        singer: '',
        style: '',
        lang: ''
      },
      detailFlag: false,
      editFlag: false,
      cardMode: ''
    }
  },

  watch: {
    'libList.pageSize' (val) {
      console.log('pageSize', val)
    },
    'libList.pageNow' (val) {
      console.log('current', val)
    }
  },
  methods: {
    // 获取乐库列表
    async getLibList () {
      const { data } = await this.$http.sodamusicApi.getSongLib(this.$store.state.sodaAccount.userInfo.lid)
      this.libList.songNum = data.data.length
      data.data.forEach((item, index) => {
        const page = Math.floor(index / 5)
        if (!this.libList.songList[page]) {
          this.libList.songList[page] = []
        }
        this.libList.songList[page].push(item)
      })
      this.libList.pageSum = this.libList.songList.length
    },

    // 详情展示
    showCard ({ sid, type }) {
      if (type === 'update') {
        this.cardMode = 'update'
        this.editFlag = true
        return
      }

      this.libList.forEach(item => {
        if (item.sid === sid) this.nowDetail = item
      })

      if (type === 'detail') this.detailFlag = true
      if (type === 'edit') {
        this.cardMode = 'edit'
        this.editFlag = true
      }
    },

    // 下载
    downloadFile (info) {
      axios({
        url: info.file_url,
        method: 'get',
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json;application/octet-stream',
          'Cache-Control': 'no-cache'
        }
      }).then((response) => {
        // 分隔出文件名
        const fileName = info.file_url.split('/').pop()
        const blob = new Blob([response.data])
        const downloadElement = document.createElement('a')
        // 创建一个指向传入 Blob 对象的 URL
        const href = window.URL.createObjectURL(blob)
        downloadElement.href = href
        downloadElement.download = fileName
        document.body.appendChild(downloadElement)
        downloadElement.click()
        window.URL.revokeObjectURL(href)
        document.body.removeChild(downloadElement)
      }).catch(() => {
        this.$message.error('下载失败~ 请稍后再试 ！')
      })
    },

    // 弹窗提醒
    showConfirm (info) {
      const this_ = this
      this_.$confirm({
        okText: '确认',
        cancelText: '取消',
        title: '请确定是否删除该音乐?',
        content: '当点击确认后，你将永远失去这首歌曲~',
        onOk () {
          return new Promise((resolve, reject) => {
            setTimeout(this_.deleteSong(info) ? resolve : reject, 100)
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel () {}
      })
    },

    // 歌曲删除
    async deleteSong (info) {
      const { data } = await this.$http.sodamusicApi.deleteSong(info)
      if (data.code === 200) {
        this.closeWindow()
        this.getLibList()
        this.$message.success(data.msg)
        return true
      } else {
        this.$message.error(data.msg)
        return false
      }
    },

    // 关闭窗口
    closeWindow () {
      // 关闭详情窗口
      if (this.detailFlag) this.detailFlag = false
      // 关闭编辑窗口
      if (this.editFlag) this.editFlag = false
    }
  },
  created () {
    this.getLibList()
  }
}
</script>

<style lang="less" scoped>
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

.manage-container{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
  padding: 15px;
  .search-container{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    padding: 15px;
    .input-search{
      width: 100%;
      margin: 15px 0;
    }
  }

  .btn-area{
    display: flex;
    width: 100%;
    padding: 0 15px 15px 15px;
    .upload-btn{
      height: 50px;
      background-color: #00b176;
      font-size: 16px;
      color: #fff;
    }
  }

  .album-item{
    width: 100%;
    margin: 15px;
  }

  .pagination{
    margin: 15px;
  }
}
</style>
