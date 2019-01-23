import { componentAppeared } from './plugin'
import { scrollParent, throttle } from './utils'
import SimpleMap from './SimpleMap'

const PRELOAD = 1.3
const THROTTLE_WAIT = 200
const DEFAULT_EVENTS = ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove']
const ParentsList = new SimpleMap()

function _eventFired (container) {
  ParentsList.get(container)
    .filter(el => checkInView(el))
    .forEach(el => {
      componentAppeared(el)
    })
}

function checkInView (el) {
  const rect = el.getBoundingClientRect()
  return (rect.top < window.innerHeight * PRELOAD && rect.bottom > 0) &&
          (rect.left < window.innerWidth * PRELOAD && rect.right > 0)
}

function addListeners (container, el) {
  if (!ParentsList.has(container)) {
    const list = []
    list.eventFired = throttle(_eventFired.bind(this, container), THROTTLE_WAIT)
    ParentsList.set(container, list)
    DEFAULT_EVENTS.forEach((evt) => _addListener(container, evt, list.eventFired))
  }
  const list = ParentsList.get(container)
  list.push(el)
  ParentsList.set(container, list)
}
function removeListeners (container, el) {
  const list = ParentsList.get(container)
  if (!list) return false // Already unobserved
  const pos = list.indexOf(el)
  if (pos === -1) return false // Already unobserved
  list.splice(pos, 1)

  if (list.length > 0) {
    ParentsList.set(container, list)
  } else {
    DEFAULT_EVENTS.forEach((evt) => _removeListener(container, evt, list.eventFired))
    ParentsList.delete(container)
  }
}
function _addListener (el, evt, callback) {
  el.addEventListener(evt, callback, {
    passive: true
  })
}
function _removeListener (el, evt, callback) {
  el.removeEventListener(evt, callback)
}

export const observe = ({ el, binding, vnode }) => {
  setTimeout(() => {
    const containers = [scrollParent(el)]
    if (containers[0] !== window) containers.push(window)

    containers.forEach(container => {
      addListeners(container, el)
      setTimeout(() => {
        const list = ParentsList.get(container)
        if (list) list.eventFired()
      })
    })
  }, 10)
}

export const unobserve = ({ el, binding, vnode }) => {
  const containers = [scrollParent(el)]
  if (containers[0] !== window) containers.push(window)

  containers.forEach(container => {
    removeListeners(container, el)
  })
}
