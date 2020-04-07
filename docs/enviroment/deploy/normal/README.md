# 常规部署
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

### 2.2 连接服务器(心跳)
```bash
ssh root@服务器ip
```
* 查看系统版本
>`lsb_release -a`
#### 2.2.1 查看客户端ssh配置
```bash
cd /etc/ssh
cat ssh_config | grep -v ^# | grep -v ^$
ls -l
```
>`cat ssh_config | grep -v ^# | grep -v ^$`: 查看配置信息<br>
>`ls -l`: 查看文件权限<br>
>`-rwxr--r--`: 所有者可读可写可执行，用户所在组只读，其他人只读<br>
#### 2.2.2 修改文件读写权限
```bash
sudo chmod 600 ssh_config
```
#### 2.2.3 配置客户端连接检测参数
如果没有下边的参数，添加到配置文件末尾
```bash
sudo vim /etc/ssh/ssh_config
```
```js
ServerAliveInterval 60
ServerAliveCountMax 3
```
>`ServerAliveInterval 60`: client每隔60秒发送一次请求给server，然后server响应，从而保持连接<br>
>`ServerAliveCountMax 3`: client发出请求后，服务器端没有响应得次数达到3，就自动断开连接，正常情况下，server不会不响应

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
#### 2.7.5 重新登录
```bash
exit
ssh root@服务器ip
```
>不再需要输入密码

### 2.8 `新服务器`参考
#### 2.8.1 阿里云新服务器密码
* **密码: 实例密码 和 远程连接密码**<br>
实例密码，用于客户端连接，即本地pc的ssh命令连接工具<br>
远程连接密码(6位)，是阿里云开启web连接页面的密码
* **重置密码，是否需要重启?**<br>
实例密码，需要重启实例<br>
远程连接密码(6位)，不需要重启实例
* 登录连接
```bash
ssh root@服务器ip
```
>输入`实例密码`
#### 2.8.2 查看~/.ssh/known_hosts
记录已经通过连接的`服务器+公钥`信息
```bash
cat ~/.ssh/known_hosts
```
>当第一次没有登录成功，不知道`公钥`是否被记录，可通过这个命令查看<br>
>使用`vim ~/.ssh/known_hosts`删除被错误记录的`公钥`<br>
#### 2.8.3 其他登录方案(不推荐)
```bash
ssh -o StrictHostKeyChecking=no root@服务器ip
```
>StrictHostKeyChecking公钥检查参数，不检查，不使用`公钥`连接<br>
>会被记录到 known_hosts

### 2.9 安装软件
#### 2.8.1 更新系统
```bash
yum -y update   # 升级所有包同时也升级软件和系统内核
yum -y upgrade  # 只升级所有包，不升级软件和系统内核
```
> -y 代表所有提示 `yes or no ?` 选择默认 yes
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

### 2.10 安装node
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

### 2.11 编写node程序
server.js
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

