module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var intersection_observer_namespaceObject = {};
__webpack_require__.r(intersection_observer_namespaceObject);
__webpack_require__.d(intersection_observer_namespaceObject, "observe", function() { return intersection_observer_observe; });
__webpack_require__.d(intersection_observer_namespaceObject, "unobserve", function() { return intersection_observer_unobserve; });
var custom_observer_namespaceObject = {};
__webpack_require__.r(custom_observer_namespaceObject);
__webpack_require__.d(custom_observer_namespaceObject, "observe", function() { return custom_observer_observe; });
__webpack_require__.d(custom_observer_namespaceObject, "unobserve", function() { return custom_observer_unobserve; });

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var i
  if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// CONCATENATED MODULE: ./src/utils.js
var hasIntersectionObserver = checkIntersectionObserver();
var transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function checkIntersectionObserver() {
  if (typeof window !== 'undefined' && 'IntersectionObserverEntry' in window && 'intersectionRect' in window.IntersectionObserverEntry.prototype) {
    // Minimal polyfill for Edge 15's lack of `isIntersecting`
    // See: https://github.com/w3c/IntersectionObserver/issues/211
    if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
      Object.defineProperty(window.IntersectionObserverEntry.prototype, 'isIntersecting', {
        get: function get() {
          return this.intersectionRect.width > 0 || this.intersectionRect.height > 0;
        }
      });
    }

    return true;
  }

  return false;
}

function loadImageAsync(src, resolve, reject) {
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
function throttle(action, delay) {
  var timeout = null;
  var lastRun = 0;
  return function () {
    if (timeout) {
      return;
    }

    var elapsed = Date.now() - lastRun;
    var context = this;
    var args = arguments;

    var runCallback = function runCallback() {
      lastRun = Date.now();
      timeout = false;
      action.apply(context, args);
    };

    if (elapsed >= delay) {
      runCallback();
    } else {
      timeout = setTimeout(runCallback, delay);
    }
  };
}
var inBrowser = typeof window !== 'undefined';

var style = function style(el, prop) {
  return typeof getComputedStyle !== 'undefined' ? getComputedStyle(el, null).getPropertyValue(prop) : el.style[prop];
};

var overflow = function overflow(el) {
  return style(el, 'overflow') + style(el, 'overflow-y') + style(el, 'overflow-x');
};

function scrollParent(el) {
  if (!inBrowser) return;

  if (!(el instanceof HTMLElement)) {
    return window;
  }

  var parent = el;

  while (parent) {
    if (parent === document.body || parent === document.documentElement) {
      break;
    }

    if (!parent.parentNode) {
      break;
    }

    if (/(scroll|auto)/.test(overflow(parent))) {
      return parent;
    }

    parent = parent.parentNode;
  }

  return window;
}
// CONCATENATED MODULE: ./src/SimpleMap.js
// Badly implemented Map to avoid ECMAScript 5
// Operations are O(n) instead of O(1)
function SimpleMap() {
  if (typeof Map !== 'undefined') return new Map(); // Use Map if available

  var __mapKeysData__ = [];
  var __mapValuesData__ = [];

  this.get = function (key) {
    var index = __mapKeysData__.indexOf(key);

    if (index === -1) return null;
    return __mapValuesData__[index];
  };

  this.has = function (key) {
    var index = __mapKeysData__.indexOf(key);

    return index !== -1;
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

    if (index === -1) return false;

    __mapKeysData__.splice(index, 1);

    __mapValuesData__.splice(index, 1);
  };
}
// CONCATENATED MODULE: ./src/intersection-observer.js


var observer = hasIntersectionObserver ? getObserver() : false;
var callbackMap = new SimpleMap();

function getObserver() {
  return new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        callbackMap.get(entry.target)();
      }
    });
  });
}

var intersection_observer_observe = function observe(el, fire) {
  callbackMap.set(el, fire);
  observer.observe(el);
};
var intersection_observer_unobserve = function unobserve(el) {
  callbackMap.delete(el);
  observer.unobserve(el);
};
// CONCATENATED MODULE: ./src/custom-observer.js


var PRELOAD = 1.3;
var THROTTLE_WAIT = 200;
var DEFAULT_EVENTS = ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove'];
var ParentsList = new SimpleMap();
var custom_observer_callbackMap = new SimpleMap();

function _eventFired(container) {
  ParentsList.get(container).filter(function (el) {
    return checkInView(el);
  }).forEach(function (el) {
    custom_observer_callbackMap.get(el)();
  });
}

function checkInView(el) {
  var rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * PRELOAD && rect.bottom > 0 && rect.left < window.innerWidth * PRELOAD && rect.right > 0;
}

