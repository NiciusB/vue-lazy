import { hasIntersectionObserver } from './utils'
import * as intersectionObserver from './intersection-observer'
import * as customObserver from './custom-observer'

const observer = hasIntersectionObserver ? intersectionObserver : customObserver
export const observe = observer.observe
export const unobserve = observer.unobserve
