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

## 5. 范围类
### 5.1 范围含义
```js
'2019-10-10'.replace(/[0-9]/g,'X');
```
>"XXXX-XX-XX"
### 5.2 减号含义
```js
'2019-10-10'.replace(/[0-9-]/g,'X');
```
>"XXXXXXXXXX"

## 6. 预定义类与边界
### 6.1 预定义类
字符 ｜ 等价类 | 含义   
-|-|-
. | [^\r\n] | 除了回车和换行符之外的所有字符 |
\d | [0-9] | 数字字符 |
\D | [^0-9] | 非数字字符 |
\s | [\t\n\x0B\f\r] | 空白符 |
\S | [^\t\n\x0B\f\r] | 非空白符 |
\w | [a-zA-Z_0-9] | 单词字符(字母、数字、下划线) |
\W | [^a-zA-Z_0-9] | 非单词字符 |
```js
ab[0-9][^\r\n]
```
等价于
```js
ab\d.
```
### 6.2 边界
字符 | 含义   
-|-
^ | 以xxx开始 |
$ | 以xxx结束 |
\b | 单词边界 |
\B | 非单词边界 |
* \b \B
```js
'This is Tom'.replace(/is/g,'0');
```
>"Th0 0 Tom"
```js
'This is Tom'.replace(/\bis\b/g,'0');
```
>"This 0 Tom"
```js
'This is Tom'.replace(/\Bis\b/g,'0');
```
>"Th0 is Tom"
* ^ $
```js
'@123@abc@'.replace(/@./g,'-');
```
>"-23-bc@"
```js
'@123@abc@'.replace(/^@./g,'-');
```
>"-23@abc@"
```js
'@123@abc@'.replace(/.@/g,'-');
```
>"@12-ab-"
```js
'@123@abc@'.replace(/.@$/g,'-');
```
>"@123@ab-"
* gm
```js
var multiStr = 
`@123
@456
@789`;
multiStr.replace(/^@\d/g,'-');
```
>"-23<br>
@456<br>
@789"<br>
```js
multiStr.replace(/^@\d/gm,'-');
```
>"-23<br>
-56<br>
-89"<br>

## 7. 量词
字符 | 含义   
-|-
? | 出现0次或1次(最多出现1次) |
+ | 出现1次或多次(至少出现1次) |
* | 出现0次或多次(任意次) |
{n} | 出现n次 |
{n,m} | 出现n到m次 |
{n,} | 至少出现n次 |
{0,n} | 最多出现n次 |

## 8. 贪婪模式与非贪婪模式
### 8.1 贪婪模式
尽可能多的匹配
```js
'123456789'.replace(/\d{3,7}/g,'-');
```
>"-89"

### 8.2 非贪婪模式
尽可能少的匹配
```js
'123456789'.replace(/\d{3,7}?/g,'-');
```
>"---"<br>
>123,456,789都匹配到\d{3}

## 9. 分组
### 9.1 ()
```js
'a1b2c3d4'.replace(/([a-z]\d){3}/g,'-');
```
>"-d4"
### 9.2 或
```js
'JasvtFvan'.replace(/Jasvt|Fvan/g,'X');
```
>"XX"
```js
'JasvtanJasFvan'.replace(/Jas(vt|Fv)an/g,'X');
```
>"XX"
### 9.3 反向引用
```js
'2019-10-12'.replace(/(\d{4})-(\d{2})-(\d{2})/g,'$1');
```
>"2019"
```js
'2019-10-12'.replace(/(\d{4})-(\d{2})-(\d{2})/g,'$3/$2/$1');
```
>"12/10/2019"
### 9.4 忽略分组
```js
'2019-10-12'.replace(/(\d{4})-(?:\d{2})-(\d{2})/g,'$3/$2/$1');
```
>"$3/12/2019"

## 10. 前瞻
### 10.1 前，头部指向尾部的方向
* `前` 从头部向尾部开始解析，从头部指向尾部的方向，叫做 `前`
* **前瞻**就是正则表达式匹配到规则的时候，向`前`检查是否符合断言
* javascript不支持后瞻/后顾/后望
* 符合特定断言成为`肯定/正向`匹配；不符合特定断言成为`否定/负向`匹配

名称 | 正则 | 备注   
-|-|-
正向前瞻 | exp(?=assert) |
负向前瞻 | exp(?!assert) |
正向后顾 | exp(?<=assert) | javascript不支持
负向后顾 | exp(?<!assert) | javascript不支持
### 10.2 正向前瞻(肯定前瞻)
```js
'a1+23t4ff'.replace(/\w(?=\d)/g,'~');
```
>"~1+~3~4ff"<br>
>`前方(向尾部方向)`是数字就替换
### 10.3 负向前瞻(否定前瞻)
```js
'a1+23t4ff'.replace(/\w(?!\d)/g,'~');
```
>"a~+2~t~~~"<br>
>`前方(向尾部方向)`不是数字就替换

