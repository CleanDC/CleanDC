const { Editor, $ } = window
const subject = $('#subject')
// 글 작성 15초 이상이 되어야 임시글로 저장
setTimeout(function () {
  window.onbeforeunload = function () {
    var article = {
      content: Editor.getContent(),
      subject: subject.val(),
      attachments: Editor.getAttachments()
    }
    if (article.content.length > 50) { localStorage.saveArticle = JSON.stringify(article) }
  }
}, 15000)

const removeArticle = () => delete localStorage.saveArticle

// 글을 등록할시 임시글 삭제. 임시글 저장안함
$('#write').submit(function (event) {
  window.onbeforeunload = null
  removeArticle()
})

// 저장된 글이 있으면 불러오고 본문에 반영.
if (localStorage.saveArticle && confirm('-클린디씨-\n임시 저장된 글이 있습니다. 불러오시겠습니까?')) {
  const article = JSON.parse(localStorage.saveArticle)
  const attachments = article.attachments

  for (let i = 0; i < attachments.length; i++) {
    Editor.getSidebar().getAttacher(attachments[i].attacher).attachHandler(attachments[i].data)
  }
  Editor.modify({ content: article.content })
  subject.val(article.subject)
} else removeArticle() // 삭제
