<template>
  <div>
    <h2>키워드 차단</h2>
    <h3>차단 키워드 목록</h3>
    <mu-switch v-model="options.check.word" label="활성화" />
    <chips :chips.sync="options.blacklist.word" />
    <h3>차단 짤방 파일명 목록</h3>
    <mu-switch v-model="options.check.jjal" label="활성화" />
    <chips :chips.sync="options.blacklist.jjal" />
  </div>
</template>
<script>
import Chips from './Chips.vue'
export default {
  name: 'WordBlock',
  components: { Chips },
  props: ['options'],
}
</script>
<style scoped>
h3{display: inline;}
</style>
