# 类组件和函数组件

## 1. src/index.js
```js {3-23}
import React from './react';
import ReactDOM from './react-dom';
class ClassCounter extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    let { children, ...props } = this.props;
    return React.createElement('div', { id: 'counter', ...props }, 'hello', children);
  }
}
function FunctionCounter(props) {
  let { children, ...config } = props;
  return React.createElement('div', { id: 'counter', ...config }, 'hello', children);
}
let element1 = React.createElement('div', { id: 'counter' }, 'hello');
let element2 = React.createElement(ClassCounter, { style: { color: 'blue' } }, 'world');
let element3 = React.createElement(FunctionCounter, { style: { color: 'blue' } }, 'world');
ReactDOM.render(
  element3,
  document.getElementById('root')
);
```

## 2. src/react/index.js
```js {1,3,17-20,22,36-38,41,42}
import { ELEMENT, CLASS_COMPONENT, FUNCTION_COMPONENT } from './constants';
import { ReactElement } from './vdom';
import { Component } from './component';

function createElement(type, config = {}, children) {
  delete config.__source;//dev环境下变量，不考虑该变量
  delete config.__self;//dev环境下变量，不考虑该变量
  let { key, ref, ...props } = config;
  let $$typeof = null;
  if (typeof type === 'string') {//span div button
    $$typeof = ELEMENT;//是一个原生的DOM类型
    /**
     * 这里要注意，用真实React在测试时，你会发现：
     * let e1 = React.createElement('abc');
     * console.log(e1); // $$typeof 仍然是 react.element类型，type: 'abc'
     */
  } else if (typeof type === 'function' && type.prototype.isReactComponent) {
    $$typeof = CLASS_COMPONENT;
  } else if (typeof type === 'function') {
    $$typeof = FUNCTION_COMPONENT;
  } else {
    console.error(`Warning: React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: ${typeof type}.`);
  }
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {//children是一个对象或字符串
    props.children = children;
  } else if (childrenLength > 1) {//children是一个数组
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }
  return ReactElement($$typeof, type, key, ref, props);
}
export {
  Component
}
const React = {
  createElement,
  Component
}
export default React;
```

## 3. src/react/constants.js
```js {1-4}
export const TEXT = Symbol.for('TEXT');
export const ELEMENT = Symbol.for('ELEMENT');
export const FUNCTION_COMPONENT = Symbol.for('FUNCTION_COMPONENT');//函数数件
export const CLASS_COMPONENT = Symbol.for('CLASS_COMPONENT');//类组件
```

## 4. src/react/component.js
* 新增
```js
class Component {
  constructor(props) {
    this.props = props;
  }
}
//类组件的本质也是函数(请参考new Class原理)，通过`isReactComponent`判断是类组件还是函数组件
Component.prototype.isReactComponent = {};
export {
  Component
}
```

