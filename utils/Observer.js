import Deferred from './Deferred'

export function watch (target, cb, options = { childList: true }) {
  const element = $(target)
  const observer = new MutationObserver(function (mutations) {
    cb.call(this, mutations)
  })
  observer.observe(element.get(0), options)
  return observer
}

export function wait (parent, selector, { next, timeout } = {}) {
  parent = $(parent)
  const target = parent.find(selector)
  if (target.length) return Promise.resolve(target)
  const deferred = new Deferred()
  const observer = new MutationObserver(function (mutations) {
    let added = false
    for (const mutation of mutations) {
      if (added) break
      added = mutation.addedNodes.length
    }
    if (!added) return
    const target = parent.find(selector)
    if (!target.length || (next && !target.next()[0])) return
    deferred.resolve(target)
  })

  observer.observe(parent.get(0), { subtree: true, childList: true })

  if (timeout === undefined) $(document).ready(() => deferred.reject('limit'))
  else setTimeout(() => deferred.reject('timeout'), timeout)

  return deferred.promise.finally(() => observer.disconnect())
}
export default { watch, wait }
