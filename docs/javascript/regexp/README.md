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




