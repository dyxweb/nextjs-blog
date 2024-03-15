## 简单vue实现
```
function Vue(options = {}) {
  this.$options = options;
  let data = this._data = this.$options.data;
  // 数据劫持
  observe(data);
  // this代理，使用this可以直接访问到data
  for (let key in data) {
    Object.defineProperty(this, key, {
      configurable: true,
      get() {
        return this._data[key];
      },
      set(newVal) {
        this._data[key] = newVal;
      }
    });
  }
  // 编译
  new Compile(options.el, this);
}

// 数据劫持的主要逻辑
function Observe(data) {
  let dep = new Dep();
  // 把data属性通过defineProperty的方式定义属性
  for (let key in data) {
    let val = data[key];
    observe(val);   // 实现了深度的数据劫持(属性值也是对象的形式)
    Object.defineProperty(data, key, {
      enumerable: true,
      get() {
        Dep.target && dep.addSub(Dep.target);
        return val;
      },
      set(newVal) {
        if (val === newVal) {
          return;
        }
        val = newVal;
        observe(newVal);    // 修改的新值也要数据劫持(修改的值为对象的形式)
        dep.notify();   // 让所有的watcher的update方法执行即可
      }
    });
  }
}

// 数据劫持的方法
function observe(data) {
  if (!data || typeof data !== 'object') {
    return;
  }
  return new Observe(data);
}

// 编译
function Compile(el, vm) {
  vm.$el = document.querySelector(el);
  let fragment = document.createDocumentFragment();

  while (child = vm.$el.firstChild) {
    fragment.appendChild(child);
  }
  replace(fragment);

  function replace(frag) {
    Array.from(frag.childNodes).forEach(function (node) {
      let txt = node.textContent;
      let reg = /\{\{(.*?)\}\}/g;

      if (node.nodeType === 3 && reg.test(txt)) { // 即是文本节点又有大括号{}
        !function replaceTxt() {
          node.textContent = txt.replace(reg, (matched, placeholder) => {
            new Watcher(vm, placeholder, replaceTxt);  // 监听变化，重新进行匹配替换内容
            // 深层次取值的形式
            return placeholder.split('.').reduce((val, key) => {
              return val[key];
            }, vm);
          });
        }();
      }

      if (node.nodeType === 1) {  // 元素节点 v-model的实现
        let nodeAttr = node.attributes;     // 获取dom节点的属性
        Array.from(nodeAttr).forEach(attr => {
          let name = attr.name;
          let exp = attr.value;
          if (name.includes('v-')) {
            node.value = vm[exp];
          }
          new Watcher(vm, exp, function (newVal) {
            node.value = newVal;    // 当watcher触发时会自动将内容放进输入框中
          });
          node.addEventListener('input', function (e) {
            let newVal = e.target.value;
            vm[exp] = newVal;
          });
        });
      }

      // 深层次递归节点
      if (node.childNodes && node.childNodes.length) {
        replace(node);
      }
    });
  }
  vm.$el.appendChild(fragment);
}

// 发布订阅
function Dep() {
  this.subs = [];
}

Dep.prototype.addSub = function (sub) {
  this.subs.push(sub);
};
Dep.prototype.notify = function () {
  this.subs.forEach(sub => sub.update());
};

// watcher
function Watcher(vm, exp, fn) {
  this.fn = fn;
  this.vm = vm;
  this.exp = exp;
  Dep.target = this;
  let val = vm;
  let arr = exp.split('.');
  arr.forEach(key => {
    val = val[key];  // 这里取值的时候Dep.target有值
  });
  Dep.target = null;
}

Watcher.prototype.update = function () {
  let val = this.vm;
  let arr = this.exp.split('.');
  arr.forEach(key => {
    val = val[key];
  });
  this.fn(val);
};
```