# Nexus

## 介绍

在前面我们写到，制品库是 **承接CI构建后的产出制品的仓库** 。具有版本管理，历史管理，权限校验等功能。<br>
在这里，我们选用 **Nexus3** 作为制品库。


## 拉取 Neuxs 镜像

老规矩，先拉取nexus镜像。命令不多解释：

```bash
docker pull sonatype/nexus3
```


## 启动 Nexus 容器

在 `/home` 下面新建一个名为 `nexus` 的文件夹，方便我们存放 `Nexus` 相关数据。并赋予权限

```bash
mkdir /home/nexus && chown -R 200 /home/nexus
```

然后启动容器。

```py
docker run -d -p 8081:8081 -p 8082:8082 \
--name nexus \
-v /home/nexus:/nexus-data \
--restart always \
sonatype/nexus3
```

>Nexus 的主服务端口是8081，但 Nexus Docker 制品库还需要分配一个新的端口作为服务端口。<br>
>这里没有演示分配哪个端口，想分配自己加 -p 参数即可。在这里我使用8082作为 docker 服务端口

将8081，8082端口添加到防火墙规则内：
```bash
firewall-cmd --zone=public --add-port=8081/tcp --permanent
firewall-cmd --zone=public --add-port=8082/tcp --permanent
systemctl reload firewalld
```

查看防火墙生效的配置:
```bash
firewall-cmd --list-all
```
>其中可以看到 `8081` 和 `8082` 已经加入到防火墙


## 访问 Nexus

打开浏览器地址栏，访问 `Nexus` 的服务地址。启动时间比较长，需要耐心等待。可以使用 `docker logs` 命令查看启动日志。如果显示以下文字，代表启动成功。

```bash
docker logs -f nexus
```
![image](./images/nexus/nexus1.png)

![image](./images/nexus/nexus2.png)


## 配置 Nexus

启动成功后，会显示上图提示文字。需要我们输入 `默认密码` 初始化配置。可以在这里找到：

```bash
cat /home/nexus/admin.password
# 6cd3cb39-2479-48ca-8ca0-831342b6f29d
```

将获取到的密码输入进去，用户是 `admin` 。

修改新密码后，会进入到这一步。这一步的意思是 **"是否开启匿名访问"**。匿名访问是指：**我们在任何没有登录的情况下，拉取（推送）制品到制品库，都算匿名访问。** 这是个很便捷，也很危险 `⚠️` 的行为。

例如，这个制品库也支持 node 的 `NPM` 私有库。那么我们在没有 `npm login` 这个制品库之前，就可以进行 `npm install` `npm publish` ，其实是不太安全的。那么任何一个知道制品库地址的人，都可以任意进行推送和获取资源。

**这里我们为了测试，可以先允许开启匿名访问**。选择 **Enable** **anonymous** **access** ，点击下一步。

![image](./images/nexus/nexus3.png)



## 创建一个 Docker 私服

我们使用有权限的账号登录后，点击页面头部导航栏的 齿轮 图标，选择左侧菜单中的 `Repositories` ，点击 `Create repository` 。

![image](./images/nexus/nexus4.png)

点击后，我们可以看到一个列表，这就是Nexus所支持的制品库类型。其中有我们要使用的Docker，也有熟悉的 Npm。我们在里面找到 Docker：

![image](./images/nexus/nexus5.png)

但是 `Docker` 有三种，该选哪个呢？

### 制品库的类型

在Nexus中，无论什么制品库，一般分为以下三种类型：

* proxy: 此类型制品库原则上 **“只下载，不允许用户推送”**。可以理解为**缓存外网制品的制品库**。例如，我们在拉取nginx镜像时，如果通过proxy类型的制品库，则它会去创建时配置好的外网docker镜像源拉取（有点像cnpm）到自己的制品库，然后给你。第二次拉取，则不会下载。起到 `缓存` 的作用。
<br>

* hosted：此类型制品库和proxy相反，原则上 **”只允许用户推送，不允许缓存“** 。这是私有库的核心，只存放自己的私有镜像或制品。
<br>

* group：此类型制品库用作以上两种类型的 **“集合”** ，将上面两个库集合为一个使用。

### 表单解释

在这里，我们其实不需要**缓存外网镜像**，那么我们只需要 **hosted类型** 即可。选择 **docker(hosted)**。

我们将启动Nexus镜像时，配置好的 Docker 端口填入HTTP 内，可以先允许匿名拉取镜像。

![image](./images/nexus/nexus6.png)

填写完成后，点击最下方的 Create repository，保存创建。


### 查看制品地址

找到我们刚刚创建的制品，点击上面的 **copy**，查看地址。

![image](./images/nexus/nexus7.png)


### 配置登录`Docker`权限

如果启动匿名拉取镜像 `Allow anonymous docker pull` 则需要配置 `Docker Bearer Token Realm`
![image](./images/nexus/DockerAuth.png)


## 登录制品库

私服建设完成后，还需要在客户端配置一下才可以使用。<br>
找到 `daemon.json` 文件，该文件描述了当前docker配置的镜像加速地址，和配置过的私服地址。

```bash
vi /etc/docker/daemon.json
```

找到 `insecure-registries` 字段，如果不存在就自己添加一个。值是数组类型，添加一条你的制品库地址。例如：

```
{
  "registry-mirrors": ["https://之前配置的阿里云镜像.mirror.aliyuncs.com"],
  "insecure-registries": ["172.16.81.50:8082"]
}
```
>注意json格式，不能有多余的逗号<br>
>这里注意，nexus显示的镜像库端口为nexus服务端口，要替换为自己配置的端口才有效。

保存退出，重启 Docker

```bash
systemctl daemon-reload
systemctl restart docker
```

接着使用 docker login 命令尝试登录：

```bash
docker login 服务IP:端口
```
>登录`login credentials`会记录在`/root/.docker/config.json`中<br/>
>如果不进行`docker logout 服务器ip:端口`操作，则服务器重启后无需再次登录

如果提示：**Login Succeeded** 则代表登录成功。

![image](./images/nexus/nexus8.png)



## 推送镜像到制品库

在这里，我们使用 `docker push` 命令推送一个本地的镜像到远程制品库。<br>
还记得在我们前面安装 `Jenkins` 时，使用过 `DockerFile` 生成了自己的 `Jenkins` 镜像 -`local/jenkins` 。所以我们可以尝试，将 `local/jenkins` 推送到制品库。<br>

但是，docker在推送一个镜像时，**镜像的 Tag (名称:版本号) 必须开头带着镜像库的地址，才可以推送**。例如下面两个镜像：<br>
🙅 **local/jenkins** 不能推送<br>
🙆 **172.16.81.150:8082/local/jenkins** 可以推送。<br>

那我们怎么才能推送上去呢？
1. **制作一份带镜像库地址的镜像：这个可以做，但是开销太大，需要走一遍制作流程**
2. **使用 docker** **tag 命令给已有的镜像打个标签：推荐使用，会将已有的镜像归位某个镜像库内。如下面格式**

```bash
# docker tag <镜像ID> 新镜像名称[:版本]
docker tag bd695e3e4317 172.16.81.150:8082/local/jenkins
```
>查看服务器上的docker镜像列表，可以使用docker images查看

这样，就可以重新打一个全新的tag，实现 “重命名” 功能。

![image](./images/nexus/nexus9.png)

接着我们使用 `docker push `命令进行推送：

```bash
docker push 172.16.81.150:8082/local/jenkins
```

![image](./images/nexus/nexus10.png)

到这里，就代表推送成功。

