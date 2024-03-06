<template>
  <!-- 歌单组件 -->
  <li class="play-list br bs">
    <!-- 播放量 -->
    <span v-if="data.playCount" class="play-count mask-style-b"><a-icon type="caret-right" :style="{ marginRight: '2px'}"/>{{data.playCount}}</span>
    <!-- 封面蒙版 -->
    <div class="cover-mask mask-style-b" @click="getPlayListAllSongs(data.id)"></div>
    <!-- 封面 -->
    <div class="cover-container">
      <img class="list-cover" v-lazy="data.imgUrl + '?param=180y180'">
    </div>
    <!-- 歌单名 -->
    <div class="list-name-container">
      <span class="list-name">{{data.name}}</span>
    </div>
  </li>
</template>

<script>
export default {
  name: 'PlayList',
  props: ['data'],
  data () {
    return {
    }
  },
  methods: {
    getPlayListAllSongs (id) {
      this.$store.dispatch('getListAllSongs', { id: id })
    }
  }
}
</script>

<style lang="less" scoped>

.play-list{
  display: inline-block;
  position: relative;
  width: 180px;
  height: 250px;
  transition: .2s all;
  overflow: hidden;

  // 播放量样式
  .play-count{
    display: inline-block;
    position: absolute;
    top: 12px;
    right: 12px;
    height: 25px;
    line-height: 25px;
    padding: 0 10px 0 8px;
    text-align: center;
    border-radius: 20px;
    z-index: 2;
    color: #fff;
  }

  // 封面蒙版样式
  .cover-mask{
    position: absolute;
    width: 180px;
    height: 180px;
    z-index: 1;
    opacity: 0;
    transition: .3s all;
    cursor: pointer;
  }

  .cover-container{
    .lazy-img-container-mixins(180px, 180px);
    // 封面样式
    .list-cover{
      width: 180px;
      height: 180px;
      transition: .3s transform;
      z-index: 0;
    }
  }

  // 封面名样式
  .list-name-container{
    position: relative;
    height: 70px;
    overflow: hidden;
    z-index: 3;
    background-color: #fff;

    .list-name{
      display: -webkit-box;
      width: 152px;
      height: 46px;
      margin: 12px 14px;
      font-size: 15px;
      text-overflow: ellipsis; /* 文本溢出 --> 溢出部分转换为 ... */
      overflow:hidden; /* 配合 text-over 使用 */
      -webkit-box-orient: vertical; /* 垂直排列 */
      -webkit-line-clamp: 2; /* 超出几行省略 */
    }
  }

}

// 歌单主体覆盖
.play-list:hover{

  .cover-mask{
    opacity: .4;
  }

  .list-cover{
    transform: scale(1.1);
  }
}

</style>
