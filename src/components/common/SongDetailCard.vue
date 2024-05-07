<template>
    <div class="detail-container br win-position bs">
      <!-- 关闭按钮 -->
      <a-icon class="close-circle" type="close-circle" theme="twoTone" :style="{fontSize: '25px'}" twoToneColor="#0075c2" @click="closeWindow"/>
      <div class="card-title">歌曲详情</div>
      <!-- 内容区域 -->
      <div class="detail-content-area">
        <div class="content-item">歌名： {{ data.song_name }}</div>
        <div class="content-item">歌手： {{ data.singer.join(' / ') }}</div>
        <div class="content-item">歌曲时长： {{ data.duration }}</div>
        <div class="content-item">语言： {{ data.language }}</div>
        <div class="content-item">风格： {{ data.style_name.join(' / ') }}</div>
        <div class="content-item">添加时间： {{ new Date(data.add_date).toLocaleString() }}</div>
      </div>
    </div>
  </template>

<script>
export default {
  name: 'SongDetailCard',
  data () {
    return {
      songDetail: ''
    }
  },
  props: ['data'],
  methods: {
    // 关闭登录弹窗
    closeWindow () {
      this.$emit('closeWindow')
    }
  },
  created () {}
}
</script>

<style lang="less" scoped>

.detail-container{
  padding: 30px;
  background-color: #fff;

  .close-circle{
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }

  .card-title{
    padding-left: 15px;
    font-size: 38px;
    font-weight: 600;
  }

  .detail-content-area{
    margin-top: 30px;
    .content-item{
      min-width: 260px;
      height: 70px;
      line-height: 40px;
      padding: 15px 50px 15px 30px;
      margin: 0 15px;
      border-top: 1px solid #f4f4f4;
      font-size: 17px;

      &:hover{
        background-color: #f8faf7;
        border-radius: 15px;
      }
    }
  }
}
</style>
