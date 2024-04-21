<template>
  <div class="edit-container br win-position bs">
    <!-- 关闭按钮 -->
    <a-icon class="close-circle" type="close-circle" theme="twoTone" :style="{fontSize: '25px'}" twoToneColor="#0075c2" @click="closeWindow"/>
    <div class="card-title">详情编辑</div>
    <!-- 内容区域 -->
    <div class="edit-content-area">
      <div class="content-item">
        <span>歌名：</span>
        <a-input size="large" :placeholder="data.song_name" v-model="newDetail.song_name"/>
      </div>
      <div class="content-item">
        <span><sup style="color: red">*</sup>歌手：</span>
        <a-input size="large" :placeholder="data.singer.join(' / ')" v-model="newDetail.singer"/>
      </div>
      <div class="content-item">
        <span>歌曲时长：</span>
        <a-input size="large" :placeholder="data.language" v-model="newDetail.language"/>
      </div>
      <div class="content-item">
        <span><sup style="color: red">*</sup>风格： </span>
        <a-input size="large" :placeholder="data.style_name.join(' / ')" v-model="newDetail.style_name"/>
      </div>
      <div class="content-item">
        <span style="font-size: 13px; color: #dcdfe6"><sup style="color: red">*</sup>如有多个值请用 , 分隔</span>
      </div>
      <div class="button-block content-item">
        <a-button class="submit" type="primary" size="large" style="width: 120px" @click="getEditInfo">提交</a-button>
        <a-button a-button class="reset" type="primary"  size="large" style="width: 120px; background-color: #e74032; border-color: #a72d24;" @click="resetEdit">重置</a-button>
      </div>
    </div>
  </div>
  </template>

<script>
import axios from 'axios'
export default {
  name: 'SongDetailEditCard',
  data () {
    return {
      newDetail: {
        song_name: '',
        singer: '',
        language: '',
        style_name: ''
      }
    }
  },
  props: ['data'],
  methods: {
    // 关闭登录弹窗
    closeWindow () {
      this.$emit('closeWindow')
    },

    // 重置编辑内容
    resetEdit () {
      this.newDetail = {
        song_name: '',
        singer: [],
        language: '',
        style_name: []
      }
    },

    // 提交修改内容
    async getEditInfo () {
      const { data } = await axios({
        method: 'PATCH',
        url: `http://localhost:3010/soda_music_lib/${this.data.sid}`,
        data: {
          sid: this.data.sid,
          song_name: this.newDetail.song_name || this.data.song_name,
          singer: this.newDetail.singer === [] ? this.data.singer : this.newDetail.singer.split(','),
          language: this.newDetail.language || this.data.language,
          style_name: this.newDetail.style_name.lenght ? this.data.style_name : this.newDetail.style_name.split(',')
        }
      })
      console.log(data)
    }
  },
  created () {}
}
</script>

<stlye lang="less" scoped>

.edit-container{
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

  .edit-content-area{
    margin-top: 30px;
    .content-item{
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      //min-width: 260px;
      height: 70px;
      padding: 15px 50px 15px 30px;
      margin: 0 15px;
      border-top: 1px solid #f4f4f4;
      font-size: 17px;

      span{
        min-width:90px;
      }

      &:hover{
        background-color: #f8faf7;
        border-radius: 15px;
      }
    }

    .button-block{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</stlye>
