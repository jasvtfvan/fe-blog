# react15核心一览
* 完成了`react15`的推演逻辑，之后的章节就是利用`fiber`实现`react16`
* `react15`代码放在这一章，测试代码需要回顾之前几章

## src/react/component.js
```js
import { compareTwoElements } from './vdom';

//更新队列
export const updateQueue = {
  updaters: [],//要执行的updater对象
  isPending: false,//是否处于批量更新模式
  add(updater) {
    this.updaters.push(updater);
  },
  //需要调用batchUpdate才更新
  batchUpdate() {
    let { updaters } = this;
    this.isPending = true;//开始更新
    let updater;
    while (updater = updaters.pop()) {
      updater.updateComponent();//更新所有 dirty 组件
    }
    this.isPending = false;//更新完毕
  }
};

class Updater {
  constructor(componentInstance) {
    this.componentInstance = componentInstance;//Updater和类组件1对1关系
    this.pendingStates = [];//更新如果批量的，先把状态暂存到数组，最后更新时统一合并
    this.nextProps = null;//新的属性对象
  }
  addState(partialState) {
    this.pendingStates.push(partialState);//把新状态放入数组
    this.emitUpdate();
  }
  emitUpdate(nextProps) {
    this.nextProps = nextProps;
    //如果有新属性对象 或者 队列处于‘休息’状态，直接更新
    if (nextProps || !updateQueue.isPending) {
      this.updateComponent();
    } else {//否则交给队列处理
      updateQueue.add(this);
    }
  }
  updateComponent() {
    let { componentInstance, pendingStates, nextProps } = this;
    if (nextProps || pendingStates.length > 0) {//长度大于0，有要合并的状态
      shouldUpdate(componentInstance, this.getProps(), this.getState());
    }
  }
  //合并props
  getProps() {
    let { componentInstance, nextProps } = this;
    let { props } = componentInstance;
    if (!nextProps) nextProps = props;
    if (!props) props = {};
    props = { ...props, ...nextProps };
    return props;
  }
  //合并及返回新的状态
  getState() {
    let { componentInstance, pendingStates } = this;
    let { state } = componentInstance;//老组件当前状态
    if (pendingStates.length > 0) {
      //迭代pendingStates，将所有状态合并到state
      for (let i = 0; i < pendingStates.length; i++) {
        let nextState = pendingStates[i];
        if (typeof nextState === 'function') {
          state = { ...state, ...nextState.call(componentInstance, state) };
        } else {
          state = { ...state, ...nextState };
        }
      }
    }
    pendingStates.length = 0;//合并后清空数组
    return state;
  }
}
//判断是否要更新
function shouldUpdate(componentInstance, nextProps, nextState) {
  componentInstance.props = nextProps;//将新props赋给组件
  componentInstance.state = nextState;//将新state赋给组件
  if (
    componentInstance.shouldComponentUpdate &&
    !componentInstance.shouldComponentUpdate(
      getComponentDefaultProps(componentInstance, nextProps),
      nextState
    )
  ) {
    //如果shouldComponentUpdate返回false，则不更新
    return false;
  }
  componentInstance.forceUpdate();//让组件强制更新
}

class Component {
  constructor(props) {
    this.props = props;
    this.$updater = new Updater(this); //this 就是类组件的实例
    this.state = {}; // 当前状态
    this.nextProps = null; // 下一个属性对象
  }
  //批量更新 partial，状态可能会被合并
  setState(partialState) {
    this.$updater.addState(partialState);
  }
  forceUpdate() {//进行组件更新
    let { props, state, renderElement: oldRenderElement } = this;
    this.props = getComponentDefaultProps(this, props);
    if (this.componentWillUpdate) {
      this.componentWillUpdate(props, state);//nextProps,nextState
    }
    let { getSnapshotBeforeUpdate } = this;
    let extraArgs = getSnapshotBeforeUpdate && getSnapshotBeforeUpdate();
    let newRenderElement = this.render();
    let currentElement = compareTwoElements(oldRenderElement, newRenderElement);
    this.renderElement = currentElement;
    if (this.componentDidUpdate) {
      this.componentDidUpdate(props, state, extraArgs);//prevProps,prevState,extraArgs
    }
  }
}
function getComponentDefaultProps(componentInstance, props) {
  if (!props) props = {};
  let { defaultProps } = componentInstance.__proto__.constructor;
  if (defaultProps) {
    for (let propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  return props;
}
//类组件的本质也是函数(请参考new Class原理)，通过`isReactComponent`判断是类组件还是函数组件
Component.prototype.isReactComponent = {};
export {
  Component
}
```
## src/react/constants.js
```js
export const TEXT = Symbol.for('TEXT');//文本类型
export const ELEMENT = Symbol.for('ELEMENT');//元素类型
export const FUNCTION_COMPONENT = Symbol.for('FUNCTION_COMPONENT');//函数数件
export const CLASS_COMPONENT = Symbol.for('CLASS_COMPONENT');//类组件
export const BOOLEAN = Symbol.for('BOOLEAN');//boolean类型

export const MOVE = 'MOVE';
export const REMOVE = 'REMOVE';
export const INSERT = 'INSERT';
```
## src/react/event.js
```js
import { updateQueue } from './component';

/**
 * React通过，类似于`事件委托`机制，将事件绑定到document上；
 * 并把事件回调函数，以`eventStore`的形式，挂载到对应的真实DOM上
 * @param {*} dom 要绑定事件的DOM节点
 * @param {*} eventType 事件类型 onClick
 * @param {*} listener 事件处理函数
 */
export function addEvent(dom, eventType, listener) {
  eventType = eventType.toLowerCase(); // onClick 作为key，转换成 onclick
  //在要绑定的DOM节点上挂载一个对象，准备存放监听函数
  let eventStore = dom.eventStore || (dom.eventStore = {});
  //eventStore.onClick = () => {console.log('this is onClick')}
  eventStore[eventType] = listener;
  /**
   * 这里可以做兼容处理，比如兼容IE、Chrome、Firefox等等
   */
  // true是捕获阶段，处理事件； false是冒泡阶段，处理事件
  document.addEventListener(eventType.slice(2), dispatchEvent, false);
}

let syntheticEvent;//合成对象，可以复用，减少垃圾回收，提高性能
function dispatchEvent(event) {
  let { type, target } = event;//type->click target->button
  let eventType = 'on' + type; //onclick
  syntheticEvent = getSyntheticEvent(event);
  //事件监听函数执行之前，进入批量更新模式
  updateQueue.isPending = true;
  // 模拟冒泡过程
  while (target) {
    let { eventStore } = target;
    let listener = eventStore && eventStore[eventType];//onClick
    if (listener) {
      listener.call(target, syntheticEvent);
    }
    target = target.parentNode;
  }
  //所有监听函数执行完毕，清掉所有属性
  for (const key in syntheticEvent) {
    if (syntheticEvent.hasOwnProperty(key)) {
      delete syntheticEvent[key];
    }
  }
  //事件处理函数执行完成，关掉批量更新模式
  updateQueue.isPending = false;
  //执行批量更新，把缓存的updater全部执行
  updateQueue.batchUpdate();
}
//如果执行了persist，就让syntheticEvent指向新对象
function persist() {
  syntheticEvent = {};
  /**
   * 下一行写法错误:
   * 根据原型链: obj.__proto__ 指向 Object.prototype;
   * 如果 obj.__proto__.abc = abc 等价于 Object.prototype.abc = abc;
   * 这是具有破坏性的,这样执行后每个 Object() 实力对象，都将具有 __proto__ 都具有了 abc 属性;
   * for (key in obj) {
   *   console.log(key); // abc
   * }
   * 该for循环说明了,for in,可以找到在__proto__上自定义的属性。（用浏览器观察__proto__时,会发现自定义属性颜色更鲜艳）
   */
  // syntheticEvent.__proto__.persist = persist;
  Object.setPrototypeOf(syntheticEvent, { persist }); //等价于 syntheticEvent.__proto__ = { persist };
}
function getSyntheticEvent(nativeEvent) {
  if (!syntheticEvent) {
    persist();
  }
  syntheticEvent.nativeEvent = nativeEvent;
  syntheticEvent.currentTarget = nativeEvent.target;
  //把原生事件对象上的方法和属性都拷贝到合成对象上
  for (let key in nativeEvent) {
    if (typeof nativeEvent[key] === 'function') {
      syntheticEvent[key] = nativeEvent[key].bind(nativeEvent); //绑定this
    } else {
      syntheticEvent[key] = nativeEvent[key];
    }
  }
  return syntheticEvent;
}
```
## src/react/index.js
```js
import { TEXT, ELEMENT, CLASS_COMPONENT, FUNCTION_COMPONENT, BOOLEAN } from './constants';
import { ReactElement } from './vdom';
import { Component } from './component';
import { flatten, onlyOne } from './utils';

//利用数组 rest，方便children直接拿到数组
function createElement(type, config = {}, ...children) {
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
    if (type.defaultProps) {
      const defaultProps = type.defaultProps;
      for (let propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }
  } else if (typeof type === 'function') {
    $$typeof = FUNCTION_COMPONENT;
  } else {
    console.error(`Warning: React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: ${typeof type}.`);
  }
  /**
   * 打平children，[['div']] => ['div']，递归打平的逻辑是什么呢？
   * 因为jsx会被babel解析成AST语法树，生成的每个虚拟DOM，都会调用React.createElement。
   * 因此就相当于 React.createElement('div',{id:'parent'},React.createElement('div',{id:'child'}));
   * 所以，在React.createElement中打平children就实现了递归打平。
   */
  children = flatten(children);
  /**
   * !!! 叶子节点为字符串或数字时，需要包装成对象，这样才能指向dom节点，并根据dom更新内容
   * 见 src/react/vdom.js updateElement方法
   * 经过这样的改造后，element的输出结构，将跟官方有区别
   */
  props.children = children.filter(item => item != null).map(item => {
    let ret;
    if (typeof item === 'object' || typeof item === 'function') {
      ret = item;
    } else {
      if (typeof item === 'boolean') {
        ret = ({ $$typeof: BOOLEAN, type: BOOLEAN, content: item });
      } else {
        ret = ({ $$typeof: TEXT, type: TEXT, content: item });
      }
    }
    return ret;
  });
  return ReactElement($$typeof, type, key, ref, props);
}
function createRef() {
  return { current: null };
}
function createContext(defaultValue) {
  Provider.value = defaultValue;
  //利用函数组件的特性
  function Provider(props) {
    Provider.value = props.value;
    return props.children;
  }
  function Consumer(props) {
    //children是一个回调函数，返回虚拟DOM
    return onlyOne(props.children)(Provider.value);
  }
  return { Provider, Consumer };
}
export {
  Component
}
const React = {
  createContext,
  createRef,
  createElement,
  Component
}
export default React;
```
## src/react/utils.js
```js
import { addEvent } from './event';

export function setProps(dom, props) {
  for (let key in props) {
    if (key != 'children') {
      let value = props[key];
      setProp(dom, key, value);
    }
  }
}
//老有新没有=>删除  老有新有=>更新  老没有新有=>添加
export function patchProps(dom, oldProps, newProps) {
  //1,删除老有新没有
  for (const key in oldProps) {
    if (key !== 'children') {//children单独处理
      if (!newProps.hasOwnProperty(key)) {
        dom.removeAttribute(key);//新的不存在,删除
      }
    }
  }
  //2,新增及更新,新有
  for (let key in newProps) {
    if (key !== 'children') {//children单独处理
      setProp(dom, key, newProps[key]);
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
## src/react/vdom.js
```js
import { TEXT, ELEMENT, CLASS_COMPONENT, FUNCTION_COMPONENT, MOVE, REMOVE, INSERT, BOOLEAN } from './constants';
import { setProps, onlyOne, flatten, patchProps } from './utils';
import { unstable_batchedUpdates } from '../react-dom';

