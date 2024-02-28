<template>
  <div class="search-bar-container" v-click-outside="closeGuessContent">
    <!-- 搜索框 -->
    <a-input-search class="input-search" name="search" size="large" placeholder="音乐/MV/用户" @search="onSearch" v-model="inputValue" @input="debounceHandler" @focus="isShowGuess = searchList.length !== 0"/>
    <!-- 猜你想搜 -->
    <div class="guess-search-popover br bs mask-style-w" v-show="isShowGuess" >
      <!-- 展示列表 -->
      <ul class="pop-ul">
        <li class="br tran-03s bs" v-for="item in searchList.slice(0, 4)" :key="item.id" @click="playAudio(item)">
          <!-- 结果信息 -->
          <div class="res-info">
            <span class="song">{{item.name}}</span>
            <span class="singer">{{item.singer.join(" / ")}}</span>
          </div>
          <!-- 播放按钮 -->
          <a-icon class="play-btn f-ds" type="play-circle" theme="filled" />
        </li>
        <li class="br tran-03s bs">
          <span class="more">更多</span>
        </li>
     </ul>
    </div>
  </div>
</template>

<script>
import { switchSearch, switchGetAudioUrl } from '@/utils/search/switch-search'
import { cleanSong } from '@/utils/search/format-song'
import _ from 'lodash'
import vClickOutside from 'vue-click-outside'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'SearchBar',
  data () {
    return {
      inputValue: '',
      isShowGuess: false,
      searchList: [],
      api: ['NeteaseCloudMusic', 'QQMusic', 'SouGouMusic']
    }
  },
  directives: {
    'click-outside': vClickOutside
  },
  watch: {
    // 监听输入框内容
    inputValue (newValue, oldValue) {
      if (newValue === '') {
        this.searchList = []
      }
    },

    searchList (newValue, oldValue) {
      // 如果数组不为空 -> guess框显示
      this.isShowGuess = newValue.length !== 0
    }
  },
  computed: {
    ...mapState(['audioPlayer'])
  },
  methods: {
    ...mapMutations(['changeIsStart']),

    // 确认搜索
    onSearch (input) {
      // if (this.searchList.length === 0) { return }
    },

    // 关键词变化 -> 防抖 - 防止单位时间内频繁请求
    debounceHandler: _.debounce(function () {
      // 输入框不为空
      if (this.inputValue !== '') {
        this.showGuessContent()
      }
    }, 500),

    // 展示 -> 猜你想搜
    showGuessContent (input) {
      // 请求关键词索引结果
      switchSearch({ input: this.inputValue, api: this.api[0] }).then(res => {
        // 数据清洗
        this.searchList = res.map(item => cleanSong({ info: item, api: this.api[0] }))
      }).catch((error) => {
        console.log(error)
      })
    },

    // 关闭 -> 猜你想搜
    closeGuessContent () {
      this.isShowGuess = false
    },

    // 播放音频
    playAudio (info) {
      switchGetAudioUrl({ id: info.id, api: this.api[0] }).then(res => {
        if (res.url) {
          info.audioUrl = res.url
          info.time = res.time
          // 歌曲查重判断
          // -------------------------
          // -------------------------
          // -------------------------
          this.$store.commit('addAudio', info)
          // 如果播放器已启动
          if (this.audioPlayer.isStart) {
            this.$store.commit('changePlayNow', 'end')
          } else {
            // 启动播放器
            this.changeIsStart(true)
          }
        } else {
          this.$message.warning('暂无音源，登录尝试获取')
        }
        // 点完 -> 隐藏猜你想搜
        this.isShowGuess = false
      }).catch((error) => {
        console.log(error)
      })
    }

  }
}
</script>

<style lang="less" scoped>
.search-bar-container{
  position: relative;
  display: inline-block;
  width: 250px;
  height: 40px;
  line-height: 40px;
  margin-right: 20px;
  vertical-align: middle;

  .input-search{
    width: 250px;
  }

  .guess-search-popover{
    position: absolute;
    width: 250px;
    padding: 15px 15px 0 15px;
    top: 50px;
    border: 1px solid @color-grey;
    z-index: 10;

    .pop-ul{
      text-align: center;

      li{
        .flex-row();
        width: 100%;
        padding: 15px;
        margin-bottom: 15px;
        cursor: pointer;
        background-color: #fff;

        &:hover{
          background-color: #ececec;
        }

        .res-info{
          width: 80%;
          .flex-col();
          .song, .singer{
            width: 100%;
            text-align: left;
            color: @font-color-text-deep;
            .textover-ellipsis()
          }

          .song{
            height: 17px;
            line-height: $height;
            font-size: $height;
            margin-bottom: 8px;
          }

          .singer{
            height: 14px;
            line-height: $height;
            font-size: $height;
          }
        }

        .play-btn{
          font-size: 30px;
          color: @primary-color;
        }

        .more{
          width: 100%;
          height: 14px;
          line-height: $height;
          font-size: 14px;
          text-align: center;
          color: @font-color-text-deep;
        }
      }
    }
  }
}
</style>
