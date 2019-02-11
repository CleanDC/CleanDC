__webpack_public_path__ = window.chrome.extension.getURL('') // eslint-disable-line camelcase
const style = css => $(`<style type="text/css">${css}</style>`)
const font = style(require('../css/font.css'))
const cleandc = style(require('../css/cleandc.css'))
const slimdc = style(require('../css/slimdc.scss'))

async function updateStyle (head, options) {
  const { style } = options
  if (style !== 'responsive') slimdc.removeAttr('media')
  else slimdc.attr('media', 'screen and (max-width: 1024px)')

  if (style === 'slim' || style === 'responsive') head.append(slimdc)
  else slimdc.detach()

  if (options.font) head.append(font)
  else font.detach()
}
export function update (options) { updateStyle($('head'), options) }
export async function head (head, options) {
  head.append(cleandc)
  updateStyle(head, await options)
}
export default { head, update }
