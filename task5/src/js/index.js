import Compile from './compile'
import {observe} from './observer'

import Watcher from './watcher'


class MVVM {
  constructor(options) {
    const data = this._data = options.data
    Object.keys(data).forEach(key => this._proxy(key))
    observe(data)
    new Compile(options.el || document.body, this)
  }

  _proxy(key) {
    Object.defineProperty(this, key, {
      configurable: true,
      enumerable: true,
      get: () => this._data[key],
      set: newVal => this._data[key] = newVal
    })
  }

  $watch(exp, cb, options) {
    new Watcher(this, exp, cb, options)
  }
}

window.MVVM = MVVM





