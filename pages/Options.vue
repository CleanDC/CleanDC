<template>
  <mu-paper v-if="options" :z-depth="3" class="options">
    <mu-appbar style="width: 100%;" color="primary">
      <img src="./assets/title.png" class="title">
      <mu-button slot="right" icon :href="github" target="_blank">
        <mu-icon value=":fab fa-github" />
      </mu-button>
    </mu-appbar>
    <div class="d-flex flex-row">
      <side-nav />
      <router-view class="content" :options="options" @update="update" />
    </div>
    <toast :message.sync="message" />
  </mu-paper>
</template>
<script>
import { Storage, Message } from '../utils'
import SideNav from './components/SideNav.vue'
import Toast from './components/Toast.vue'
import _ from 'lodash'
import packageJson from '../package.json'

export default {
  name: 'Options',
  components: { SideNav, Toast },
  data () { return { options: null, message: '' } },
  computed: {
    github () { return packageJson.homepage },
  },
  async created () {
    this.options = await Storage.get('options')
    Message.listen('optionsUpdated', (options, sender) => {
      if (sender.url) this.options = options // 다른 페이지에서 변경되었을 경우
    }, false)
    this.$watch('options', _.debounce((v, o) => {
      if (v !== o) return // 레퍼런스가 바뀐건 위에 optionsUpdated에서 바뀐것
      this.message = '저장 되었습니다.'
      Storage.set('options', this.options)
      Message.send('optionsUpdated', this.options)
    }, 600), { deep: true })
  },
  methods: {
    update (path, value) { _.set(this.options, path, value) },
  },
}
</script>
<style lang="scss" scoped>
.options {
  width: 500px; margin: 20px auto;background: #f7f7f7;position: relative;overflow: hidden;
  .mu-appbar ::v-deep .mu-appbar-title{display: flex;flex-direction: column;}
  .title{object-fit: contain;margin: 8px 0px;width: 160px;-webkit-user-drag: none;}
  .content {flex:1;overflow-y:auto;padding:0 20px;overflow-x: hidden;}
  .tooltip{
    height: 0;
    text-align: center;
    .text{
      display: inline-block;
      transform: translateY(-100%);
      padding: 10px;
      background: #00000094;
      color: white;
      border-radius: 3px 3px 0 0;
    }
  }
}
</style>
<style>
body .mu-item-action{min-width: 43px;}
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR:500,700,900&subset=korean');
body { font-family: 'Noto Sans KR', sans-serif !important;user-select: none; }
.flex-1{flex:1;}
</style>
