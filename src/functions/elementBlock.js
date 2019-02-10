// css로 막을 수 없는 광고 요소 제거
import { Observer } from '../../utils'

function gallListBlock (gallList) {
  gallList.find(`.gall_num:contains('AD')`).parent('.ub-content').hide() // 갤리스트 광고글 숨김
}

async function elementBlock () {
  const body = await Observer.wait(document.documentElement, 'body')
  Observer.wait(body, 'table.gall_list').then(x => gallListBlock(x), () => {})
}
elementBlock()

export function set () {}
export default { set }
