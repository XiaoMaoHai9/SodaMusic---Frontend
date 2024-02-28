<template>
  <!-- mv组件 -->
  <div class="mv-lists-main">
    <ul class="mv-lists-outer">
      <li class="mv-item br bs" v-for="item in data" :key="item.id">
        <div class="mv-cover-mask br mask-style-b" @click="getUrl(item.id)">
          <a-icon type="caret-right" class="play-icon" title="播放"/>
        </div>
        <div class="mv-cover-container">
          <img class="mv-cover" v-lazy="item.cover + '?param=360y240'">
        </div>
        <!-- 播放量 -->
        <span v-if="item.playCount || item.playcount" class="play-count mask-style-b"><a-icon type="caret-right" :style="{ marginRight: '2px'}"/>{{item.playCount || item.playcount}}</span>
        <div class="mv-info">
          <span class="sing-name">{{item.name}}</span>
          <span class="singer">{{item.artistName}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MvLists',
  data () {
    return {}
  },
  props: [
    'data'
  ],
  methods: {
    getUrl (id) {
      this.$store.dispatch('getMvUrl', { id: id, r: '1080' })
    }
  }
}
</script>

<style lang="less" scoped>

  .mv-lists-main{
    margin: 20px 0 0 0;

    .mv-lists-outer{
      display: flex;
      flex-direction: row;
      align-items: center;
      text-align: center;
      justify-content: space-between;
      flex-wrap: wrap;

      .mv-item{
        position: relative;
        width: 180px;
        height: 175px;
        margin-bottom: 20px;
        overflow: hidden;
        transition: .4s;
        cursor: pointer;

        .mv-cover-mask{
          position: absolute;
          width: 180px;
          height: 120px;
          line-height: 120px;
          text-align: center;
          z-index: 3;
          opacity: 0;
          transition: .2s;

          .play-icon{
            font-size: 40px;
            color: #fff;
            vertical-align: middle;
            transition: .2s;

            &:hover{
              font-size: 50px;
            }
          }
        }

        .mv-cover-container{
          .lazy-img-container-mixins(180px, 120px);
          z-index: 1;

          .mv-cover{
            width: 180px;
            height: 120px;
          }
        }

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

        .mv-info{
          display: flex;
          align-items: flex-start;
          flex-direction: column;
          justify-content: space-evenly;
          width: 180px;
          height: 55px;
          padding: 0 15px;
          transition: .4s;
          background-color: #fff;

          .sing-name, .singer{
            width: 150px;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      .mv-item:hover{
          .mv-cover-mask{
            opacity: 1;
          }

          .mv-info{
            color: #000;
          }
      }
    }
  }
</style>
