<template>
  <mu-paper v-if="options" :z-depth="3" class="options">
    <mu-appbar style="width: 100%;" color="primary">
      <img src="./assets/title.png" class="title">
      <mu-button slot="right" icon @click="github">
        <mu-icon value=":fab fa-github" />
      </mu-button>
    </mu-appbar>
    <div class="d-flex flex-row">
      <side-nav />
      <router-view class="content" :options="options" @update="update" />
    </div>
  </mu-paper>
</template>
<script>
import { Storage, Message } from '../utils'
import SideNav from './components/SideNav.vue'
import _ from 'lodash'
import packageJson from '../package.json'

export default {
  name: 'Options',
  components: { SideNav },
  data () { return { options: null } },
  async created () {
    this.options = await Storage.get('options')
    this.$watch('options', v => {
      Storage.set('options', v)
      Message.send('optionsUpdated', v)
    }, { deep: true })
  },
  methods: {
    update (path, value) { _.set(this.options, path, value) },
    github () { window.open(packageJson.homepage, '_blank') },
  },
}
</script>
<style scoped>
.options {width: 500px; margin: 20px auto;background: #f7f7f7;}
.mu-appbar >>> .mu-appbar-title{display: flex;flex-direction: column;}
.title{object-fit: contain;margin: 8px 0px;width: 160px;-webkit-user-drag: none;}
.content {flex:1;overflow-y:auto;padding:0 20px;}
</style>
<style>
body .mu-item-action{min-width: 43px;}
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR:500,700,900&subset=korean');
body { font-family: 'Noto Sans KR', sans-serif !important;user-select: none; }
</style>
