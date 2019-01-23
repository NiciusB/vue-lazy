import { componentAppeared } from './plugin'

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      componentAppeared(entry.target)
    }
  })
})

export const observe = (data) => {
  observer.observe(data.el)
}
export const unobserve = (data) => {
  observer.unobserve(data.el)
}
