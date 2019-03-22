import { Message, Element } from '../../utils'
import _ from 'lodash'
const sel = Element.selectors
const style = css => $(`<style type="text/css">${css}</style>`)
const css = style(require('../css/nsfw.scss'))
const name = {
  Drawing: '그림',
  Hentai: '헨타이',
  Porn: '야짤',
  Sexy: '은꼴짤',
  Neutral: '특이점 없음'
}
const check = async function (article, options) {
  const { nsfw: { enable, drawing, hentai, porn, sexy } } = await options
  if (!enable) return
  _(article
    .find(sel.articleContent)
    .find('img:not(.nsfw-checked)')
    .addClass('nsfw-checked')
    .removeClass('sfw'))
    .map($)
    .forEach(async img => {
      img.one('contextmenu', evt => {
        evt.preventDefault()
        evt.stopPropagation()
        img.addClass('sfw')
      })
      img.attr('title', '분석중')
      const res = await Message.send('nsfw', img.attr('src'))
      const nsfw = res && _(res).keyBy('className').mapValues('probability').value()
      if (!nsfw) return img.addClass('sfw').attr('title', '분석 에러')
      img.attr('title', _.map(nsfw, (v, k) => `${name[k]} : ${Math.round(v * 10000) / 100}%`).join('\n'))
      if ((
        nsfw.Drawing * 100 < drawing &&
        nsfw.Hentai * 100 < hentai &&
        nsfw.Porn * 100 < porn &&
        nsfw.Sexy * 100 < sexy
      )) img.addClass('sfw')
    })
}
export default {
  async head (head, options) {
    const { nsfw: { enable } } = await options
    if (enable) head.append(css)
  },
  article (article, options) {
    check(article, options)
  },
  ready (options) {
    const article = $(sel.article) // article때 본문이 다 안읽힐 수도 있어서 재검사
    if (!article.length) return
    check(article, options)
  },
  update (options) {
    const article = $(sel.article)
    if (!article.length) return
    article.find('img.nsfw-checked').removeClass('nsfw-checked')
    if (options.nsfw.enable) {
      $('head').append(css)
      check(article, options)
    } else {
      css.detach()
    }
  }
}