let updateDepth = 0;//递归深度
let diffQueue = [];//补丁包，比较移动、添加、删除的节点
export function compareTwoElements(oldRenderElement, newRenderElement) {
  oldRenderElement = onlyOne(oldRenderElement);
  newRenderElement = onlyOne(newRenderElement);
  let currentDOM = oldRenderElement.dom;//取出老的DOM节点（此处，element.dom = dom;已经做过预埋设计）
  let currentElement = oldRenderElement;
  if (newRenderElement == null) {
    currentDOM.parentNode.removeChild(currentDOM);//新的虚拟DOM为null，删掉老节点
    currentDOM = null;
  } else if (oldRenderElement.type != newRenderElement.type) { // span div function class
    let newDOM = createDOM(newRenderElement);//类型不同，新节点替换老节点
    currentDOM.parentNode.replaceChild(newDOM, currentDOM);
    currentElement = newRenderElement;
  } else {
    //新老节点都存在，类型一样。进行 dom-diff 深度比较，比较他们的属性和子节点，并尽可能复用老节点
    updateElement(oldRenderElement, newRenderElement);
  }
  return currentElement;
}
// *** 如果是`函数组件`或`类组件`,`oldElement`就是`oldRenderElement`
// renderElement 是函数组件执行后 或 类组件调用render后返回的虚拟DOM，虚拟DOM是由React.createElement创建的
function updateElement(oldElement, newElement) {
  /**
   * !!!给 src/react/index.js 做比对，如果是字符串或者数字，仍需要获取dom，并根据dom内容更新
   */
  let currentDOM = newElement.dom = oldElement.dom;
  if (oldElement.$$typeof === TEXT && newElement.$$typeof === TEXT) {
    if (oldElement.content !== newElement.content) {
      currentDOM.textContent = newElement.content;
    }
  } else if (oldElement.$$typeof === ELEMENT) {// div span p
    //先更新父节点的属性，再比较更新子节点（返回来也可以）
    updateDOMProperties(currentDOM, oldElement.props, newElement.props);
    updateChildrenElements(currentDOM, oldElement.props.children, newElement.props.children);
    //把newElement.props赋给oldElement.props，不仅要更新dom上的attribute，还是要同步props
    oldElement.props = newElement.props;
  } else if (oldElement.$$typeof === FUNCTION_COMPONENT) {// 函数组件
    updateFunctionComponent(oldElement, newElement);
  } else if (oldElement.$$typeof === CLASS_COMPONENT) {// 类组件
    updateClassComponent(oldElement, newElement);
  }
}
function updateChildrenElements(dom, oldChildrenElements, newChildrenElements) {
  updateDepth++;//每递归新一层，updateDepth++
  diff(dom, oldChildrenElements, newChildrenElements);
  updateDepth--;//每diff完一层，返回上一级，updateDepth--
  if (updateDepth === 0) {//当updateDepth为0，说明到了最上层，执行补丁包
    patch(diffQueue);//执行补丁
    diffQueue.length = 0;
  }
}
//注意 MOVE 的逻辑：删除原节点，再插入到新的位置，因此需要缓存老DOM
function patch(diffQueue) {
  let deleteMap = {};//缓存老的dom
  let deleteChildren = [];//要删除的子节点
  for (let i = 0; i < diffQueue.length; i++) {
    const difference = diffQueue[i];
    let { type, fromIndex, toIndex, componentInstance } = difference;
    if (type === MOVE || type === REMOVE) {//移动或删除
      let oldChildDOM = difference.parentNode.childNodes[fromIndex];//老的DOM节点
      if (type === MOVE) {//移动则缓存
        deleteMap[fromIndex] = oldChildDOM;//缓存老的DOM，方便复用
      }
      deleteChildren.push({ childDOM: oldChildDOM, componentInstance });
    }
  }
  //把移动和删除的节点，执行删除操作。因为移动的真实DOM已经缓存，所以还可以拿到
  deleteChildren.forEach(({ childDOM, componentInstance }) => {
    childDOM.parentNode.removeChild(childDOM);
    // 如果componentInstance存在，说明是类组件，如果卸载则执行 componentInstanceWillUnmount
    if (componentInstance && componentInstance.componentWillUnmount) {
      componentInstance.componentWillUnmount();
    }
  });
  for (let i = 0; i < diffQueue.length; i++) {
    //diff函数处理完毕后
    //MOVE具有fromIndex,toIndex
    //INSERT具有toIndex,dom
    //REMOVE具有fromIndex
    let { type, fromIndex, toIndex, parentNode, dom } = diffQueue[i];
    if (type === INSERT) {
      insertChildAt(parentNode, dom, toIndex);
    } else if (type === MOVE) {
      insertChildAt(parentNode, deleteMap[fromIndex], toIndex);
    }
  }
  //释放资源
  deleteMap = {};
  deleteChildren.length = 0;
}
//向index索引位置插入元素
function insertChildAt(parentNode, newChildDOM, index) {
  let oldChild = parentNode.children[index];//拿到老的节点
  oldChild ? parentNode.insertBefore(newChildDOM, oldChild) : parentNode.appendChild(newChildDOM);
}
function diff(parentNode, oldChildrenElements, newChildrenElements) {
  let oldChildrenElementsMap = getChildrenElementsMap(oldChildrenElements);
  let newChildrenElementsMap = getNewChildrenElementsMap(oldChildrenElementsMap, newChildrenElements);
  let lastIndex = 0;
  //由于深度优先，所有子节点在diffQueue中的位置，比父节点位置靠前
  for (let i = 0; i < newChildrenElements.length; i++) {
    const newChildElement = newChildrenElements[i];
    if (newChildElement) {
      let newKey = newChildElement.key || i.toString();
      let oldChildElement = oldChildrenElementsMap[newKey];
      if (newChildElement === oldChildElement) {//同一个对象，在构建newChildrenElementsMap时确定
        if (oldChildElement._mountIndex < lastIndex) {
          diffQueue.push({
            parentNode,//记录父节点
            type: MOVE,
            fromIndex: oldChildElement._mountIndex,
            toIndex: i
          });
        }
        lastIndex = Math.max(oldChildElement._mountIndex, lastIndex);
      } else {//如果类型不相等，插入新元素（后边该key对应的老元素将被迭代，并会标记为删除）
        diffQueue.push({
          parentNode,
          type: INSERT,
          toIndex: i,
          dom: createDOM(newChildElement)
        });
      }
      newChildElement._mountIndex = i;//新的节点，下次更新时，将变成老节点，需要_mountIndex
    }
  }
  //迭代老节点，如果新节点map中不包含老key，或者key相同type不同，则将老节点标记为删除
  for (const oldKey in oldChildrenElementsMap) {
    let oldChildElement = oldChildrenElementsMap[oldKey];
    if (newChildrenElementsMap.hasOwnProperty(oldKey)) {//新老key相同
      let newChildElement = newChildrenElementsMap[oldKey];
      //如果key相同，type相同，在getNewChildrenElementsMap方法中，就确保了newChildElement === oldChildElement
      //当然，也可以使用canDeepCompare判断
      if (oldChildElement !== newChildElement) {//type不同
        diffQueue.push({
          parentNode,
          type: REMOVE,
          fromIndex: oldChildElement._mountIndex,
          componentInstance: oldChildElement.componentInstance //如果存在componentInstance，说明是类组件
        });
      }
    } else {//新map不包含老key，标记老元素删除
      diffQueue.push({
        parentNode,
        type: REMOVE,
        fromIndex: oldChildElement._mountIndex,
        componentInstance: oldChildElement.componentInstance //如果不存在，则为undefined
      });
    }
  }
}
function getNewChildrenElementsMap(oldChildrenElementsMap, newChildrenElements) {
  let map = {};
  for (let i = 0; i < newChildrenElements.length; i++) {
    const newChildElement = newChildrenElements[i];
    if (newChildElement) {
      let newKey = newChildElement.key || (i + '');
      let oldChildElement = oldChildrenElementsMap[newKey];
      // key一样，类型一样
      if (canDeepCompare(oldChildElement, newChildElement)) {
        updateElement(oldChildElement, newChildElement);//更新属性后，递归更新子节点
        newChildrenElements[i] = oldChildElement;//复用老的虚拟DOM，老的虚拟DOM的dom属性，指向真实DOM
      }
      //新数组上的每个element都映射到map，其中包含了跟oldChildElement相等的元素
      map[newKey] = newChildrenElements[i];
    }
  }
  return map;
}
//是否可以深度递归比较
function canDeepCompare(oldChildElement, newChildElement) {
  if (!!oldChildElement && !!newChildElement) {
    return oldChildElement.type === newChildElement.type;
  }
  return false;
}
// 获取老map
function getChildrenElementsMap(oldChildrenElements) {
  let map = {};
  for (let i = 0; i < oldChildrenElements.length; i++) {
    const oldKey = oldChildrenElements[i].key || (i + '');
    map[oldKey] = oldChildrenElements[i];
  }
  return map;
}
function updateDOMProperties(dom, oldProps, newProps) {
  patchProps(dom, oldProps, newProps);
}
//类组件element.componentInstance.renderElement.dom=真实DOM
function updateClassComponent(oldElement, newElement) {
  let componentInstance = newElement.componentInstance = oldElement.componentInstance;
  let updater = componentInstance.$updater;
  let nextProps = newElement.props;
  //React.createElement(ClassA,{style:{color:'red'}},...children) => ClassA -> type
  if (oldElement.type.contextType) {
    componentInstance.context = oldElement.type.contextType.Provider.value;
  }
  if (componentInstance.componentWillReceiveProps) {
    componentInstance.componentWillReceiveProps(nextProps);
  }
  //getDerivedStateFromProps 在 componentWillReceiveProps 后边
  //type指class,getDerivedStateFromProps是静态属性
  if (newElement.type.getDerivedStateFromProps) {
    let newState = newElement.type.getDerivedStateFromProps(nextProps, componentInstance.state);
    if (newState) {
      componentInstance.state = { ...componentInstance.state, ...newState };
    }
  }
  updater.emitUpdate(nextProps);
}
//函数组件element.renderElement.dom=真实DOM
function updateFunctionComponent(oldElement, newElement) {
  let oldRenderElement = oldElement.renderElement;
  let newRenderElement = newElement.type(newElement.props);
  let currentDOM = compareTwoElements(oldRenderElement, newRenderElement);
  newElement.renderElement = currentDOM;//更新之后，重新挂载
}

