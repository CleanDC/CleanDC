<template>
  <div>
    <h2>스타일</h2>
    <mu-form :model="options">
      <mu-form-item label="스타일 선택">
        <mu-radio v-model="style" value="slim" label="슬림형" />
        <mu-radio v-model="style" value="normal" label="노멀형" />
        <mu-radio v-model="style" value="responsive" label="반응형" />
      </mu-form-item>
      <mu-form-item label="폰트 사용">
        <mu-switch v-model="font" label="나눔고딕" />
      </mu-form-item>
    </mu-form>
  </div>
</template>
<script>

export default {
  name: 'Style',
  props: ['options'],
  computed: {
    style: {
      get () { return this.options.style },
      set (v) { this.$emit('update', 'style', v) }
    },
    font: {
      get () { return this.options.font },
      set (v) { this.$emit('update', 'font', v) }
    }
  }

}
</script>
