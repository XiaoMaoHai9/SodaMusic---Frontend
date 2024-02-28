<template>
<div class="new-album-main">
    <!-- 左按钮 -->
    <transition name="turn-left-fade">
      <div class="turn-left turn-button" v-show="leftBtnShow"><a-icon type="left" :style="{fontSize: '50px'}" @click="turnLR('left')"/></div>
    </transition>
    <!-- 新歌列表主体 -->
    <div class="new-album-outer" v-if="data != []">
      <div class="new-ablum-inner"  :style="{ left: left + 'px'}">
        <ul class="new-album-list" v-for="(item, index) in data" :key="index">
          <new-album-item v-for="value in item.info" :key="value.id" :data="value"></new-album-item>
        </ul>
      </div>
    </div>
    <!-- 右按钮 -->
    <transition name="turn-right-fade">
      <div class="turn-right turn-button" v-show="rightBtnShow"><a-icon type="right" :style="{fontSize: '50px'}" @click="turnLR('right')"/></div>
    </transition>
</div>
</template>

<script>
import NewAlbumItem from '@/components/found-page/NewAlbumItem.vue'

export default {
  name: 'NewAblum',
  components: {
    NewAlbumItem
  },
  data () {
    return {
      left: 0,
      nowPage: 1,
      leftBtnShow: false,
      rightBtnShow: true
    }
  },
  props: [
    'data'
  ],
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
      if (this.nowPage >= 3) {
        // 隐藏右按钮
        this.rightBtnShow = false
      } else {
        // 否则显示按钮
        this.rightBtnShow = true
      }
    }
  },
  methods: {
    // 左右滑动
    turnLR (direction) {
      // 左滑
      // !!! 注意page的初始值是1
      if (direction === 'left') {
        this.left = this.left + 975
        this.nowPage--
      } else if (direction === 'right') {
        // 右滑
        this.left = this.left - 975
        this.nowPage++
      }
    }
  }
}
</script>

<style lang="less" scpoed>

// 左右跳转按钮 vue 过渡动画设置
// #region
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
// #endregion

.new-album-main{
  position: relative;
  margin-top: 10px;

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
    right: -65px;
  }

  .new-album-outer{
    position: relative;
    width: 960px;
    padding: 0 15px;
    overflow: hidden;
    box-sizing: content-box;

    .new-ablum-inner{
      position: relative;
      width: 1250%;
      transition: .5s;

      .new-album-list{
        display: flex;
        flex-direction: row;
        align-items: center;
        position: relative;
        height: 130px;
      }
    }

  }
}
</style>
