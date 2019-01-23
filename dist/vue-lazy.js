/*!
 * vue-lazy v1.0.2
 * (c) 2019 Nuno Balbona
 * Released under the MIT License.
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.VueLazy = global.VueLazy || {})));
}(this, (function (exports) { 'use strict';

var hasIntersectionObserver = checkIntersectionObserver();

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
        });
    }
    return true
  }
  return false
}

function loadImageAsync (src, resolve, reject) {
  var image = new Image();
  image.src = src;

  image.onload = function () {
    resolve({
      src: image.src
    });
  };

  image.onerror = function (err) {
    reject(err);
  };
}

function throttle (action, delay) {
  var timeout = null;
  var lastRun = 0;
  return function () {
    if (timeout) {
      return
    }
    var elapsed = Date.now() - lastRun;
    var context = this;
    var args = arguments;
    var runCallback = function () {
      lastRun = Date.now();
      timeout = false;
      action.apply(context, args);
    };
    if (elapsed >= delay) {
      runCallback();
    } else {
      timeout = setTimeout(runCallback, delay);
    }
  }
}

var inBrowser = typeof window !== 'undefined';

var style = function (el, prop) {
  return typeof getComputedStyle !== 'undefined'
    ? getComputedStyle(el, null).getPropertyValue(prop)
    : el.style[prop]
};
var overflow = function (el) {
  return style(el, 'overflow') + style(el, 'overflow-y') + style(el, 'overflow-x')
};

function scrollParent (el) {
  if (!inBrowser) { return }
  if (!(el instanceof HTMLElement)) {
    return window
  }

  var parent = el;

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

    parent = parent.parentNode;
  }

  return window
}

// Badly implemented Map to avoid ECMAScript 5
// Operations are O(n) instead of O(1)

function SimpleMap () {
  if ('Map' in window) { return new Map() } // Use Map if available

  var __mapKeysData__ = [];
  var __mapValuesData__ = [];
  this.get = function (key) {
    var index = __mapKeysData__.indexOf(key);
    if (index === -1) { return null }
    return __mapValuesData__[index]
  };
  this.has = function (key) {
    var index = __mapKeysData__.indexOf(key);
    return index !== -1
  };
  this.set = function (key, data) {
    var index = __mapKeysData__.indexOf(key);
    if (index === -1) {
      __mapKeysData__.push(key);
      __mapValuesData__.push(data);
    } else {
      __mapKeysData__[index] = key;
      __mapValuesData__[index] = data;
    }
  };
  this.delete = function (key) {
    var index = __mapKeysData__.indexOf(key);
    if (index === -1) { return false }
    __mapKeysData__.splice(index, 1);
    __mapValuesData__.splice(index, 1);
  };
  return this
}

var observer$1 = hasIntersectionObserver ? getObserver() : false;
var callbackMap = new SimpleMap();

function getObserver () {
  return new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        callbackMap.get(entry.target)();
      }
    });
  })
}

var observe$1 = function (el, fire) {
  callbackMap.set(el, fire);
  observer$1.observe(el);
};
var unobserve$1 = function (el) {
  callbackMap.delete(el);
  observer$1.unobserve(el);
};


var intersectionObserver = Object.freeze({
	observe: observe$1,
	unobserve: unobserve$1
});

var PRELOAD = 1.3;
var THROTTLE_WAIT = 200;
var DEFAULT_EVENTS = ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove'];
var ParentsList = new SimpleMap();
var callbackMap$1 = new SimpleMap();

function _eventFired (container) {
  ParentsList.get(container)
    .filter(function (el) { return checkInView(el); })
    .forEach(function (el) {
      callbackMap$1.get(el)();
    });
}

function checkInView (el) {
  var rect = el.getBoundingClientRect();
  return (rect.top < window.innerHeight * PRELOAD && rect.bottom > 0) &&
          (rect.left < window.innerWidth * PRELOAD && rect.right > 0)
}

function addListeners (container, el) {
  if (!ParentsList.has(container)) {
    var list$1 = [];
    list$1.eventFired = throttle(_eventFired.bind(this, container), THROTTLE_WAIT);
    ParentsList.set(container, list$1);
    DEFAULT_EVENTS.forEach(function (evt) { return _addListener(container, evt, list$1.eventFired); });
  }
  var list = ParentsList.get(container);
  list.push(el);
  ParentsList.set(container, list);
}
function removeListeners (container, el) {
  var list = ParentsList.get(container);
  if (!list) { return false } // Already unobserved
  var pos = list.indexOf(el);
  if (pos === -1) { return false } // Already unobserved
  list.splice(pos, 1);

  if (list.length > 0) {
    ParentsList.set(container, list);
  } else {
    DEFAULT_EVENTS.forEach(function (evt) { return _removeListener(container, evt, list.eventFired); });
    ParentsList.delete(container);
  }
}
function _addListener (el, evt, callback) {
  el.addEventListener(evt, callback, {
    passive: true
  });
}
function _removeListener (el, evt, callback) {
  el.removeEventListener(evt, callback);
}

var observe$2 = function (el, fire) {
  callbackMap$1.set(el, fire);
  setTimeout(function () {
    var containers = [scrollParent(el)];
    if (containers[0] !== window) { containers.push(window); }

    containers.forEach(function (container) {
      addListeners(container, el);
      setTimeout(function () {
        var list = ParentsList.get(container);
        if (list) { list.eventFired(); }
      });
    });
  }, 10);
};

var unobserve$2 = function (el) {
  callbackMap$1.delete(el);
  var containers = [scrollParent(el)];
  if (containers[0] !== window) { containers.push(window); }

  containers.forEach(function (container) {
    removeListeners(container, el);
  });
};


var customObserver = Object.freeze({
	observe: observe$2,
	unobserve: unobserve$2
});

var observer = hasIntersectionObserver ? intersectionObserver : customObserver;

function observe$$1 () {
  observer.observe.apply(observer, arguments);
}
function unobserve$$1 () {
  observer.unobserve.apply(observer, arguments);
}

function setPreferedObserver (name) {
  if (name === 'custom') { observer = customObserver; }
  else if (name === 'intersection') { observer = intersectionObserver; }
  else { throw new Error('[vue-lazy] Unknown observer name') }
}

var dataMap = new SimpleMap();

var lazy = function (Vue, options) {
  Vue.directive('lazy', {
    bind: basicHanding,
    update: basicHanding,
    componentUpdated: basicHanding,
    unbind: unbind
  });
};

/*
* Remove observer
* @param  {DOM} el Element in the DOM
* @param  {object} binding Vue directive binding
* @param  {vnode} vnode Vue node for element
* @return
*/

