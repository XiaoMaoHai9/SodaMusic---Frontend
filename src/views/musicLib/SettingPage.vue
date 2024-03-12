<template>
  <div class="setting-container">
    <div class="content bs br">
      设置
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingPage'
}
</script>

<style lang="less" scoped>
.setting-container{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
  padding: 15px;

  .content{
    width: 100%;
    height: 800px;
    line-height: 800px;
    text-align: center;
    font-size: 40px;
    background-color: #fff;
  }
}
</style>
