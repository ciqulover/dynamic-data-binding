class Observer {
  constructor(data) {
    this.data = data
    this.walk(data)
  }

  // traverse data
  walk(data) {
    Object.keys(data).forEach((key) => {
      this.defineReactive(this.data, key, data[key])
    })
  }

  // binding
  defineReactive(obj, key, val) {
    // bind deeply
    observe(val)
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get: () => {
        console.log('你访问了 ' + key)
        return val
      },
      set: newVal => {
        if (newVal === val) return
        console.log(`你设置了 ${key}, 新的值为 ${newVal}`)
        val = newVal
      }
    })
  }

}

const observe = function (value) {
  if (!value || typeof value != 'object') return
  return new Observer(value)
}

// allowed to test in browser
window.Observer = Observer


// test
const a1 = new Observer({
  name: 'youngwind',
  age: 25
});

const a2 = new Observer({
  university: 'bupt',
  major: 'computer'
});

const name = a1.data.name
a1.data.age = 100
const university = a2.data.university
a2.data.major = 'science'