function unbind (el, binding, vnode) {
  dataMap.delete(el);
  unobserve$$1(el);
}

/*
* Update info if image v-lazy is added or changed
* @param  {DOM} el Element in the DOM
* @param  {object} binding Vue directive binding
* @param  {vnode} vnode Vue node for element
* @return
*/
function basicHanding (el, binding, vnode) {
  var customData = {
    bindType: binding.arg,
    src: null
  };
  updateComponentData(el, customData);
  customData.src = binding.value;
  dataMap.set(el, customData);
  observe$$1(el, function () {
    componentAppeared(el);
  });
}

function componentAppeared (el) {
  var customData = dataMap.get(el);
  if (!customData) {
    console.warn(("[vue-lazy] Image had no data: " + el));
    return false
  }
  unobserve$$1(el);

  loadImageAsync(customData.src, function (ref) {
    var src = ref.src;

    // Success
    customData.src = src;
    updateComponentData(el, customData);
  }, function (error) {
    // Error
    customData.src = error.src;
    updateComponentData(el, customData);
  });
}

function updateComponentData (el, customData) {
  if (!el) { return false }
  var src = customData.src || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Transparent Pixel

  if (customData.bindType) {
    el.style[customData.bindType] = 'url("' + src + '")';
  } else if (el.getAttribute('src') !== src) {
    el.setAttribute('src', src);
  }
}

var index = {
  install: function (Vue, options) {
    if ( options === void 0 ) options = {};

    // Set defaults
    if (options.preferedObserver === undefined) { options.preferedObserver = false; }
    // Execute options
    if (options.preferedObserver) {
      setPreferedObserver(options.preferedObserver);
    }

    lazy(Vue, options);
  }
};

exports['default'] = index;

Object.defineProperty(exports, '__esModule', { value: true });

})));
