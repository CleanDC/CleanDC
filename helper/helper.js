const style = css => $(`<style type="text/css">${css}</style>`)
$('head').append(style(require('./helper.css')))

if (document.querySelector('div.editor_wrap')) { // 에디터일때
  require('./gjjal')
  if (document.querySelector('#write')) require('./saveArticle') // 새글 쓰기일때
}
