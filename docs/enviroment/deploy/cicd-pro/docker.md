# Docker

## Docker的介绍

### 什么是Docker ？

<br />`docker` 是一个开源的应用容器引擎，开发者可以打包自己的应用到容器里面，然后迁移到其他机器的 `docker` 应用中，可以实现快速部署。如果出现的故障，可以通过镜像，快速恢复服务。

Docker的优势在于 **快速**，**轻量，灵活。开发者可以快速制作一个自己自定义的镜像，也可以使用官方现有的镜像来启动一个服务。且容器之间相互隔离不冲突，但硬件资源又是共享的。**<br />**<br />**镜像也可以快速分享，你可以将镜像保存为文件进行分享传输，也可以上传到镜像库进行存取和管理****

### Docker 在CI/CD中的作用


- 可以使用 `Docker` 打包制品镜像
- 可以使用 `Docker` 快速启动 `Jenkins` `Gitlab`  等服务的容器

### Docker和虚拟机的区别

<br />![image](./images/docker/docker-vs-vm.png)

- **Docker 容器是一个应用层抽象，用于将代码和依赖资源打包在一起。 多个容器可以在同一台机器上运行，共享操作系统内核，但各自作为独立的进程在用户空间中运行。**与虚拟机相比， **容器占用的空间较少**（容器镜像大小通常只有几十兆），**瞬间就能完成启动** 。



- **虚拟机 (VM) 是一个物理硬件层抽象，用于将一台服务器变成多台服务器。** 管理程序允许多个 VM 在一台机器上运行。**每个VM都包含一整套操作系统、一个或多个应用、必要的二进制文件和库资源，因此 占用大量空间 。而且 VM 启动也十分缓慢** (知乎@Guide哥)


### 镜像

<br />Docker镜像的概念有点像我们的 “代码模版”，镜像内是一个操作系统。<br />
<br />**镜像一般都比较小，由多个层构成**。我们可以看到，下图 Nginx 镜像最底层是 Ubuntu15.04 镜像，上层才是应用服务等其他层。在我们**推送镜像/拉取镜像**时，Docker**不会拉取完整镜像，只会拉取有更改的那一层**，这样可以做到快速更新镜像。例如下图是Nginx镜像的层级结构。<br />![image](./images/docker/docker-image.png)<br />一般主流工具服务语言都有自己封装的镜像（node Jenkins gitlab nginx），当然你也可以制作自己的镜像，实现环境复用的作用。

### 容器

<br />如果说镜像是代码模版，容器就是代码模版编译后运行的文件。容器由镜像创建而来，是真正可以访问的东西。<br />我们可以将容器当作一个迷你操作系统，进行常规的操作和使用。且可以快速重启，删除创建。

### Dockerfile

<br />DockerFile 是一个镜像的描述文件，里面描述了**创建一个镜像所需要的执行步骤**。我们也可以自定义DockerFile创建一个自己的镜像。<br />
<br />例如下面的DockerFile：
```py
FROM nginx:1.15-alpine
COPY html /etc/nginx/html
COPY conf /etc/nginx/
WORKDIR /etc/nginx/html
```
这个DockerFile可描述为：<br />

1. 基于 `nginx:1.15` 镜像做底座。
1. 拷贝本地 `html` 文件夹内的文件，到 镜像内 `/etc/nginx/html` 文件夹。
1. 拷贝本地 `conf` 文件夹内的文件，到 镜像内 `/etc/nginx/`  文件夹。


<br />怎么生成镜像呢？我们只需要使用 `docker build` 命令就可以生成了：
```py
docker build -t imagename:version .
```
> -t: 声明要打tag标签，后面就是标签
> . ：声明要寻找dockerfile文件的路径。“.” 代表当前路径下寻找


<br />关于DockerFile的语法，可以看这里 [https://www.runoob.com/docker/docker-dockerfile.html](https://www.runoob.com/docker/docker-dockerfile.html)。网络上也有很多类似的教程


### 常用命令

<br />[https://www.runoob.com/docker/docker-container-usage.html](https://www.runoob.com/docker/docker-container-usage.html)



## 安装 Docker


### 1. 安装所需依赖

<br />在安装Docker之前，需要安装 `device-mapper-persistent-data` 和 `lvm2` 两个依赖：<br />
<br />我们使用使用 `Yum` 命令安装依赖：
```bash
yum install -y yum-utils device-mapper-persistent-data lvm2
```
> device-mapper-persistent-data: 存储驱动，Linux上的许多高级卷管理技术
> lvm: 逻辑卷管理器，用于创建逻辑磁盘分区使用


### 2. 使用阿里云源安装Docker

<br />接下来，添加阿里云的Docker镜像源，加速Docker的安装
```bash
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
yum install docker-ce
```


### 3. 启动Docker

<br />使用 `systemctl` 启动Docker
```bash
systemctl start docker
systemctl enable docker
```


### 4. 验证安装成功

<br />执行 `docker -v` ，如果展示以下信息，代表安装成功。<br />
<br />![image](./images/docker/docker-v.png)<br />

### 5. 配置阿里云源

<br />我们拉取Docker镜像时，一般默认会去 Docker 官方源拉取镜像。但是国内出海网速实在是太慢，所以我们更换为 `阿里云镜像仓库` 源进行镜像下载加速<br />
<br />登录阿里云官网，打开 [阿里云容器镜像服务](https://cr.console.aliyun.com)。点击左侧菜单最下面的 `镜像加速器` ，选择 `Centos` （如下图）<br />
<br />![image](./images/docker/daemon-json.png)<br />
<br />按照官网的提示，执行命令，即可实现更换Docker镜像源地址<br />


