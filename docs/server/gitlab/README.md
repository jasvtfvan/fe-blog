# 利用Docker搭建gitlab
**GitHub 使用的是 Git 分布式版本控制系统。**

*`GitLab` 分为 社区版（Community Edition，缩写为 CE）和 企业版（Enterprise Edition，缩写为 EE）。社区版是免费的。本案例使用 gitlab-ce 社区版。*

* Docker搭建过程参考 `服务器->常规部署`
* gitlab详细介绍请上网搜索

![gitlab](./images/gitlab.jpg)

## Git客户端工具
* 工具下载 [git bash](https://git-scm.com/downloads)
* 推荐教程 [Git教程-廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/896043488029600)

## 安装环境
GitLab 的搭建有多种方式，本文案例使用 Docker 来搭建。
* 系统：CentOS 7.6
* Docker: 19.03.3
* GitLab: 最新版本 latest (12.3.5)
* 需求内存：最低 2 GB

## gitlab安装与配置
* docker-hub地址: [https://hub.docker.com/r/gitlab/gitlab-ce](https://hub.docker.com/r/gitlab/gitlab-ce)

### 拉取镜像，创建目录结构
* 拉取镜像
```bash
docker pull gitlab/gitlab-ce
```
* 查看镜像信息
```bash
docker inspect gitlab/gitlab-ce
```
>可以注意一下`ExposedPorts`，指所有端口号<br>
>可以注意一下`Volumes`，指docker容器中配置、日志、数据的存放目录

* 创建配置级数据目录
```bash
mkdir -p /srv/gitlab/{config,logs,data}
```
>srv目录用于存放用户主动生成的数据，可以修改成自己挂载外接硬盘的路径

### 首次运行，初始化gitlab
* 启动容器
```bash
docker run --detach \
  --hostname gitlab.example.com \
  --publish 9443:443 \
  --publish 9222:22 \
  --publish 9000:80 \
  --name gitlab \
  --restart always \
  -v /srv/gitlab/config:/etc/gitlab \
  --volume /srv/gitlab/logs:/var/log/gitlab \
  --volume /srv/gitlab/data:/var/opt/gitlab \
  gitlab/gitlab-ce:latest
```
>9443,9222,9000端口可根据实际情况配置，并需要在`云服务器安全组`中将**9000**添加的`入站规则`<br>
>--detach 代表守护进程运行<br>
>--hostname 代表主机名或域名<br>
>-v 是 --volume 的缩写，代表在docker中，配置、日志、数据，宿主机目录和容器目录的映射关系<br>
* 查看容器
```bash
docker ps
```
* 打开浏览器，输入网址 (上边以`9000`端口为例，根据自己实际情况)<br>
**刷新一下，等待一会，此时gitlab正在初始化目录结构**
* 重置`root`密码

### 配置邮件服务器
* 本案例以QQ邮箱为例子，配置`IMAP/SMTP`服务<br>
打开邮箱->设置->账户，开启 IMAP/SMTP 服务，获取 `授权码`，并将`授权码`复制到电脑文本，请重视 **授权码**
* 修改gitlab配置文件
```bash
vi /srv/gitlab/config/gitlab.rb
```
* 修改下边内容的 `*` 处，然后复制到 gitlab.rb 中
```
gitlab_rails['smtp_enable'] = true
gitlab_rails['smtp_address'] = "smtp.qq.com"
gitlab_rails['smtp_port'] = 465
gitlab_rails['smtp_user_name'] = "35****69@qq.com"
gitlab_rails['smtp_password'] = "ju****ah"
gitlab_rails['smtp_authentication'] = "login"
gitlab_rails['smtp_enable_starttls_auto'] = true
gitlab_rails['smtp_tls'] = true
gitlab_rails['gitlab_email_from'] = '35****69@qq.com'
```
>第1行 smtp_enable 开启 SMTP 功能<br>
>第3行 smtp_port 587 会报错<br>
>第4行 smtp_user_name 改成你的邮箱账号<br>
>第5行 smtp_password 改成你的`授权码`<br>
>第9行 gitlab_email_from 发件人信息，必须跟 第4行 smtp_user_name 保持一致，否则报错
* 使gitlab配置生效
```bash
docker exec gitlab gitlab-ctl reconfigure
```
* 测试邮件功能

*进入gitlab容器并启动bash命令*
```bash
docker exec -it gitlab /bin/bash
```
*开启 gitlab-rails 工具*
```bash
gitlab-rails console production
```
*等待程序运行完毕，发送邮件测试*
```bash
Notify.test_email('35****69@qq.com', '邮件标题', '邮件内容').deliver_now
```
收到邮件后，邮件测试完成<br>
**敲黑板划重点：qq邮箱不能给163发送邮件，即使使用网页qq邮箱，也会被打回来！！！**<br>
但是163可以给qq发送邮件，如果想要配置163邮箱，请上网参考163的smtp配置。<br>
>（话说到底是丁磊小气，还是马化腾小气）

### 配置访问地址（ip和端口）
**敲黑板划重点：9000端口的配置方法**
* 停止并删除容器
```bash
docker stop gitlab
docker ps -a
docker rm gitlab
```
* 修改gitlab.rb配置文件，添加 external_url
```bash
vi /srv/gitlab/config/gitlab.rb
```
```
external_url 'http://服务器ip:9000'
```

### 再次启动容器，使新端口生效
```bash
docker run --detach \
  --publish 9443:443 \
  --publish 9222:22 \
  --publish 9000:9000 \
  --name gitlab \
  --restart always \
  -v /srv/gitlab/config:/etc/gitlab \
  --volume /srv/gitlab/logs:/var/log/gitlab \
  --volume /srv/gitlab/data:/var/opt/gitlab \
  gitlab/gitlab-ce:latest
```
>`9000`端口处，第一次启动容器：--publish 9000:80 \ <br>
>`9000`端口处，第二次启动容器：--publish 9000:9000 \ <br>
>`9000`即为external_url指定的端口


