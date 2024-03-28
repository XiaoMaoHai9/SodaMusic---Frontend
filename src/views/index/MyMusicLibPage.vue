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
        <a-menu-item key="4" @click="confirm">
          <a-icon type="logout" /><span>退出</span>
        </a-menu-item>
      </a-menu>
    <keep-alive :include='keepArr'>
      <router-view/>
    </keep-alive>
  </div>

</template>

<script>
import { mapMutations } from 'vuex'
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
    ...mapMutations(['logout']),

    handleClick (e) {
      if (e.key === '1') {
        this.$router.push('/myMicLib')
      } else if (e.key === '2') {
        this.$router.push('/myMicLib/micMangage')
      } else if (e.key === '3') {
        this.$router.push('/myMicLib/setting')
      } else if (e.key === '4') {
        if (this.$route.path === '/myMicLib/libIndex') e.key = '1'
        if (this.$route.path === '/myMicLib/micMangage') e.key = '2'
        if (this.$route.path === '/myMicLib/setting') e.key = '3'
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
    },

    // 退出确认弹窗
    confirm () {
      const _this = this
      this.$confirm({
        title: '确认退出',
        okText: '确认',
        cancelText: '取消',
        onOk () {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              // 账户数据处理
              _this.logout('sodamusic')
              // 跳转到发现页
              _this.$router.push('/found')
              _this.$message.success('退出成功！')
              resolve()
            }, 200)
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel () {}
      })
    }
  },
  created () {
    if (this.$route.path !== '/myMicLib/libIndex') this.$router.push('/myMicLib/libIndex')
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
  overflow: hidden;

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
