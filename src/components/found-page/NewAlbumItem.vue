<template>
  <div class="new-album bs"  @mouseenter="getIsEnter('enter')" @mouseleave="getIsEnter('leave')">
    <div class="new-album-cover-container br">
      <img class="album-cover lazy-img" v-lazy="data.imgUrl + '?param=90y90'" @click="playAlbum({id: data.id})">
    </div>
    <div class="album-info">
      <span class="album-name">{{data.name}}</span>
      <span class="singer-name">{{data.singer.join(' / ')}}</span>
    </div>
    <div class="other-tools" v-show="isEnter">
      <a-icon class="tools-icon" type="heart" :style="{fontSize: '25px'}"/>
      <a-icon class="tools-icon" type="download" :style="{fontSize: '25px', margin: '0 15px'} "/>
      <a-icon class="tools-icon" type="ellipsis" :style="{fontSize: '25px'}"/>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'NewAlbum',
  data () {
    return {
      isEnter: false
    }
  },
  props: [
    'data'
  ],
  methods: {
    ...mapActions(['checkMusic']),

    getIsEnter (data) {
      if (data === 'enter') {
        this.isEnter = true
      } else {
        this.isEnter = false
      }
    },

    // 播放专辑
    async playAlbum (info) {
      // 获取歌曲详情
      this.$store.dispatch('getAlbumAllSongs', info)
    }
  }
}
</script>

<style lang="less" scoped>

.new-album{
  display: flex;
  width: 310px;
  height: 110px;
  // margin-left: 15px;
  margin-right: 15px;
  padding: 10px;
  border-radius: 14px;
  transition: .4s;

  .new-album-cover-container{
    .lazy-img-container-mixins(90px, 90px);
    margin-right: 15px;

    .album-cover{
      width: 90px;
      height: 90px;
      cursor: pointer;
    }
  }

  .album-info{
    display: block;
    width: 185px;
    height: 90px;
    font-size: 0;
    padding: 15px 0;

    .album-name, .singer-name{
      display: inline-block;
      width: 190px;
      height: 30px;
      line-height: 30px;
      font-size: 20px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space:nowrap;
    }
    .singer-name{
      color: #9a9fa9;
    }
  }

  .other-tools{
    width: 105px;
    height: 90px;
    line-height: 90px;
    text-align: center;

    .tools-icon{
      vertical-align: middle;
      color: #999;
      transition: all 0.2s;
    }

    .tools-icon:hover{
      color: rgba(0, 0, 0, 0.65);
    }
  }
}

.new-album:hover{
  background-color: #FAFAFA;
  .album-info,.album-name, .singer-name{
    width: 80px;
  }
}
</style>
