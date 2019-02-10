import { Message, Observer, Element } from '../utils'
import style from './functions/style'
import block from './functions/block'
import elementBlock from './functions/elementBlock'
import _ from 'lodash'
const options = Message.send('requestOptions')
const { $ } = global
const functions = [style, block, elementBlock]
const { selectors: sel } = Element
const c = () => {}

function injectHelper () {
  const script = document.createElement('script')
  $('body').append(script)
  script.onload = async function () {
    if (!$('div.editor_wrap').length) return // 에디터일때 helper/gjjal과 통신
    window.postMessage({ gjjal: await Message.send('requestGjjal') })
  }
  script.src = chrome.extension.getURL('helper.js')
}

async function head () {
  const head = await Observer.wait(document.documentElement, 'head')
  _.invokeMap(functions, 'head', head, options)
}
async function body () {
  const body = await Observer.wait(document.documentElement, 'body')
  _.invokeMap(functions, 'body', body, options)
  list(body).catch(c)
  article(body).catch(c)
}
async function list (body) {
  const list = await Observer.wait(body, sel.list)
  _.invokeMap(functions, 'list', list, options)
}
async function article (body) {
  const article = await Observer.wait(body, sel.article)
  _.invokeMap(functions, 'article', article, options)
  comments(article).catch(c)
  attachment(article).catch(c)
}
async function attachment (article) {
  const attachment = await Observer.wait(article, sel.attachment)
  _.invokeMap(functions, 'attachment', attachment, options)
}
async function comments (article) {
  const comments = await Observer.wait(article.parent(), sel.comments)
  _.invokeMap(functions, 'comments', comments, options)
  Observer.watch(comments, () => _.invokeMap(functions, 'comments', comments, options))
}
async function ready () {
  await new Promise(resolve => $(document).ready(resolve))
  injectHelper()
  _.invokeMap(functions, 'ready', options)
}
async function update () {
  Message.listen('optionsUpdated', options => {
    _.invokeMap(functions, 'update', options)
  })
}
function lifecycle () {
  head()
  body()
  ready()
  update()
}
lifecycle()
