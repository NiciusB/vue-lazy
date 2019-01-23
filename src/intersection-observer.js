import { hasIntersectionObserver } from './utils'
import SimpleMap from './SimpleMap'

const observer = hasIntersectionObserver ? getObserver() : false
const callbackMap = new SimpleMap()

function getObserver () {
  return new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callbackMap.get(entry.target)()
      }
    })
  })
}

export const observe = (el, fire) => {
  callbackMap.set(el, fire)
  observer.observe(el)
}
export const unobserve = (el) => {
  callbackMap.delete(el)
  observer.unobserve(el)
}
