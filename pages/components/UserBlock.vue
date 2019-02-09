<template>
  <div>
    <h2>유저 차단</h2>
    <h3>차단 유저 목록</h3>
    <mu-switch v-model="options.check.user" label="활성화" />
    <chips :chips.sync="options.blacklist.user" />
    <h3>정규식 차단 목록</h3>
    <mu-switch v-model="options.check.regex" label="활성화" />
    <chips :chips.sync="options.blacklist.regex" />
  </div>
</template>
<script>
import Chips from './Chips.vue'
export default {
  name: 'UserBlock',
  components: { Chips },
  props: ['options'],
}
</script>
<style scoped>
h3{display: inline;}
</style>
