// NotificationOptions - https://developer.chrome.com/apps/notifications#type-NotificationOptions
import Deferred from './Deferred'

let idx = -1
const iconUrl = 'icons/icon128.png'

const notifications = {}

class Notification {
  constructor (title, message, optional = {}) {
    this.id = `${idx += 1}`
    notifications[this.id] = this
    this.options = Object.assign({
      title, message, iconUrl, type: 'basic'
    }, optional)
    chrome.notifications.create(this.id, this.options)
    const { resolve: resolvePromise, promise } = new Deferred()
    Object.assign(this, { resolvePromise, promise })
  }

  get clicked () {
    const deferred = new Deferred()
    this.promise.then(({ type }) => deferred.resolve(type === 'clicked'))
    return deferred.promise
  }

  get closed () {
    const deferred = new Deferred()
    this.promise.then(({ type, byUser }) => deferred.resolve(type === 'closed' && { byUser }))
    return deferred.promise
  }

  get buttonClicked () {
    const deferred = new Deferred()
    this.promise.then(({ type, button }) => deferred.resolve(type === 'buttonClicked' && button))
    return deferred.promise
  }

  resolvePromise (res) {
    delete notifications[this.id]
    this.resolve(res)
  }

  update (notificationOptions) {
    Object.assign(this.options, notificationOptions)
    chrome.notifications.update(this.id, this.options)
  }

  clear () {
    chrome.notifications.clear(this.id)
  }
}
if (chrome.notifications) {
  chrome.notifications.onClosed.addListener((notificationId, byUser) => {
    notifications[notificationId].resolvePromise({ type: 'closed', byUser })
  })
  chrome.notifications.onClicked.addListener((notificationId) => {
    notifications[notificationId].resolvePromise({ type: 'clicked' })
  })
  chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    const notification = notifications[notificationId]
    const button = notification.options.buttons[buttonIndex]
    notification.resolvePromise({ type: 'buttonClicked', button, buttonIndex })
  })
}
export function create (title, message, optional) {
  return new Notification(title, message, optional)
}

export default { create, Notification }
