# 微信公众号(服务号)本地调试

## 前言知识
### 平台端(2B)
* 微信开放平台:<br>
`开放平台`可以关联同一个`主体`(一个营业执照对应一个企业主体)的不同平台，不同平台间的`openid`通过`开放平台`的`unionId`进行互换。
* 微信公众平台包括:<br>
服务号、订阅号、小程序、企业微信

### 客户端(2C)
* 公众号 对应 服务号(2B)
* 订阅号 对应 订阅号(2B)
* 小程序 对应 小程序(2B)
* 企业微信 对应 企业微信(2B)
#### 消息推送
* 公众号 -> 公众号
* 订阅号 -> 订阅号
* 小程序 -> 服务通知
* 企业微信 -> 企业微信(种类更多)

## 前端

### 内网穿透（可以不使用）
* 1，下载并安装`ngrok` [https://ngrok.com/download](https://ngrok.com/download)
* 2，【可省略的步骤】点击`Login`登录，没有注册过点`Sign up`
* 3，【可省略的步骤】登录后，点击`Your Authtoken`，地址[https://dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)
* 4，【可省略的步骤】复制 `token`
* 5，进入安装目录：
```shell
cd ~/Documents/PortableApplication/ngrok2
```
* 6，输入命令，启动
```shell
ngrok http localhost:8080
```
>>>http://localhost:8080 映射成 http://2b60-175-167-130-205.ngrok.io/

### 个人沙盒测试公众号
* 1，登录 [https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index](https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index)
* 2，关注`测试号二维码`
* 3，搜索`网页授权获取用户基本信息`，修改地址为`2b60-175-167-130-205.ngrok.io`
* 4，如需js-sdk，配置`JS接口安全域名修改`


## 后端
1, 配置个人沙盒测试公众号`appID`和`appSecret`
2，配置好的接口域名如：`http://api.tuoshikeji.com`

## 需知
可以不使用`内网穿透`，上文中的`2b60-175-167-130-205.ngrok.io`替换成`192.168.8.103:8080`这种形式
