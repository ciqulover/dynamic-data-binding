(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _watcher = require('./watcher');

var _watcher2 = _interopRequireDefault(_watcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var toNodeFragment = function toNodeFragment(node) {
  var fragment = document.createDocumentFragment();
  var child = void 0;
  while (child = node.firstChild) {
    fragment.appendChild(child);
  }return fragment;
};

var isElementNode = function isElementNode(node) {
  return node.nodeType == 1;
};
var isTextNode = function isTextNode(node) {
  return node.nodeType == 3;
};
var isDirective = function isDirective(dir) {
  return dir.indexOf('v-') == 0 || dir.indexOf('@') == 0 || dir.indexOf(':') == 0;
};

var isEventDirective = function isEventDirective(dir) {
  return dir.indexOf('v-on:') == 0 || dir.indexOf('@') == 0;
};

var _splice = Array.prototype.slice;

var Compile = function () {
  function Compile(el, vm) {
    _classCallCheck(this, Compile);

    this.$vm = vm;
    this.$el = isElementNode(el) ? el : document.querySelector(el);
    if (this.$el) {
      this.$fragment = toNodeFragment(this.$el);
      this.compileElements(this.$fragment.childNodes);
      this.$el.appendChild(this.$fragment);
    }
  }

  _createClass(Compile, [{
    key: 'compileElements',
    value: function compileElements(nodes) {
      var _this = this;

      nodes = _splice.call(nodes);
      nodes.forEach(function (node) {
        if (isElementNode(node)) _this.compile(node);else if (isTextNode(node)) {
          var reg = /\{\{(.+?)}}/g;
          var match = reg.exec(node.nodeValue);
          if (match) {
            _this.compileText(node, match[1], match.index);
          }
        }

        var childNodes = node.childNodes;
        if (childNodes && childNodes.length) {
          _this.compileElements(childNodes);
        }
      });
    }
  }, {
    key: 'compileText',
    value: function compileText(node, exp, index) {
      compileUtil.text(node, this.$vm, exp);
    }
  }, {
    key: 'compile',
    value: function compile(node) {
      var _this2 = this;

      var attrs = _splice.call(node.attributes);
      attrs.forEach(function (attr) {
        var attrName = attr.name;
        var exp = attr.value;
        if (isDirective(attrName)) {
          if (isEventDirective(attrName)) {
            compileUtil.eventHandler(node, _this2.$vm, exp, attrName);
          } else {
            var dir = attrName.slice(2);
            compileUtil[dir] && compileUtil[dir](node, _this2.$vm, exp);
          }
          node.removeAttribute(attrName);
        }
      });
    }
  }]);

  return Compile;
}();

var updater = {
  textUpdater: function textUpdater(node, value, oldValue) {
    //todo
    // node.nodeValue = node.nodeValue.replace(oldValue, function (oldValue, offset) {
    //   // if (offset === startIndex) {
    //   //   return value
    //   // }
    //   // else return oldValue
    //   return value
    // })
    node.nodeValue = node.nodeValue.replace(oldValue, value);
  },
  htmlUpdater: function htmlUpdater(node, value, oldValue) {
    node.innerHTML = node.innerHTML.replace(oldValue, value);
  },
  modelUpdater: function modelUpdater(node, value, oldValue) {
    node.value = value;
  },
  attrUpdater: function attrUpdater(node, value, oldValue, prop) {
    node[prop].value = value;
  }
};

var compileUtil = {
  text: function text(node, vm, exp) {
    this.bind(node, vm, exp, 'text');
  },
  html: function html(node, vm, exp) {
    this.bind(node, vm, exp, 'html');
  },
  model: function model(node, vm, exp) {
    var _this3 = this;

    this.bind(node, vm, exp, 'model');
    var val = this._getVMVal(vm, exp);
    var inputHandler = function inputHandler(e) {

      var newValue = e.target.value;
      if (newValue === val) return;

      _this3._setVMVal(vm, exp, newValue);
      val = newValue;
    };

    node.addEventListener('input', inputHandler, false);
  },
  bind: function bind(node, vm, exp, dir) {

    var updateFn = updater[dir + 'Updater'];
    var initValue = dir == 'text' ? '{{' + exp + '}}' : '';
    updateFn && updateFn(node, this._getVMVal(vm, exp), initValue);
    new _watcher2.default(vm, exp, function (value, oldValue) {
      updateFn && updateFn(node, value, oldValue);
    });
  },
  eventHandler: function eventHandler(node, vm, exp, dir) {
    var eventType = dir.slice(dir.indexOf('@') == 0 ? 1 : 5);
    var fn = vm.$options.methods && vm.$options.methods[exp];
    if (eventType && fn) {
      node.addEventListener(eventType, function () {
        return fn.call(vm);
      }, false);
    }
  },
  _getVMVal: function _getVMVal(vm, exp) {
    var val = vm._data;
    var segments = exp.split('.');
    segments.forEach(function (k) {
      return val = val[k];
    });
    return val;
  },
  _setVMVal: function _setVMVal(vm, exp, value) {
    var val = vm._data;
    var segments = exp.split('.');
    var l = segments.length;

    segments.forEach(function (k, i) {
      if (i < l - 1) val = val[k];else {
        val[k] = value;
      }
    });
  }
};

exports.default = Compile;

},{"./watcher":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var uid = 0;

var Dep = function () {
  function Dep() {
    _classCallCheck(this, Dep);

    this.id = uid++;
    this.subs = [];
  }

  _createClass(Dep, [{
    key: "addSub",
    value: function addSub(sub) {
      this.subs.push(sub);
    }
  }, {
    key: "depend",
    value: function depend() {
      if (Dep.target) Dep.target.addDep(this);
    }
  }, {
    key: "notify",
    value: function notify() {
      this.subs.forEach(function (sub) {
        return sub.update();
      });
    }
  }]);

  return Dep;
}();

Dep.target = null;

exports.default = Dep;

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _compile = require('./compile');

var _compile2 = _interopRequireDefault(_compile);

var _observer = require('./observer');

var _watcher = require('./watcher');

var _watcher2 = _interopRequireDefault(_watcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MVVM = function () {
  function MVVM(options) {
    var _this = this;

    _classCallCheck(this, MVVM);

    var data = this._data = options.data;
    this.$options = options;
    Object.keys(data).forEach(function (key) {
      return _this._proxy(key);
    });
    (0, _observer.observe)(data);
    new _compile2.default(options.el || document.body, this);
  }

  _createClass(MVVM, [{
    key: '_proxy',
    value: function _proxy(key) {
      var _this2 = this;

      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get: function get() {
          return _this2._data[key];
        },
        set: function set(newVal) {
          return _this2._data[key] = newVal;
        }
      });
    }
  }, {
    key: '$watch',
    value: function $watch(exp, cb, options) {
      new _watcher2.default(this, exp, cb, options);
    }
  }]);

  return MVVM;
}();

window.MVVM = MVVM;

},{"./compile":1,"./observer":4,"./watcher":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.observe = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dep = require('./dep');

var _dep2 = _interopRequireDefault(_dep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Observer = function () {
  function Observer(value) {
    _classCallCheck(this, Observer);

    this.value = value;
    this.dep = new _dep2.default();
    this.walk(value);
    Object.defineProperty(value, '__ob__', {
      value: this,
      writable: true,
      enumerable: false,
      configurable: true
    });
  }

  _createClass(Observer, [{
    key: 'walk',
    value: function walk(value) {
      var _this = this;

      Object.keys(value).forEach(function (key) {
        _this.defineReactive(value, key, value[key]);
      });
    }
  }, {
    key: 'defineReactive',
    value: function defineReactive(obj, key, val) {

      var dep = new _dep2.default();
      var childOb = observe(val);

      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        get: function get() {
          if (_dep2.default.target) {
            dep.depend();
            if (childOb) childOb.dep.depend();
          }
          return val;
        },
        set: function set(newVal) {
          if (newVal === val) return;
          val = newVal;
          childOb = observe(newVal);
          dep.notify();
        }
      });
    }
  }]);

  return Observer;
}();

