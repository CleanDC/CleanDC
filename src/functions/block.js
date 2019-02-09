import { Observer, Message, sleep } from '../../utils'
import _ from 'lodash'

{
  let rightClickId
  document.addEventListener('mousedown', event => {
    if (event.button !== 2) return
    const parent = $(event.target).closest('.ub-content').find('.ub-writer')
    if (!parent.length) return
    rightClickId = parent.attr('data-uid') || parent.attr('data-ip')
  }, true)
  Message.listen('requestTargetId', (payload, sender, res) => res(rightClickId))
}

class Block {
  constructor ({ check, blacklist }) {
    const { user, word, regex } = blacklist
    this.cache = {
      user: _.zipObject(user, user),
      word: _.zipObject(word, word),
      regex: regex.map(x => new RegExp(x)),
      jjal: _.zipObject(word, word),
    }
    Object.assign(this, // 체크 활성화가 되어있지 않은건 빈함수로 오버라이드
      _(['user', 'word', 'regex', 'jjal'])
        .filter(x => !check[x])
        .map(x => [x, () => {}])
        .fromPairs().value()
    )
  }

  list (table) {
    _(table.find('.ub-content')).map($).forEach(x => this.user(x) || this.word(x) || this.regex(x))
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
    _(wrap.find('.ub-content')).map($).forEach(x => this.user(x) || this.word(x) || this.regex(x))
  }

  user (item) {
    const writer = item.find('.ub-writer')
    const userInfo = _(['user_name', 'data-nick', 'data-ip', 'data-uid']).map(x => writer.attr(x)).compact().value()
    const match = _.find(userInfo, x => this.cache.user[x])
    if (match) item.addClass('cleandc-block')
    return match
  }
  word (item) {
    const text = item.text()
    const match = _.find(this.cache.word, x => text.includes(x))
    if (match) item.addClass('cleandc-block')
    return match
  }
  regex (item) {
    const writer = item.find('.ub-writer')
    const nick = writer.attr('data-nick')
    const match = _.find(this.cache.regex, x => x.test(nick))
    if (match) item.addClass('cleandc-block')
    return match && nick
  }
  async jjal (article) {
    const fileBox = await Observer.wait(article, 'ul.appending_file').catch(() => [])
    if (!fileBox.length) return
    await sleep()
    _(fileBox.find('li a')).map($)
      .map(a => ({
        name: a.text().trim,
        params: _.chain(a.attr('href')).split('?').get(1).split('&').compact().map(x => x.split('=')).fromPairs().value() // 쿼리스트링 파싱
      }))
      .filter(({ name }) => this.cache.jjal[name])
      .forEach(({ params }) => $(`img[src*=${params.no}],img[onclick*=${params.no}]`).addClass('cleandc-block'))
  }
}

export async function set (options) {
  const body = await Observer.wait(document.documentElement, 'body')
  const block = new Block(options)
  Observer.wait(body, 'table.gall_list').then(x => block.list(x), () => {})
  Observer.wait(body, 'div.view_content_wrap').then(article => {
    block.article(article) &&
    Observer.wait(article.parent(), 'div.comment_wrap')
      .then(x => block.commentsObserve(x), () => {})
  }, () => {})
}
export function update (options) {
  const block = new Block(options)
  const article = $('div.view_content_wrap')
  const table = $('table.gall_list')
  $('.cleandc-block').removeClass('cleandc-block')
  if (table.length) block.list(table)
  if (article.length) {
    block.article(article)
    block.comments(article.parent().find('div.comment_wrap'))
  }
}

export default { set, update }
