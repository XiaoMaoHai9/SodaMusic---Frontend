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
      <a-upload
        name="file"
        class="upload-btn"
        :multiple="true"
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76">
        <a-button><a-icon type="upload" /> 点击上传 </a-button>
      </a-upload>
    </div>
    <new-album-item class="album-item" v-for="item in libList" :data="item" :key="item.sid">
      <a-icon class="tools-icon" type="info-circle" :style="{fontSize: '25px'}" title="详情" @click="showCard(item.sid, 'detail')"/>
      <a-icon class="tools-icon" type="edit" :style="{fontSize: '25px', marginLeft: '15px'}" @click="showCard(item.sid, 'edit')" title="编辑"/>
      <a-icon class="tools-icon" type="cloud-download" :style="{fontSize: '25px', marginLeft: '15px'}" title="下载"/>
      <a-icon class="tools-icon" type="delete" :style="{fontSize: '25px', margin: '0 30px 0 15px'}" title="删除"/>
    </new-album-item>
    <a-pagination class="pagination" v-model="current" :total="50" show-less-items />
    <transition name="mask-fade">
      <song-detail-card v-if="detailFlag" @closeWindow="closeWindow()" :data="nowDetail"></song-detail-card>
    </transition>
    <transition name="mask-fade">
      <song-detail-edit-card v-if="editFlag" @closeWindow="closeWindow()" :data="nowDetail"></song-detail-edit-card>
    </transition>
    <div class="win-bk-mask mask-style-b" v-if="detailFlag || editFlag" @click="closeWindow()">
    </div>
  </div>
</template>

<script>
import NewAlbumItem from '@/components/found-page/AlbumItem.vue'
import SongDetailCard from '@/components/common/SongDetailCard.vue'
import SongDetailEditCard from '@/components/common/SongDetailEditCard.vue'
import { formatDetail } from '@/utils/format-data'
import axios from 'axios'

export default {
  components: { NewAlbumItem, SongDetailCard, SongDetailEditCard },
  name: 'MicManagePage',
  data () {
    return {
      libList: [],
      nowDetail: '',
      searchInfo: {
        song: '',
        singer: '',
        style: '',
        lang: ''
      },
      detailFlag: false,
      editFlag: false,
      pageSize: 20,
      current: 4
    }
  },

  watch: {
    pageSize (val) {
      console.log('pageSize', val)
    },
    current (val) {
      console.log('current', val)
    }
  },
  methods: {
    onShowSizeChange (current, pageSize) {
      console.log(current, pageSize)
    },

    // 获取乐库列表
    async getLibList () {
      const { data } = await axios({
        method: 'GET',
        url: 'http://localhost:3010/soda_music_lib'
      })
      this.libList = data.map(item => {
        return formatDetail(item)
      })
    },

    // 详情展示
    showCard (sid, type) {
      this.libList.forEach(item => {
        if (item.sid === sid) this.nowDetail = item
      })
      if (type === 'detail') this.detailFlag = true
      if (type === 'edit') this.editFlag = true
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
      /deep/ .ant-btn{
        height: 50px;
        background-color: #00b176;
        font-size: 16px;
        color: #fff;
      }
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