var hasOwn = function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

var observe = function observe(value) {
  if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) != 'object') return;
  var ob = void 0;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) ob = value.__ob__;else ob = new Observer(value);
  return ob;
};

exports.observe = observe;

},{"./dep":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dep = require('./dep');

var _dep2 = _interopRequireDefault(_dep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Watcher = function () {
  function Watcher(vm, exp, cb, options) {
    _classCallCheck(this, Watcher);

    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    this.deep = options ? !!options.deep : false;
    this.depIds = {};
    this.getter = parsePath(this.exp);
    this.value = this.get();
  }

  _createClass(Watcher, [{
    key: 'addDep',
    value: function addDep(dep) {
      if (!this.depIds.hasOwnProperty(dep.id)) {
        dep.addSub(this);
        this.depIds[dep.id] = dep;
      }
    }
  }, {
    key: 'get',
    value: function get() {
      _dep2.default.target = this;
      var value = this.getter(this.vm);

      if (this.deep) {
        traverse(value);
      }

      _dep2.default.target = null;
      return value;
    }
  }, {
    key: 'update',
    value: function update() {
      this.run();
    }
  }, {
    key: 'run',
    value: function run() {
      var oldValue = this.value;
      var value = this.get();
      if (value !== oldValue || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
        this.cb.call(this.vm, value, oldValue);
        this.value = value;
      }
    }
  }]);

  return Watcher;
}();

function parsePath(path) {
  var segments = path.split('.');
  return function (obj) {
    segments.forEach(function (k) {
      return obj = obj[k];
    });
    return obj;
  };
}

var seenObjects = new Set();

function traverse(val) {
  seenObjects.clear();
  _traverse(val, seenObjects);
}

function _traverse(val, seen) {

  if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) != 'object') return;
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) return;
    seen.add(depId);
  }
  var keys = Object.keys(val);
  var i = keys.length;
  while (i--) {
    _traverse(val[keys[i]], seen);
  }
}

exports.default = Watcher;

},{"./dep":2}]},{},[3]);
