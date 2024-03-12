<template>
  <div class="lib-container">
    <!-- 左侧导航菜单 -->
      <a-menu
        :default-selected-keys="['1']"
        :open-keys.sync="openKeys"
        :mode= "menuMode"
        @click="handleClick"
        :inline-collapsed="collapsed"
      >
        <a-menu-item key="1" @titleClick="titleClick">
          <a-icon type="home" /><span>首页</span>
        </a-menu-item>
        <a-menu-item key="2" @titleClick="titleClick">
          <a-icon type="folder" /><span>歌曲管理</span>
        </a-menu-item>
        <a-menu-item key="3">
          <a-icon type="setting" /><span>设置</span>
        </a-menu-item>
      </a-menu>
    <keep-alive :include='keepArr'>
      <router-view/>
    </keep-alive>
  </div>

</template>

<script>
export default {
  name: 'MusicLibPage',
  data () {
    return {
      keepArr: ['LibIndexPage', 'MicManagePage', 'SettingPage'],
      current: ['mail'],
      openKeys: ['sub1'],
      collapsed: false,
      menuMode: 'inline'
    }
  },
  watch: {
    openKeys (val) {
      console.log('openKeys', val)
    }
  },
  methods: {
    handleClick (e) {
      if (e.key === '1') {
        this.$router.push('/myMicLib')
      } else if (e.key === '2') {
        this.$router.push('/myMicLib/micMangage')
      } else if (e.key === '3') {
        this.$router.push('/myMicLib/setting')
      }
    },
    titleClick (e) {
      console.log('titleClick', e)
    },
    toggleCollapsed () {
      this.collapsed = !this.collapsed
    },

    // 匹配导航菜单的显示模式
    matchMenuMode (mediaList) {
      this.menuMode = mediaList.matches ? 'horizontal' : 'inline'
    }
  },
  created () {
  },
  mounted () {
    const mediaList = window.matchMedia('(max-width: 768px)')
    this.matchMenuMode(mediaList)
    mediaList.addEventListener('change', this.matchMenuMode)
  },
  activated () {
  },
  deactivated () {
  }
}
</script>

<style lang="less" scoped>

.lib-container{
  display: flex;
  position: relative;
  min-width: 320px;
  max-width: 2560px;
  margin: 0 auto;
}

.ant-menu{
  width: 30%;
  max-width: 400px;

  .ant-menu-item{
    height: 60px;
    line-height: 60px;
    font-size: 20px;

    .anticon{
      font-size: 20px;
    }
  }
}

@media screen and (max-width: 768px) {
  .lib-container{
    flex-direction: column;
  }
  .ant-menu {
    width: 100%;
    max-width: 100%;
  }
}
</style>
