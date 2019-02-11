import { Element } from '../../utils'

export default {
  list (list) {
    list.find(`.gall_num:contains('AD')`).parent(Element.selectors.row).hide() // 갤리스트 광고글 숨김
  }
}
