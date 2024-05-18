<template>
  <div class="setting-container">
    <!-- 用户信息修改区域 -->
    <div class="input-area">
      <span class="setting-title">账号设置</span>
      <div class="input-block">
        <span class="input-title">用户名</span>
        <a-input size="large" placeholder="请输入新用户名" v-model="userForm.username"/>
      </div>
      <div class="input-block">
        <span class="input-title">手机号</span>
        <a-input size="large" placeholder="请输入新手机号" v-model="userForm.phone"/>
      </div>
      <div class="input-block">
        <span class="input-title">密码</span>
        <a-input-password size="large" placeholder="请输入新密码" v-model="userForm.password"/>
      </div>
      <div class="button-block">
        <a-button class="submit" type="primary" size="large" style="width: 45%" @click="submitForm">提交</a-button>
        <a-button class="reset" type="primary"  size="large" style="width: 45%; background-color: #e74032; border-color: #a72d24;" @click="clearForm">重置</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { chechUname, checkPhone, checkPwd } from '@/utils/check-data'
export default {
  name: 'SettingPage',
  data () {
    return {
      userForm: {
        lid: '',
        username: '', // 用户名
        phone: '', // 手机号
        password: '' // 密码
      }
    }
  },
  methods: {
    async submitForm () {
      if (this.userForm.username === '' && this.userForm.phone === '' && this.userForm.password === '') return this.$message.warn('请输入修改内容 ！')

      // 用户名格式验证
      if (this.userForm.username !== '') {
        const checkUnameRes = chechUname(this.userForm.username)
        if (!checkUnameRes.bool) {
          this.$message.error(checkUnameRes.msg)
          return
        }
      }

      // 手机号格式验证
      if (this.userForm.phone !== '') {
        const checkPhoneRes = checkPhone(this.userForm.phone)
        if (!checkPhoneRes.bool) {
          this.$message.error(checkPhoneRes.msg)
          return
        }
      }

      if (this.userForm.password !== '') {
      // 密码格式验证
        const checkPwdRes = checkPwd(this.userForm.password)
        if (!checkPwdRes.bool) {
          this.$message.error(checkPwdRes.msg)
          return
        }
      }

      const { data } = await this.$http.sodamusicApi.updateUserInfo({
        lid: this.$store.state.sodaAccount.userInfo.lid,
        user_name: this.userForm.username, // 用户名
        phone: this.userForm.phone, // 手机号
        password: this.userForm.password // 密码
      })

      if (data.code === 200) {
        this.clearForm()
        return this.$message.success(data.msg)
      }

      this.$message.error(data.msg)
    },
    clearForm () {
      this.userForm = {
        username: '', // 用户名
        phone: '', // 手机号
        password: '' // 密码
      }
    }
  }
}
</script>

<style lang="less" scoped>
.setting-container{
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  height: 700px;
  padding: 15px;

  .input-area{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 450px;
    height: 400px;
    // margin: 90px 0;

    .setting-title{
      margin-top: 30px;
      font-size: 30px;
    }

    .input-block, .button-block{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }

    .input-block{
      .input-title{
        display: inline-block;
        width: 90px;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
      }
    }
  }
}
</style>
