<template>
  <div class="register-container br win-position bs">
    <!-- 关闭按钮 -->
    <a-icon class="close-circle" type="close-circle" theme="twoTone" :style="{fontSize: '25px'}" twoToneColor="#0075c2" @click="closeWindow"/>
    <!-- 平台logo展示 -->
    <img class="platform-top" :src="platformTopLogoUrl"/>
    <div class="register-title">
      <div>SodaMusic</div>
      <div>账号注册</div>
    </div>
    <!-- 账号密码登录区域 -->
    <div class="input-area">
      <!-- 头像上传 -->
      <div class="avatar-editer">
        <a-upload
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          action=""
          :before-upload="beforeUpload"
          @change="handleChange"
        >
        <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">
              头像上传
            </div>
          </div>
        </a-upload>
      </div>
      <a-input size="large" placeholder="请输入用户名" style="margin-top: 15px" v-model="regForm.username"/>
      <a-input size="large" placeholder="请输入手机号" style="margin-top: 15px" v-model="regForm.phone"/>
      <a-input-password size="large" placeholder="请输入密码" style="margin-top: 15px" v-model="regForm.password"/>
      <a-input-password size="large" placeholder="请再次输入密码" style="margin-top: 15px" v-model="regForm.rePassword"/>
      <a-button type="primary" size="large" style="width: 100%; margin-top: 40px" @click="registerTo">注册</a-button>
    </div>
    <!-- 前往登录 -->
    <a style="width: 100%" @click="$emit('goLogin')"><a-icon type="login" />  账号登录</a>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { chechUname, checkPhone, checkPwd } from '@/utils/check-data'

// 对图片编码的函数
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  name: 'RegisterCard',
  props: [],
  data () {
    return {
      regForm: {
        avatar: '', // 头像
        username: 'pu_-', // 用户名
        phone: '17364493915', // 手机号
        password: '111111ACc', // 密码
        rePassword: '111111ACc' // 再次密码
      },
      loading: false,
      imageUrl: ''
    }
  },
  computed: {
    ...mapState(['loginModel', 'platform']),

    // 顶部平台logo url
    platformTopLogoUrl () {
      return require('@/assets/images/logos/sodamusic-icon-top.png')
    },

    // 平台logo url
    platformLogoUrl () {
      return require(`@/assets/images/logos/${this.platform}-icon.png`)
    }
  },
  methods: {
    ...mapMutations(['updatePlatform', 'changeLoginFlag', 'checkLoginModel', 'setUserInfo', 'changeLoginState']),

    // 关闭窗口
    closeWindow () {
      this.regForm.username = ''
      this.regForm.phone = ''
      this.regForm.password = ''
      this.regForm.rePassword = ''
      this.$emit('closeWindow')
    },

    // 点击登录 --> 手机号、验证码格式校验 --> 验证码正确性校验 --> 判断登陆类型 --> 提交表格
    async registerTo () {
      // 用户名格式验证
      const checkUnameRes = chechUname(this.regForm.username)
      if (!checkUnameRes.bool) {
        this.$message.error(checkUnameRes.msg)
        return
      }
      // 手机号格式验证
      const checkPhoneRes = checkPhone(this.regForm.phone)
      if (!checkPhoneRes.bool) {
        this.$message.error(checkPhoneRes.msg)
        return
      }
      // 密码格式验证
      const checkPwdRes = checkPwd(this.regForm.password)
      if (!checkPwdRes.bool) {
        this.$message.error(checkPwdRes.msg)
        return
      }

      if (this.regForm.rePassword === '') return this.$message.error('请再次输入密码！')

      // 两次密码对比
      if (this.regForm.password !== this.regForm.rePassword) return this.$message.error('两次密码不一致')

      // 提交注册请求
      const res = await this.$http.sodamusicApi.register(this.regForm)
      // const res = { data: { code: '200', msg: '登陆成功' } }
      if (res.data.code !== 200) return this.$message.warning(res.data.msg)
      // 请求成功
      this.$message.success(res.data.msg)
      // 当前平台 -> sodamusic
      this.updatePlatform('sodamusic')
      // 切换登录界面
      this.$emit('goLogin')
    },

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
      }
    },

    // 上传前文件格式拦截
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
    }
  }
}
</script>

<style lang="less" scoped>

.register-container{
  padding: 25px;
  background-color: #FAFAFA;

  .close-circle{
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }

  .platform-top{
    position: absolute;
    top: 0;
    left: 0;
    width: 90px;
    height: 90px;
    // background: url('@/assets/images/logos/neteasecloud-top.png') no-repeat;
    // background-size: 100%;
    clip-path: polygon(0 0, 100% 0, 0 100%);
  }

  .register-title{
    width: 300px;
    margin: 70px 0 15px 0;
    font-size: 38px;
    font-weight: 600;
    text-align: left;
  }

  .avatar-editer{
    display: flex;
    flex-direction: column;
    align-items: center;

    .ant-upload-picture-card-wrapper{
      width: auto;
    }

    .ant-upload-select-picture-card{
      background-color: #fff;
    }

    .avatar-uploader > .ant-upload {
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

  .input-area{
    width: 300px;
    padding: 20px 0;
    border-radius: 0 15px 15px 0;

    .get-msg{
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
    }
  }

  .account-choose{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
    height: 50px;
    margin-top: 15px;

    .logo-btn{
      width: 50px;
      border-radius: 100px;
      background-color: #fff;
      cursor: pointer;
    }
  }
}
</style>
