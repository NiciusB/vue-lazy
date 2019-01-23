export const hasIntersectionObserver = checkIntersectionObserver()

function checkIntersectionObserver () {
  if ('IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRect' in window.IntersectionObserverEntry.prototype) {
    // Minimal polyfill for Edge 15's lack of `isIntersecting`
    // See: https://github.com/w3c/IntersectionObserver/issues/211
    if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
      Object.defineProperty(window.IntersectionObserverEntry.prototype,
        'isIntersecting', {
          get: function () {
            return this.intersectionRect.width > 0 || this.intersectionRect.height > 0
          }
        })
    }
    return true
  }
  return false
}

export function loadImageAsync (src, resolve, reject) {
  const image = new Image()
  image.src = src

  image.onload = () => {
    resolve({
      src: image.src
    })
  }

  image.onerror = (err) => {
    reject(err)
  }
}

export function throttle (action, delay) {
  let timeout = null
  let lastRun = 0
  return function () {
    if (timeout) {
      return
    }
    const elapsed = Date.now() - lastRun
    const context = this
    const args = arguments
    const runCallback = () => {
      lastRun = Date.now()
      timeout = false
      action.apply(context, args)
    }
    if (elapsed >= delay) {
      runCallback()
    } else {
      timeout = setTimeout(runCallback, delay)
    }
  }
}

export const inBrowser = typeof window !== 'undefined'

const style = (el, prop) => {
  return typeof getComputedStyle !== 'undefined'
    ? getComputedStyle(el, null).getPropertyValue(prop)
    : el.style[prop]
}
const overflow = (el) => {
  return style(el, 'overflow') + style(el, 'overflow-y') + style(el, 'overflow-x')
}

export function scrollParent (el) {
  if (!inBrowser) return
  if (!(el instanceof HTMLElement)) {
    return window
  }

  let parent = el

  while (parent) {
    if (parent === document.body || parent === document.documentElement) {
      break
    }

    if (!parent.parentNode) {
      break
    }

    if (/(scroll|auto)/.test(overflow(parent))) {
      return parent
    }

    parent = parent.parentNode
  }

  return window
}