### 2.12 启动程序
* 安装pm2，进程管理器，进程异常退出时pm2会尝试重启，(守护进程运行程序)
```bash
npm install pm2 -g
```
>如果已安装，不必再次安装，pm2 -V查看版本
* clone项目创建server4000.js
```bash
cd ~
git clone https://gitee.com/zhufengpeixun/2019blog.git
cp server.js server4000.js
```
>之后编辑文件，将3000部分改成4000
* 启动server4000.js
```bash
pm2 start server4000.js --name 'server4000'
```
>启动命令: pm2 start [fileName] --name [appName]<br>
>重启命令: pm2 restart [appName]<br>
>查看列表: pm2 list<br>
>停止命令: pm2 stop [appName]<br>
>删除命令: pm2 delete [appName]<br>
* 访问4000端口
访问 [http://127.0.0.1:4000](http://127.0.0.1:4000) 或者使用命令
```bash
curl http://127.0.0.1:4000
```
* 查看进程
```bash
ps -ef | grep node
```
>node 为查看的关键字
* 杀死进程(比如处理端口被占用)
```bash
kill -9 [pid]
```

### 2.13 nginx
`Nginx`是一个高性能的`HTTP`和反向代理服务器
#### 2.13.1 nginx安装
```bash
yum install nginx -y
```
#### 2.13.2 nginx命令
* 启动nginx: `nginx -c /etc/nginx/nginx.conf`
* 关闭nginx: `nginx -s stop`
* 重读配置文件: `nginx -s reload`
#### 2.13.3 nginx配置
* 查看配置文件
```bash
cat /etc/nginx/nginx.conf | grep -v ^# | grep -v ^$
```
>| grep -v ^# | grep -v ^$ 排除所有 # 开头的行，排除所有空行
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
#### 2.13.4 nginx常规配置参考
```js
user  nginx;
worker_processes  1;

events {
  worker_connections  1024;
}

http {
  include       mime.types;
  default_type  application/octet-stream;

  sendfile        on;
  keepalive_timeout  65;

  server{
    listen  8090;
    server_name 0.0.0.0:8090;
    location / {
      root /var/opt/nginx/web_dist;
      index index.html index.htm;
      try_files $uri $uri/ /index.html;
    }
  }

  server{
    listen  80;
    server_name 0.0.0.0:80;
    location / {
      root /var/opt/nginx;
      index index.html index.htm;
      try_files $uri $uri/ /index.html;
    }
  }
}
```
* 打包方式
1. **web_dist** 项目使用绝对路径 (需要配置 8090 这样的端口)
2. 其他路由使用相对路径<br>
publicPath: './' （或 publicPath: ''）<br>
比如 **www** 项目 和 **mobile** 项目
* 访问地址(部署后最终效果)
1. http://192.168.3.2 => nginx首页
2. http://192.168.3.2:8090 => web_dist项目
3. http://192.168.3.2/www => www项目
4. http://192.168.3.2/mobile => mobile项目

## 3. Docker
* Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的镜像中，然后发布到任何流行的 Linux或Windows 机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口

### 3.1 docker版本
* docker分为企业版(EE)和社区版(CE)
* docker-ce社区版地址: [https://docs.docker.com/install/linux/docker-ce/centos/](https://docs.docker.com/install/linux/docker-ce/centos/)
* docker-hub镜像中心地址: [https://hub.docker.com/](https://hub.docker.com/)

### 3.2 docker安装
#### 3.2.1 卸载旧版本
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
#### 3.2.2 安装
```bash {2}
yum install -y yum-utils device-mapper-persistent-data lvm2
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install -y docker-ce docker-ce-cli containerd.io
```
#### 3.2.3 常见异常
* 在执行`3.2.2`第2行时，有时会出现异常
```
"Could not resolve host: download.docker.com; 未知的错误"
```
>原因在于首次请求docker地址，无法直接下载
* 解决方法
```bash
curl https://download.docker.com/linux/centos/
```
>1. 先请求通docker地址，会返回网页内容<br>
>2. 然后可以执行`3.2.2`第2行和第3行命令
#### 3.2.4 其他安装方式参考
建议使用3.2.2官方提供方式
```bash
sudo wget -qO- https://get.docker.com | sh
```
* 关键词
>sudo 给普通用户root权限，便于安装<br>
>wget 下载命令（常见的curl属于另一种）<br>
>-q 简化模式，简化太多输出<br>
>O- 输出依赖，依赖标准模式，不依赖简单文件系统<br>
>sh 管道，将命令发送给shell，利用shell运行
* 添加用户到docker组，允许普通用户使用docker
```bash
sudo usermod -aG docker <username>
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

### 3.5 Docker架构
![docker-arch](./images/docker-arch.jpg)

### 3.6 阿里云加速
* 镜像仓库: [https://dev.aliyun.com/search.html](https://dev.aliyun.com/search.html)
* 镜像加速器: [https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)
* 配置加速器镜像
```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://fwvjnv59.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```
>其中 https://fwvjnv59.mirror.aliyuncs.com 可以通过`镜像加速器`链接找到，即镜像加速器地址

### 3.7 服务启动解析
* 运行镜像并执行命令
```bash
docker run ubuntu /bin/echo "Hello world"
```
>docker: Docker 的二进制执行文件<br>
>run: 与前面的 docker 组合来运行一个容器<br>
>ubuntu指定要运行的镜像，Docker首先从本地主机上查找镜像是否存在，如果不存在，Docker 就会从镜像仓库 Docker Hub 下载公共镜像<br>
>/bin/echo "Hello world": 在启动的容器里执行的命令
* 运行新镜像并启动bash脚本
```bash
docker container run -p 3333:3000 -it zhufengblog /bin/bash
npm start
```
>-p 参数是将容器的3000端口映射为本机的3333端口<br>
>-it 参数是将容器的shell容器映射为当前的shell,在本机容器中执行的命令都会发送到容器当中执行
zhufengblog image的名称<br>
>/bin/bash 容器启动后执行的第一个命令,这里是启动了bash容器以便执行脚本

### 3.8 启动node服务
#### 3.8.1 创建目录及server.js文件
```bash
cd ~
mkdir dockerenv
cd dockerenv/
mkdir app
cd mkdir app
vi server.js
```
>将server.js内容粘贴进server.js<br>
>pwd命令显示为 /root/dockerenv/app
* 初始化app目录为npm目录
```bash
npm i -y
cat package.json
```
>编辑并确保 npm start 运行 node server.js
#### 3.8.2 Dockerfile
```bash
cd ~/dockerenv/
vi Dockerfile
```
```js
FROM node
COPY ./app /app
WORKDIR /app
RUN npm install
EXPOSE 3000
CMD npm start
```
>FROM 表示该镜像继承的镜像 :表示标签<br>
>COPY 是将当前目录下的app目录下面的文件都拷贝到image里的/app目录中<br>
>WORKDIR 指定工作路径，类似于执行 cd 命令<br>
>RUN命令在 image 文件的构建阶段执行,RUN npm install 在/app目录下安装依赖，安装后的依赖也会打包到image目录中<br>
>EXPOSE 暴露3000端口，允许外部连接这个端口<br>
>CMD命令在容器启动后执行<br>

>*一个 Dockerfile 可以包含多个RUN命令，但是只能有一个CMD命令*<br>
>*指定了CMD命令以后，docker container run命令就不能附加命令了(比如前面的/bin/bash),否则它会覆盖CMD命令*
#### 3.8.3 创建image
```bash
docker build -t zhufengblog .
```
>-t用来指定image镜像的名称，后面还可以加冒号指定标签，如果不指定默认就是latest<br>
>. 表示Dockerfile文件的所有路径,.就表示当前路径
#### 3.8.4 启动容器
```bash
docker run -d -p 3000:3000 zhufengblog
```
>-d 以后台方式运行，即退出当前用户命令链接，容器不会死掉<br>
>-p 端口映射 :右边 --映射为--> 左边:
>>冒号左边是外网访问端口，冒号右边是docker容器端口

### 3.9 测试
* 前边已经配置好nginx
* pm2方式已经启动server4000
* 开启浏览器输入 http://ip
* 如当前为3000，开启浏览器新标签页，会变成4000
```flow
nginx 
  |   => server3000 => docker(zhufengblog)
  |   => server4000 => pm2(server4000)
```


## 4. Docker命令参考

### 4.1 docker基础命令
* 查看docker volume帮助
```bash
docker volumn --help
```
>volumn可以将数据及配置等，持久化的挂载到docker/volumns上
* **进入docker容器**
```bash
docker exec -it [container-id] /bin/bash
```
>-it将docker容器shell映射到当前主机<br>
>[container-id]或者[image-name]都可执行<br>
>/bin/bash可以简写成bash，代表进入容器后运行bash
* 根据DockerFile创建镜像
```bash
docker build -t hello_docker .
```
>-t 给镜像添加标签<br>
>.  根据当前目录的所有 Dockerfile 文件创建镜像

### 4.2 docker镜像命令
* 查看镜像
```bash
docker images
```
* 拉取镜像
```bash
docker pull gitlab/gitlab-ce:latest
```
* daemon方式运行镜像
```bash
docker run -p 8080:80 -d nginx
```
>-p 端口映射 80 --映射为--> 8080<br>
>-d 以后台方式运行，即退出当前用户命令链接，容器不会死掉
* 删除镜像
```bash
docker rmi [image-id]
```

### 4.3 docker容器命令
* 查看运行中的容器
```bash
docker ps
```
* 查看所有容器
```bash
docker ps -a
```
* 删除容器
```bash
docker rm [container-id]
```
* 停止容器
```bash
docker stop [container-id]
```
* 将容器提交成镜像
```bash
docker commit -m 'message' [container-id] [image-name]
```
* 拷贝文件到容器
```bash
docker cp [fileName] [container-id]://usr/share/nginx/html
```

### 4.4 docker-compose命令
docker多容器管理
* 创建文件
```bash
cd ~/dockerenv/compose
touch docker-compose.yml
vim docker-compose.yml
```
>创建后，编写相关配置<br>
>cd 到 docker-compose.yml 目录下
* 运行
```bash
docker-compose up -d
```
* 停止
```bash
docker-compose stop
```
* 删除
```bash
docker-compose rm
```
* 构建
```bash
docker-compose build
```
* 查看日志
```bash
docker-compose logs -f
```

## 5. docker修改data目录
* [修改daemon.json](https://docs.docker.com/config/daemon/systemd/#custom-docker-daemon-options)
* 为了减少系统磁盘压力，可以将docker镜像、容器、volumes放到挂载的目录(/mnt/data/docker)
### 5.1 显示docker目录下所有文件
```bash
du /var/lib/docker
```
### 5.2 查看docker信息
```bash
docker info
```
>Storage Driver: overlay2<br>
>Docker Root Dir: /var/lib/docker<br>
> Registry Mirrors: https://21f73xp7.mirror.aliyuncs.com/<br>
### 5.3 创建data-root目录
```bash
mkdir /mnt/data/docker
```
* 如果docker中已经有镜像，需要执行拷贝
>cp /var/lib/docker /mnt/data/docker
### 5.4 停止docker服务
```bash
systemctl stop docker
```
### 5.5 编辑daemon.json
```bash
vim /etc/docker/daemon.json
```
```py
{
  "registry-mirrors": ["https://21f73xp7.mirror.aliyuncs.com"],
  "data-root": "/mnt/data/docker",
  "storage-driver": "overlay2"
}
```
>`overlay2`来自`docker info`的信息
### 5.6 显示docker新目录下所有文件
```bash
du /mnt/data/docker/
```
### 5.7 查看docker信息
```bash
docker info
```
>Docker Root Dir: /mnt/data/docker<br>
### 5.8 查看docker镜像信息
```bash
docker inspect [image-id]
```
>最后看到镜像对应路径为`新路径`
