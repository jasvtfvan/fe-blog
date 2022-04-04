(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{285:function(s,e,a){s.exports=a.p+"assets/img/docker-in-docker.f0d13333.png"},286:function(s,e,a){s.exports=a.p+"assets/img/docker-ps-jenkins.3b8d6b11.png"},287:function(s,e,a){s.exports=a.p+"assets/img/waiting-jenkins.56deb1cb.png"},288:function(s,e,a){s.exports=a.p+"assets/img/unlock-jenkins.1017688e.png"},289:function(s,e,a){s.exports=a.p+"assets/img/cat-jenkins-passwd.86534a7d.png"},290:function(s,e,a){s.exports=a.p+"assets/img/init-jenkins-plugins.0dd2c3b6.png"},291:function(s,e,a){s.exports=a.p+"assets/img/finish-jenkins-install.27492bda.png"},292:function(s,e,a){s.exports=a.p+"assets/img/jenkins-freedom-pj.6b84f30d.png"},293:function(s,e,a){s.exports=a.p+"assets/img/jenkins-first-shell.e080f6a7.png"},294:function(s,e,a){s.exports=a.p+"assets/img/jenkins-first-console.a351bbb7.png"},295:function(s,e,a){s.exports=a.p+"assets/img/jenkins-build-status.eb60aac4.png"},336:function(s,e,a){"use strict";a.r(e);var n=a(0),t=Object(n.a)({},(function(){var s=this,e=s.$createElement,n=s._self._c||e;return n("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[n("h1",{attrs:{id:"安装-jenkins"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#安装-jenkins","aria-hidden":"true"}},[s._v("#")]),s._v(" 安装 Jenkins")]),s._v(" "),n("h2",{attrs:{id:"jenkins-是啥"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#jenkins-是啥","aria-hidden":"true"}},[s._v("#")]),s._v(" Jenkins 是啥")]),s._v(" "),n("p",[n("br"),n("code",[s._v("Jenkins")]),s._v(" 是一个基于Java语言开发的CI持续构建工具，主要用于持续、自动的构建/测试软件项目。"),n("br"),s._v("它可以执行你预先设定好的设置和脚本，也可以和 Git工具做集成，实现自动触发和定时触发器构建。")]),s._v(" "),n("h2",{attrs:{id:"安装-docker"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#安装-docker","aria-hidden":"true"}},[s._v("#")]),s._v(" 安装 Docker")]),s._v(" "),n("p",[n("br"),s._v("在这里，我们使用 "),n("code",[s._v("Docker")]),s._v(" 安装 "),n("code",[s._v("Jenkins")]),s._v(" 服务，在安装前，需要先安装 "),n("code",[s._v("Docker")]),s._v(" 环境 :"),n("br")]),s._v(" "),n("h2",{attrs:{id:"安装防火墙"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#安装防火墙","aria-hidden":"true"}},[s._v("#")]),s._v(" 安装防火墙")]),s._v(" "),n("div",{staticClass:"language-bash line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[s._v("yum "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" firewalld systemd -y\n"),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("service")]),s._v(" firewalld start\nfirewall-cmd --permanent --add-service"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("http\nfirewall-cmd --permanent --add-rich-rule"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"rule family="')]),s._v("ipv4"),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('" source address="')]),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("172.16")]),s._v(".0.0/16"),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('" accept"')]),s._v("\nsystemctl reload firewalld\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br")])]),n("blockquote",[n("p",[s._v("pemmanent: 表示永久生效，若不加 --permanent 系统下次启动后就会失效。\nsystemctl："),n("a",{attrs:{href:"https://www.cnblogs.com/zwcry/p/9602756.html",target:"_blank",rel:"noopener noreferrer"}},[s._v("https://www.cnblogs.com/zwcry/p/9602756.html"),n("OutboundLink")],1),s._v("\nfirewall-cmd："),n("a",{attrs:{href:"https://blog.csdn.net/s_p_j/article/details/80979450",target:"_blank",rel:"noopener noreferrer"}},[s._v("https://blog.csdn.net/s_p_j/article/details/80979450"),n("OutboundLink")],1)])]),s._v(" "),n("blockquote",[n("p",[s._v("add-rich-rule："),n("strong",[s._v("添加一条放行规则。作用是允许docker容器之间可以走宿主机互相访问。")]),s._v(" "),n("strong",[s._v("其中，172.16.0.0是宿主机网段，/16代表匹配所有网段内的IP：")]),n("a",{attrs:{href:"https://blog.csdn.net/aerchi/article/details/39396423?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase",target:"_blank",rel:"noopener noreferrer"}},[s._v("https://blog.csdn.net/aerchi/article/details/39396423?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase"),n("OutboundLink")],1)])]),s._v(" "),n("h2",{attrs:{id:"_1-使用-dockerfile-构建-jenkins-镜像"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_1-使用-dockerfile-构建-jenkins-镜像","aria-hidden":"true"}},[s._v("#")]),s._v(" 1. 使用 DockerFile 构建 Jenkins 镜像")]),s._v(" "),n("p",[n("br"),s._v("我们都知道，每个Docker容器，都是一个独立的，与外界隔离的操作系统环境。"),n("strong",[s._v("在使用 Jenkins 服务进行构建时，用户写的 "),n("strong",[n("strong",[n("code",[s._v("Shell")])])]),s._v(" 脚本，也只会在容器内执行。")]),n("br"),s._v(" "),n("br"),s._v("但我们问题来了，我们想让容器部署的 "),n("code",[s._v("Jenkins")]),s._v(" 可以构建 "),n("code",[s._v("Docker")]),s._v(" 镜像，只有2种办法："),n("br")]),s._v(" "),n("ol",[n("li",[s._v("加一台 "),n("code",[s._v("Jenkins")]),s._v(" master 节点，构建机内安装 "),n("code",[s._v("Docker")]),s._v(" 环境。这样我们就可以执行远程构建。")]),s._v(" "),n("li",[n("strong",[s._v("宿主机的Docker环境，移花接木到容器内部，在容器内部执行Docker命令构建镜像。")])])]),s._v(" "),n("p",[s._v("这就是我们要讲的重磅知识点："),n("strong",[s._v("Docker in Docker")])]),s._v(" "),n("h3",{attrs:{id:"docker-in-docker"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#docker-in-docker","aria-hidden":"true"}},[s._v("#")]),s._v(" Docker in Docker")]),s._v(" "),n("h4",{attrs:{id:"原理"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#原理","aria-hidden":"true"}},[s._v("#")]),s._v(" 原理")]),s._v(" "),n("p",[n("br"),s._v("那什么是 "),n("code",[s._v("Docker in Docker")]),s._v(" 呢？"),n("br"),s._v(" "),n("br"),s._v("Docker 采用的是C/S（即Client/Server）架构。我们在执行 "),n("code",[s._v("docker xxx")]),s._v(" 等命令时，"),n("strong",[s._v("其实是使用 "),n("code",[s._v("Client")]),s._v(" 在和"),n("code",[s._v("docker engine")]),s._v(" 在进行通信。")])]),s._v(" "),n("p",[s._v("我们在安装 Docker CE 时，会生成一个 "),n("code",[s._v("systemd service")]),s._v(" 服务。这个服务启动时，就是 "),n("code",[s._v("Docker Engine")]),s._v(" 服务。默认情况下，Docker守护进程会生成一个 socket（"),n("code",[s._v("/var/run/docker.sock")]),s._v("）文件来进行本地进程通信，因此只能在本地使用 docker 客户端或者使用 Docker API 进行操作。"),n("br")]),s._v(" "),n("blockquote",[n("p",[s._v("*.sock文件：sock 文件是 UNIX 域套接字，它可以通过文件系统（而非网络地址）进行寻址和访问。")])]),s._v(" "),n("p",[n("br"),s._v("因此，只要把"),n("strong",[s._v("宿主机的Docker套接字通过Docker数据卷挂载到容器内部")]),s._v("，就能实现在容器内使用Docker命令（如下图）。\n"),n("img",{attrs:{src:a(285),alt:"image"}}),n("br")]),s._v(" "),n("h4",{attrs:{id:"使用"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#使用","aria-hidden":"true"}},[s._v("#")]),s._v(" 使用")]),s._v(" "),n("p",[s._v("下方的命令，就是 "),n("code",[s._v("Docker in Docker")]),s._v(" 的使用。")]),s._v(" "),n("div",{staticClass:"language-bash line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[s._v("docker run "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v(". -v /var/run/docker.sock:/var/run/docker.sock\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br")])]),n("p",[n("br"),s._v("所以，我们要实现在Jenkins内部访问宿主机docker，要写一个DockerFile进行二次镜像构建。"),n("br"),s._v("此DockerFile的作用，就是为了安装容器使用宿主机 "),n("code",[s._v("Docker")]),s._v(" 缺少的依赖。这里我们在容器内安装 "),n("code",[s._v("libltdl7")]),s._v(" 。"),n("br")]),s._v(" "),n("blockquote",[n("p",[s._v("如果不写DockerFile进行构建也可以，亲测直接挂Docker套接字进容器后会有依赖缺失问题，，，，这个方法只针对Jenkins镜像")])]),s._v(" "),n("div",{staticClass:"language-bash line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[n("span",{pre:!0,attrs:{class:"token function"}},[s._v("vi")]),s._v(" Dockerfile\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br")])]),n("div",{staticClass:"language-bash line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[s._v("FROM jenkins/jenkins\n"),n("span",{pre:!0,attrs:{class:"token environment constant"}},[s._v("USER")]),s._v(" root\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 清除了基础镜像设置的源，切换成阿里云源")]),s._v("\nRUN "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("echo")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("''")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" /etc/apt/sources.list.d/jessie-backports.list "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("echo")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"deb http://mirrors.aliyun.com/debian jessie main contrib non-free"')]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" /etc/apt/sources.list "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("echo")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"deb http://mirrors.aliyun.com/debian jessie-updates main contrib non-free"')]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">>")]),s._v(" /etc/apt/sources.list "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n  "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("echo")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"deb http://mirrors.aliyun.com/debian-security jessie/updates main contrib non-free"')]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">>")]),s._v(" /etc/apt/sources.list\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 更新源并安装缺少的包")]),s._v("\nRUN "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("apt-get")]),s._v(" update "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("apt-get")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" -y libltdl7\nARG "),n("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("dockerGid")]),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("999")]),s._v("\n\nRUN "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("echo")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v('"docker:x:'),n("span",{pre:!0,attrs:{class:"token variable"}},[s._v("${dockerGid}")]),s._v(':jenkins"')]),s._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">>")]),s._v(" /etc/group\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br")])]),n("h2",{attrs:{id:"_2-构建-jenkins-镜像"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_2-构建-jenkins-镜像","aria-hidden":"true"}},[s._v("#")]),s._v(" 2. 构建 Jenkins 镜像")]),s._v(" "),n("p",[n("br"),s._v("这样的话，我们就不能直接使用官方的 "),n("code",[s._v("Jenkins")]),s._v(" 镜像进行构建，需要用 "),n("code",[s._v("DockerFile")]),s._v(" 先构建一份自己的 "),n("code",[s._v("Jenkins")]),s._v(" 镜像。使用 "),n("code",[s._v("docker build")]),s._v(" 命令构建镜像")]),s._v(" "),n("div",{staticClass:"language-bash line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[s._v("docker build -t local/jenkins "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br")])]),n("blockquote",[n("p",[s._v("-t：镜像的名字及tag，通常name:tag或者name格式；可以在一次构建中为一个镜像设置多个tag")])]),s._v(" "),n("br"),s._v("\n![image](./images/jenkins/build-jenkins.png)"),n("br"),s._v("\n如果提示 `Successfully tagged local/jenkins:latest` 则构建成功\n"),n("h2",{attrs:{id:"_3-启动镜像"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_3-启动镜像","aria-hidden":"true"}},[s._v("#")]),s._v(" 3. 启动镜像")]),s._v(" "),n("p",[n("br"),s._v("我们将Jenkins用户目录外挂到宿主机内，先新建一个 "),n("code",[s._v("/home/jenkins")]),s._v(" 目录，并设置权限：")]),s._v(" "),n("div",{staticClass:"language-bash line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[n("span",{pre:!0,attrs:{class:"token function"}},[s._v("mkdir")]),s._v(" /home/jenkins\n"),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("chown")]),s._v(" -R "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1000")]),s._v(" /home/jenkins/\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br")])]),n("p",[n("br"),s._v("接下来我们用镜像创建容器并启动：")]),s._v(" "),n("div",{staticClass:"language-bash line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[s._v("docker run -itd --name jenkins -p "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("8080")]),s._v(":8080 -p "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("50000")]),s._v(":50000 "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n-v /var/run/docker.sock:/var/run/docker.sock "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n-v /usr/bin/docker:/usr/bin/docker "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n-v /home/jenkins:/var/jenkins_home "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--restart always "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--user root local/jenkins\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br")])]),n("blockquote",[n("p",[s._v("-itd: 由 -i -t -d命令组合而成\n-i: 开启容器内的交互模式，允许用户可以进入容器进行输入交互\n-t: 分配一个虚拟终端\n-d: 允许容器以后台运行（不加的话只能前台运行，退出终端容器就停止了）\n--name: 容器名称\n-p: 将容器内的端口映射到宿主机的端口。格式为：宿主机端口:容器端口\n-v: 将宿主机内的文件挂载到容器目录下。格式为：宿主机目录:容器目录\n--user: 指定用户启动\n--restart: 当 Docker 重启时，容器自动启动，否则就需要使用 docker restart 手动启动")])]),s._v(" "),n("p",[n("br"),s._v("启动后，会返回一串ID值，这就是 "),n("code",[s._v("容器ID")]),s._v(" 值。"),n("br"),s._v(" "),n("br"),s._v("执行 "),n("code",[s._v("docker ps")]),s._v(" 命令，查看Jenkins容器是否在列表内。如果在列表内，说明启动成功"),n("br"),s._v(" "),n("img",{attrs:{src:a(286),alt:"image"}}),n("br")]),s._v(" "),n("blockquote",[n("p",[s._v("提示：如果执行docker ps 后容器没有在列表内，多半是启动失败。可以加-a参数查看所有已经生成的容器的运行状态。\n如果想进一步查看原因，可以使用docker logs -f <容器ID> 查看容器内日志输出。")])]),s._v(" "),n("h2",{attrs:{id:"_4-启动-jenkins"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_4-启动-jenkins","aria-hidden":"true"}},[s._v("#")]),s._v(" 4. 启动 Jenkins")]),s._v(" "),n("p",[n("br"),s._v("首先我们在防火墙添加 "),n("code",[s._v("8080")]),s._v(" 和 "),n("code",[s._v("50000")]),s._v(" 端口的放行，并重载防火墙")]),s._v(" "),n("div",{staticClass:"language-bash line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[s._v("firewall-cmd --zone"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("public --add-port"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("8080")]),s._v("/tcp --permanent\nfirewall-cmd --zone"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("public --add-port"),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("50000")]),s._v("/tcp --permanent\nsystemctl reload firewalld\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br")])]),n("p",[n("br"),s._v("容器启动后，访问 "),n("code",[s._v("宿主机IP:8080")]),s._v(" 。如果看到以下界面，代表正在启动。"),n("br"),s._v("Jenkins第一次的启动时间一般比较长（视机器性能而看）"),n("br"),s._v(" "),n("img",{attrs:{src:a(287),alt:"image"}})]),s._v(" "),n("h2",{attrs:{id:"_5-初始化-jenkins-配置"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_5-初始化-jenkins-配置","aria-hidden":"true"}},[s._v("#")]),s._v(" 5. 初始化 Jenkins 配置")]),s._v(" "),n("h3",{attrs:{id:"解锁-jenkins"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#解锁-jenkins","aria-hidden":"true"}},[s._v("#")]),s._v(" 解锁 Jenkins")]),s._v(" "),n("p",[n("br"),s._v("Jenkins 启动完成后，会跳转至这个界面解锁 Jenkins。"),n("br"),s._v(" "),n("img",{attrs:{src:a(288),alt:"image"}}),n("br"),s._v("Jenkins启动后，会生成一个 "),n("code",[s._v("初始密码")]),s._v(" ，该密码在 Jenkins 容器内存放，可以进入容器后查看密码内容。")]),s._v(" "),n("div",{staticClass:"language-bash line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[s._v("docker "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("exec")]),s._v(" -it jenkins /bin/bash\n"),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("cat")]),s._v(" /var/jenkins_home/secrets/initialAdminPassword\n"),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("exit")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br")])]),n("blockquote",[n("p",[s._v("docker exec: 进入一个已启动的容器内，执行命令\ncat：查看文件内容。如果逐步查看可以用more命令\n-it: -i -t的组合\n-i: 即使没有附加也保持STDIN 打开\n-t: 分配一个伪终端")])]),s._v(" "),n("p",[n("img",{attrs:{src:a(289),alt:"image"}}),s._v("\n输入配置文件中的密码，解锁 Jenkins"),n("br")]),s._v(" "),n("h3",{attrs:{id:"下载插件"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#下载插件","aria-hidden":"true"}},[s._v("#")]),s._v(" 下载插件")]),s._v(" "),n("p",[n("br"),s._v("解锁后，来到了插件下载页面。先进入容器配置一下清华大学的Jenkins插件源后，再安装插件。所以先不要点。"),n("br"),s._v(" "),n("img",{attrs:{src:a(290),alt:"image"}}),n("br"),s._v(" "),n("br"),n("strong",[s._v("进入容器，查找  "),n("code",[s._v("default.json")]),s._v("  文件")]),s._v("，把镜像源替换进去，替换后退出容器终端")]),s._v(" "),n("div",{staticClass:"language-bash line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[s._v("docker "),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("exec")]),s._v(" -it jenkins /bin/bash\n"),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("find")]),s._v(" / -name "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'default.json'")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("sed")]),s._v(" -i "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'s/http:\\/\\/updates.jenkins-ci.org\\/download/https:\\/\\/mirrors.tuna.tsinghua.edu.cn\\/jenkins/g'")]),s._v(" /var/jenkins_home/updates/default.json "),n("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&&")]),s._v(" "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("sed")]),s._v(" -i "),n("span",{pre:!0,attrs:{class:"token string"}},[s._v("'s/http:\\/\\/www.google.com/https:\\/\\/www.baidu.com/g'")]),s._v(" /var/jenkins_home/updates/default.json\n"),n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("exit")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br")])]),n("p",[n("br"),s._v("然后重启容器，重新访问界面，解锁后安装推荐插件")]),s._v(" "),n("div",{staticClass:"language-bash line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[s._v("docker restart jenkins\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br")])]),n("h2",{attrs:{id:"_6-完成安装"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_6-完成安装","aria-hidden":"true"}},[s._v("#")]),s._v(" 6. 完成安装")]),s._v(" "),n("p",[n("br"),s._v("接下来一路按照提示配置，直到看到以下界面代表安装成功："),n("br"),s._v(" "),n("br"),n("img",{attrs:{src:a(291),alt:"image"}}),n("br")]),s._v(" "),n("h2",{attrs:{id:"_7-测试安装"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_7-测试安装","aria-hidden":"true"}},[s._v("#")]),s._v(" 7. 测试安装")]),s._v(" "),n("p",[n("br"),s._v("我们点击 Jenkins 首页 -> 左侧导航 -> 新建任务 -> 构建一个自由风格的软件项目"),n("br"),s._v(" "),n("br"),n("img",{attrs:{src:a(292),alt:"image"}}),n("br"),s._v(" "),n("br"),s._v("找到 "),n("code",[s._v("构建")]),s._v(" 一项，选择 “增加构建步骤”，选择 "),n("code",[s._v("执行Shell")]),s._v(" ，输入以下命令："),n("br"),s._v(" "),n("br"),s._v("此命令是去拉取一个nodejs稳定版镜像")]),s._v(" "),n("div",{staticClass:"language-bash line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[s._v("docker -v\ndocker pull node:latest\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br")])]),n("p",[n("img",{attrs:{src:a(293),alt:"image"}}),n("br"),s._v("保存后，我们点击左侧菜单的 “立即构建”，Jenkins就会开始构建。选择左侧历史记录第一项（最新的一项），点击控制台输出，查看构建日志。"),n("br"),s._v(" "),n("img",{attrs:{src:a(294),alt:"image"}}),n("br"),s._v(" "),n("br"),s._v("Jenkins构建任务为蓝色灯，代表构建成功。红色灯代表构建失败"),n("br"),s._v(" "),n("img",{attrs:{src:a(295),alt:"image"}})]),s._v(" "),n("h2",{attrs:{id:"_8-结束"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_8-结束","aria-hidden":"true"}},[s._v("#")]),s._v(" 8. 结束")]),s._v(" "),n("p",[n("br"),s._v("到这里，我们的Jenkins就代表安装完成了"),n("br")])])}),[],!1,null,null,null);e.default=t.exports}}]);