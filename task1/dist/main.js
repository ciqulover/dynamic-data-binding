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
  }

  // traverse data


  _createClass(Observer, [{
    key: 'walk',
    value: function walk(data) {
      var _this = this;

      Object.keys(data).forEach(function (key) {
        _this.defineReactive(_this.data, key, data[key]);
      });
    }

    // binding

  }, {
    key: 'defineReactive',
    value: function defineReactive(obj, key, val) {
      // bind deeply
      observe(val);
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        get: function get() {
          console.log('你访问了 ' + key);
          return val;
        },
        set: function set(newVal) {
          if (newVal === val) return;
          console.log('\u4F60\u8BBE\u7F6E\u4E86 ' + key + ', \u65B0\u7684\u503C\u4E3A ' + newVal);
          val = newVal;
        }
      });
    }
  }]);

  return Observer;
}();

var observe = function observe(value) {
  if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) != 'object') return;
  return new Observer(value);
};

// allowed to test in browser
window.Observer = Observer;

// test
var a1 = new Observer({
  name: 'youngwind',
  age: 25
});

var a2 = new Observer({
  university: 'bupt',
  major: 'computer'
});

var name = a1.data.name;
a1.data.age = 100;
var university = a2.data.university;
a2.data.major = 'science';

},{}]},{},[1]);
