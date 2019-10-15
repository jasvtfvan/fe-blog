# 服务器部署步骤
1. 购买自己的域名
2. 域名备案
3. 购买服务器
4. 配置服务器应用环境
5. 安装配置服务器
6. 项目远程部署和发布与更新

## 1. 服务器购买与备案
### 1.1 购买域名
* [阿里云](https://wanwang.aliyun.com/)
* [腾讯云](https://dnspod.cloud.tencent.com/)
* [百度云](https://cloud.baidu.com/product/bcd.html)
### 1.2 云主机
* [阿里云 ECS](https://www.aliyun.com/)
* [亚马逊 AWS](https://aws.amazon.com/cn)
* [腾讯云](https://cloud.tencent.com/product/cvm)
* [百度云](https://cloud.baidu.com/product/bcc.html)
* 华为云(面向企业)
* google云(集成google的AI服务，尚未进入中国市场)
### 1.3 购买服务器（阿里云）
* [选择配置](https://ecs-buy.aliyun.com/wizard/#/postpay/cn-beijing)
* 镜像 CentOS 7.6 64位
### 1.4 备案（阿里云）
* [阿里云备案](https://beian.aliyun.com)
* [备案管理](https://bsn.console.aliyun.com/#/bsnManagement)

## 2. 服务器部署
### 2.1 客户端工具
* 工具下载 [git bash](https://git-scm.com/downloads)
* 推荐教程 [Git教程-廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/896043488029600)

### 2.2 连接服务器
```bash
ssh root@服务器ip
```
* 查看系统版本
>`lsb_release -a`

### 2.3 创建非root用户
```bash
adduser zhangsan
```

### 2.4 授予权限
`gpasswd`命令是Linux下工作组文件`/etc/group`和`/etc/gshadow`管理工具。
>`-a`: 添加用户到组<br>
>`-d`: 从组删除用户
```bash
sudo gpasswd -a zhangsan
```

### 2.5 添加sudo权限
* Linux用户配置sudo权限`visudo`,如果你用`visudo`来编辑这个文件，那么它会帮你自动做很多事情，比如说语法检查，加锁防止别人同时修改这个文件等等
```bash
sudo visudo
```
或者
```bash
vi /etc/sudoers
```
>visudo 等价于 /etc/sudoers

增加以下内容
```bash
# User privilege specification
zhangsan ALL=(ALL:ALL) ALL
```
* 1 "From ALL hosts", zhangsan 从任何机器登录，都可以应用接下来的规则
* 2 "Run As ALL User", zhangsan"可以以任何用户的身份运行一些命令
* 3 "Run As All Groups", zhangsan"可以以任何用户组的身份运行一些命令
* 4 前面的规定适用于任何命令
>`zhangsan`这个用户可以从任何机器登录，以任何用户和用户组的身份运行任何命令。 保存并退出

### 2.6 修改非root用户密码
```bash
passwd zhangsan
``` 
### 2.7 SSH无密码登录
ssh 公钥认证是ssh认证的方式之一。通过公钥认证可实现ssh免密码登陆，git的ssh方式也是通过公钥进行认证的。
#### 2.7.1 本地生成公钥和私钥
* 查看本地公钥私钥，如果存在不再生成
```bash
ls -al ~/.ssh
```
* 生成公钥和私钥
```bash
ssh-keygen --help
cd ~/.ssh
ssh-keygen -t rsa -b 4096
```
>-t 指定加密方式<br>
>-b 字节数
#### 2.7.2 开启ssh代理
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```
>加速秘钥验证过程
#### 2.7.3 服务器生成公钥和私钥
* 1 查看公钥私钥是否存在，参考本地操作
* 2 生成公钥和私钥，并开启ssh代理
```bash
ssh-keygen -t rsa -b 4096
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
```
#### 2.7.4 把本地的公钥上传到服务器授权文件中
* 1 本地查看公钥，复制`公钥`
```bash
cat ~/.ssh/id_rsa.pub
```
* 2 上传到服务器授权文件，粘贴`公钥`到`authorized_keys`
```bash
vi ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
service sshd restart
```
>可读 可写 可执行<br>
>&nbsp;&nbsp;&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(二进制)<br>
>2^2 * 1 + 2^1 * 1 + 2^0 * 0 = 6  所有者权限<br>
>2^2 * 0 + 2^1 * 0 + 2^0 * 0 = 0  所属组权限<br>
>2^2 * 0 + 2^1 * 0 + 2^0 * 0 = 0  其他人权限<br>
>chmod 600 >> 所有者可读可写，所属组和其他人没有任何权限

### 2.8 安装软件
#### 2.8.1 更新系统
```bash
yum update
```
#### 2.8.2 查看依赖软件是否安装
```bash
wget --version
curl --version
git --version
```
#### 2.8.3 安装软件
```bash
yum install wget curl git -y
```
>已安装的，不必重复安装

### 2.9 安装node
```bash
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.35.0/install.sh | bash
. /root/.bashrc
nvm install stable
node -v
npm i nrm -g
```
>nvm github地址: [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)<br>
>nvm sh脚本地址: [https://github.com/nvm-sh/nvm/blob/master/install.sh](https://github.com/nvm-sh/nvm/blob/master/install.sh) <br>
>https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh === https://raw.githubusercontent.com/creationix/nvm/v0.35.0/install.sh<br>
* 命令简单解释
>第一行命令自动执行脚本，并配置环境变量<br>
>. /root/.bashrc === source /root/.bashrc 使环境变量生效<br>
>nvm node版本管理工具 --help查看帮助<br>
>nrm node远程镜像代理工具 --help查看帮助
* 查看当前npm全局安装的包
>`npm list -g --depth=0`

### 2.10 编写node程序
server3000.js
```js
let http = require('http');
let server = http.createServer(function(req,res){
  res.statusCode = 200;
  res.setHeader('Content-Type',"text/html");
  res.end('hello blog 3000');
});
server.listen(3000,()=>{
    console.log('the server is started at port 3000');
});
```
* 上传代码到git服务器，比如:
>https://gitee.com/zhufengpeixun/2019blog.git

### 2.11 启动程序
* 安装pm2，进程管理器，进程异常退出时pm2会尝试重启，(守护进程运行程序)
```bash
npm install pm2 -g
```
>如果已安装，不必再次安装，pm2 -V查看版本
* 启动server3000.js
```bash
pm2 start server3000.js --name 'blog3000'
```
>启动命令: pm2 start [fileName] --name [appName]<br>
>重启命令: pm2 restart [appName]<br>
>查看列表: pm2 list<br>
>停止命令: pm2 stop [appName]<br>
>删除命令: pm2 delete [appName]<br>
* 访问3000端口
访问 [http://127.0.0.1:3000](http://127.0.0.1:3000)
* 查看进程
```bash
ps -ef | grep node
```
>node 为查看的关键字
* 杀死进程(比如处理端口被占用)
```bash
kill -9 [pid]
```

### 2.12 nginx
`Nginx`是一个高性能的`HTTP`和反向代理服务器
#### 2.12.1 nginx安装
```bash
yum install nginx -y
```
#### 2.12.2 nginx命令
* 启动nginx: `nginx -c /etc/nginx/nginx.conf`
* 关闭nginx: `nginx -s stop`
* 重读配置文件: `nginx -s reload`
#### 2.12.3 nginx配置
* 查看配置文件
```bash
cat /etc/nginx/nginx.conf | grep -v '#'
```
>| grep -v '#' 排除所有 # 开头的行
* 配置conf
```bash
cd /etc/nginx/conf.d/
vi blog.conf
```
```js
upstream blog{
    server 127.0.0.1:3000;
    server 127.0.0.1:4000;
}
server {
    listen 80;
    server_name [外网ip或域名];
    location / {
        proxy_pass http://blog;
    }
}
```
>配置后，如果没有启动nginx，需要执行 `nginx -s reload`
* 查看端口使用情况
>`netstat -lnpt | grep 80`
* 异常处理
>nginx: [error] open() "/run/nginx.pid" failed<br>
>nginx.conf 中配置了pid /run/nginx.pid<br>
>发现并没有/run/nginx.pid这个文件<br>
>1, `ps -ef | grep nginx` 得到pid 比如20926<br>
>2, `vi /run/nginx.pid` 将20926赋值进去<br>
>3, `nginx -s reload`

## 3. Docker
* Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的镜像中，然后发布到任何流行的 Linux或Windows 机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口

### 3.1 docker版本
* docker分为企业版(EE)和社区版(CE)
* docker-ce社区版地址: [https://docs.docker.com/install/linux/docker-ce/centos/](https://docs.docker.com/install/linux/docker-ce/centos/)
* docker-hub镜像中心地址: [https://hub.docker.com/](https://hub.docker.com/)

### 3.2 docker安装
* 卸载旧版本
```bash
yum remove docker \
                docker-client \
                docker-client-latest \
                docker-common \
                docker-latest \
                docker-latest-logrotate \
                docker-logrotate \
                docker-engine
rm -rf /var/lib/docker
```
>卸载需谨慎，请先查看
* 安装
```bash
yum install -y yum-utils device-mapper-persistent-data lvm2
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install docker-ce docker-ce-cli containerd.io
```

### 3.3 启动docker
```bash
systemctl start docker
```

### 3.4 查看docker信息
```bash
docker info
docker version
```



FROM node
COPY ./app /app
WORKDIR /app
RUN npm install
EXPOSE 3000
CMD npm start

