export var observer = false
export const handlers = new WeakMap()

if ('IntersectionObserver' in window) {
  /* eslint-disable no-undef */
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target

        const handler = handlers.get(lazyImage)
        if (!handler) {
          console.warn(`[vue-lazy] Image had no data: ${lazyImage}`)
          return false
        }
        const data = handler

        /* eslint-disable no-undef */
        const newImage = new Image()
        newImage.src = data.src

        // on success
        newImage.onload = function () {
          if (data.src) {
            lazyImage.src = data.src
          }
        }
        // on error
        newImage.onerror = function () {
          if (data.err) {
            lazyImage.src = data.err
          }
        }

        observer.unobserve(lazyImage)
      }
    })
  })
}

