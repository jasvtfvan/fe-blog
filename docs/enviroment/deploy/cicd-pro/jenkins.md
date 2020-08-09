# 安装 Jenkins


## Jenkins 是啥

<br />`Jenkins` 是一个基于Java语言开发的CI持续构建工具，主要用于持续、自动的构建/测试软件项目。<br />它可以执行你预先设定好的设置和脚本，也可以和 Git工具做集成，实现自动触发和定时触发器构建。

## 安装 Docker

<br />在这里，我们使用 `Docker` 安装 `Jenkins` 服务，在安装前，需要先安装 `Docker` 环境 :<br />

## 安装防火墙


```bash
yum install firewalld systemd -y
service firewalld start
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="172.16.0.0/16" accept"
systemctl reload firewalld
```


> pemmanent: 表示永久生效，若不加 --permanent 系统下次启动后就会失效。
> systemctl：[https://www.cnblogs.com/zwcry/p/9602756.html](https://www.cnblogs.com/zwcry/p/9602756.html)
> firewall-cmd：[https://blog.csdn.net/s_p_j/article/details/80979450](https://blog.csdn.net/s_p_j/article/details/80979450)
> 

> add-rich-rule：**添加一条放行规则。作用是允许docker容器之间可以走宿主机互相访问。**
> **其中，172.16.0.0是宿主机网段，/16代表匹配所有网段内的IP：**[https://blog.csdn.net/aerchi/article/details/39396423?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase](https://blog.csdn.net/aerchi/article/details/39396423?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase)



## 1. 使用 DockerFile 构建 Jenkins 镜像

<br />我们都知道，每个Docker容器，都是一个独立的，与外界隔离的操作系统环境。**在使用 Jenkins 服务进行构建时，用户写的 ****`Shell`**** 脚本，也只会在容器内执行。**<br />
<br />但我们问题来了，我们想让容器部署的 `Jenkins` 可以构建 `Docker` 镜像，只有2种办法：<br />

1. 加一台 `Jenkins` master 节点，构建机内安装 `Docker` 环境。这样我们就可以执行远程构建。
1. **宿主机的Docker环境，移花接木到容器内部，在容器内部执行Docker命令构建镜像。**



这就是我们要讲的重磅知识点：**Docker in Docker**

### Docker in Docker

#### 原理

<br />那什么是 `Docker in Docker` 呢？<br />
<br />Docker 采用的是C/S（即Client/Server）架构。我们在执行 `docker xxx` 等命令时，**其实是使用 `Client` 在和`docker engine` 在进行通信。**

我们在安装 Docker CE 时，会生成一个 `systemd service` 服务。这个服务启动时，就是 `Docker Engine` 服务。默认情况下，Docker守护进程会生成一个 socket（`/var/run/docker.sock`）文件来进行本地进程通信，因此只能在本地使用 docker 客户端或者使用 Docker API 进行操作。<br />

> *.sock文件：sock 文件是 UNIX 域套接字，它可以通过文件系统（而非网络地址）进行寻址和访问。


<br />因此，只要把**宿主机的Docker套接字通过Docker数据卷挂载到容器内部**，就能实现在容器内使用Docker命令（如下图）。
![image](./images/jenkins/docker-in-docker.png)<br />

#### 使用


下方的命令，就是 `Docker in Docker` 的使用。
```bash
docker run ... -v /var/run/docker.sock:/var/run/docker.sock
```

<br />所以，我们要实现在Jenkins内部访问宿主机docker，要写一个DockerFile进行二次镜像构建。<br />此DockerFile的作用，就是为了安装容器使用宿主机 `Docker` 缺少的依赖。这里我们在容器内安装 `libltdl7` 。<br />

> 如果不写DockerFile进行构建也可以，亲测直接挂Docker套接字进容器后会有依赖缺失问题，，，，这个方法只针对Jenkins镜像

```bash
vi Dockerfile
```
```bash
FROM jenkins/jenkins
USER root
# 清除了基础镜像设置的源，切换成阿里云源
RUN echo '' > /etc/apt/sources.list.d/jessie-backports.list \
  && echo "deb http://mirrors.aliyun.com/debian jessie main contrib non-free" > /etc/apt/sources.list \
  && echo "deb http://mirrors.aliyun.com/debian jessie-updates main contrib non-free" >> /etc/apt/sources.list \
  && echo "deb http://mirrors.aliyun.com/debian-security jessie/updates main contrib non-free" >> /etc/apt/sources.list
# 更新源并安装缺少的包
RUN apt-get update && apt-get install -y libltdl7
ARG dockerGid=999

RUN echo "docker:x:${dockerGid}:jenkins" >> /etc/group
```

## 2. 构建 Jenkins 镜像

<br />这样的话，我们就不能直接使用官方的 `Jenkins` 镜像进行构建，需要用 `DockerFile` 先构建一份自己的 `Jenkins` 镜像。使用 `docker build` 命令构建镜像
```bash
docker build -t local/jenkins .
```
> -t：镜像的名字及tag，通常name:tag或者name格式；可以在一次构建中为一个镜像设置多个tag


<br />
![image](./images/jenkins/build-jenkins.png)<br />
如果提示 `Successfully tagged local/jenkins:latest` 则构建成功

## 3. 启动镜像

<br />我们将Jenkins用户目录外挂到宿主机内，先新建一个 `/home/jenkins` 目录，并设置权限：
```bash
mkdir /home/jenkins
chown -R 1000 /home/jenkins/
```

<br />接下来我们用镜像创建容器并启动：
```bash
docker run -itd --name jenkins -p 8080:8080 -p 50000:50000 \
-v /var/run/docker.sock:/var/run/docker.sock \
-v /usr/bin/docker:/usr/bin/docker \
-v /home/jenkins:/var/jenkins_home \
--restart always \
--user root local/jenkins
```

> -itd: 由 -i -t -d命令组合而成
> -i: 开启容器内的交互模式，允许用户可以进入容器进行输入交互
> -t: 分配一个虚拟终端
> -d: 允许容器以后台运行（不加的话只能前台运行，退出终端容器就停止了）
> --name: 容器名称
> -p: 将容器内的端口映射到宿主机的端口。格式为：宿主机端口:容器端口
> -v: 将宿主机内的文件挂载到容器目录下。格式为：宿主机目录:容器目录
> --user: 指定用户启动
> --restart: 当 Docker 重启时，容器自动启动，否则就需要使用 docker restart 手动启动


<br />启动后，会返回一串ID值，这就是 `容器ID` 值。<br />
<br />执行 `docker ps` 命令，查看Jenkins容器是否在列表内。如果在列表内，说明启动成功<br />
![image](./images/jenkins/docker-ps-jenkins.png)<br />

> 提示：如果执行docker ps 后容器没有在列表内，多半是启动失败。可以加-a参数查看所有已经生成的容器的运行状态。
> 如果想进一步查看原因，可以使用docker logs -f <容器ID> 查看容器内日志输出。


## 4. 启动 Jenkins

<br />首先我们在防火墙添加 `8080` 和 `50000` 端口的放行，并重载防火墙
```bash
firewall-cmd --zone=public --add-port=8080/tcp --permanent
firewall-cmd --zone=public --add-port=50000/tcp --permanent
systemctl reload firewalld
```

<br />容器启动后，访问 `宿主机IP:8080` 。如果看到以下界面，代表正在启动。<br />Jenkins第一次的启动时间一般比较长（视机器性能而看）<br />
![image](./images/jenkins/waiting-jenkins.png)

## 5. 初始化 Jenkins 配置

### 解锁 Jenkins

<br />Jenkins 启动完成后，会跳转至这个界面解锁 Jenkins。<br />
![image](./images/jenkins/unlock-jenkins.png)<br />Jenkins启动后，会生成一个 `初始密码` ，该密码在 Jenkins 容器内存放，可以进入容器后查看密码内容。
```bash
docker exec -it jenkins /bin/bash
cat /var/jenkins_home/secrets/initialAdminPassword
exit;
```
> docker exec: 进入一个已启动的容器内，执行命令
> cat：查看文件内容。如果逐步查看可以用more命令
> -it: -i -t的组合
> -i: 即使没有附加也保持STDIN 打开
> -t: 分配一个伪终端

![image](./images/jenkins/cat-jenkins-passwd.png)
输入配置文件中的密码，解锁 Jenkins<br />

### 下载插件

<br />解锁后，来到了插件下载页面。先进入容器配置一下清华大学的Jenkins插件源后，再安装插件。所以先不要点。<br />
![image](./images/jenkins/init-jenkins-plugins.png)<br />
<br />**进入容器，查找  `default.json`  文件**，把镜像源替换进去，替换后退出容器终端
```bash
docker exec -it jenkins /bin/bash
find / -name 'default.json'
sed -i 's/http:\/\/updates.jenkins-ci.org\/download/https:\/\/mirrors.tuna.tsinghua.edu.cn\/jenkins/g' /var/jenkins_home/updates/default.json && sed -i 's/http:\/\/www.google.com/https:\/\/www.baidu.com/g' /var/jenkins_home/updates/default.json
exit;
```

<br />然后重启容器，重新访问界面，解锁后安装推荐插件
```bash
docker restart jenkins
```


## 6. 完成安装

<br />接下来一路按照提示配置，直到看到以下界面代表安装成功：<br />
<br />![image](./images/jenkins/finish-jenkins-install.png)<br />

## 7. 测试安装

<br />我们点击 Jenkins 首页 -> 左侧导航 -> 新建任务 -> 构建一个自由风格的软件项目<br />
<br />![image](./images/jenkins/jenkins-freedom-pj.png)<br />
<br />找到 `构建` 一项，选择 “增加构建步骤”，选择 `执行Shell` ，输入以下命令：<br />
<br />此命令是去拉取一个nodejs稳定版镜像
```bash
docker -v
docker pull node:latest
```
![image](./images/jenkins/jenkins-first-shell.png)<br />保存后，我们点击左侧菜单的 “立即构建”，Jenkins就会开始构建。选择左侧历史记录第一项（最新的一项），点击控制台输出，查看构建日志。<br />
![image](./images/jenkins/jenkins-first-console.png)<br />
<br />Jenkins构建任务为蓝色灯，代表构建成功。红色灯代表构建失败<br />
![image](./images/jenkins/jenkins-build-status.png)

## 8. 结束

<br />到这里，我们的Jenkins就代表安装完成了<br />
