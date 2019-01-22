import { observer, handlers } from './observer'

export default {
  install: (Vue, options = {}) => {
    Vue.directive('lazy', {
      bind,
      componentUpdated
    })
  }
}

/*
* Add functionality to image
* @param  {DOM} el Element in the DOM
* @param  {object} binding Vue directive binding
* @param  {vnode} vnode Vue node for element
* @return
*/

function bind (el, binding, vnode) {
  basicHanding(...arguments)
}

/*
* Update info if image v-lazy changed
* @param  {DOM} el Element in the DOM
* @param  {object} binding Vue directive binding
* @param  {vnode} vnode Vue node for element
* @return
*/

function componentUpdated (el, binding, vnode) {
  basicHanding(...arguments)
}

function basicHanding (el, binding, vnode) {
  if (observer) {
    handlers.set(el, {
      src: binding.value
    })
    observer.observe(el)
  } else {
    el.src = binding.value
  }
}
