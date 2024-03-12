<template>
  <div class="manage-container">
    <new-album-item class="album-item" :data="info"></new-album-item>
    <new-album-item class="album-item" :data="info"></new-album-item>
    <new-album-item class="album-item" :data="info"></new-album-item>
    <new-album-item class="album-item" :data="info"></new-album-item>
    <new-album-item class="album-item" :data="info"></new-album-item>
    <new-album-item class="album-item" :data="info"></new-album-item>
    <new-album-item class="album-item" :data="info"></new-album-item>
    <new-album-item class="album-item" :data="info"></new-album-item>
    <a-pagination class="pagination" v-model="current" :total="50" show-less-items />
  </div>
</template>

<script>
import NewAlbumItem from '@/components/found-page/AlbumItem.vue'
export default {
  components: { NewAlbumItem },
  name: 'MicManagePage',
  data () {
    return {
      info: {
        imgUrl: '',
        name: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        singer: ['xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx']
      },
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
    }
  }
}
</script>

<style lang="less" scoped>
.manage-container{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
  padding: 15px;

  .album-item{
    width: 100%;
    margin: 15px;
  }

  .pagination{
    margin: 15px;
  }
}
</style>
