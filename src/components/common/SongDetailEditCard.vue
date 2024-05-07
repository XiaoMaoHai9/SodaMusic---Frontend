<template>
  <div class="card-container br win-position bs">
    <!-- 关闭按钮 -->
    <a-icon class="close-circle" type="close-circle" theme="twoTone" :style="{fontSize: '25px'}" twoToneColor="#0075c2" @click="closeWindow"/>
    <div class="card-content">
      <!-- 详情编辑区域 -->
      <div class="edit-container-area" v-if="cardMode === 'edit'">
        <div class="card-title" style="margin-bottom: 50px">详情编辑</div>
        <!-- 内容区域 -->
        <div class="edit-content-area">
        <div class="content-item">
          <span>歌名：</span>
          <a-input size="large" :placeholder="data.song_name" v-model="newDetail.songName"/>
        </div>
        <div class="content-item">
          <span><sup style="color: red">*</sup>歌手：</span>
          <a-input size="large" :placeholder="data.singer.join(' / ')" v-model="newDetail.singer"/>
        </div>
        <div class="content-item">
          <span>语言：</span>
          <a-input size="large" :placeholder="data.language" v-model="newDetail.language"/>
        </div>
        <div class="content-item">
          <span><sup style="color: red">*</sup>风格： </span>
          <a-input size="large" :placeholder="data.style_name.join(' / ')" v-model="newDetail.  style_name"/>
        </div>
        </div>
      </div>
      <!-- 歌曲上传区域 -->
      <div class="add-container-area" v-else>
        <div class="card-title">歌曲上传</div>
        <!-- 封面上传 -->
        <div class="cover-editer">
          <a-upload
            name="cover"
            list-type="picture-card"
            class="cover-uploader"
            :show-upload-list="false"
            action="http://localhost:3000/upload/cover"
            :before-upload="beforeUpload"
            @change="handleChange"
            accept="image/png, image/jpeg"
          >
          <img v-if="imageUrl" :src="imageUrl" alt="cover" style="width: 100%"/>
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                封面上传
              </div>
            </div>
          </a-upload>
        </div>
        <!-- 内容区域 -->
        <div class="add-content-area">
          <div class="content-item">
            <span>歌名：</span>
            <a-input size="large" placeholder="请输入歌名" v-model="addSongInfo.songName"/>
          </div>
          <div class="content-item">
            <span><sup style="color: red">* </sup>歌手：</span>
            <a-input size="large" placeholder="请输入歌手名" v-model="addSongInfo.singer"/>
          </div>
          <div class="content-item">
            <span>语言</span>
            <a-input size="large" placeholder="请输入歌曲语言" v-model="addSongInfo.language"/>
          </div>
          <div class="content-item">
            <span><sup style="color: red">* </sup>风格： </span>
            <a-input size="large" placeholder="请输入歌曲风格" v-model="addSongInfo.styleName"/>
          </div>
          <div class="content-item">
            <a-upload
              name="audio"
              action="http://localhost:3000/upload/songfile"
              @change="audioHandleChange"
              accept="audio/mp3, audio/flac, audio/wma, audio/aac"
              :fileList="fileList"
            >
              <a-button class="upload-btn" type="primary" size="large" title="选择音频文件"><a-icon type="folder-open" /> 选择音频文件 </a-button>
            </a-upload>
          </div>
        </div>
      </div>
      <!-- 提示区 -->
      <div class="tips">
        <span style="font-size: 13px; color: #dcdfe6"><sup style="color: red">* </sup>如有多个值请用 , 分隔</span>
      </div>
      <!-- 按钮区 -->
      <div class="button-block">
        <a-button class="submit" type="primary" size="large" style="width: 120px" @click="submitFromInfo"> 提交</a-button>
        <a-button a-button class="reset" type="primary"  size="large" style="width: 120px; background-color: #e74032; border-color: #a72d24;" @click="resetEdit">重置</a-button>
      </div>
    </div>
  </div>
</template>

<script>

