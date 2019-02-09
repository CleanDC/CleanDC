import Deferred from './Deferred'
export function get (name) {
  const deferred = new Deferred()
  chrome.storage.sync.get(name, x => deferred.resolve(x[name]))
  return deferred.promise
}

export function set (name, value) {
  const deferred = new Deferred()
  chrome.storage.sync.set({ [name]: value }, deferred.resolve)
  return deferred.promise
}
export function remove (name) {
  return chrome.storage.sync.remove(name)
}

export default { get, set, remove }
