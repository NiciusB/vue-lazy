/*!
 * vue-lazy v1.0.1
 * (c) 2019 Nuno Balbona
 * Released under the MIT License.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

var observer$1 = hasIntersectionObserver ? getObserver() : false;

function getObserver () {
  return new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        componentAppeared(entry.target);
      }
    });
  })
}

var observe$1 = function (data) {
  observer$1.observe(data.el);
};
var unobserve$1 = function (data) {
  observer$1.unobserve(data.el);
};


var intersectionObserver = Object.freeze({
	observe: observe$1,
	unobserve: unobserve$1
});

// Badly implemented Map to avoid ECMAScript 5
// Operations are O(n) instead of O(1)

function SimpleMap () {
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
}

var PRELOAD = 1.3;
var THROTTLE_WAIT = 200;
var DEFAULT_EVENTS = ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove'];
var ParentsList = new SimpleMap();

function _eventFired (container) {
  ParentsList.get(container)
    .filter(function (el) { return checkInView(el); })
    .forEach(function (el) {
      componentAppeared(el);
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

var observe$2 = function (ref) {
  var el = ref.el;
  var binding = ref.binding;
  var vnode = ref.vnode;

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

var unobserve$2 = function (ref) {
  var el = ref.el;
  var binding = ref.binding;
  var vnode = ref.vnode;

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
var observe$$1 = observer.observe;
var unobserve$$1 = observer.unobserve;

var dataSet = new SimpleMap();

var plugin = {
  install: function (Vue, options) {
    if ( options === void 0 ) options = {};

    Vue.directive('lazy', {
      bind: basicHanding,
      update: basicHanding,
      componentUpdated: basicHanding,
      unbind: unbind
    });
  }
};

/*
* Remove observer
* @param  {DOM} el Element in the DOM
* @param  {object} binding Vue directive binding
* @param  {vnode} vnode Vue node for element
* @return
*/

function unbind (el, binding, vnode) {
  var data = dataSet.get(el);
  dataSet.delete(el);
  unobserve$$1(data);
}

/*
* Update info if image v-lazy is added or changed
* @param  {DOM} el Element in the DOM
* @param  {object} binding Vue directive binding
* @param  {vnode} vnode Vue node for element
* @return
*/
function basicHanding (el, binding, vnode) {
  var data = {
    el: el,
    vnode: vnode,
    binding: binding,
    src: null
  };
  updateComponentData(data);
  dataSet.set(el, data);
  data.src = binding.value;
  observe$$1(data);
}

function componentAppeared (el) {
  var data = dataSet.get(el);
  if (!data) {
    console.warn(("[vue-lazy] Image had no data: " + el));
    return false
  }
  unobserve$$1(data);

  loadImageAsync(data.src, function (ref) {
    var src = ref.src;

    // Success
    data.src = src;
    updateComponentData(data);
  }, function (error) {
    // Error
    data.src = error.src;
    updateComponentData(data);
  });
}

function updateComponentData (ref) {
  var el = ref.el;
  var src = ref.src;
  var binding = ref.binding;

  if (!el) { return false }
  if (!src) { src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; } // Transparent Pixel

  if (binding.arg) {
    el.style[binding.arg] = 'url("' + src + '")';
  } else if (el.getAttribute('src') !== src) {
    el.setAttribute('src', src);
  }
}


var plugin$1 = Object.freeze({
	default: plugin,
	componentAppeared: componentAppeared
});

var require$$0 = ( plugin$1 && plugin ) || plugin$1;

var src = require$$0;

exports['default'] = src;
