import { Element } from '../../utils'

export default {
  list (list) {
    const tags = list.find(Element.selectors.row + ' .gall_tit a:not(.reply_numbox)')
    let i = 0
    for (; i < tags.length; i++) {
      const tag = tags[i]
      const { attributes: { href } } = tag
      if (href && href.value.includes('/board/view')) break
    }
    tags.closest(Element.selectors.row).slice(0, i).hide()
    // 게시글 링크가 아닌 링크가 달린 경우 광고로 판단
  }
}
