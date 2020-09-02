<template>
  <div class="chips" @mousedown="mousedown" @mouseup="mouseup">
    <mu-chip v-if="!list.length" class="chip">비어있음</mu-chip>
    <mu-chip
      v-for="(item,idx) of list"
      :key="item"
      ref="chips"
      class="chip"
      :idx="idx"
      :delete="!editing||focus!==idx"
      :contenteditable="focus===idx"
      @input="editing=true"
      @blur="(editing=false)||blur($event,idx)"
      @delete="remove(idx)"
      @focus="onFocus($event,idx)"
      @keydown.esc="cancel($event,idx)"
      @keydown.delete="del($event,idx)"
      @keydown.enter.prevent="enter($event,idx)"
      @mousedown.native.stop="insertTo=null"
      @paste.prevent="paste($event,idx)"
    >
      {{ item }}
    </mu-chip>
    <mu-chip style="position:absolute" @focus="insert(list.length-1)" />
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
      insertTo: null,
      list: _(this.chips).uniq().compact().value(),
      editing: false,
    }
  },
  computed: {
    listCompact () { return this.list.filter(x => x) }
  },
  watch: {
    listCompact (n, o) {
      if (_.isEqual(n, o)) return
      this.$emit('update:chips', n)
    },
    async list (v) {
      await this.$nextTick()
      this.$refs.chips.sort((a, b) => a.$attrs.idx - b.$attrs.idx) // 순서를 idx로 정렬
    },
    async focus (v, o) {
      if (v === null) return
      await this.$nextTick() // 엘리먼트 생성 대기
      const item = this.$refs.chips[v]
      if (item) item.$el.focus()
    },
  },
  methods: {
    blur ($evt, idx) {
      if (this.focus === idx) this.focus = null // 하지 않으면 지웠을때 포커싱을 옮긴게 적용이 안됨
      this.editing = false
      const el = $evt.target
      const text = el.innerText.trim()
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
    async insert (idx) {
      this.list.splice(idx + 1, 0, '')
      this.focus = idx + 1
      await this.$nextTick() // blur 대기
      this.editing = true
    },
    mousedown ($evt) {
      const { offsetX: x, offsetY: y } = $evt
      let { idx = -1 } = _.chain(this.$refs.chips)
        .map('$el')
        .map((el, idx) => ({ idx, l: el.offsetLeft, t: el.offsetTop }))
        .findLast(({ l, t }) => l < x && t < y).value() || {}
      const emptyIdx = this.list.indexOf('') // 빈아이템은 없어질 아이템이기 때문에 빼줌
      if (emptyIdx > -1 && idx > emptyIdx) idx--
      this.insertTo = idx
    },
    mouseup ($evt) {
      if (this.insertTo === null) return
      if (this.insertTo >= this.list.length) this.insertTo = this.list.length - 1
      this.insert(this.insertTo)
    },
    async enter ($evt, idx) {
      const el = $evt.target
      const { length } = this.list
      el.blur()
      $evt.preventDefault()
      await this.$nextTick()
      this.insert(idx - (length - this.list.length))
    },
    remove (idx) {
      const el = this.$refs.chips[idx].$el
      el.innerText = ''
      el.blur() //  blur를 태워서 지워지게 해야함. 블러에서 값을 쓰기 때문
    },
    cancel ($evt, idx) {
      const el = $evt.target
      el.innerText = this.list[idx]
      el.blur()
    },
    async paste ($evt, idx) {
      const [paste, ...rest] = $evt.clipboardData.getData('text').split(/[\n]/)
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      selection.deleteFromDocument()
      range.insertNode(document.createTextNode(paste))
      if (rest.length) {
        $evt.target.blur()
        this.list.splice(idx + 1, 0, ..._(rest).uniq().difference(this.list).value())
      }
    }
  }
}
</script>
<style>
.chips{position: relative;min-height: 60px;margin:0 -3px 20px -3px;}
.chip{vertical-align: top;margin:3px;}
</style>
