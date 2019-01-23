import { observe, unobserve } from './observer'
import { loadImageAsync } from './utils'
import SimpleMap from './SimpleMap'

const dataSet = new SimpleMap()

export default {
  install: (Vue, options = {}) => {
    Vue.directive('lazy', {
      bind: basicHanding,
      update: basicHanding,
      componentUpdated: basicHanding,
      unbind: unbind
    })
  }
}

/*
* Remove observer
* @param  {DOM} el Element in the DOM
* @param  {object} binding Vue directive binding
* @param  {vnode} vnode Vue node for element
* @return
*/

function unbind (el, binding, vnode) {
  const data = dataSet.get(el)
  dataSet.delete(el)
  unobserve(data)
}

/*
* Update info if image v-lazy is added or changed
* @param  {DOM} el Element in the DOM
* @param  {object} binding Vue directive binding
* @param  {vnode} vnode Vue node for element
* @return
*/
function basicHanding (el, binding, vnode) {
  const data = {
    el,
    vnode,
    binding,
    src: null
  }
  updateComponentData(data)
  dataSet.set(el, data)
  data.src = binding.value
  observe(data)
}

export function componentAppeared (el) {
  const data = dataSet.get(el)
  if (!data) {
    console.warn(`[vue-lazy] Image had no data: ${el}`)
    return false
  }
  unobserve(data)

  loadImageAsync(data.src, ({ src }) => {
    // Success
    data.src = src
    updateComponentData(data)
  }, (error) => {
    // Error
    data.src = error.src
    updateComponentData(data)
  })
}

function updateComponentData ({ el, src, binding }) {
  if (!el) return false
  if (!src) src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' // Transparent Pixel

  if (binding.arg) {
    el.style[binding.arg] = 'url("' + src + '")'
  } else if (el.getAttribute('src') !== src) {
    el.setAttribute('src', src)
  }
}