## 5. src/react/vdom.js
```js {1,2,5-10,16-19,21-25,31-68,85,88-93}
import { ELEMENT, CLASS_COMPONENT, FUNCTION_COMPONENT } from './constants';
import { setProps, onlyOne, flatten } from './utils';

export function createDOM(element) {
  if (element == null) { // null or undefined
    return null; // appendChild时，如果为null，则不挂载到parent上
  }
  let dom;
  if (typeof element === 'object') { // 如果是对象类型
    element = onlyOne(element); // 如果是数组，只取第一个
    let { $$typeof } = element;
    if (!$$typeof) { // 字符串或者数字
      dom = document.createTextNode(element);
    } else if ($$typeof == ELEMENT) { // 原生DOM节点
      dom = createNativeDOM(element);
    } else if ($$typeof == FUNCTION_COMPONENT) { // 函数组件
      dom = createFunctionComponentDOM(element);
    } else if ($$typeof == CLASS_COMPONENT) { // 类组件
      dom = createClassComponentDOM(element);
    }
    /**
     * `element`是ReactElement创建出来的虚拟DOM，让虚拟的DOM的`dom`属性指向真实DOM
     * 这里是一个预埋设计，或者叫铺垫，通过虚拟DOM能够获取真实DOM
     */
    element.dom = dom;
  } else { // 如果非对象类型，数字，字符串
    dom = document.createTextNode(element);
  }
  return dom;
}
// 创建函数组件真实的DOM对象
function createFunctionComponentDOM(element) {
  //element: $$typeof, type, key, ref, props
  let { type, props } = element;
  /**
   * function FunctionComponent(props) {
   *   return React.createElement('div', { id: 'counter' }, 'hello');
   * }
   */
  let renderElement = type(props);// type === FunctionComponent
  //element 是 React.createElement(FunctionComponent, config, children); 的返回值
  //element 是 FunctionComponent 的父级，当然这里不是DOM的父级，只是理解为父级
  element.renderElement = renderElement; // 这里也是一个预埋设计
  let dom = createDOM(renderElement);
  return dom;
  // 第25行`element.dom = dom;`，可以推导出: element.renderElement.dom=真实DOM
}
// 创建类组件真实的DOM对象
function createClassComponentDOM(element) {
  let {type, props } = element;
  /**
   * class ClassCounter extends React.Component {
   *   constructor(props) {
   *     super(props);
   *   }
   *   render() {
   *     return React.createElement('div', { id: 'counter' }, 'hello');
   *   }
   * }
   */
  let componentInstance = new type(props);
  element.componentInstance = componentInstance; // 这里也是一个预埋设计
  let renderElement = componentInstance.render();
  componentInstance.renderElement = renderElement; // 这里也是一个预埋设计
  let dom = createDOM(renderElement);
  return dom;
  // 第25行`element.dom = dom;`，可以推导出: element.componentInstance.renderElement.dom=真实DOM
}
/**
let element = React.createElement('button',
  { id: 'sayHello', onClick },
  'say', React.createElement('span', { onClick: spanClick, style: { color: 'red' } }, 'Hello')
);
 */
function createNativeDOM(element) {
  let { type, props } = element; // div button span
  let dom = document.createElement(type); //真实DOM对象
  //1，创建虚拟dom的子节点
  createNativeDOMChildren(dom, element.props.children);
  //2，给DOM元素添加属性
  setProps(dom, props);
  return dom;
}
function createNativeDOMChildren(parentNode, ...children) {
  let childrenNodeArr = children && flatten(children);
  if (childrenNodeArr) {
    for (let i = 0; i < childrenNodeArr.length; i++) {
      let child = childrenNodeArr[i];
      if (typeof child === 'object') { // 对象类型，不是字符串或数字
        //child会传递给element，预埋设计，跟第25行`element.dom = dom;`逻辑一样，给element添加索引
        child._mountIndex = i;
      }
      let childDOM = createDOM(child);
      childDOM && parentNode.appendChild(childDOM);
    }
  }
}

export function ReactElement($$typeof, type, key, ref, props) {
  let element = {
    $$typeof, type, key, ref, props
  };
  return element;
}
```

## 6. src/react/utils
```js {23-37}
import { addEvent } from './event';

export function setProps(dom, props) {
  for (let key in props) {
    if (key != 'children') {
      let value = props[key];
      setProp(dom, key, value);
    }
  }
}
function setProp(dom, key, value) {
  if (/^on/.test(key)) {
    addEvent(dom, key, value);
  } else if (key === 'style') {
    for (const styleName in value) {
      dom.style[styleName] = value[styleName];
    }
  } else {
    dom.setAttribute(key, value);
  }
}

export function onlyOne(obj) {
  return Array.isArray(obj) ? obj[0] : obj;
}

// 打平任意多维数组，避免深度克隆
export function flatten(arr) {
  return arr.reduce((prev, curr, index) => {
    if (Array.isArray(curr)) {
      prev = prev.concat(flatten(curr));
    } else {
      prev = prev.concat(curr);
    }
    return prev;
  }, []);
}
```

## 6. 没有改变的js
>src/react-dom/index.js<br>
>src/react/event.js



