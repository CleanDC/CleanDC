import { Element } from '../../utils'

// css로 막을 수 없는 광고 요소 제거
async function list (list) {
  list.find(`.gall_num:contains('AD')`).parent(Element.selectors.row).hide() // 갤리스트 광고글 숨김
}

export default { list }
