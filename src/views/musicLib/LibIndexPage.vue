<template>
  <div class="index-container">
    <div class="box box-1 br bs"></div>
    <div class="box box-2 br bs"></div>
    <div class="box box-3 br bs"></div>
    <div class="box box-4 br bs"></div>
    <div class="box box-4 br bs"></div>
    <div class="box box-4 br bs"></div>
  </div>
</template>

<script>
export default {
  name: 'LibIndexPage'
}
</script>

<style lang="less" scoped>
.index-container{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
  padding: 15px;

  .box{
    width: calc(50% - 30px);
    height: 450px;
    margin: 15px;
    background-color: #fff;
  }
}

@media screen and (max-width: 1200px){

    .index-container{
      flex-wrap: nowrap;
      flex-direction: column;
      align-items: center;

    .box{
      width: calc(100% - 15px);
      background-color: #fff;
    }
  }
}
</style>
