# Jenkins + Nexus


<br />上一章我们写到，如何使用 Nexus 托管我们的镜像。这一章我们就将 Nexus 和 Jenkins 结合起来构建部署。<br />

<a name="Im23h"></a>
## Jenkins 登录认证制品库

<br />想使用 `Jenkins` 推送镜像到制品库，必须先登录制品库。进入 `Jenkins` 容器，使用 `docker login` 登录，然后退出即可：
```bash
docker exec -it jenkins /bin/bash
docker login 制品库地址:端口
exit;
```
>10.211.55.3:8082<br/>
>登录`login credentials`会记录在`/root/.docker/config.json`中<br/>
>如果不进行`docker logout 服务器ip:端口`操作，则服务器重启后无需再次登录

<a name="obg0K"></a>
## Nginx 服务器登录认证制品库

<br />编辑 `/etc/docker/daemon.json` 文件，将制品库地址写入，然后重启 `docker` 服务
```bash
vi /etc/docker/daemon.json
sudo systemctl daemon-reload
sudo systemctl restart docker
```
```
{
  "registry-mirrors": ["https://jzirisvt.mirror.aliyuncs.com"],
  "insecure-registries": ["10.211.55.3:8082"]
}
```

<br />接着使用 `docker login` 命令进行登录
```bash
docker login 制品库地址:端口
```
>10.211.55.3:8082


<a name="EjgWc"></a>
## 使用 DockerFile 构建前端镜像

<br />在此之前，我们使用** 构建压缩包 => 直接上传到目标服务器 => 进行解压部署 **的方式部署前端。<br />在这里，我们更换为部署docker镜像。既然要制作自己的镜像，那就少不了** DockerFile。**<br />**<br />在前面我们写到过，**DockerFile 是一个镜像制作过程的步骤描述**。那么我们也可以简单的描述下我们自己的步骤。<br />
<br />我们在代码目录下，新建一个文件。叫 **Dockerfile** （注意，file全小写）：
```bash
# FROM nginx:1.15-alpine
# COPY dist /usr/share/nginx/html
# WORKDIR /usr/share/nginx/html
FROM nginx:1.15-alpine
COPY dist /usr/share/nginx/html/jenkins-test-vue/
WORKDIR /usr/share/nginx/html
```
此Dockerfile声明了以下步骤：

1. 拉取一个 `nginx 1.15-alpine` 版本的镜像。
1. 将当前目录下的 `dist` `文件夹里的内容`拷贝到镜像的 `/usr/share/nginx/html` 文件夹中。
1. 声明启动容器时，在 `/usr/share/nginx/html` 下面执行。
>`.`代表当前路径，即docker容器中的`/var/jenkins_home/workspace/项目目录`，项目是从gitlab拉取而来<br/>
>当执行到`docker build -t 172.16.81.150:8082/fe/nginx-fe-$timestamp .`时，会将`.代码的当前路径`作为`context上下文`，并在`context`中寻找`Dockerfile`。<br/>
>同时`docker客户端`会把`上下文`中的所有文件发送给`docker daemon`。<br/>
>当执行`COPY`操作时，会在当前`上下文`中寻找文件，并拷贝到镜像的目标路径`/usr/share/nginx/html`下，如果目标路径不存在则自动创建目标路径。<br/>
>不能拷贝上下文之外的文件，否则会报错。<br/>
>当执行`docker run`时，容器会拿到镜像里对应路径`/usr/share/nginx/html`下的所有文件。<br/>

<br />接着提交到代码库中。<br />

<a name="N6zCG"></a>
## 修改 Jenkins 执行脚本

<br />我们打开之前 `Jenkins` 任务的编辑页面，改为以下脚本：
```bash
# set -e
# timestamp=`date '+%Y%m%d%H%M%S'`

# node -v
# npm -v

# npm install -g cnpm --registry=https://registry.npm.taobao.org

# cnpm install

# npm run build

# # 编译docker镜像
# docker build -t 172.16.81.150:8082/fe/nginx-fe-$timestamp .

# # 推送docker镜像到制品库
# docker push 172.16.81.150:8082/fe/nginx-fe-$timestamp

# # 远程执行命令部署镜像
# ssh -o StrictHostKeyChecking=no root@172.16.81.151 "docker pull 172.# 16.81.150:8082/fe/nginx-fe-$timestamp && \
# docker stop jenkins-test && \
# docker rm jenkins-test && \
# docker run -p 80:80 -itd \
# --name jenkins-test \
# --restart always \
# 172.16.81.150:8082/fe/nginx-fe-$timestamp"

set -e
timestamp=`date '+%Y%m%d%H%M%S'`

node -v
npm -v
npm install -g cnpm --registry=https://registry.npm.taobao.org
rm -rf node_modules/
rm -rf dist/
cnpm install
npm run build

# 编译docker镜像
docker build -t 10.211.55.3:8082/fe/nginx-fe-$timestamp .

# 推送docker镜像到制品库
docker push 10.211.55.3:8082/fe/nginx-fe-$timestamp

# 远程执行命令部署镜像
ssh -o StrictHostKeyChecking=no root@10.211.55.4 "docker pull 10.211.55.3:8082/fe/nginx-fe-$timestamp && \
docker stop nginx && \
docker rm nginx && \
docker run -p 80:80 -itd \
--name nginx \
--restart always \
10.211.55.3:8082/fe/nginx-fe-$timestamp"
```
>`set -e` bash如果任何语句的执行结果不是true则应该退出<br/>
>在shell脚本中，声明一个变量只需要 变量名=值 即可。在命令中用 $-变量名 进行使用。<br/>
>timestamp=\`date '+%Y%m%d%H%M%S'\`：这个代表执行 date '+%Y%m%d%H%M%S' 这条命令，并赋值给 timestamp 这个变量。<br/>
>date '+%Y%m%d%H%M%S' 代表输出当前时间的年月日时分秒。</br>

>-o StrictHostKeyChecking=no `跳过ssh公钥检查`<br/>
>比如: ssh root@ip -o StrictHostKeyChecking=no<br/>
>比如: scp test.txt root@ip:~ -o StrictHostKeyChecking=no<br/>
>StrictHostKeyChecking: [https://cikeblog.com/ssh-cant-established.html](https://cikeblog.com/ssh-cant-established.html)


**如何进入nginx容器**
```bash
docker exec -it nginx /bin/sh
```
>进入alpine容器


<br />这里可以看到，我们将之前脚本后半部分的流程：<br />
<br />**压缩打包资源 => 通过 ****`scp`**** 上传压缩包**** => ****`ssh`**** 远程执行解压部署命令 **<br />
<br />替换为：<br />**<br />**Dockerfile构建镜像 => 上传镜像到制品库 => 远程执行命令拉取镜像，停止容器，删除容器，启动新拉取的镜像**<br />

