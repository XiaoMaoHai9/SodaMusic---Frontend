<template>
  <div>私人乐库
      <!-- <img src="@/assets/images/common/login-leftPhoto.jpg" alt=""> -->
  </div>

</template>

<script>
export default {
  name: 'MusicLibPage',
  activated () {
    console.log('actived 激活 → 进入页面')
  },
  deactivated () {
    console.log('deactived 失活 → 离开页面')
  }
}
</script>

<style>

</style>
