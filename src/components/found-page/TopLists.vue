<template>
  <div class="top-lists-main">
    <ul class="top-lists-outer" v-if="data != []">
      <li class="top-item br bs" v-for="(item, index) in data.lists" :key="item.id" :style="{backgroundColor : bgColor[index]}">
        <div class="bg-cover br mask-style-b">
          <a-icon class="to-play" type="play-circle" theme="filled" title="播放" @click="getPlayListAllSongs(item.id)"/>
        </div>
        <span class="top-name">{{item.name}}</span>
        <ul class="top-lists" v-if="data.hasSongs">
          <li v-for="(list, num) in item.songs" :key="list.id" :style="{marginTop: '10px'}">
            <div class="song-name">{{num + 1}}&nbsp;&nbsp;&nbsp;{{list.name}}</div>
            <div class="singer">{{list.singer.join(' / ')}}</div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TopLists',
  data () {
    return {
      bgColor: [
        '#B44645',
        '#E4B766',
        '#E59D69',
        '#286F99',
        '#93965E'
      ]
    }
  },
  props: [
    'data'
  ],
  methods: {
    getPlayListAllSongs (id) {
      this.$store.dispatch('getListAllSongs', { id: id })
    }
  },
  created () {
  }
}
</script>

<style lang='less' scoped>

  @font-face {
    font-family: 'SmileySans';
    src: url('@/assets/fonts/common/SmileySans-Oblique.ttf');
  }

  .top-lists-main{
    margin-top: 20px;

    .top-lists-outer{
      display: flex;
      flex-direction: row;
      align-items: center;
      text-align: center;
      justify-content: space-between;

      .top-item{
        position: relative;
        width: 180px;
        height: 300px;
        overflow: hidden;
        z-index: 1;
        cursor: pointer;

        .bg-cover{
          position: absolute;
          width: 180px;
          height: 300px;
          line-height: 300px;
          z-index: 2;
          opacity: 0;
          transition: .4s;
        }

        .to-play{
          font-size: 50px;
          color: #fff;
          vertical-align: middle;
          transition: .2s;
        }

        .to-play:hover{
          font-size: 60px;
        }

        .top-name{
          position: relative;
          display: inline-block;
          width: 160px;
          height: 75px;
          line-height: 75px;
          margin-top: 20px;
          font-family: 'SmileySans';
          text-align: center;
          word-break: break-word; // 当前单词在宽度内无法展示，整个单词换行展示
          color: #fff;
          font-size: 30px;
        }

        .top-lists{
          position: relative;
          display: inline-block;
          padding: 0 20px;
          font-size: 16px;
          color: #fff;
          text-align: left;

          .song-name, .singer{
            .textover-ellipsis()
          }

          .song-name{
            width: 120px;
          }

          .singer{
            width: 120px;
            text-indent: 20px;
          }
        }
      }

      .top-item:hover{
        .bg-cover, .to-play{
          opacity: 1;
        }
      }
    }
  }

</style>
