import { Message, Element } from '../../utils'
import _ from 'lodash'
const sel = Element.selectors
const style = css => $(`<style type="text/css">${css}</style>`)
const css = style(require('../css/nsfw.scss'))

export default {
  head (head, options) {
    head.append(css)
  },
  article (article) {
    const imgs = _.map(article.find(sel.articleContent).find('img'), $)
    _.forEach(imgs, async img => {
      const res = await Message.send('nsfw', img.attr('src'))
      const nsfw = res && _(res).keyBy('className').mapValues('probability').value()
      if (nsfw) {
        if (nsfw.Neutral > 0.7) img.addClass('sfw')
        img.one('click', evt => {
          evt.preventDefault()
          evt.stopPropagation()
          img.addClass('sfw')
        })
      } else {
        img.addClass('sfw')
      }
      console.log(nsfw)
    })
  }
}
