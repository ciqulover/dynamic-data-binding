(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Observer = function () {
  function Observer(data) {
    _classCallCheck(this, Observer);

    this.data = data;
    this.walk(data);
    this.subscribers = {};
  }

  // traverse data


  _createClass(Observer, [{
    key: 'walk',
    value: function walk(data, path) {
      var _this = this;

      Object.keys(data).forEach(function (key) {
        _this.defineReactive(data, key, data[key], path);
      });
    }

    // observe deeply if object

  }, {
    key: 'observe',
    value: function observe(value, path) {
      if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) != 'object') return;
      if (path) path = path + '.';
      this.walk(value, path);
    }

    // binding

  }, {
    key: 'defineReactive',
    value: function defineReactive(obj, key, val, path) {
      var _this2 = this;

      if (!path) path = key;else path = path + key;

      // bind deeply
      this.observe(val, path);

      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        get: function get() {
          // console.log('你访问了 ' + key)
          return val;
        },
        set: function set(newVal) {
          if (newVal === val) return;
          // console.log(`你设置了 ${key}, 新的值为 ${JSON.stringify(newVal)}`)
          val = newVal;
          _this2.$notify(path || key);
          _this2.observe(newVal, path);
        }
      });
    }
  }, {
    key: '$watch',
    value: function $watch(key, cb) {
      if (typeof cb != 'function') {
        console.log('you need pass a function as callback');
        return;
      }
      if (!this.subscribers[key]) this.subscribers[key] = [];
      this.subscribers[key].push(cb);
    }
  }, {
    key: '$notify',
    value: function $notify(path) {
      var _this3 = this;

      var keys = path.split('.');
      var depPaths = keys.map(function (key, index) {
        if (index == 0) return key;else {
          var str = '';
          while (index--) {
            str = keys[index] + '.' + str;
          }return str + key;
        }
      });
      depPaths.forEach(function (path) {
        var fns = _this3.subscribers[path];
        if (fns && fns.length) {
          fns.forEach(function (fn) {
            return fn && fn(_this3.$getValue(path));
          });
        }
      });
    }
  }, {
    key: '$getValue',
    value: function $getValue(exp) {
      var path = exp.split('.');
      var val = this.data;
      path.forEach(function (k) {
        return val = val[k];
      });
      return val;
    }
  }]);

  return Observer;
}();

// allowed to test in browser


window.Observer = Observer;

// test
var a2 = new Observer({
  name: {
    firstName: 'shaofeng',
    lastName: 'liang'
  },
  age: 25
});

a2.$watch('name', function (newName) {
  console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。');
});

a2.data.name.firstName = 'hahaha';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。
a2.data.name.lastName = 'blablabla';
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。

},{}]},{},[1]);
