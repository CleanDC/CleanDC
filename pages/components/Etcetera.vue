<template>
  <div>
    <h2>기타 설정</h2>
    <div class="switch">
      클릭 애니메이션 (준비중)
      <mu-switch v-model="options.clickAnimation" />
    </div>
    <div class="switch">
      유동 차단 (준비중)
      <mu-switch v-model="options.blockUdong" />
    </div>
    <div class="switch">
      고정 짤방<br>
      <input
        ref="file"
        type="file"
        accept="image/*"
        style="z-index: -10;position: absolute;opacity:0"
        @change="readFile"
      >
      <mu-text-field
        v-model.lazy="url"
        full-width
        placeholder="이미지 URL을 붙여넣으세요."
        :action-icon="url?'close':'attach_file'"
        :action-click="actionClick"
      /><br>
    </div>
  </div>
</template>
<script>
const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42mL4//8/A0CAAQAI/AL+26JNFgAAAABJRU5ErkJggg=='
export default {
  name: 'Etcetera',
  props: ['options'],
  data () {
    return {
      gjjalData: JSON.parse(localStorage.gjjal || '{}')
    }
  },
  computed: {
    gjjal: {
      get () { return this.gjjalData },
      set (v) {
        this.gjjalData = v
        localStorage.gjjal = JSON.stringify(v)
      }
    },
    url: {
      get () { return this.gjjal.url || this.gjjal.name },
      set (url) {
        this.gjjal = /^https?:\/\//.test(url) ? { name: '클린디씨.png', base64: png, url } : {}
      }
    }
  },
  methods: {
    actionClick () {
      if (this.url) this.gjjal = {}
      else this.$refs.file.click()
    },
    readFile ($event) {
      const file = $event.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onloadend = () => { this.gjjal = { name: file.name, base64: reader.result } }
      reader.readAsDataURL(file)
    }
  }

}
</script>
<style scoped>
h3{display: inline;}
.switch{color: rgba(0, 0, 0, .54);font-size: 14px;line-height: 28px;margin-bottom: 14px;}
.switch .mu-switch{display: block}
</style>
