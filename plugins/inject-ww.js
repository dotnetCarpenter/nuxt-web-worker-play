
import ExampleWorker from '~/assets/js/Example.worker.js' // worker files has to end in ".worker.js" - see nuxt.config.js

function Worker () {
  const worker = new ExampleWorker()
  const listeners = []

  return Object.seal({
    inUse: false,
    listen (f) {
      listeners.push(['listen', f])
      worker.addEventListener('message', f)
    },
    unlisten (f) {
      remove(listeners, 'listen', f)
      worker.removeEventListener('message', f)
    },
    error (f) {
      listeners.push(['error', f])
      worker.addEventListener('messageerror', f)
    },
    unerror (f) {
      remove(listeners, 'error', f)
      worker.removeEventListener('messageerror', f)
    },
    message (data, transfer) {
      worker.postMessage(data, transfer)
    },
    destroy () {
      listeners.forEach(tuple => {
        this['un' + tuple[0]](tuple[1])
      })
      worker.terminate()
    }
  })
}

function remove (list, type, f) {
  list.splice(
    list.indexOf(
      find(list, tuple => tuple[0] === type && tuple[1] === f)
    )
    , 1
  )
}

function find (list, predicate) {
  for (let i = 0, len = list.length; i < len; i++) {
    if (predicate(list[i])) return list[i]
  }
}

export default (context, inject) => {
  inject('worker', {
    createWorker () {
      return new Worker()
    }
  })
}
