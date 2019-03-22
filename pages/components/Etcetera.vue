<template>
  <div class="etcetera">
    <h2>기타 설정</h2>
    <div class="nsfw">
      <div class="d-flex align-items-center">
        <h3 class="flex-1">후방주의</h3>
        <mu-switch v-model="options.nsfw.enable" />
      </div>
      <div class="item">
        <div class="label">그림</div>
        <mu-slider
          v-model="options.nsfw.drawing"
          :color="color(options.nsfw.drawing)"
          :thumb-color="color(options.nsfw.drawing)"
          :disabled="!options.nsfw.enable"
        />
      </div>
      <div class="item">
        <div class="label">헨타이</div>
        <mu-slider
          v-model="options.nsfw.hentai"
          :color="color(options.nsfw.hentai)"
          :thumb-color="color(options.nsfw.hentai)"
          :disabled="!options.nsfw.enable"
        />
      </div>
      <div class="item">
        <div class="label">야짤</div>
        <mu-slider
          v-model="options.nsfw.porn"
          :color="color(options.nsfw.porn)"
          :thumb-color="color(options.nsfw.porn)"
          :disabled="!options.nsfw.enable"
        />
      </div>
      <div class="item">
        <div class="label">은꼴짤</div>
        <mu-slider
          v-model="options.nsfw.sexy"
          :color="color(options.nsfw.sexy)"
          :thumb-color="color(options.nsfw.sexy)"
          :disabled="!options.nsfw.enable"
        />
      </div>
    </div>
    <div class="switches">
      <div class="switch">
        유동 차단
        <mu-switch v-model="options.blockUdong" />
      </div>
      <div class="switch">
        클릭 애니메이션 (준비중)
        <mu-switch :value="options.clickAnimation&&false" disabled />
      </div>
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
    color (v) {
      const [min, max] = [20, 50]
      const p = v < min ? 0 : v > max ? 1 : (v - min) / (max - min)
      return `rgb(${243 - (243 - 33) * p},${33 + (150 - 33) * p},${33 + (243 - 33) * p})`
    },
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
<style lang="scss" scoped>
.etcetera{
  h3{display: inline;}
  .nsfw{
    .item{
      display: flex;
      .label{flex:1;text-align: center}
      .mu-slider{flex:3}
    }
  }
  .switches{
    display: flex;
    .switch{ flex:1 }
  }
  .switch{
    color: rgba(0, 0, 0, .54);
    font-size: 14px;
    line-height: 28px;
    margin-bottom: 14px;
    .mu-switch{display: block}
  }
}
</style>
