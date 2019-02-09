<template>
  <div class="chips" @click="click">
    <mu-chip v-if="!list.length" class="chip">비어있음</mu-chip>
    <mu-chip
      v-for="(item,idx) of list"
      :key="item"
      :ref="idx"
      class="chip"
      :delete="!editing||focus!==idx"
      :contenteditable="focus===idx"
      @input="editing=true"
      @blur="(editing=false)||blur($event,idx)"
      @delete="remove(idx)"
      @focus="onFocus($event,idx)"
      @keydown.esc="cancel($event,idx)"
      @keydown.delete="del($event,idx)"
      @keydown.enter.prevent="enter($event,idx)"
      @click.native.stop
    >
      {{ item }}
    </mu-chip>
    <mu-chip style="position:absolute" @focus="create(list.length-1)" />
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'Chips',
  props: ['chips'],
  data () {
    return {
      focus: null,
      list: _(this.chips).uniq().compact().value(),
      editing: false,
    }
  },
  watch: {
    async focus (v, o) {
      if (v === null) return
      await this.$nextTick() // 엘리먼트 생성 대기
      const item = this.$refs[v]
      if (item) item[0].$el.focus()
    },
    list (v) { this.$emit('update:chips', this.list.slice()) }
  },
  methods: {
    blur ($evt, idx) {
      if (this.focus === idx) this.focus = null // 하지 않으면 지웠을때 포커싱을 옮긴게 적용이 안됨
      this.editing = false
      const el = $evt.target
      let text = el.innerText
      const list = this.list
      const found = _.findIndex(list, (x, i) => i !== idx && x === text)
      if (found > -1) list.splice(found, 1, undefined)
      if (text) list.splice(idx, 1, text)
      else list.splice(idx, 1)
      _.pull(list, undefined)
    },
    async onFocus ($evt, idx) {
      this.focus = idx
      const range = document.createRange()
      range.selectNodeContents($evt.target)
      range.collapse(false)
      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    },
    del ($evt, idx) {
      if ($evt.target.innerText) return
      $evt.preventDefault()
      $evt.target.blur()
      this.focus = idx - 1
    },
    async create (idx) {
      this.list.splice(idx + 1, 0, '')
      this.focus = idx + 1
      await this.$nextTick() // blur 대기
      this.editing = true
    },
    click ($evt) {
      const { offsetX: x, offsetY: y } = $evt
      const { idx = -1 } = _.chain(this.list.length).times()
        .map(x => this.$refs[x])
        .map(x => x[0].$el)
        .map((x, idx) => ({ idx, l: x.offsetLeft, t: x.offsetTop }))
        .findLast(({ l, t }) => l < x && t < y).value() || {}
      this.create(idx)
    },
    async enter ($evt, idx) {
      const el = $evt.target
      const { length } = this.list
      el.blur()
      $evt.preventDefault()
      await this.$nextTick()
      this.create(idx - (length - this.list.length))
    },
    remove (idx) {
      const el = this.$refs[idx][0].$el
      el.innerText = ''
      el.blur() //  blur를 태워서 지워지게 해야함. 블러에서 값을 쓰기 때문
    },
    cancel ($evt, idx) {
      const el = $evt.target
      el.innerText = this.list[idx]
      el.blur()
    }
  }
}
</script>
<style>
.chips{position: relative;min-height: 60px;margin:0 -3px 20px -3px;}
.chip{vertical-align: top;margin:3px;}
</style>