function addListeners(container, el) {
  if (!ParentsList.has(container)) {
    var _list = [];
    _list.eventFired = throttle(_eventFired.bind(this, container), THROTTLE_WAIT);
    ParentsList.set(container, _list);
    DEFAULT_EVENTS.forEach(function (evt) {
      return _addListener(container, evt, _list.eventFired);
    });
  }

  var list = ParentsList.get(container);
  list.push(el);
  ParentsList.set(container, list);
}

function removeListeners(container, el) {
  var list = ParentsList.get(container);
  if (!list) return false; // Already unobserved

  var pos = list.indexOf(el);
  if (pos === -1) return false; // Already unobserved

  list.splice(pos, 1);

  if (list.length > 0) {
    ParentsList.set(container, list);
  } else {
    DEFAULT_EVENTS.forEach(function (evt) {
      return _removeListener(container, evt, list.eventFired);
    });
    ParentsList.delete(container);
  }
}

function _addListener(el, evt, callback) {
  el.addEventListener(evt, callback, {
    passive: true
  });
}

function _removeListener(el, evt, callback) {
  el.removeEventListener(evt, callback);
}

var custom_observer_observe = function observe(el, fire) {
  custom_observer_callbackMap.set(el, fire);
  setTimeout(function () {
    var containers = [scrollParent(el)];
    if (containers[0] !== window) containers.push(window);
    containers.forEach(function (container) {
      addListeners(container, el);
      setTimeout(function () {
        var list = ParentsList.get(container);
        if (list) list.eventFired();
      });
    });
  }, 10);
};
var custom_observer_unobserve = function unobserve(el) {
  custom_observer_callbackMap.delete(el);
  var containers = [scrollParent(el)];
  if (containers[0] !== window) containers.push(window);
  containers.forEach(function (container) {
    removeListeners(container, el);
  });
};
// CONCATENATED MODULE: ./src/observer.js



var observer_observer = hasIntersectionObserver ? intersection_observer_namespaceObject : custom_observer_namespaceObject;
function observer_observe() {
  var _observer;

  (_observer = observer_observer).observe.apply(_observer, arguments);
}
function observer_unobserve() {
  var _observer2;

  (_observer2 = observer_observer).unobserve.apply(_observer2, arguments);
}
function setPreferedObserver(name) {
  if (name === 'custom') observer_observer = custom_observer_namespaceObject;else if (name === 'intersection') observer_observer = intersection_observer_namespaceObject;else throw new Error('[vue-lazy] Unknown observer name');
}
// CONCATENATED MODULE: ./src/directive-lazy.js



var dataMap = new SimpleMap();
/* harmony default export */ var directive_lazy = (function (Vue, options) {
  Vue.directive('lazy', {
    bind: basicHanding,
    update: basicHanding,
    componentUpdated: basicHanding,
    unbind: unbind
  });
});
/*
* Remove observer
* @param  {DOM} el Element in the DOM
* @param  {object} binding Vue directive binding
* @param  {vnode} vnode Vue node for element
* @return
*/

function unbind(el, binding, vnode) {
  dataMap.delete(el);
  observer_unobserve(el);
}
/*
* Update info if image v-lazy is added or changed
* @param  {DOM} el Element in the DOM
* @param  {object} binding Vue directive binding
* @param  {vnode} vnode Vue node for element
* @return
*/


function basicHanding(el, binding, vnode) {
  var customData = {
    bindType: binding.arg,
    src: null
  };
  updateComponentData(el, customData);
  customData.src = binding.value;
  dataMap.set(el, customData);
  observer_observe(el, function () {
    componentAppeared(el);
  });
}

function componentAppeared(el) {
  var customData = dataMap.get(el);

  if (!customData) {
    console.warn("[vue-lazy] Image had no data: ".concat(el));
    return false;
  }

  observer_unobserve(el);
  loadImageAsync(customData.src, function (_ref) {
    var src = _ref.src;
    // Success
    customData.src = src;
    updateComponentData(el, customData);
  }, function (error) {
    // Error
    customData.src = error.src;
    updateComponentData(el, customData);
  });
}

function updateComponentData(el, customData) {
  if (!el) return false;
  var src = customData.src || transparentPixel;

  if (customData.bindType) {
    el.style[customData.bindType] = 'url("' + src + '")';
  } else if (el.getAttribute('src') !== src) {
    el.setAttribute('src', src);
  }
}
// CONCATENATED MODULE: ./src/index.js


/* harmony default export */ var src_0 = ({
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    // Set defaults
    if (options.preferedObserver === undefined) options.preferedObserver = false; // Execute options

    if (options.preferedObserver) {
      setPreferedObserver(options.preferedObserver);
    }

    directive_lazy(Vue, options);
  }
});
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (src_0);



/***/ })

/******/ })["default"];