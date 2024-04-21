<template>
  <div class="setting-container">
    <!-- 用户信息修改区域 -->
    <div class="input-area">
      <span class="setting-title">账号设置</span>
      <div class="input-block">
        <span class="input-title">用户名</span>
        <a-input size="large" placeholder="请输入新用户名" v-model="loginForm.username"/>
      </div>
      <div class="input-block">
        <span class="input-title">手机号</span>
        <a-input size="large" placeholder="请输入新手机号" v-model="loginForm.phone"/>
      </div>
      <div class="input-block">
        <span class="input-title">密码</span>
        <a-input-password size="large" placeholder="请输入新密码" v-model="loginForm.password"/>
      </div>
      <div class="button-block">
        <a-button class="submit" type="primary" size="large" style="width: 45%">提交</a-button>
        <a-button class="reset" type="primary"  size="large" style="width: 45%; background-color: #e74032; border-color: #a72d24;">重置</a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingPage',
  data () {
    return {
      loginForm: {
        username: 'pu-_', // 用户名
        phone: '15375692553', // 手机号
        password: 'GototheMars2001W' // 密码
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
