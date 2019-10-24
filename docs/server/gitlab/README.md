# docker搭建gitlab
**GitHub 使用的是 Git 分布式版本控制系统。**

*`GitLab` 分为 社区版（Community Edition，缩写为 CE）和 企业版（Enterprise Edition，缩写为 EE）。社区版是免费的。本案例使用 gitlab-ce 社区版。*

* Docker搭建过程参考 `服务器->常规部署`
* gitlab详细介绍请上网搜索

![gitlab](./images/gitlab.jpg)

## 1. Git客户端工具
* 工具下载 [git bash](https://git-scm.com/downloads)
* 推荐教程 [Git教程-廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/896043488029600)

## 2. 安装环境信息
GitLab 的搭建有多种方式，本文案例使用 Docker 来搭建。
### 2.1 gitlab硬件要求
* CPU: 2核 (官方推荐的最低要求)
* 系统: CentOS 7.6
* Docker: 19.03.3
* GitLab: 最新版本 latest (12.3.5)
* 最低内存: 4GB RAM + 4GB swap (推荐 8GB RAM)
* 最低硬盘: 10 GB (增加量根据 repositories 大小具体分析)
### 2.2 查看配置命令
* 查看操作系统信息
```bash
lsb_release -a
```
* 监控系统情况
```bash
top
```
>`q`退出
* 查看系统内存使用
```bash
free -m
```
>单位`M`
* 查看磁盘占用率
```bash
df -h
```
* 查看docker信息，docker版本
```bash
docker info
docker version
```
* docker监控容器状态
```bash
docker stats
```
```py {1}
CONTAINER ID    NAME      CPU %    MEM USAGE / LIMIT      MEM %     NET I/O            BLOCK I/O         PIDS
443af8ac50ae    gitlab    4.89%    4.634GiB / 15.51GiB    29.87%    4.85MB / 7.16MB    28.7kB / 4.7GB    461
21bdd9c32eea    redis     0.11%    8.371MiB / 15.51GiB    0.05%     5.71MB / 2.3MB     19.9MB / 0B       4
82e19d1644f2    mongo     0.19%    77.36MiB / 15.51GiB    0.49%     12.4MB / 21.2MB    16.9MB / 469MB    
```
>`ctrl + c`退出

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
```py
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
>需要在`云服务器安全组`中将**9443,9222,9000**添加到`入站规则`<br>
>--detach 代表守护进程运行（缩写 -d）<br>
>--hostname 代表主机名或域名<br>
>--publish 端口映射 左边是宿主机端口，右边是docker内部的端口（缩写 -p）<br>
>--name 给启动容器起名<br>
>--restart always Docker重启后，容器自动启动<br>
>-v 是 --volume 的缩写，代表在docker中，配置、日志、数据，宿主机目录和容器目录的映射关系<br>
>latest 指定镜像tag

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
```py
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
>该段描述用于记录，已经可以通过qq邮箱发送给163邮件，原因尚不明确<br>
>**敲黑板划重点：qq邮箱不能给163发送邮件，即使使用网页qq邮箱，也会被打回来！！！**<br>
>但是163可以给qq发送邮件，如果想要配置163邮箱，请上网参考163的smtp配置。<br>

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
>`9000`端口用于http，网站访问的http端口和项目http端口<br>
>`9222`端口用于项目的ssh地址

### 3.5 再次启动容器，使新端口生效
```py
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
>`9000`即为external_url指定的端口，并将其映射到容器外，供外网使用<br>
>`9222`对应容器内部的ssh端口，**注意，22端口仍是ssh端口，而配置文件中的9222用于项目ssh地址**<br>
>*`9443`对应容器`443`端口，即https服务端口，将在最后https部分具体阐述*

## 4. gitlab使用
### 4.1 账户创建
#### 4.1.1 root 用户登录
* 修改root用户邮箱地址<br>
[http://服务器ip:9000/admin/users/root/edit](http://服务器ip:9000/admin/users/root/edit)
>Admin Area(导航栏小扳子) -> Users -> Edit
* 创建普通用户，输入邮箱<br>
>自动发送邮箱
#### 4.1.2 admin可以选择关闭注册功能
[http://服务器ip:9000/admin/application_settings/general](http://服务器ip:9000/admin/application_settings/general)
>Admin Area(导航栏小扳子) -> Settings -> General
**Sign-up restrictions**<br>
Sign-up enabled 取消勾选 -> Save changes
#### 4.1.2 普通用户打开邮箱
>点击修改密码链接，修改密码

### 4.2 项目创建
* 创建项目
first-demo<br>
ssh地址<br>
`git@服务器ip:9222:root/first-demo.git`<br>
http地址<br>
`http://服务器ip:9000/root/first-demo.git`

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
* 登录你的账号（非root账号）
* 头像 -> Settings -> SSH Keys<br>
>或者浏览器地址栏输入 [http://服务器ip:9000/profile/keys](http://服务器ip:9000/profile/keys)
* 将公钥复制到Key中，保存
* 验证ssh是否配置成功
```bash
ssh -T git@服务器ip:9222
```

### 4.5 pull/push 拉取和推送
* 跳转到目标文件夹clone项目
```bash
cd ~/Documents/projects
git clone git@服务器ip:9222:root/first-demo.git
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
remote.origin.url=ssh://git@服务器ip:9222/root/first-demo.git
remote.origin.fetch=+refs/heads/*:refs/remotes/origin/*
branch.master.remote=origin
branch.master.merge=refs/heads/master
```
* ssh config 配置方式，小编这里暂不给出，请读者自行搜索 `git多账号`

## 5. gitlab权限(用户、群组、角色、项目)

### 5.1 用户
#### 5.1.1 用户分类
Regular普通用户
>可以访问自己所在的`群组`和`项目`

Admin管理员
>可以访问所有`群组`、`项目`、`用户`，并且能够管理所有功能

其他选项
>是否可以创建群组<br>
>是否外部用户: 外部用户，只有被明确授权，才能访问`内部`和`私有`项目，并且不能创建群组或项目
#### 5.1.2 功能
* 查询用户 [http://服务器ip:9000/admin/users](http://服务器ip:9000/admin/users)
* 创建用户（根据用户分类）[http://服务器ip:9000/admin/users/new](http://服务器ip:9000/admin/users/new)
* 编辑用户（根据用户分类）[http://服务器ip:9000/admin/users/用户名/edit](http://服务器ip:9000/admin/users/用户名/edit)
* 删除用户 [http://服务器ip:9000/admin/users](http://服务器ip:9000/admin/users)

### 5.2 群组
#### 5.2.1 群组描述
>`群组`允许你管理和协作多个项目。组内成员可以访问群组对应的所有项目。<br>
`群组`可以嵌套创建子群组<br>
属于一个`群组`的`项目`以`群组`的namespace为前缀。<br>
通过项目配置，已存在的`项目`可以加入`群组`。<br>
新加入的`项目`namespace不属于当前组。
#### 5.2.2 功能
* 创建群组 [http://服务器ip:9000/groups/new](http://服务器ip:9000/groups/new)<br>
群组名称 namespace 群组描述 权限<br>
>`Private` 当前群组 和 群组中的项目，只能成员可见<br>
`Internal` 当前群组 和 所有 internal 项目，可以被所有登录用户访问<br>
`Public` 不需要任何授权就可以访问 当前群组 和 所有 public 项目
* 创建项目 [http://服务器ip:9000/projects/new?namespace_id=Group_Id](http://服务器ip:9000/projects/new?namespace_id=Group_Id)<br>
项目名 群组/用户namespace 项目namespace 描述信息<br>
>`Private`群组只可以创建`Private`项目<br>
`Internal`群组可以创建`Private`和`Internal`项目<br>
`Public`群组可以创建`Private`、`Internal`、`Public`项目<br>
* 添加成员 [http://服务器ip:9000/groups/Group_Namespace/-/group_members](http://服务器ip:9000/groups/Group_Namespace/-/group_members)<br>
可以选择成员角色 Guest,Reporter,Developer,Maintainer,Owner (参考`5.3`角色)，并可选过期时间
#### 5.2.3 角色权限
[http://服务器ip:9000/help/user/permissions](http://服务器ip:9000/help/user/permissions)


### 5.3 角色
#### 5.3.1 角色类型
* `Guest` 访客
* `Reporter` 报告者
* `Developer` 开发者
* `Maintainer` 维护者
* `Owner` 所有者
>项目最高权限为`Maintainer`，群组最高权限为`Owner`<br>
个人创建项目，一些特殊操作可由项目`创建者`执行；<br>
群组创建项目，一些特殊操作可以由群组`Owner`执行。

### 5.4 项目
#### 5.4.1 功能
* 创建项目 [http://服务器ip:9000/projects/new](http://服务器ip:9000/projects/new)<br>
项目名 群组/用户namespace 项目namespace 描述信息<br>
>`Private`只有被明确授权的用户才能访问项目（添加成员或添加到群组）<br>
`Internal`当前项目可以任何登录用户访问<br>
`Public`当前项目可以被所有人访问，无需授权或登录<br>
* 添加成员 [http://服务器ip:9000/群组或用户namespace/项目名/-/project_members](http://服务器ip:9000/群组或用户namespace/项目名/-/project_members)<br>
可以选择成员角色 Guest,Reporter,Developer,Maintainer (参考`5.3`角色)，并可选过期时间
* 添加到群组 [http://服务器ip:9000/群组或用户namespace/项目名/-/project_members](http://服务器ip:9000/群组或用户namespace/项目名/-/project_members)<br>
可选最高权限角色 Guest,Reporter,Developer,Maintainer (参考`5.3`角色)，并可选过期时间
#### 5.4.2 角色权限
[http://服务器ip:9000/help/user/permissions](http://服务器ip:9000/help/user/permissions)
* 常用权限

| Action      | Gust        | Reporter    | Developer   | Maintainer  | Owner       |
| :----:      | :----:      | :----:      | :----:      | :----:      | :----:      |
| 下载项目     | ✓           | ✓           | ✓           | ✓           | ✓           |
| 评论        | ✓           | ✓           | ✓           | ✓           | ✓           |
| 查看项目代码  | ✓           | ✓           | ✓           | ✓           | ✓           |
| pull项目代码 | ✓           | ✓           | ✓           | ✓           | ✓           |
| 创建 issue  | ✓           | ✓           | ✓           | ✓           | ✓           |
| 创建新分支   |             |             | ✓           | ✓           | ✓           |


## 6. git-flow



## 7. https证书



