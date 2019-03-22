<template>
  <div v-if="options" class="popup">
    <img src="./assets/title.png" class="title" @click="optionsPage">
    <mu-radio v-model="options.style" value="slim" label="슬림형" />
    <mu-radio v-model="options.style" value="normal" label="노멀형" />
    <mu-radio v-model="options.style" value="responsive" label="반응형" />
    <mu-checkbox v-model="options.font" label="나눔고딕" />
    <mu-checkbox v-model="options.nsfw.enable" label="후방주의" />
    <mu-checkbox v-model="options.check.user" label="유저 차단" />
    <mu-checkbox v-model="options.check.word" label="키워드 차단" />
  </div>
</template>
<script>
import { Storage, Message } from '../utils'

export default {
  name: 'Popup',
  data () { return { options: null } },
  async created () {
    this.options = await Storage.get('options')
    this.$watch('options', v => {
      Message.send('optionsUpdated', v)
      Storage.set('options', v)
    }, { deep: true })
  },
  methods: {
    optionsPage () { chrome.runtime.openOptionsPage() }
  },
}
</script>
<style>
@import url('https://fonts.googleapis.com/css?family=Do+Hyeon&subset=korean');

body { font-family: 'Do Hyeon', sans-serif !important; user-select: none;-webkit-user-drag: none;}
body .mu-radio-label,body .mu-checkbox-label{font-size: 17px;flex: 1;text-align: center}
.mu-checkbox-ripple-wrapper,.mu-radio-ripple-wrapper{z-index: -10;}
.popup{display: flex;flex-direction: column;width:120px;height: 200px;justify-content: space-between;}
.popup>:not(img){margin:4px 8px;}
.title{width:100%;cursor:pointer;}
</style>
