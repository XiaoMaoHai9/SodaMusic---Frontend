<template>
  <div class="play-list-main">
    <!-- 左按钮 -->
    <transition name="turn-left-fade">
      <div class="turn-left turn-button" v-show="leftBtnShow"><a-icon type="left" :style="{fontSize: '50px'}" @click="turnLR('left')"/></div>
    </transition>
    <!-- 歌单切换框架 -->
    <div class="play-lists-outer">
      <ul class="play-lists" :style="{ left: left + '%'}">
        <!-- 歌单主体 -->
        <play-list-item
          v-for="(item) in data" :key="item.id"
          :data="item"
          :style="{ marginRight: '15px'}"
        ></play-list-item>
      </ul>
    </div>
    <!-- 右按钮 -->
    <transition name="turn-right-fade">
      <div class="turn-right turn-button" v-show="rightBtnShow"><a-icon type="right" :style="{fontSize: '50px'}" @click="turnLR('right')"/></div>
    </transition>
  </div>
</template>

<script>
import PlayListItem from '@/components/found-page/PlayListItem.vue'

export default {
  name: 'PlayList',
  components: {
    PlayListItem
  },
  props: [
    'data'
  ],
  data () {
    return {
      left: 0,
      ListPageArr: [],
      nowPage: 1,
      leftBtnShow: false,
      rightBtnShow: true
    }
  },
  computed: {},
  watch: {
    // 监控 left值的变化
    left () {
      // 位于初始位置
      if (this.nowPage <= 1) {
        // 隐藏左按钮
        this.leftBtnShow = false
      } else {
        // 否则显示按钮
        this.leftBtnShow = true
      }

      // 位于默位置
      if (this.nowPage >= this.ListPageArr.length) {
        // 隐藏右按钮
        this.rightBtnShow = false
      } else {
        // 否则显示按钮
        this.rightBtnShow = true
      }
    },

    // 监控页数的变化
    nowPage () {
      // 如果到了最后一页，页数组逆位
      if (this.nowPage === this.ListPageArr.length) {
        this.ListPageArr.reverse()
      } else if (this.nowPage === 1) {
        // 如果回到第一页，则重新正位
        this.ListPageArr.reverse()
      }
    },

    // 监控父亲传来的data
    data () {
      // 获取每页的歌单数 --> 满页为5个歌单
      this.getListPageArr()
    }
  },
  methods: {
    // 左右滑动
    turnLR (direction) {
      // 左滑
      // !!! 注意page的初始值是1
      if (direction === 'left') {
        this.left = this.left + 20 * this.ListPageArr[this.nowPage - 1 - 1]
        this.nowPage--
      } else if (direction === 'right') {
        // 右滑
        this.left = this.left - 20 * this.ListPageArr[this.nowPage - 1 + 1]
        this.nowPage++
      }
    },

    // 歌单页数数组 --> 用来存储每页的歌单数
    getListPageArr () {
      const arr = []
      // 满页的个数
      const fullPageNum = Math.floor(this.data.length / 5)
      // 最后一页里有多少个
      const endPage = this.data.length % 5
      for (let i = 0; i < fullPageNum; i++) {
        arr.push(5)
      }
      if (endPage !== 0) {
        arr.push(endPage)
      }
      this.ListPageArr = arr
    }
  }
}
</script>

<style lang="less" scoped>

.turn-left-fade-enter-active {
  transition: all .2s cubic-bezier(1.0, 0.8, 0.5, 1.0);
}
.turn-left-fade-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.turn-left-fade-enter, .turn-left-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(-20px);
  opacity: 0;
}

.turn-right-fade-enter-active {
  transition: all .2s cubic-bezier(1.0, 0.8, 0.5, 1.0);
}
.turn-right-fade-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.turn-right-fade-enter, .turn-right-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(20px);
  opacity: 0;
}

.play-list-main{
  position: relative;
  margin: 20px 0 0 0;

  .turn-button{
  position: absolute;
  top: 100px;
  z-index: 2;
  cursor: pointer;
  }

  .turn-left{
    left: -80px;
  }

  .turn-right{
    right: -80px;
  }

  .play-lists-outer{
    width: 975px;
    overflow: hidden;

    .play-lists{
      display: block;
      position: relative;
      width: 1250%;
      transition: .5s;
    }
  }
}

</style>