export function createDOM(element) {
  if (typeof element !== 'object') {
    throw Error(`Uncaught DOMException: Failed to execute 'createElement' on 'Document': The tag name provided ('${element}') is not a valid name.`)
  }
  /**
   * !!! element 如果是字符串或者数字，修改成在 createElement时，封装成对象
   */
  let dom;
  element = onlyOne(element); // 如果是数组，只取第一个
  let { $$typeof } = element;
  if (!$$typeof) { // 字符串或者数字
    dom = document.createTextNode(element);
  } else if ($$typeof == TEXT) {
    dom = document.createTextNode(element.content);
  } else if ($$typeof == ELEMENT) { // 原生DOM节点
    dom = createNativeDOM(element);
  } else if ($$typeof == FUNCTION_COMPONENT) { // 函数组件
    dom = createFunctionComponentDOM(element);
  } else if ($$typeof == CLASS_COMPONENT) { // 类组件
    dom = createClassComponentDOM(element);
  } else if ($$typeof == BOOLEAN) { // boolean
    dom = document.createTextNode('');
  }
  /**
   * `element`是ReactElement创建出来的虚拟DOM，让虚拟的DOM的`dom`属性指向真实DOM
   * 这里是一个预埋设计，或者叫铺垫，通过虚拟DOM能够获取真实DOM
   */
  element.dom = dom;
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
  // `element.dom = dom;`，可以推导出: element.renderElement.dom=真实DOM
}
// 创建类组件真实的DOM对象
function createClassComponentDOM(element) {
  let { type, props, ref } = element;
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
  if (type.contextType) {
    componentInstance.context = type.contextType.Provider.value;
  }
  if (ref) {//给类组件也增加ref
    ref.current = componentInstance;
  }
  if (componentInstance.componentWillMount) {
    componentInstance.componentWillMount();
  }
  if (type.getDerivedStateFromProps) {
    let newState = type.getDerivedStateFromProps(props, componentInstance.state);
    if (newState) {
      componentInstance.state = { ...componentInstance.state, ...newState };
    }
  }
  element.componentInstance = componentInstance; // 这里也是一个预埋设计
  let renderElement = componentInstance.render();
  componentInstance.renderElement = renderElement; // 这里也是一个预埋设计
  let dom = createDOM(renderElement);
  renderElement.dom = dom; // 此处需要进行一次挂载,便于配合生命周期
  if (componentInstance.componentDidMount) {
    unstable_batchedUpdates(componentInstance.componentDidMount.bind(componentInstance));
  }
  return dom;
  // `element.dom = dom;`，可以推导出: element.componentInstance.renderElement.dom=真实DOM
}
/**
let element = React.createElement('button',
  { id: 'sayHello', onClick },
  'say', React.createElement('span', { onClick: spanClick, style: { color: 'red' } }, 'Hello')
);
 */