## 11. JS对象属性
* global: 是否全文搜索，默认false
* ignore case: 是否大小写敏感，默认false
* multiline: 多行搜索，默认false
* lastIndex: 当前表达式匹配内容的最后一个字符的下一个位置
* source: 正则表达式的文本字符串
```js
var reg = /\w/;
console.log(reg.global); // false
console.log(reg.ignoreCase); // false
console.log(reg.multiline); // false
console.log(reg.lastIndex); // 0
console.log(reg.source); // \w
```
```js
var reg = /\w/gim;
console.log(reg.global); // true
console.log(reg.ignoreCase); // true
console.log(reg.multiline); // true
console.log(reg.lastIndex); // 0
console.log(reg.source); // \w
```

## 12. test和exec方法
### 12.1 test方法
* **RegExp.prototype.test(str)**<br>
测试是否存在，匹配正则表达式的，字符串
```js
var reg = /\w/;
console.log(reg.test('1')); // true
console.log(reg.test('@')); // false
```
#### 12.1.1 非全局调用
```js
var reg = /\w/;
reg.lastIndex; // 0
reg.test('abc'); // true
reg.lastIndex; // 0
reg.test('abc'); // true
```
#### 12.1.2 全局调用
```js
var reg = /\w/g;
reg.lastIndex; // 0
reg.test('abc'); // true
reg.lastIndex; // 1
reg.test('abc'); // true
reg.lastIndex; // 2
reg.test('abc'); // true
reg.lastIndex; // 3
reg.test('abc'); // false
reg.lastIndex; // 0
```

### 12.2 exec方法
* **RegExp.prototype.test(str)**<br>
* 使用正则表达式，对字符串进行搜索，并更新RegExp全局属性(lastIndex)
* 如果没有匹配返回null，如果匹配到返回结果数组<br>
`index`匹配第一个字符的位置<br>
`input`存放被检索的字符串<br>
* **返回值规则**
* 数组的第1个元素：与正则表达式相匹配的文本
* 数组的第2个元素：与RegExpObject的第1个子表达式相匹配的文本(如果存在)
* 数组的第3个元素：与RegExpObject的第2个子表达式相匹配的文本(如果存在)
* 数组的第n个元素: 与RegExpObject的第n个子表达式相匹配的文本(如果存在)
#### 12.2.1 非全局调用
```js
var reg = /\d(\w)(\w)\d/;
var str = '$1az2bx3cy4dw5ev';
var ret = reg.exec(str);
reg.lastIndex; // 0
ret.index; // 1
ret.input; // $1az2bx3cy4dw5ev
ret.toString(); // 1az2,a,z
```
#### 12.2.2 全局调用
```js
var reg = /\d(\w)(\w)\d/g;
var str = '$1az2bx3cy4dw5ev';
var ret = reg.exec(str);
reg.lastIndex; // 5
ret.index; // 1
ret.input; // $1az2bx3cy4dw5ev
ret.toString(); // 1az2,a,z
ret = reg.exec(str);
reg.lastIndex; // 11
ret.index; // 7
ret.input; // $1az2bx3cy4dw5ev
ret.toString(); // 3cy4,c,y
ret = reg.exec(str);
ret; // null
```

## 13. 字符串对象方法
### 13.1 String.prototype.search(reg)
* 返回第一个匹配结果index，如果不匹配返回 -1
* 忽略g，不进行全局搜素，总是从字符串开始位置搜索
### 13.2 String.prototype.match(reg)
* 检索字符串，返回一个或多个与regExp匹配的文本
* regExp是否具有g标志，对结果影响很大
#### 13.2.1 非全局匹配
* 只在字符串中进行一次匹配
* 没有找到，返回null
* 找到返回数组，存放与它找到的匹配文本有关的信息<br>
`index`声明匹配文本的起始字符，在字符串中的位置<br>
`input`声明对string对象对引用<br>
* **返回值规则**
* 数组的第1个元素：匹配文本
* 数组的第2个元素：第1个子表达式相匹配的文本(如果存在)
* 数组的第3个元素：第2个子表达式相匹配的文本(如果存在)
* 数组的第n个元素: 第n个子表达式相匹配的文本(如果存在)
```js
str.match(reg); // 结果同 12.2.1
```
#### 13.2.2 全局匹配
* 全局搜索，找到字符串中所有匹配字符串
* 没有找到，返回null
* 找到返回数组，存放一个或多个匹配字符串<br>
* 返回结果，没有`index`和`input`属性<br>
### 13.3 String.prototype.replace
* String.prototype.replace(str, strReplace)
* String.prototype.replace(reg, strReplace)
* String.prototype.replace(reg, function)<br>
这里只介绍`function`
```js
function(match, [group1, group2, ..., groupN,] index, origin)
```
```js
'a1b2c3d4e'.replace(/(\d)(\w)(\d)/g,function(
  match,group1,group2,group3,index,origin
){
  console.log('------------');
  console.log('match:',match);
  console.log('index:',index);
  console.log('group1:',group1);
  console.log('group2:',group2);
  console.log('group3:',group3);
  console.log('ret:',(match+' --> '+group1+group3));
  return group1+group3;
});
// a12c34e
```
>------------<br>
>match: 1b2<br>
>index: 1<br>
>group1: 1<br>
>group2: b<br>
>group3: 2<br>
>ret: 1b2 --> 12<br>
>------------<br>
>match: 3d4<br>
>index: 5<br>
>group1: 3<br>
>group2: d<br>
>group3: 4<br>
>ret: 3d4 --> 34<br>

