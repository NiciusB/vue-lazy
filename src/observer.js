import { hasIntersectionObserver } from './utils'
import * as intersectionObserver from './intersection-observer'
import * as customObserver from './custom-observer'

var observer = hasIntersectionObserver ? intersectionObserver : customObserver

export function observe () {
  observer.observe(...arguments)
}
export function unobserve () {
  observer.unobserve(...arguments)
}

export function setPreferedObserver (name) {
  if (name === 'custom') observer = customObserver
  else if (name === 'intersection') observer = intersectionObserver
  else throw new Error('[vue-lazy] Unknown observer name')
}
