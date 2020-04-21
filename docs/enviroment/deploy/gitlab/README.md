# docker搭建gitlab
**GitHub 使用的是 Git 分布式版本控制系统。**

*`GitLab` 分为 社区版（Community Edition，缩写为 CE）和 企业版（Enterprise Edition，缩写为 EE）。社区版是免费的。本案例使用 gitlab-ce 社区版。*

* Docker搭建过程参考 `服务器->常规部署`
* gitlab详细介绍请上网搜索

![gitlab](./images/gitlab.jpg)

## 1. Git客户端工具
### 1.1 工具下载
git bash: [https://git-scm.com/downloads](https://git-scm.com/downloads)
### 1.2 推荐教程
[Git教程-廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/896043488029600)

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
mkdir -p /mnt/srv/gitlab/{config,logs,data}
```
>/mnt是挂在硬盘后的目录<br>
>/srv目录用于存放用户主动生成的数据，一般修改成自己挂载外接硬盘的路径

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
  -v /mnt/srv/gitlab/config:/etc/gitlab \
  --volume /mnt/srv/gitlab/logs:/var/log/gitlab \
  --volume /mnt/srv/gitlab/data:/var/opt/gitlab \
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
vi /mnt/srv/gitlab/config/gitlab.rb
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
vi /mnt/srv/gitlab/config/gitlab.rb
```
```
external_url 'http://服务器ip:9000/gitlab'
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
  -v /mnt/srv/gitlab/config:/etc/gitlab \
  --volume /mnt/srv/gitlab/logs:/var/log/gitlab \
  --volume /mnt/srv/gitlab/data:/var/opt/gitlab \
  gitlab/gitlab-ce:latest
```
>`9000`端口处，第一次启动容器：--publish 9000:80 \ <br>
>`9000`端口处，第二次启动容器：--publish 9000:9000 \ <br>
>`9000`即为external_url指定的端口，并将其映射到容器外，供外网使用<br>
>`9222`对应容器内部的ssh端口，**注意，22端口仍是ssh端口，而配置文件中的9222用于项目ssh地址**<br>
>*`9443`对应容器`443`端口，即https服务端口，将在最后https部分具体阐述*

### 3.6 Web IDE 配置方案说明
*Web IDE 功能的存在，让用户可以只操作web浏览器，就能实现文件的维护*
* 最终方案:
1. docker容器内部端口 `443` `22` `80`
2. docker容器外部端口 `9443` `9222` `80`
* gitlab.rb 配置
```
external_url 'http://服务器ip/gitlab'
gitlab_rails['gitlab_shell_ssh_port'] = 9222
```
>`external_url`: 声明外界http请求的地址，以及WebIDE的地址<br>
>`gitlab_shell_ssh_port`: 声明外界ssh交互的端口
* 调试流程及结果:
1. docker容器内部端口`80` -> docker外部容器端口`9000` -> nginx端口`80` => Web IDE 失效
2. docker容器内部端口`9000` -> docker外部容器端口`9000` -> nginx端口`80` => Web IDE 失效
3. docker容器内部端口`80` -> docker外部容器端口`80` -> nginx端口不使用`80` => Web IDE 有效

### 3.7 内置nginx配置
#### 3.7.1 理解位置关系
```bash
docker exec -it gitlab /bin/bash
```
>进入gitlab容器
```bash
cd /var/opt/gitlab/nginx/conf/
ls
```
>跳转到nginx目录，查看文件
```bash
exit
cd /mnt/srv/gitlab/data/nginx/conf
ls
```
>退出到宿主机，查看文件，跟容器内一样
#### 3.7.2 mime.type （理论基础,暂未实践）
**`nginx`增加`mime`类型，修改`mime.type`类型默认打开方式**<br>
nginx建立的网站客户端点击下载docx的文档的时候能.zip的文件的解决方法
1. 新建 `mime.types` 文件举例（详见附录）
```py
types {
  # Microsoft Office
  application/msword doc;
  application/vnd.ms-excel xls;
  application/vnd.ms-powerpoint ppt;
  application/vnd.openxmlformats-officedocument.wordprocessingml.document docx;
  application/vnd.openxmlformats-officedocument.spreadsheetml.sheet xlsx;
  application/vnd.openxmlformats-officedocument.presentationml.presentation pptx;
}
```
2. 修改 `nginx.conf` 文件，添加 `mime.types`
```
http{
  include include /etc/nginx/mime.types;
  ... ...
}
```
>`/etc/nginx/mime.types;`这个是一个决定路径的例子<br>
>也可以写`mime.types;`代表相对当前配置文件路径<br>
>根据创建的文件修改这个路径
3. 重启gitlab
```bash
docker exec gitlab gitlab-ctl reconfigure
```

## 4. gitlab使用
### 4.1 账户创建
#### 4.1.1 root 用户登录
* 修改root用户邮箱地址<br>
[http://服务器ip:9000/gitlab/admin/users/root/edit](http://服务器ip:9000/gitlab/admin/users/root/edit)
>Admin Area(导航栏小扳子) -> Users -> Edit
* 创建普通用户，输入邮箱<br>
>自动发送邮箱
#### 4.1.2 admin可以选择关闭注册功能
[http://服务器ip:9000/gitlab/admin/application_settings/general](http://服务器ip:9000/gitlab/admin/application_settings/general)
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
`http://服务器ip:9000/gitlab/root/first-demo.git`

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
>或者浏览器地址栏输入 [http://服务器ip:9000/gitlab/profile/keys](http://服务器ip:9000/gitlab/profile/keys)
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

## 5. gitlab权限

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
* 查询用户 [http://服务器ip:9000/gitlab/admin/users](http://服务器ip:9000/gitlab/admin/users)
* 创建用户（根据用户分类）[http://服务器ip:9000/gitlab/admin/users/new](http://服务器ip:9000/gitlab/admin/users/new)
* 编辑用户（根据用户分类）[http://服务器ip:9000/gitlab/admin/users/用户名/edit](http://服务器ip:9000/gitlab/admin/users/用户名/edit)
* 删除用户 [http://服务器ip:9000/gitlab/admin/users](http://服务器ip:9000/gitlab/admin/users)

### 5.2 角色
#### 5.2.1 角色类型
* `Guest` 访客
* `Reporter` 报告者
* `Developer` 开发者
* `Maintainer` 维护者
* `Owner` 所有者
>项目最高权限为`Maintainer`，群组最高权限为`Owner`<br>
个人创建项目，一些特殊操作可由项目`创建者`执行；<br>
群组创建项目，一些特殊操作可以由群组`Owner`执行。

### 5.3 群组
#### 5.3.1 群组描述
>`群组`允许你管理和协作多个项目。组内成员可以访问群组对应的所有项目。<br>
`群组`可以嵌套创建子群组<br>
属于一个`群组`的`项目`以`群组`的namespace为前缀。<br>
通过项目配置，已存在的`项目`可以加入`群组`。<br>
新加入的`项目`namespace不属于当前组。
#### 5.3.2 功能
* 创建群组 [http://服务器ip:9000/gitlab/groups/new](http://服务器ip:9000/gitlab/groups/new)<br>
群组名称 namespace 群组描述 权限<br>
>`Private` 当前群组 和 群组中的项目，只能成员可见<br>
`Internal` 当前群组 和 所有 internal 项目，可以被所有登录用户访问<br>
`Public` 不需要任何授权就可以访问 当前群组 和 所有 public 项目
* 创建项目 [http://服务器ip:9000/gitlab/projects/new?namespace_id=Group_Id](http://服务器ip:9000/gitlab/projects/new?namespace_id=Group_Id)<br>
项目名 群组/用户namespace 项目namespace 描述信息<br>
>`Private`群组只可以创建`Private`项目<br>
`Internal`群组可以创建`Private`和`Internal`项目<br>
`Public`群组可以创建`Private`、`Internal`、`Public`项目<br>
* 添加成员 [http://服务器ip:9000/gitlab/groups/Group_Namespace/-/group_members](http://服务器ip:9000/gitlab/groups/Group_Namespace/-/group_members)<br>
可以选择成员角色 Guest,Reporter,Developer,Maintainer,Owner (参考`5.3`角色)，并可选过期时间
#### 5.3.3 角色权限
[http://服务器ip:9000/gitlab/help/user/permissions](http://服务器ip:9000/gitlab/help/user/permissions)
* 常用权限

| Action                | Gust   | Reporter | Developer | Maintainer | Owner  |
| :----:                | :----: | :----:   | :----:    | :----:     | :----: |
| 浏览群组               | ✓      | ✓        | ✓         | ✓          | ✓      |
| 创建项目               |        |          | ✓         | ✓          | ✓      |
| 创建/编辑/删除项目里程碑 |        |          | ✓         | ✓          | ✓      |
| 创建子组               |        |          |           | ✓          | ✓      |
| 编辑群组               |        |          |           |            | ✓      |
| 管理成员               |        |          |           |            | ✓      |
| 删除群组               |        |          |           |            | ✓      |
| 查看审核事件            |        |          |           |            | ✓      |
| 禁用邮箱通知            |        |          |           |            | ✓      |

### 5.4 项目
#### 5.4.1 功能
* 创建项目 [http://服务器ip:9000/gitlab/projects/new](http://服务器ip:9000/gitlab/projects/new)<br>
项目名 群组/用户namespace 项目namespace 描述信息<br>
>`Private`只有被明确授权的用户才能访问项目（添加成员或添加到群组）<br>
`Internal`当前项目可以任何登录用户访问<br>
`Public`当前项目可以被所有人访问，无需授权或登录<br>
* 添加成员 [http://服务器ip:9000/gitlab/群组或用户namespace/项目名/-/project_members](http://服务器ip:9000/gitlab/群组或用户namespace/项目名/-/project_members)<br>
可以选择成员角色 Guest,Reporter,Developer,Maintainer (参考`5.3`角色)，并可选过期时间
* 添加到群组 [http://服务器ip:9000/gitlab/群组或用户namespace/项目名/-/project_members](http://服务器ip:9000/gitlab/群组或用户namespace/项目名/-/project_members)<br>
可选最高权限角色 Guest,Reporter,Developer,Maintainer (参考`5.3`角色)，并可选过期时间
#### 5.4.2 角色权限
[http://服务器ip:9000/gitlab/help/user/permissions](http://服务器ip:9000/gitlab/help/user/permissions)
* 常用权限

| Action                | Gust   | Reporter | Developer | Maintainer | Owner  |
| :----:                | :----: | :----:   | :----:    | :----:     | :----: |
| 下载项目               | ✓      | ✓        | ✓         | ✓          | ✓      |
| 评论                   | ✓      | ✓        | ✓         | ✓          | ✓      |
| 查看项目代码            | ✓      | ✓        | ✓         | ✓          | ✓      |
| pull项目代码           | ✓      | ✓        | ✓         | ✓          | ✓      |
| 创建issue              | ✓      | ✓        | ✓         | ✓          | ✓      |
| 创建branch             |        |          | ✓         | ✓          | ✓      |
| push非保护分支          |        |          | ✓         | ✓          | ✓      |
| push非保护分支-f        |        |          | ✓         | ✓          | ✓      |
| remove非保护分支        |        |          | ✓         | ✓          | ✓      |
| 创建新merge request    |        |          | ✓         | ✓          | ✓      |
| 标记merge request      |        |          | ✓         | ✓          | ✓      |
| 锁定merge request      |        |          | ✓         | ✓          | ✓      |
| 管理/接受merge request  |        |          | ✓         | ✓          | ✓      |
| 添加tag                |        |          | ✓         | ✓          | ✓      |
| 创建/编辑/删除项目里程碑  |        |          | ✓         | ✓          | ✓      |
| 重写/编辑tag           |        |          | ✓         | ✓          | ✓      |
| 添加members            |        |          |           | ✓          | ✓      |
| 启动/禁用分支保护        |        |          |           | ✓          | ✓      |
| push保护分支           |        |          |           | ✓          | ✓      |
| 打开/关闭dev保护分支push |        |          |           | ✓          | ✓      |
| 启动/禁用tag保护        |        |          |           | ✓          | ✓      |
| 编辑项目               |        |          |           | ✓          | ✓      |
| 添加项目秘钥            |        |          |           | ✓          | ✓      |
| 设置访问权限            |        |          |           |            | ✓      |
| 迁移到其他namespace    |        |          |           |            | ✓      |
| 删除项目               |        |          |           |            | ✓      |
| 删除issues            |        |          |           |            | ✓      |
| 禁用邮箱通知           |        |          |           |            | ✓      |

## 附录
### 1. mime.types
* 扩展名和相应的MIME对应关系
```js
.asx,video/x-ms-asf   
.xml,text/xml   
.tsv,text/tab-separated-values   
.ra,audio/x-pn-realaudio   
.sv4crc,application/x-sv4crc   
.spc,application/x-pkcs7-certificates   
.pmc,application/x-perfmon   
.lit,application/x-ms-reader   
.crd,application/x-mscardfile   
.isp,application/x-internet-signup   
.wmlsc,application/vnd.wap.wmlscriptc   
.vst,application/vnd.visio   
.xlam,application/vnd.ms-excel.addin.macroEnabled.12   
.ttf,application/octet-stream   
.pfm,application/octet-stream   
.csv,application/octet-stream   
.aaf,application/octet-stream   
.one,application/onenote   
.hta,application/hta   
.atom,application/atom+xml   
.323,text/h323   
.mhtml,message/rfc822   
.midi,audio/mid   
.p7r,application/x-pkcs7-certreqresp   
.mny,application/x-msmoney   
.clp,application/x-msclip   
.vsd,application/vnd.visio   
.lpk,application/octet-stream   
.bin,application/octet-stream   
.onetoc,application/onenote   
.x,application/directx   
.wvx,video/x-ms-wvx   
.vcf,text/x-vcard   
.htc,text/x-component   
.htt,text/webviewhtml   
.h,text/plain   
.mht,message/rfc822   
.mid,audio/mid   
.p7b,application/x-pkcs7-certificates   
.gz,application/x-gzip   
.dvi,application/x-dvi   
.cpio,application/x-cpio   
.vdx,application/vnd.ms-visio.viewer   
.sldm,application/vnd.ms-powerpoint.slide.macroEnabled.12   
.xlm,application/vnd.ms-excel   
.fdf,application/vnd.fdf   
.setreg,application/set-registration-initiation   
.eps,application/postscript   
.p7s,application/pkcs7-signature   
.toc,application/octet-stream   
.mdp,application/octet-stream   
.ics,application/octet-stream   
.chm,application/octet-stream   
.asi,application/octet-stream   
.afm,application/octet-stream   
.evy,application/envoy   
.wmp,video/x-ms-wmp   
.qt,video/quicktime   
.mpv2,video/mpeg   
.xslt,text/xml   
.etx,text/x-setext   
.cod,p_w_picpath/cis-cod   
.snd,audio/basic   
.au,audio/basic   
.man,application/x-troff-man   
.qtl,application/x-quicktimeplayer   
.pmw,application/x-perfmon   
.class,application/x-java-applet   
.iii,application/x-iphone   
.csh,application/x-csh   
.z,application/x-compress   
.vtx,application/vnd.visio   
.vsw,application/vnd.visio   
.wps,application/vnd.ms-works   
.potx,application/vnd.openxmlformats-officedocument.presentationml.template   
.ps,application/postscript   
.p7c,application/pkcs7-mime   
.thn,application/octet-stream   
.mso,application/octet-stream   
.dot,application/msword   
.doc,application/msword   
.sgml,text/sgml   
.nws,message/rfc822   
.pbm,p_w_picpath/x-portable-bitmap   
.ief,p_w_picpath/ief   
.wav,audio/wav   
.texi,application/x-texinfo   
.mvb,application/x-msmediaview   
.hdf,application/x-hdf   
.vsx,application/vnd.visio   
.dotm,application/vnd.ms-word.template.macroEnabled.12   
.docm,application/vnd.ms-word.document.macroEnabled.12   
.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation   
.psm,application/octet-stream   
.java,application/octet-stream   
.eot,application/octet-stream   
.jar,application/java-archive   
.mpeg,video/mpeg   
.xsf,text/xml   
.map,text/plain   
.uls,text/iuls   
.rf,p_w_picpath/vnd.rn-realflash   
.m3u,audio/x-mpegurl   
.wma,audio/x-ms-wma   
.aifc,audio/aiff   
.mdb,application/x-msaccess   
.mvc,application/x-miva-compiled   
.stl,application/vnd.ms-pki.stl   
.ppsx,application/vnd.openxmlformats-officedocument.presentationml.slideshow   
.xlsb,application/vnd.ms-excel.sheet.binary.macroEnabled.12   
.setpay,application/set-payment-initiation   
.prm,application/octet-stream   
.mix,application/octet-stream   
.lzh,application/octet-stream   
.hhk,application/octet-stream   
.onepkg,application/onenote   
.xaf,x-world/x-vrml   
.flr,x-world/x-vrml   
.IVF,video/x-ivf   
.cnf,text/plain   
.asm,text/plain   
.tiff,p_w_picpath/tiff   
.wax,audio/x-ms-wax   
.ms,application/x-troff-ms   
.tcl,application/x-tcl   
.shar,application/x-shar   
.sh,application/x-sh   
.nc,application/x-netcdf   
.hlp,application/winhlp   
.oda,application/oda   
.pfb,application/octet-stream   
.fla,application/octet-stream   
.wm,video/x-ms-wm   
.rgb,p_w_picpath/x-rgb   
.ppm,p_w_picpath/x-portable-pixmap   
.ram,audio/x-pn-realaudio   
.sit,application/x-stuffit   
.dir,application/x-director   
.mpp,application/vnd.ms-project   
.xla,application/vnd.ms-excel   
.ssm,application/streamingmedia   
.axs,application/olescript   
.ods,application/oleobject   
.psp,application/octet-stream   
.jpb,application/octet-stream   
.wrz,x-world/x-vrml   
.m1v,video/mpeg   
.mno,text/xml   
.cmx,p_w_picpath/x-cmx   
.jpeg,p_w_picpath/jpeg   
.dib,p_w_picpath/bmp   
.rmi,audio/mid   
.aiff,audio/aiff   
.wmd,application/x-ms-wmd   
.wri,application/x-mswrite   
.pub,application/x-mspublisher   
.ins,application/x-internet-signup   
.wks,application/vnd.ms-works   
.xls,application/vnd.ms-excel   
.ai,application/postscript   
.crl,application/pkix-crl   
.qxd,application/octet-stream   
.dwp,application/octet-stream   
.xof,x-world/x-vrml   
.wmv,video/x-ms-wmv   
.nsc,video/x-ms-asf   
.mpa,video/mpeg   
.pnm,p_w_picpath/x-portable-anymap   
.rpm,audio/x-pn-realaudio-plugin   
.aif,audio/x-aiff   
.me,application/x-troff-me   
.pml,application/x-perfmon   
.trm,application/x-msterminal   
.m13,application/x-msmediaview   
.js,application/x-javascript   
.dxr,application/x-director   
.potm,application/vnd.ms-powerpoint.template.macroEnabled.12   
.xltx,application/vnd.openxmlformats-officedocument.spreadsheetml.template   
.xlt,application/vnd.ms-excel   
.xlc,application/vnd.ms-excel   
.p10,application/pkcs10   
.smi,application/octet-stream   
.sea,application/octet-stream   
.hqx,application/mac-binhex40   
.spl,application/futuresplash   
.movie,video/x-sgi-movie   
.lsf,video/x-la-asf   
.txt,text/plain   
.jfif,p_w_picpath/pjpeg   
.jpe,p_w_picpath/jpeg   
.zip,application/x-zip-compressed   
.wmf,application/x-msmetafile   
.m14,application/x-msmediaview   
.latex,application/x-latex   
.wcm,application/vnd.ms-works   
.pptm,application/vnd.ms-powerpoint.presentation.macroEnabled.12   
.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet   
.hhp,application/octet-stream   
.aca,application/octet-stream   
.accdb,application/msaccess   
.jcz,application/liquidmotion   
.wrl,x-world/x-vrml   
.wmx,video/x-ms-wmx   
.asr,video/x-ms-asf   
.lsx,video/x-la-asf   
.xsl,text/xml   
.html,text/html   
.tif,p_w_picpath/tiff   
.der,application/x-x509-ca-cert   
.pfx,application/x-pkcs12   
.p12,application/x-pkcs12   
.ppsm,application/vnd.ms-powerpoint.slideshow.macroEnabled.12   
.cur,application/octet-stream   
.accdt,application/msaccess   
.hdml,text/x-hdml   
.htm,text/html   
.xbm,p_w_picpath/x-xbitmap   
.jpg,p_w_picpath/jpeg   
.texinfo,application/x-texinfo   
.ppam,application/vnd.ms-powerpoint.addin.macroEnabled.12   
.xlw,application/vnd.ms-excel   
.rm,application/vnd.rn-realmedia   
.pdf,application/pdf   
.rar,application/octet-stream   
.psd,application/octet-stream   
.inf,application/octet-stream   
.emz,application/octet-stream   
.dsp,application/octet-stream   
.onea,application/onenote   
.jck,application/liquidmotion   
.mpe,video/mpeg   
.mp2,video/mpeg   
.sct,text/scriptlet   
.ras,p_w_picpath/x-cmu-raster   
.swf,application/x-shockwave-flash   
.wmz,application/x-ms-wmz   
.gtar,application/x-gtar   
.dcr,application/x-director   
.sldx,application/vnd.openxmlformats-officedocument.presentationml.slide   
.pps,application/vnd.ms-pps   
.p7m,application/pkcs7-mime   
.xsn,application/octet-stream   
.ocx,application/octet-stream   
.accde,application/msaccess   
.mov,video/quicktime   
.wmls,text/vnd.wap.wmlscript   
.cpp,text/plain   
.c,text/plain   
.bas,text/plain   
.css,text/css   
.art,p_w_picpath/x-jg   
.mp3,audio/mpeg   
.t,application/x-troff   
.roff,application/x-troff   
.tar,application/x-tar   
.hhc,application/x-oleobject   
.scd,application/x-msschedule   
.pko,application/vnd.ms-pki.pko   
.sst,application/vnd.ms-pki.certstore   
.ppt,application/vnd.ms-powerpoint   
.xtp,application/octet-stream   
.u32,application/octet-stream   
.pcx,application/octet-stream   
.msi,application/octet-stream   
.exe,application/octet-stream   
.asd,application/octet-stream   
.onetoc2,application/onenote   
.fif,application/fractals   
.mpg,video/mpeg   
.vml,text/xml   
.xdr,text/plain   
.vcs,text/plain   
.hxt,text/html   
.eml,message/rfc822   
.xpm,p_w_picpath/x-xpixmap   
.ico,p_w_picpath/x-icon   
.gif,p_w_picpath/gif   
.dwf,drawing/x-dwf   
.src,application/x-wais-source   
.tr,application/x-troff   
.pmr,application/x-perfmon   
.pma,application/x-perfmon   
.dll,application/x-msdownload   
.bcpio,application/x-bcpio   
.wmlc,application/vnd.wap.wmlc   
.wdb,application/vnd.ms-works   
.dotx,application/vnd.openxmlformats-officedocument.wordprocessingml.template   
.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document   
.pot,application/vnd.ms-powerpoint   
.xltm,application/vnd.ms-excel.template.macroEnabled.12   
.rtf,application/rtf   
.prf,application/pics-rules   
.snp,application/octet-stream   
.cab,application/octet-stream   
.avi,video/x-msvideo   
.asf,video/x-ms-asf   
.dtd,text/xml   
.wml,text/vnd.wap.wml   
.vbs,text/vbscript   
.rtx,text/richtext   
.dlm,text/dlm   
.xwd,p_w_picpath/x-xwindowdump   
.pgm,p_w_picpath/x-portable-graymap   
.bmp,p_w_picpath/bmp   
.crt,application/x-x509-ca-cert   
.ustar,application/x-ustar   
.tex,application/x-tex   
.sv4cpio,application/x-sv4cpio   
.tgz,application/x-compressed   
.cdf,application/x-cdf   
.vss,application/vnd.visio   
.cat,application/vnd.ms-pki.seccat   
.thmx,application/vnd.ms-officetheme   
.xlsm,application/vnd.ms-excel.sheet.macroEnabled.12   
.prx,application/octet-stream   
.pcz,application/octet-stream   
.onetmp,application/onenote   
.acx,application/internet-property-stream   
.wsdl,text/xml   
.disco,text/xml   
.xsd,text/xml   
.wbmp,p_w_picpath/vnd.wap.wbmp   
.png,p_w_picpath/png   
.pnz,p_w_picpath/png   
.smd,audio/x-smd   
.smz,audio/x-smd   
.smx,audio/x-smd   
.mmf,application/x-smaf
```
