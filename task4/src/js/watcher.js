import Dep from './dep'

class Watcher {
  constructor(vm, exp, cb, options) {
    this.vm = vm
    this.exp = exp
    this.cb = cb
    this.deep = options ? !!options.deep : false
    this.depIds = {}
    this.getter = parsePath(this.exp)
    this.value = this.get()
  }

  addDep(dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this)
      this.depIds[dep.id] = dep
    }
  }


  get() {
    Dep.target = this
    const value = this.getter(this.vm)

    if (this.deep) traverse(value)

    Dep.target = null
    return value
  }

  update() {
    // console.log('updated')
    this.run()
  }

  run() {
    const oldValue = this.value
    this.value = this.get()
    if (oldValue !== this.value) this.cb.call(this.vm, this.value, oldValue)
  }
}


function parsePath(path) {
  const segments = path.split('.')
  return function (obj) {
    segments.forEach(k => obj = obj[k])
    return obj
  }
}

const seenObjects = new Set()

function traverse(val) {
  seenObjects.clear()
  _traverse(val, seenObjects)
}

function _traverse(val, seen) {
  if (typeof val != 'object') return
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) return
    seen.add(depId)
  }
  const keys = Object.keys(val)
  let i = keys.length
  while (i--) _traverse(val[keys[i]], seen)
}

export default Watcher
