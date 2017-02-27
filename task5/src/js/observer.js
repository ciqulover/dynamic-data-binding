import Dep from './dep'

class Observer {

  constructor(value) {
    this.value = value
    this.dep = new Dep()
    this.walk(value)
    Object.defineProperty(value, '__ob__', {
      value: this,
      writable: true,
      enumerable: false,
      configurable: true
    })
  }

  walk(value) {
    Object.keys(value).forEach((key) => {
      this.defineReactive(value, key, value[key])
    })
  }


  defineReactive(obj, key, val) {

    const dep = new Dep()
    let childOb = observe(val)

    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get: () => {
        if (Dep.target) {
          dep.depend()
          if (childOb) childOb.dep.depend()
        }
        return val
      },
      set: newVal => {
        if (newVal === val) return
        val = newVal
        childOb = observe(newVal)
        dep.notify()
      }
    })
  }
}


const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)

const observe = (value) => {
  if (!value || typeof value != 'object') return
  let ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) ob = value.__ob__
  else ob = new Observer(value)
  return ob
}

export {observe}
