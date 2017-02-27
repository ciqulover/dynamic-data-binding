#### 具备功能

* 支持`v-html,v-model,v-on,@click`等`directive`
* 支持`deep watch`，`$watch` API
  ```javascript
  // 键路径
  vm.$watch('a.b.c', function (newVal, oldVal) {
    // 做点什么
  })
  
  // 为了发现对象内部值的变化，可以在选项参数中指定 deep: true 
  vm.$watch('someObject', callback, {
    deep: true
  })
  vm.someObject.nestedValue = 123
  // callback is fired
  ```
  
#### TODO
* [x]  属性代理
* [x] `methods`对象
* [ ] 其他指令的实现
* [ ] Virtual Dom
* [ ] 异步渲染