function createNativeDOM(element) {
  let { type, props, ref } = element; // div button span
  let dom = document.createElement(type); //真实DOM对象
  //1，创建虚拟dom的子节点
  createNativeDOMChildren(dom, element);
  //2，给DOM元素添加属性
  setProps(dom, props);
  if (ref) {
    ref.current = dom;
  }
  return dom;
}
function createNativeDOMChildren(parentNode, element) {
  let childrenNodeArr = element.props.children;//已经在React.createElement中打平
  if (childrenNodeArr) {
    for (let i = 0; i < childrenNodeArr.length; i++) {
      let child = childrenNodeArr[i];
      //child会传递给element，预埋设计，跟`element.dom = dom;`逻辑一样，给element添加索引
      child._mountIndex = i;
      let childDOM = createDOM(child);
      parentNode.appendChild(childDOM);
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
## src/react-dom/index.js
```js
import { createDOM } from '../react/vdom';
import { updateQueue } from '../react/component';
function render(element, container) {
  //1，把虚拟dom变成真实DOM
  let dom = createDOM(element);
  //2，挂在真实DOM到container上
  container.appendChild(dom);
}
function unstable_batchedUpdates(fn) {
  updateQueue.isPending = true;//批量更新模式
  fn();
  updateQueue.isPending = false;
  updateQueue.batchUpdate();
}
export {
  unstable_batchedUpdates,
}
export default {
  render,
  unstable_batchedUpdates,
};
```
