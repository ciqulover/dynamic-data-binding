class Observer {
  
  constructor(data) {
    this.data = data
    this.walk(data)
    this.subscribers = []
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
        observe(newVal)
        const index = this.getIndex(key)
        if (index > -1) this.subscribers[index].cb(newVal)
        console.log(`你设置了 ${key}, 新的值为 ${JSON.stringify(newVal)}`)
        val = newVal
      }
    })
  }

  $watch(key, cb) {
    if (typeof cb != 'function') {
      console.log('you need pass a function as callback')
      return
    }
    const index = this.getIndex(key)
    if (index > -1) {
      console.warn(`The watcher '${key}' already exists and will be overwritten`)
      this.subscribers[index].cb = cb
      return
    }
    this.subscribers.push({key, cb})
  }

  getIndex(key) {
    let length = this.subscribers.length
    let index = -1
    while (length--) {
      if (this.subscribers[length].key == key) {
        index = length
        break
      }
    }
    return index
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

a1.data.name = {
  lastName: 'liang',
  firstName: 'shaofeng'
};

const lastName = a1.data.name.lastName
a1.data.name.firstName = 'lalala'

const a3 = new Observer({
  name: 'youngwind',
  age: 25
});

a3.$watch('age', function (age) {
  console.log(`我的年纪变了，现在已经是：${age}岁了`)
})

a3.data.age = 100
