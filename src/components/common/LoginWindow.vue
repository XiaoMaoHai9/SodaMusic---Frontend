<template>
  <div class="container br win-position">
    <!-- 关闭按钮 -->
    <a-icon class="close-circle" type="close-circle" theme="twoTone" :style="{fontSize: '25px'}" twoToneColor="#0075c2" @click="closeLogin"/>
    <!-- 左侧图样 -->
    <div class="left-photo"></div>
    <!-- 手机号登录区域 -->
    <div class="input-area" v-show="loginModel === 'phone'">
      <div :style="{ marginTop: '10px', width: '300px'}"><span>手机号登录</span></div>
      <div :style="{ marginTop: '60px',width: '300px'}">
        <a-input-group compact size="large">
          <a-select default-value="Option1" size="large">
            <a-select-option value="Option1">
              +86
            </a-select-option>
            <a-select-option value="Option2">
              Option2
            </a-select-option>
          </a-select>
          <a-input style="width: 78%" placeholder="请输入手机号" v-model="loginForm.phoneNum"/>
        </a-input-group>
      </div>
      <div class="get-msg">
        <a-input style="width: 60%" placeholder="请输入短信验证码" size="large" :style="{ margin: '0 10px 0 0'}" v-model="loginForm.captcha"/>
        <a-button class="get-msgcode" type="primary" :style="{width: '40%'}" :size="size" @click="getCaptcha" :disabled="countFlag">{{codeCountdown !== 60 ? codeCountdown + 's' : '获取验证码'}}</a-button>
      </div>
      <a-button type="primary" :style="{marginTop: '50px', width: '76%'}" :size="size" @click="loginTo">登录</a-button>
      <a :style="{marginTop: '20px', width: '76%'}" @click="toCheckLogin('account')">账号登录</a>
    </div>
    <!-- 账号密码登录区域 -->
    <div class="input-area" v-show="loginModel === 'account'">
      <div :style="{ marginTop: '10px', width: '300px'}"><span>密码登录</span></div>
      <div :style="{ marginTop: '60px',width: '300px'}">
        <a-input-group compact size="large">
          <a-select default-value="Option1" size="large">
            <a-select-option value="Option1">
              +86
            </a-select-option>
            <a-select-option value="Option2">
              Option2
            </a-select-option>
          </a-select>
          <a-input style="width: 78%" placeholder="请输入手机号" v-model="loginForm.phoneNum"/>
        </a-input-group>
      </div>
      <a-input-password placeholder="请输入密码" size="large" v-model="loginForm.password" :style="{ marginTop: '10px' ,width: '300px', fontSize:'15px'}"/>
      <a-button type="primary" :style="{marginTop: '50px', width: '76%'}" :size="size" @click="loginTo">登录</a-button>
      <a :style="{marginTop: '20px', width: '76%'}" @click="toCheckLogin('phone')">手机号登录</a>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'LoginComponent',
  props: [],
  data () {
    return {
      size: 'large',
      loginForm: {
        phoneNum: '', // 手机号
        ctcode: '', // 地区码
        captcha: '', // 短信验证码
        password: '' // 密码
      },
      codeCountdown: 60,
      countFlag: false,
      timer: null,
      regTel: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, // 11位手机号码正则
      regMsgCode: /^\d{4}$/ // 4位数字验证码正则
    }
  },
  computed: {
    ...mapState(['loginModel'])
  },
  methods: {
    ...mapMutations(['checkLoginModel', 'setUserInfo', 'changeLoginState']),
    // 关闭登录弹窗
    closeLogin () {
      this.loginForm.phoneNum = ''
      this.loginForm.msgCode = ''
      this.loginForm.password = ''
      this.$emit('openWindow')
      this.codeCountdown = 60
      this.countFlag = false
      clearInterval(this.timer)
      this.timer = null
    },

    // 获取验证码
    async getCaptcha () {
      if (this.loginForm.phoneNum === '') {
        this.$message.warning('请填写您的手机号！')
        return false
      }
      const { data } = await this.$http.login.sendCode(this.loginForm)

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
      if (!this.verifySubmit()) {
        return false
      }

      let data = null

      try {
        if (this.loginModel === 'phone') {
          const res = await this.$http.login.loginByPhone(this.loginForm)
          try {
            const resVerify = await this.$http.login.verifyCode(this.loginForm)
            if (resVerify.data.code === 200) {
              data = res.data
            }
          } catch (error) {
            this.$message.error(error.data.message)
          }
        } else if (this.loginModel === 'account') {
          const res = await this.$http.login.loginByPwd(this.loginForm)
          data = res.data
        }
        if (data.code === 200) {
          this.getUserInfo(data.profile.userId)
          window.sessionStorage.setItem('token', data.token)
          window.sessionStorage.setItem('cookie', data.cookie)
          window.sessionStorage.setItem('isLogin', true)
          this.changeLoginState(true)
          this.$message.success('登录成功！')
        }
      } catch (error) {
        this.$message.error(error.data.message)
      }
    },

    // 获取用户详情
    async getUserInfo (uid) {
      const { data: res } = await this.$http.login.getUserInfo({ uid: uid })

      if (res.code !== 200) {
        this.$message.error(res.msg)
      } else {
        window.sessionStorage.setItem('userInfo', JSON.stringify(res.profile))
        this.setUserInfo(res.profile)
      }
    },

    // 校验提交格式
    verifySubmit () {
      // 手机号格式验证
      if (this.loginForm.phoneNum === '') {
        this.$message.warning('请填写您的手机号！')
        return false
      } else if (!this.regTel.test(this.loginForm.phoneNum)) {
        this.$message.error('请正确填写您的手机号码！')
        return false
      }

      // 验证码格式验证
      if (this.loginModel === 'phone') {
        if (this.loginForm.captcha === '') {
          this.$message.warning('验证码不能为空！')
          return false
        } else if (!this.regMsgCode.test(this.loginForm.captcha)) {
          this.$message.error('短信验证码格式错误！')
          return false
        }
      }

      return true
    },

    // 切换登陆方式
    toCheckLogin (model) {
      this.checkLoginModel(model)
    }
  }
}
</script>

<style lang="less" scoped>
.container{
  display: flex;
  flex-direction: row;
  width: 900px;
  height: 500px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  border: 1px solid @color-grey;

  .left-photo{
    width: 510px;
    height: 100%;
    background-image: url('@/assets/images/common/login-leftPhoto.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 160% 100%;
  }

  .close-circle{
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }

  .input-area{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width:  390px;
    border-radius: 0 15px 15px 0;

    span{
      font-size: 30px;
      text-align: left;
    }

    .get-msg{
      display: flex;
      justify-content: space-between;
      width: 300px;
      margin-top: 10px;
    }
  }
}
</style>
