class Observer {

  constructor(data) {
    this.data = data
    this.walk(data)
    this.subscribers = {}
  }

  // traverse data
  walk(data, path) {
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key], path)
    })
  }

  // observe deeply if object
  observe(value, path) {
    if (!value || typeof value != 'object') return
    if (path) path = path + '.'
    this.walk(value, path)
  }

  // binding
  defineReactive(obj, key, val, path) {
    if (!path) path = key
    else path = path + key

    // bind deeply
    this.observe(val, path)

    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get: () => {
        // console.log('你访问了 ' + key)
        return val
      },
      set: newVal => {
        if (newVal === val) return
        // console.log(`你设置了 ${key}, 新的值为 ${JSON.stringify(newVal)}`)
        val = newVal
        this.$notify(path || key)
        this.observe(newVal, path)
      }
    })
  }

  $watch(key, cb) {
    if (typeof cb != 'function') {
      console.log('you need pass a function as callback')
      return
    }
    if (!this.subscribers[key]) this.subscribers[key] = []
    this.subscribers[key].push(cb)
  }

  $notify(path) {
    const keys = path.split('.')
    const depPaths = keys.map((key, index) => {
      if (index == 0) return key
      else {
        let str = ''
        while (index--) str = keys[index] + '.' + str
        return str + key
      }
    })
    depPaths.forEach((path) => {
      const fns = this.subscribers[path]
      if (fns && fns.length) {
        fns.forEach(fn => fn && fn(this.$getValue(path)))
      }
    })
  }

  $getValue(exp) {
    const path = exp.split('.')
    let val = this.data
    path.forEach(k => val = val[k])
    return val
  }
}


// allowed to test in browser
window.Observer = Observer


// test
let a2 = new Observer({
  name: {
    firstName: 'shaofeng',
    lastName: 'liang'
  },
  age: 25
})

a2.$watch('name', function (newName) {
  console.log('我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。')
})

a2.data.name.firstName = 'hahaha'
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。
a2.data.name.lastName = 'blablabla'
// 输出：我的姓名发生了变化，可能是姓氏变了，也可能是名字变了。
