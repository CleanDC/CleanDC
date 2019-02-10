import { Observer, Message } from '../../utils'
// eslint-disable-next-line camelcase
__webpack_public_path__ = window.chrome.extension.getURL('')
const style = css => $(`<style type="text/css">${css}</style>`)
const font = style(require('../css/font.css'))
const cleandc = style(require('../css/cleandc.css'))
const slimdc = style(require('../css/slimdc.css'))

async function updateStyle (options) {
  const head = await Observer.wait(document.documentElement, 'head')
  if (!options) options = await Message.send('requestOptions')
  const { style } = options
  if (style !== 'responsive') slimdc.removeAttr('media')
  else slimdc.attr('media', 'screen and (max-width: 1024px)')

  if (style === 'slim' || style === 'responsive') head.append(slimdc)
  else slimdc.detach()

  if (options.font) head.append(font)
  else font.detach()
}

export function set (options) { updateStyle(options) }
export function update (options) { updateStyle(options) }
export default { set, update }

Observer.wait(document.documentElement, 'head').then(head => head.append(cleandc))
