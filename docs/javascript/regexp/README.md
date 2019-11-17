# js正则表达式

## 1. 正则工具
[https://regexper.com/](https://regexper.com/)

## 2. RegExp对象
### 2.1 实例化RegExp对象
#### 2.1.1 字面量
```js
var reg = /\bis\b/g;
```
>\b单词边界
```js
'He is a boy. This is a dog. Where is she?'.replace(reg, 'IS');
```
>"He IS a boy. This IS a dog. Where IS she?"
#### 2.1.2 构造函数
```js
var reg = new RegExp('\\bis\\b','g');
```
```js
'He is a boy. This is a dog. Where is she?'.replace(reg, 'IS');
```
>"He IS a boy. This IS a dog. Where IS she?"
### 2.2 修饰符
#### 2.2.1 g:global
全文搜索，不添加，搜索到第一个匹配停止
#### 2.2.2 i:ignore case
忽略大小写，默认大小写敏感
#### 2.2.3 m:multiple lines
多行搜索

## 3. 原字符
### 3.1 原义文本字符
* 没有特殊含义，a 就是 a，2 就是 2
### 3.2 元字符
* 正则表达式中，有特殊含义的非字母字符
```
* + ? $ ^ . | \ ( ) { } [ ]
```
字符 | 含义   
-|-
\t | 水平制表符 |
\v | 垂直制表符 |
\n | 换行符 |
\r | 回车符 |
\o | 空字符 |
\f | 换页符 |
\cX| 与X对应的控制字符(Ctrl + X) |

## 4. 字符类
### 4.1 字符类
```js
'a1b2c3d4'.replace(/[abcd]/g,'A');
```
>"A1A2A3A4"
### 4.2 字符类取反
```js
'a1b2c3d4'.replace(/[^abcd]/g,'N');
```
>"aNbNcNdN"



