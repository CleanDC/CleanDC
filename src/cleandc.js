import { Message, Observer, Element } from '../utils'
import * as functions from './functions'
import _ from 'lodash'
const options = Message.send('requestOptions')
const { selectors: sel } = Element
const c = () => {}

function injectHelper () {
  const script = document.createElement('script')
  $(document.body).append(script)
  script.onload = async function () {
    if (!$(sel.editor).length) return // 에디터일때 helper/gjjal과 통신
    window.postMessage({ gjjal: await Message.send('requestGjjal') })
  }
  script.src = chrome.extension.getURL('helper.js')
}

const lifecycle = {
  async head () {
    const head = await Observer.wait(document.documentElement, 'head')
    _.invokeMap(functions, 'head', head, options)
  },
  async body () {
    const body = await Observer.wait(document.documentElement, 'body')
    _.invokeMap(functions, 'body', body, options)
    this.list(body).catch(c)
    this.article(body).catch(c)
  },
  async list (body) {
    const list = await Observer.wait(body, sel.list, { next: true }) // 다음 요소 그려질때까지 대기
    _.invokeMap(functions, 'list', list, options)
  },
  async article (body) {
    const article = await Observer.wait(body, sel.article, { next: true }) // 다음 요소 그려질때까지 대기
    _.invokeMap(functions, 'article', article, options)
    this.comments(article).catch(c)
    this.attachment(article).catch(c)
  },
  attachment (article) {
    const attachment = article.find(sel.attachment) // article 내부에 있고 다 그려진 시점이기 때문에 동기로 찾음
    _.invokeMap(functions, 'attachment', attachment, options)
  },
  async comments (article) {
    const comments = await Observer.wait(article.parent(), sel.comments)
    Observer.watch(comments, () => _.invokeMap(functions, 'comments', comments, options))
  },
  async ready () {
    await new Promise(resolve => $(document).ready(resolve))
    injectHelper()
    _.invokeMap(functions, 'ready', options)
  },
  update () {
    Message.listen('optionsUpdated', options => {
      _.invokeMap(functions, 'update', options)
    })
  }
}

lifecycle.head()
lifecycle.body()
lifecycle.ready()
lifecycle.update()
