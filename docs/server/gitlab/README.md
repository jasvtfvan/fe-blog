# docker搭建gitlab
**GitHub 使用的是 Git 分布式版本控制系统。**

*`GitLab` 分为 社区版（Community Edition，缩写为 CE）和 企业版（Enterprise Edition，缩写为 EE）。社区版是免费的。本案例使用 gitlab-ce 社区版。*

* Docker搭建过程参考 `服务器->常规部署`
* gitlab详细介绍请上网搜索

![gitlab](./images/gitlab.jpg)

## 1. Git客户端工具
* 工具下载 [git bash](https://git-scm.com/downloads)
* 推荐教程 [Git教程-廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/896043488029600)

## 2. 安装环境
GitLab 的搭建有多种方式，本文案例使用 Docker 来搭建。
* 系统：CentOS 7.6
* Docker: 19.03.3
* GitLab: 最新版本 latest (12.3.5)
* 需求内存：最低 2 GB

## 3. gitlab安装与配置
* docker-hub地址: [https://hub.docker.com/r/gitlab/gitlab-ce](https://hub.docker.com/r/gitlab/gitlab-ce)

### 3.1 拉取镜像，创建目录结构
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

### 3.2 首次运行，初始化gitlab
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
>9443,9222,9000端口可根据实际情况配置<br>
>需要在`云服务器安全组`中将**9443,9222,9000**添加的`入站规则`<br>
>http端口默认`80`改为9000，ssh端口默认`22`改为9222<br>
>--detach 代表守护进程运行<br>
>--hostname 代表主机名或域名<br>
>-v 是 --volume 的缩写，代表在docker中，配置、日志、数据，宿主机目录和容器目录的映射关系<br>

*小编尚未发现`9443`的用途，以及如果在配置文件中修改`443`端口*
* 查看容器
```bash
docker ps
```
* 打开浏览器，输入网址 (上边以`9000`端口为例，根据自己实际情况)<br>
**刷新一下，等待一会，此时gitlab正在初始化目录结构**
* 重置`root`密码

### 3.3 配置邮件服务器
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

### 3.4 配置访问地址（ip和端口）
**敲黑板划重点：<br>**
**9000端口的配置方法**<br>
**9222端口的配置方法**<br>
* 停止并删除容器
```bash
docker stop gitlab
docker ps -a
docker rm gitlab
```
* 修改gitlab.rb配置文件
```bash
vi /srv/gitlab/config/gitlab.rb
```
```
external_url 'http://服务器ip:9000'
gitlab_rails['gitlab_shell_ssh_port'] = 9222
```
>`9000`端口用于http，`9222`端口用于ssh

### 3.5 再次启动容器，使新端口生效
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
>`9000`即为external_url指定的端口<br>
* 验证ssh是否配置成功
```bash
ssh -T git@ip:9222
```

## 4. gitlab使用
### 4.1 账户创建
* 1 root 用户登录
* 2 创建普通用户，输入邮箱
自动发送邮箱
* 3 普通用户打开邮箱
点击修改密码链接，修改密码
* 4 普通用户登录

### 4.2 项目创建
* 创建项目
first-demo<br>
ssh地址<br>
`git@ip:9222:root/first-demo.git`<br>
http地址<br>
`http://ip:9000/root/first-demo.git`

### 4.3 本地git配置
>--global代表全局配置<br>
>在项目根目录配置，可以不加--global<br>
>git优先查找项目配置，如果找不到则向上查找全局配置，如果找不到，会在`git commit`时抛出异常<br>
>>下边已全局配置作为例子<br>
* 查看全局配置
```bash
git config --list --global
```
* 设置全局用户名和邮箱
```bash
git config --global user.name "yourName"
git config --global user.email "yourEmail@example.com"
```
* 删除全局配置
```bash
git config --global --unset user.name
git config --global --unset user.email
```

### 4.4 ssh公钥/私钥
#### 4.4.1 生成本地ssh公钥/私钥
* 查看本地公钥/私钥
```bash
ls -al ~/.ssh
```
```
total 24
drwx------   5 your-pc-name  staff   160  5  9 17:57 .
drwxr-xr-x+ 55 your-pc-name  staff  1760 10 22 13:58 ..
-rw-------   1 your-pc-name  staff  1675 12  9  2018 id_rsa
-rw-r--r--   1 your-pc-name  staff   399 12  9  2018 id_rsa.pub
-rw-r--r--@  1 your-pc-name  staff  2254 10 22 13:26 known_hosts
```
>如果已经存在 公钥/私钥，可以不再生成，**除非希望不同`公钥/私钥`用到不同的服务器**<br>
>小编认为一般没必要生成多个`公钥/私钥`<br>
* 生成公钥/私钥
```bash
ssh-keygen --help
cd ~/.ssh
ssh-keygen -t rsa -b 4096 -C "yourEmail@example.com"
```
>-t 指定加密方式<br>
>-b 字节数<br>
>-C 邮箱注释，**`注意`**这只是起到注释作用，对加密传输没有任何影响，**`建议不使用该参数`**<br>
* 查看本地公钥
```bash
cat ~/.ssh/id_rsa.pub
```
```
ssh-rsa xxx......xx yourEmail@example.com
```
>如果生成公钥/私钥时没有加`-C`则没有`yourEmail@example.com`<br>
#### 4.4.2 配置gitlab服务器ssh公钥/私钥
* 登录你的用户（非root用户）
* 头像 -> Settings -> SSH Keys
* 将公钥复制到Key中，保存

### 4.5 pull/push 拉取和推送
* 跳转到目标文件夹clone项目
```bash
cd ~/Documents/projects
git clone git@ip:9222:root/first-demo.git
cd first-demo/
```
* 配置用户名和邮箱
>如果当前项目`用户名`和`邮箱` === git全局`用户名`和`邮箱`，则无需配置<br>
>否则，参考 `4.3 本地git配置` 去掉 **--global** 进行配置
* 修改代码并提交
```bash
git add .
git commit -m 'yourCommit'
git push origin master
```
>这只是git简单举例，具体参考 `1.Git客户端工具`

### 4.6 git多账号策略
* 没有用户名和邮箱效果
```
*** Please tell me who you are.
Run

  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"

to set your account's default identity.
Omit --global to set the identity only in this repository.

fatal: unable to auto-detect email address (got 'computerName@bogon.(none)')
```
1. 全局推荐常用的用户名和邮箱
2. 项目中配置对应的用户名和邮箱
* 举例，小编有 github 和 gitlab 两套账号：

*全局配置(github):*
```bash
git config --list  --global
```
```
user.name=小编github账号
user.email=小编github邮箱
```
*项目配置(gitlab):*
```bash
cd ~/Documents/data/first-demo
git config --list
```
```{2,3,5,6}
# ... ...
user.name=小编gitlab账号
user.email=小编gitlab邮箱
# ... ...
remote.origin.url=http://服务器ip:9000/root/first-demo.git
remote.origin.fetch=+refs/heads/*:refs/remotes/origin/*
branch.master.remote=origin
branch.master.merge=refs/heads/master
```
* ssh config 配置方式，小编这里暂不给出，请读者自行搜索 `git多账号`

## 5. gitlab账户角色权限



## 6. git分支规划




