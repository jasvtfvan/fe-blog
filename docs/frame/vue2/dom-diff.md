# Vue2 dom-diff算法 源码分解

## 1. 最终目录结构
参考该目录结构，后文不再赘述文件位置
```{5,8}
|-- vue2-dom-diff
    |-- .gitignore
    |-- package-lock.json
    |-- package.json
    |-- dist
    |   |-- index.html
    |   |-- main.js
    |-- src
        |-- index.js
        |-- vdom
            |-- h.js
            |-- index.js
            |-- patch.js
            |-- vnode.js
```

## 2. 构建项目
* 初始化项目
```bash
cd ~/Documents/
mkdir vue2-dom-diff
cd vue2-dom-diff
npm init -y
```
* 修改package.json文件
```json {7,8,13,14,15,16,17,18}
{
  "name": "vue2-dom-diff",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack --mode=development",
    "dev": "webpack-dev-server --mode=development --contentBase=./dist"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/webpack-dev-server": "^3.1.7",
    "webpack": "^4.41.2",
    "webpack-cli": "^3.3.9",
    "webpack-dev-server": "^3.8.2"
  }
}
```
* 初始化main.js
```bash
npm run build
```
* 创建index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Vue DOM DIFF</title>
    <style>
        ul {
            text-align: center;
            transition: all 1s;
        }
        li {
            width: 100px;
            color: #FFF;
            text-align: center;
            transition: all 1s;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    <script src="main.js"></script>
</body>
</html>
```

## 3. 虚拟dom实现
### 3.1 虚拟dom结构
![2.virutaldom](./images/2.virutaldom.png)
### 3.2 src/index.js
测试虚拟dom代码
```js
import { h } from './vdom';
// h是用来创建虚拟dom的，虚拟dom就是一个普通js对象，放着类型、属性、多个子类
const root = document.getElementById('root');
const oldVnode = h('div', { id: 'container' },
  h('span', { style: { color: 'red' } }, 'hello'),
  'world'
);
console.log(oldVnode);
```
### 3.3 vdom/index.js
```js
import h from './h';
export {
    h
}
```
### 3.4 vdom/h.js
```js
import vnode from './vnode';
const hasOwnProperty = Object.prototype.hasOwnProperty;
function h(type, config, ...children) {
    const props = {}; // 属性对象
    let key;
    if (config) {
        if (config.key) {
            key = config.key;
        }
        // 迭代config中的每一个属性
        for (let propName in config) {
            if (hasOwnProperty.call(config, propName) && propName != 'key') {
                props[propName] = config[propName];
            }
        }
    }
    // type=div key=undefined
    return vnode(type, key, props, children.map((child, index) => {
        return typeof child == 'number' || typeof child == 'string' ? vnode(undefined, undefined, undefined, undefined, child) : child;
    }));
}
export default h;
```