// 对图片编码的函数
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  name: 'SongDetailEditCard',
  data () {
    return {
      newDetail: {
        songName: '',
        singer: '',
        language: '',
        styleName: ''
      },
      addSongInfo: {
        coverUrl: 'src\\db\\images\\cover\\1714889624155.png',
        songName: '',
        singer: '',
        language: '',
        styleName: '',
        audioUrl: ''
      },
      imageUrl: '',
      loading: false,
      isEditCard: false,
      fileList: [], // 文件列表
      defaultFileList: [] // 已上传内容列表
    }
  },
  props: ['data', 'cardMode'],
  methods: {
    // 关闭登录弹窗
    closeWindow () {
      this.$emit('closeWindow')
    },

    // 重置编辑内容
    resetEdit () {
      if (this.cardMode === 'edit') {
        this.newDetail = {
          songName: '',
          singer: '',
          language: '',
          styleName: ''
        }
      } else {
        this.addSongInfo = {
          coverUrl: 'src\\db\\images\\cover\\1714889624155.png',
          songName: '',
          singer: '',
          language: '',
          styleName: '',
          audioUrl: ''
        }
        this.imageUrl = ''
        this.fileList = []
      }
    },

    // 提交修改内容
    async submitFromInfo () {
      // 编辑详情提交
      if (this.cardMode === 'edit') {
        const { data } = await this.$http.sodamusicApi.modifySongDetail({
          lid: this.$store.state.sodaAccount.userInfo.lid,
          sid: this.data.sid,
          song_name: this.newDetail.songName,
          singer: this.newDetail.singer === '' ? this.newDetail.singer : JSON.stringify(this.newDetail.singer.split(',')),
          language: this.newDetail.language,
          style_name: this.newDetail.styleName === '' ? this.newDetail.style_name : JSON.stringify(this.newDetail.style_name.split(','))
        })
        if (data.code === 200) {
          this.closeWindow()
          this.$emit('refreshLibList')
          this.$message.success(data.msg)
        } else {
          this.$message.error(data.msg)
        }
      } else {
        // 歌曲上传提交
        if (!this.addSongInfo.songName) return this.$message.warning('请输入歌曲名！')
        if (!this.addSongInfo.singer) return this.$message.warning('请输入歌手名！')
        if (!this.addSongInfo.language) return this.$message.warning('请输入语言！')
        if (!this.addSongInfo.styleName) return this.$message.warning('请输入歌曲风格！')
        if (!this.addSongInfo.audioUrl) return this.$message.warning('请选择需要上传的音频文件！')
        const { data } = await this.$http.sodamusicApi.uploadSong({
          lid: this.$store.state.sodaAccount.userInfo.lid,
          song_name: this.addSongInfo.songName,
          singer: JSON.stringify(this.addSongInfo.singer.split(',')),
          language: this.addSongInfo.language,
          cover_url: this.addSongInfo.coverUrl,
          file_url: this.addSongInfo.audioUrl,
          style_name: JSON.stringify(this.addSongInfo.styleName.split(','))
        })
        if (data.code === 200) {
          this.closeWindow()
          this.$emit('refreshLibList')
          this.$message.success(data.msg)
        } else {
          this.$message.error(data.msg)
        }
      }
    },

    // 封面上传状态处理
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl
          this.loading = false
        })

        if (info.file.response.code === 200) {
          this.$message.success(info.file.response.msg)
          this.addSongInfo.coverUrl = info.file.response.data.cover_url
        }
      }
    },

    // 图片上传前文件格式拦截
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('请上传 JPG JPEG PNG格式的图片!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小请不要超过 2MB!')
      }
      return isJpgOrPng && isLt2M
    },

    // 音频上传状态处理
    audioHandleChange (info) {
      let fileList = [...info.fileList]

      // 1. Limit the number of uploaded files
      //    Only to show two recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-2)

      // 2. read from response and show file link
      fileList = fileList.map(file => {
        if (file.response) {
          // Component will show file.url as link
          file.url = file.response.url
        }
        return file
      })

      this.fileList = fileList
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 上传成功！`)
        this.addSongInfo.audioUrl = info.file.response.data.audio_url
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    }
  },
  created () {}
}
</script>

<style lang="less" scoped>
.card-container{
  padding: 30px 20px 15px 20px;
  background-color: #fff;

  .close-circle{
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }

  .card-content{
    .cover-editer{
      margin-top: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .ant-upload-picture-card-wrapper{
        width: auto;
      }

      .ant-upload-select-picture-card{
        background-color: #fff;
      }

      .cover-uploader > .ant-upload {
        width: 128px;
        height: 128px;
      }

      .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
      }

      .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
      }

      .avatar-tite{
        font-size: 20px;
        color: #9A9FA9;
      }
    }

    .edit-container-area, .add-container-area{
      .card-title{
        padding-left: 15px;
        font-size: 38px;
        font-weight: 600;
      }

      .edit-content-area, .add-content-area{
        .content-item{
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;
          padding: 10px 50px 10px 30px;
          margin: 0 15px;
          border-top: 1px solid #f4f4f4;
          font-size: 17px;
          span{
            min-width: 90px;
          }
          &:hover{
            background-color: #f8faf7;
            border-radius: 15px;
          }

          .upload-btn{
            width: 300px;
            height: 50px;
            background-color: #00b176;
            font-size: 16px;
            color: #fff;
          }
        }
      }
    }

    .tips{
      padding: 15px 50px 15px 30px;
      margin: 0 15px;
      border-top: 1px solid #f4f4f4;
    }

    .button-block{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 15px 50px 15px 30px;
      margin: 0 15px;
      border-top: 1px solid #f4f4f4;
    }
  }
}
</style>

<style lang="less" scoped>
.ant-upload.ant-upload-select-picture-card{
  border: 2px dashed #d9d9d9 !important;
  background-color: #fff !important;
}

.ant-upload.ant-upload-select-picture-card {
  overflow: hidden;
}

.ant-upload.ant-upload-select-picture-card > .ant-upload{
  padding: 0 !important;
}
</style>
