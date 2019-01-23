import { observe, unobserve } from './observer'
import { loadImageAsync } from './utils'
import SimpleMap from './SimpleMap'

const dataMap = new SimpleMap()

export default function (Vue, options) {
  Vue.directive('lazy', {
    bind: basicHanding,
    update: basicHanding,
    componentUpdated: basicHanding,
    unbind: unbind
  })
}

/*
* Remove observer
* @param  {DOM} el Element in the DOM
* @param  {object} binding Vue directive binding
* @param  {vnode} vnode Vue node for element
* @return
*/

function unbind (el, binding, vnode) {
  dataMap.delete(el)
  unobserve(el)
}

/*
* Update info if image v-lazy is added or changed
* @param  {DOM} el Element in the DOM
* @param  {object} binding Vue directive binding
* @param  {vnode} vnode Vue node for element
* @return
*/
function basicHanding (el, binding, vnode) {
  const customData = {
    bindType: binding.arg,
    src: null
  }
  updateComponentData(el, customData)
  customData.src = binding.value
  dataMap.set(el, customData)
  observe(el, () => {
    componentAppeared(el)
  })
}

function componentAppeared (el) {
  const customData = dataMap.get(el)
  if (!customData) {
    console.warn(`[vue-lazy] Image had no data: ${el}`)
    return false
  }
  unobserve(el)

  loadImageAsync(customData.src, ({ src }) => {
    // Success
    customData.src = src
    updateComponentData(el, customData)
  }, (error) => {
    // Error
    customData.src = error.src
    updateComponentData(el, customData)
  })
}

function updateComponentData (el, customData) {
  if (!el) return false
  const src = customData.src || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' // Transparent Pixel

  if (customData.bindType) {
    el.style[customData.bindType] = 'url("' + src + '")'
  } else if (el.getAttribute('src') !== src) {
    el.setAttribute('src', src)
  }
}
