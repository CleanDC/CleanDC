import { Storage, Message } from '../utils'
import _ from 'lodash'
const defaultOptions = {
  blacklist: {
    word: [], user: [], regex: [], jjal: []
  },
  font: true,
  style: 'responsive',
  check: {
    user: false,
    word: false,
    jjal: false,
    regex: false,
  },
  clickAnimation: false,
  blockUdong: false
}
async function initOptions () {
  const options = await Storage.get('options')
  if (!options) { // 옵션이 없을때
    const setting = await Storage.get('setting') // 이전 옵션 찾음
    if (!setting) return Storage.set('options', defaultOptions) // 이전 옵션 없으면 기본 옵션 사용
    let options
    try { options = JSON.parse(setting) } catch (e) { options = {} }
    // 구버전 옵션 변경
    options.style = ['slim', 'normal', 'responsive'][(options.style || 3) - 1]
    const {
      chk_blacklist: user,
      chk_blackword: word,
      chk_blackjjal: jjal,
      chk_regex: regex,
    } = options
    Object.assign(options, { check: { user, word, jjal, regex } })
    options.font = options.nanumgothic
    options.blacklist.user = options.blacklist.nick.map(x => x.replace(/\.\*\.\*$/, ''))
    _.forEach([ 'chk_blacklist', 'chk_blackword', 'chk_blackjjal', 'chk_regex', 'nanumgothic', 'blacklist.nick' ], x => _.unset(options, x))
    return Storage.set('options', _.merge(defaultOptions, options)) // 있으면 이전 옵션을 저장
  }
}

initOptions()

function createContextMenu (title, onclick) {
  chrome.contextMenus.create({
    title,
    contexts: ['link'],
    documentUrlPatterns: ['http://gall.dcinside.com/*', 'http://job.dcinside.com/*'],
    onclick
  })
}
createContextMenu(
  '차단 유저 추가',
  async function (info, tab) {
    const id = await Message.sendTab('requestTargetId', tab.id)
    if (!id) return
    const options = await Storage.get('options')
    const { blacklist } = options
    if (blacklist.user.includes(id)) return alert('이미 추가 되어 있는 유저 입니다.')
    blacklist.user.push(id)
    await Storage.set('options', options)
    Message.sendActiveTab('optionsUpdated', options)
    alert(`${id}가 차단 유저 리스트에 추가 되었습니다.`)
  })
createContextMenu(
  '차단 유저 삭제',
  async function (info, tab) {
    const id = await Message.sendTab('requestTargetId', tab.id)
    if (!id) return
    const options = await Storage.get('options')
    const removed = _.remove(options.blacklist.user, v => v === id)
    if (!removed.length) return alert('추가 되어있지 않은 유저입니다.')
    await Storage.set('options', options)
    alert(`${id}가 차단 유저 리스트에서 제거 되었습니다.`)
  })

Message.listen('requestGjjal', (pl, sdr, res) => res(JSON.parse(localStorage.gjjal || '{}')))
Message.listen('requestOptions', (pl, sdr, res) => Storage.get('options').then(res))
Message.listen('optionsUpdated', options => Message.sendAllTabs('optionsUpdated', options))
// 팝업을 표시할 조건
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  /http:\/\/(gall|job).dcinside.com\/.+\/.+/.test(tab.url) && chrome.pageAction.show(tabId)
})
