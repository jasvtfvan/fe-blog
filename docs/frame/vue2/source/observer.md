# 数据劫持

* 观察一个数据Vue2.0 defineProperty，无法针对数组length，length不可枚举
* [https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
>defineProperty只针对对象 数组是没有使用defineProperty的

## 1. 观察对象的getter和setter
* 核心代码
```js
function observer(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  for (let key in obj) {
    defineReactive(obj, key, obj[key]);
  }
}
function defineReactive(obj, key, value) {
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (value !== newValue) {
        value = newValue;
        console.log('视图更新');
      }
    }
  })
}
```
* 测试代码
```js
let data = {name: 'zf'};
observer(data);
console.log(data.name);
data.name = '123';
data.a = '123';
```
* 测试结果
```
zf
视图更新
```
* 结论
>1，增加不存在的属性 不能更新视图 (需要使用vm.$set)

## 2. 递归增加getter和setter
* 核心代码
```js
function observer(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  for (let key in obj) {
    defineReactive(obj, key, obj[key]);
  }
}
function defineReactive(obj, key, value) {
  observer(value); // 递归创建响应式数据，性能不好
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (value !== newValue) { // 新值也可能是一个对象
        observer(newValue);
        value = newValue;
        console.log('视图更新');
      }
    }
  })
}
```
* 测试代码
```js
let data = {name: {n: 'zf'}};
observer(data);
data.name.n = '123';
data.name = {n: 'jw'};
data.name.n = 'zf';
```
* 测试结果
```
视图更新
视图更新
视图更新
```
* 结论
>2，默认会递归增加 getter和setter<br>
>特点： 使用对象的时候 必须先声明属性，这个属性才是响应式的

## 3. 对数组的处理
* 核心代码
```js
function observer(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      let item = obj[i];
      observer(item);
    }
  } else {
    for (let key in obj) {
      // 默认只循环第一层
      defineReactive(obj, key, obj[key]);
    }
  }
}
function defineReactive(obj, key, value) {
  observer(value); // 递归创建响应式数据，性能不好
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (value !== newValue) { // 新值也可能是一个对象
        observer(newValue);
        value = newValue;
        console.log('视图更新');
      }
    }
  })
}
```
* 测试代码
```js
let data = {
  d: [1,2,3,{name:'zf'}]
};
observer(data);
data.d[0] = 100; // 不更新视图
data.d[3].name = 'jw'; // 更新视图
```
* 测试结果
```
视图更新
```
* 结论
>3，数组里套对象 对象是支持响应式变化的，如果是常量则没有效果<br>
>4，修改数组索引和长度 是不会导致视图更新的

## 4. 对数组原型方法的处理
* 核心代码
```js
let arrayProto = Array.prototype; // 数组原型上的方法
let proto = Object.create(arrayProto);
['push','unshift','splice','reverse','sort','shift','pop'].forEach(method => {
  proto[method] = function (...args) { // 这个参数数组，也应该被监控
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice': // 数组的splice 只有传递三个参数 才有追加效果
        inserted = args.slice(2);
        break;
      default:
        break;
    }
    ArrayObserver(inserted);
    // Array.prototype.push.call([1,2,3],4,5,6);
    console.log('更新视图');
    arrayProto[method].call(this,...args);
  }
});
function ArrayObserver(obj) {
  for (let i = 0; i < obj.length; i++) {
    let item = obj[i];
    observer(item);
  }
}
function observer(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    Object.setPrototypeOf(obj,proto); // 实现对数组方法的重写
    ArrayObserver(obj);
  } else {
    for (let key in obj) {
      // 默认只循环第一层
      defineReactive(obj, key, obj[key]);
    }
  }
}
function defineReactive(obj, key, value) {
  observer(value); // 递归创建响应式数据，性能不好
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (value !== newValue) { // 新值也可能是一个对象
        observer(newValue);
        value = newValue;
        console.log('视图更新');
      }
    }
  })
}
```
* 测试代码
```js
let data = {
  d: [1,2,3,{name:'zf'}]
};
observer(data);
data.d.push({name:'jw'});
console.log(data.d);
data.d[4].name = 'zfjw';
```
* 测试结果
```
更新视图
[ 1, 2, 3, { name: [Getter/Setter] }, { name: [Getter/Setter] } ]
视图更新
```
* 结论
>5，如果新增的数据 vue中也会帮你监控（对象类型）

## 结论总结
* 1，增加不存在的属性 不能更新视图 (需要使用vm.$set)
* 2，默认会递归增加 getter和setter
* 特点： 使用对象的时候 必须先声明属性，这个属性才是响应式的
* 3，数组里套对象 对象是支持响应式变化的，如果是常量则没有效果<br>
* 4，修改数组索引和长度 是不会导致视图更新的
* 5，如果新增的数据 vue中也会帮你监控（对象类型）
