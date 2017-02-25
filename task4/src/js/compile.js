import Watcher from './watcher'

const toNodeFragment = node => {
  const fragment = document.createDocumentFragment()
  let child
  while (child = node.firstChild) fragment.appendChild(child)
  return fragment
}

const isElementNode = node => node.nodeType == 1
const isTextNode = node => node.nodeType == 3
const isDirective = attr => attr.indexOf('v-') == 0

const _splice = Array.prototype.slice

class Compile {
  constructor(el, vm) {
    this.$vm = vm
    this.$el = isElementNode(el) ? el : document.querySelector(el)
    if (this.$el) {
      this.$fragment = toNodeFragment(this.$el)
      this.compile(this.$fragment.childNodes)
      this.$el.appendChild(this.$fragment)
    }
  }

  compile(nodes) {
    nodes = _splice.call(nodes)
    nodes.forEach(node => {
      if (isElementNode(node)) this.compileEl(node)
      else if (isTextNode(node)) {
        const reg = /\{\{(.+?)}}/g
        let match = reg.exec(node.nodeValue)
        if (match) {
          this.compileText(node, match[1], match.index, this.$vm)
        }
      }

      const childNodes = node.childNodes
      if (childNodes && childNodes.length) {
        this.compile(childNodes)
      }
    })
  }

  compileText(node, exp, index, vm) {
    // console.log(arguments)
    updater.textUpdater(node, this._getVMVal(vm, exp), '{{' + exp + '}}', index)
    new Watcher(this.$vm, exp, function (value, oldValue) {
      updater.textUpdater(node, value, oldValue)
    })
  }

  compileEl(node) {
    // console.log(node.attributes)
    const attrs = _splice.call(node.attributes)
    attrs.forEach(attr => {
      // if (isDirective(attr)) console.log(attr)

    })

  }

  _getVMVal(vm, exp) {
    let val = vm._data
    exp = exp.split('.')
    exp.forEach(k => {
      val = val[k]
    })
    return val
  }
}


const updater = {
  textUpdater: function (node, value, oldValue, startIndex) {
    //todo
    // node.nodeValue = node.nodeValue.replace(oldValue, function (oldValue, offset) {
    //   // if (offset === startIndex) {
    //   //   return value
    //   // }
    //   // else return oldValue
    //   return value
    // })
    node.nodeValue = node.nodeValue.replace(oldValue, value)
  }
}


export default Compile
