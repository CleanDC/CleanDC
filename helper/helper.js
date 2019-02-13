import { selectors as sel } from '../utils/Element'
const style = css => $(`<style type="text/css">${css}</style>`)
$(document.head).append(style(require('./helper.css')))

if (document.querySelector(sel.editor)) { // 에디터일때
  require('./gjjal')
  if (document.querySelector(sel.write)) require('./saveArticle') // 새글 쓰기일때
}
