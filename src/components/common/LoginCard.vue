<template>
  <div class="login-container br win-position bs">
    <!-- 关闭按钮 -->
    <a-icon class="close-circle" type="close-circle" theme="twoTone" :style="{fontSize: '25px'}" twoToneColor="#0075c2" @click="closeWindow"/>
    <!-- 平台logo展示 -->
    <img class="platform-top" :src="platformTopLogoUrl"/>
    <div class="login-title">{{thirdParty.loginModel === 'phone' && platform === 'neteasecloud'? '手机号登录' : '密码登录'}}</div>
    <!-- 手机号登录区域 -->
    <div class="input-area" v-show="thirdParty.loginModel === 'phone' && platform === 'neteasecloud'">
      <a-input size="large" placeholder="请输入手机号" v-model="loginForm.phone"/>
      <div class="get-msg">
        <a-input style="width: 56%" placeholder="请输入短信验证码" size="large" v-model="loginForm.captcha"/>
        <a-button class="get-captcha" type="primary" :style="{width: '40%'}" size="large" @click="getCaptcha" :disabled="countFlag">{{codeCountdown !== 60 ? codeCountdown + 's' : '获取验证码'}}</a-button>
      </div>
      <a-button type="primary" size="large" style="width: 100%; margin-top: 40px" @click="loginTo">登录</a-button>
    </div>
    <!-- 账号密码登录区域 -->
    <div class="input-area" v-show="thirdParty.loginModel === 'account' || platform === 'sodamusic'">
      <a-input size="large" placeholder="请输入手机号" v-model="loginForm.phone"/>
      <a-input-password size="large" placeholder="请输入密码" style="margin-top: 15px" v-model="loginForm.password"/>
      <a-button type="primary" size="large" style="width: 100%; margin-top: 40px" @click="loginTo">登录</a-button>
    </div>
    <!-- 更改登录方式 -->
    <a v-show="platform === 'neteasecloud'" style="width: 100%" @click="checkLoginModel()"><a-icon type="swap" />  {{thirdParty.loginModel === 'account' ? '手机号登录' : '密码登录'}}</a>
    <!-- 账号注册 -> 仅供 sodamusic 平台 -->
    <a v-show="platform === 'sodamusic'" style="width: 100%" @click="$emit('goRegister')"><a-icon type="user-add" />  注册账号</a>
    <!-- 更改登录平台 -->
    <div class="account-choose">
      <img v-if="platform === 'neteasecloud'" class="logo-btn bs" src="@/assets/images/logos/sodamusic-icon.png" title="SodaMusic登录" @click="updatePlatform('sodamusic')">
      <img v-else class="logo-btn bs" src="@/assets/images/logos/neteasecloud-icon.png" title="网易云音乐登录" @click="updatePlatform('neteasecloud')">
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { checkPhone, checkPwd, checkCaptcha } from '@/utils/check-data'
export default {
  name: 'LoginComponent',
  props: [],
  data () {
    return {
      loginForm: {
        phone: '15375692553', // 手机号
        captcha: '', // 短信验证码
        password: 'GototheMars2001W' // 密码
      },
      codeCountdown: 60,
      countFlag: false,
      timer: null,
      regTel: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, // 11位手机号码正则
      regcaptcha: /^\d{4}$/ // 4位数字验证码正则
    }
  },
  computed: {
    ...mapState(['platform', 'thirdParty']),

    // 顶部平台logo url
    platformTopLogoUrl () {
      return require(`@/assets/images/logos/${this.platform}-icon-top.png`)
    },

    // 平台logo url
    platformLogoUrl () {
      return require(`@/assets/images/logos/${this.platform}-icon.png`)
    }
  },
  methods: {
    ...mapMutations(['updatePlatform', 'checkLoginModel', 'setUserInfo', 'changeLoginState', 'changeLoginFlag']),
    // 关闭登录弹窗
    closeWindow () {
      this.loginForm.phone = ''
      this.loginForm.captcha = ''
      this.loginForm.password = ''
      if (this.platform === 'sodamusic') this.changeLoginFlag(false)
      this.updatePlatform('neteasecloud')
      this.$emit('closeWindow')
      this.codeCountdown = 60
      this.countFlag = false
      clearInterval(this.timer)
      this.timer = null
    },

    // 更新当前平台
    updatePlatform (platformName) {
      this.$store.commit('updatePlatform', platformName)
    },

    // 获取验证码
    async getCaptcha () {
      // 手机号格式验证
      const checkPhoneRes = checkPhone(this.loginForm.phone)
      if (!checkPhoneRes.bool) {
        this.$message.error(checkPhoneRes.msg)
        return
      }
      // 提交验证码发送请求
      const { data } = await this.$http.neteasecloudApi.login.sendCode(this.loginForm)

      if (data.code === 200) {
        this.$message.success('发送成功，请注意查收！')
        this.countFlag = true
        // 按钮倒计时
        this.timer = setInterval(() => {
          this.codeCountdown--
          if (this.codeCountdown < 0) {
            clearInterval(this.timer)
            this.codeCountdown = 60
            this.countFlag = false
          }
        }, 1000)
      } else {
        this.$message.error('发送失败')
      }
    },

    // 点击登录 --> 手机号、验证码格式校验 --> 验证码正确性校验 --> 判断登陆类型 --> 提交表格
    async loginTo () {
      // 手机号格式验证
      const checkPhoneRes = checkPhone(this.loginForm.phone)
      if (!checkPhoneRes.bool) {
        this.$message.error(checkPhoneRes.msg)
        return
      }

      // 记录登录响应结果
      let data = null

      // 苏打音乐登录
      if (this.platform === 'sodamusic') {
        const { data } = await this.$http.sodamusicApi.login(this.loginForm)
        if (data.code !== 200) return this.$message.warning(data.msg)
        window.localStorage.setItem('token_sodamusic', data.token)
        this.getUserInfo('', 'sodamusic').then(res => {
          window.localStorage.setItem('isLogin_sodamusic', true)
          this.changeLoginState({ data: true, platform: 'sodamusic' })
          this.closeWindow()
          if (this.$route.path !== '/myMicLib/libIndex') {
            this.$router.push('/myMicLib')
          }
          this.$message.success('登录成功！欢迎  ' + res.username)
        })
      } else {
        // 判断三方平台登录模式 -> 手机号登录
        if (this.thirdParty.loginModel === 'phone') {
          // 验证码格式验证
          const chechCapRes = checkCaptcha(this.loginForm.captcha)
          if (!chechCapRes.bool) {
            this.$message.error(chechCapRes.msg)
            return
          }
          try {
            // 验证验证码是否有效
            const resVerify = await this.$http.neteasecloudApi.login.verifyCode(this.loginForm)
            if (resVerify.data.code && resVerify.data.code === 200) {
            // 提交登录请求
              const res = await this.$http.neteasecloudApi.login.loginByPhone(this.loginForm)
              data = res.data
            }
          } catch (error) {
            this.$message.error(error.response.data.message)
          }
          // 判断三方平台登录模式 -> 密码登录
        } else if (this.thirdParty.loginModel === 'account') {
          // 密码格式验证
          const checkPwdRes = checkPwd(this.loginForm.password)
          if (!checkPwdRes.bool) {
            this.$message.error(checkPwdRes.msg)
            return
          }
          // 提交登录请求
          const res = await this.$http.neteasecloudApi.login.loginByPwd(this.loginForm)
          data = res.data
        }

        // 登录成功
        if (data.code && data.code === 200) {
          this.getUserInfo(data.profile.userId, 'neteasecloud')
          window.sessionStorage.setItem('token_thirdPart', data.token)
          window.sessionStorage.setItem('cookie_thirdPart', data.cookie)
          window.sessionStorage.setItem('isLogin_thirdPart', true)
          this.changeLoginState({ data: true, platform: 'neteasecloud' })
          this.$message.success('登录成功！')
          this.closeWindow()
        }
      }
    },

    // 获取用户详情
    async getUserInfo (id, platform) {
      // 苏打音乐
      if (platform === 'sodamusic') {
        // 发送请求
        const { data } = await this.$http.sodamusicApi.getUserInfo()
        if (data.code !== 200) return this.$message.error('获取用户信息失败，请重新登录')
        this.setUserInfo({ data: data.data, platform: 'sodamusic' })
        window.localStorage.setItem('userInfo_sodamusic', JSON.stringify(data.data))
        return data.data
        // 网易云
      } else if (platform === 'neteasecloud') {
        // 发送请求
        const { data: res } = await this.$http.neteasecloudApi.login.getUserInfo({ uid: id })
        window.sessionStorage.setItem('userInfo_neteasecloud', JSON.stringify(res.profile))
        this.setUserInfo({ data: res.profile, platform: 'neteasecloud' })
      }
    }
  }
}
</script>

<style lang="less" scoped>

.login-container{
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

  .login-title{
    width: 300px;
    margin: 70px 0 15px 0;
    font-size: 38px;
    font-weight: 600;
    text-align: left;
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
