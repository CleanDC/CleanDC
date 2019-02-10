import { Observer, Message } from '../../utils'
import _ from 'lodash'
import querystring from 'querystring'
const sel = {
  list: 'table.gall_list',
  row: '.ub-content',
  writer: '.ub-writer',
  article: 'div.view_content_wrap',
  attachment: 'ul.appending_file',
  comments: 'div.comment_wrap',
  contextMenu: '.nickname,.ip,b>b'
}
const cls = {
  block: 'cleandc-block',
  row: 'ub-content',
  writer: 'ub-writer',
}
const tag = { contextMenu: '<a href="javascript:" class="contextmenu"></a>' }

class Block {
  constructor ({ check, blacklist }) {
    const { user, word, regex, jjal } = blacklist
    this.cache = {
      user: _.zipObject(user, user),
      word: _.zipObject(word, word),
      regex: regex.map(x => new RegExp(x)),
      jjal: _.zipObject(jjal, jjal),
    }
    Object.assign(this, // 체크 활성화가 되어있지 않은건 빈함수로 오버라이드
      _(['user', 'word', 'regex', 'jjal'])
        .filter(x => !check[x])
        .map(x => [x, () => {}])
        .fromPairs().value()
    )
  }

  list (table) {
    _(table.find(sel.row)).map($).forEach(x => this.user(x) || this.word(x) || this.regex(x))
  }

  article (article) {
    const onMatch = msg => {
      alert(msg)
      window.history.back()
    }
    this.jjal(article)
    if (this.user(article)) return onMatch('차단된 작성자의 게시물입니다.')
    if (this.word(article)) return onMatch('차단된 키워드가 있는 글입니다.')
    if (this.regex(article)) return onMatch('정규식 차단된 작성자의 게시물입니다.')
    return true
  }
  commentsObserve (wrap) {
    Observer.watch(wrap, () => this.comments(wrap))
  }
  comments (wrap) {
    _(wrap.find(sel.row)).map($).forEach(x => this.user(x) || this.word(x) || this.regex(x))
  }

  user (item) {
    const writer = item.find(sel.writer)
    const { uid, ip, nick } = writer.data()
    const match = _.find([uid, ip, nick], x => this.cache.user[x])
    if (match) item.addClass(cls.block)
    return match
  }
  word (item) {
    const text = item.text()
    const match = _.find(this.cache.word, x => text.includes(x))
    if (match) item.addClass(cls.block)
    return match
  }
  regex (item) {
    const writer = item.find(sel.writer)
    const { nick } = writer.data()
    const match = _.find(this.cache.regex, x => x.test(nick))
    if (match) item.addClass(cls.block)
    return match && nick
  }
  async jjal (article) {
    const fileBox = await Observer.wait(article, sel.attachment).catch(() => [])
    if (!fileBox.length) return
    _(fileBox.find('li a')).map($)
      .map(a => ({
        name: a.text(),
        params: querystring.parse(_(a.attr('href')).split('?').get(1)) // 쿼리스트링 파싱
      }))
      .filter(({ name }) => this.cache.jjal[name])
      .forEach(({ params }) => $(`img[src*=${params.no}],img[onclick*=${params.no}]`).addClass(cls.block))
  }
}

export async function set (options) {
  const body = await Observer.wait(document.documentElement, 'body')
  const block = new Block(options)
  Observer.wait(body, sel.list).then(x => block.list(x), () => {})
  Observer.wait(body, sel.article).then(article => {
    block.article(article) &&
    Observer.wait(article.parent(), sel.comments)
      .then(x => block.commentsObserve(x), () => {})
  }, () => {})
}
export function update (options) {
  const block = new Block(options)
  const article = $(sel.article)
  const table = $(sel.list)
  $(`.${cls.block}`).removeClass(cls.block)
  if (table.length) block.list(table)
  if (article.length) {
    block.article(article)
    block.comments(article.parent().find(sel.comments))
  }
}

export default { set, update }

$(document).ready(() => {
  // context 메뉴 지원 래퍼 추가
  $(sel.writer).find(sel.contextMenu)
    .wrapInner(tag.contextMenu)
  const comments = $(sel.comments)
  comments.length && Observer.watch(comments, () => {
    comments.find(sel.writer).find(sel.contextMenu)
      .wrapInner(tag.contextMenu)
  })

  // 우클릭 한 유저 정보 기억
  let rightClickId
  document.addEventListener('mousedown', event => {
    if (event.button !== 2) return
    const writer = $(event.target).closest(sel.row).find(sel.writer)
    if (!writer.length) return
    const { uid, ip, nick } = writer.data()
    rightClickId = uid || ip || nick
  }, true)
  Message.listen('requestTargetId', (payload, sender, res) => res(rightClickId))
})
