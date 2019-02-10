import { Message } from '../utils'
import style from './functions/style'
import block from './functions/block'
import './functions/elementBlock'
const { $ } = global

function injectHelper () {
  const script = document.createElement('script')
  $('body').append(script)
  script.onload = async function () {
    if (!$('div.editor_wrap').length) return // 에디터일때 helper/gjjal과 통신
    window.postMessage({ gjjal: await Message.send('requestGjjal') })
  }
  script.src = chrome.extension.getURL('helper.js')
}

async function cleandc () {
  const options = await Message.send('requestOptions')
  style.set(options)
  block.set(options)
  $(document).ready(() => injectHelper())
}
cleandc()

Message.listen('optionsUpdated', options => {
  style.update(options)
  block.update(options)
})
