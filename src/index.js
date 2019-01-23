import lazy from './directive-lazy'
import { setPreferedObserver } from './observer'

export default {
  install: (Vue, options = {}) => {
    // Set defaults
    if (options.preferedObserver === undefined) options.preferedObserver = false
    // Execute options
    if (options.preferedObserver) {
      setPreferedObserver(options.preferedObserver)
    }

    lazy(Vue, options)
  }
}
