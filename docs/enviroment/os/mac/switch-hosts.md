# SwitchHosts

## SwitchHosts
SwitchHosts 是一个管理、切换多个 hosts 方案的工具。
它是一个免费开源软件。
* 官方介绍
[https://swh.app/zh/](https://swh.app/zh/)
* github主页地址
[https://github.com/oldj/SwitchHosts](https://github.com/oldj/SwitchHosts)
* github下载地址
[https://github.com/oldj/SwitchHosts/releases](https://github.com/oldj/SwitchHosts/releases)


## GitHub520
一个让国内访问github的加速神器

### GitHub520配置
```
# GitHub520 Host Start
140.82.114.25                 alive.github.com
140.82.113.25                 live.github.com
185.199.108.154               github.githubassets.com
140.82.113.21                 central.github.com
185.199.108.133               desktop.githubusercontent.com
185.199.108.153               assets-cdn.github.com
185.199.108.133               camo.githubusercontent.com
185.199.108.133               github.map.fastly.net
199.232.69.194                github.global.ssl.fastly.net
140.82.113.4                  gist.github.com
185.199.111.153               github.io
140.82.113.4                  github.com
192.0.66.2                    github.blog
140.82.112.5                  api.github.com
185.199.108.133               raw.githubusercontent.com
185.199.108.133               user-images.githubusercontent.com
185.199.108.133               favicons.githubusercontent.com
185.199.108.133               avatars5.githubusercontent.com
185.199.108.133               avatars4.githubusercontent.com
185.199.108.133               avatars3.githubusercontent.com
185.199.108.133               avatars2.githubusercontent.com
185.199.108.133               avatars1.githubusercontent.com
185.199.108.133               avatars0.githubusercontent.com
185.199.108.133               avatars.githubusercontent.com
140.82.113.10                 codeload.github.com
52.216.139.219                github-cloud.s3.amazonaws.com
52.216.107.20                 github-com.s3.amazonaws.com
52.217.64.220                 github-production-release-asset-2e65be.s3.amazonaws.com
52.217.133.241                github-production-user-asset-6210df.s3.amazonaws.com
52.216.244.140                github-production-repository-file-5c1aeb.s3.amazonaws.com
185.199.108.153               githubstatus.com
64.71.144.202                 github.community
23.100.27.125                 github.dev
185.199.108.133               media.githubusercontent.com


# Update time: 2021-12-06T02:05:29+08:00
# Update url: https://raw.hellogithub.com/hosts
# Star me: https://github.com/521xueweihan/GitHub520
# GitHub520 Host End
```

### GitHub520简单原理
将上述配置复制到`hosts`文件中，可以加速访问github

## 系统Hosts
系统模版`hosts`
```
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1	localhost
255.255.255.255	broadcasthost
::1             localhost
# Added by Docker Desktop
# To allow the same kube context to work on the host and the container:
127.0.0.1 kubernetes.docker.internal
# End of section
```

## 综合使用
* 1，下载安装`SwitchHosts`
* 2，创建`系统Hosts`，选择*本地*，粘贴系统默认配置（该步骤必须有，否则新生成的`hosts`文件会覆盖系统文件，导致丢失默认配置）
* 3，创建`GitHub520`，选择*远程*，URL输入`https://cdn.jsdelivr.net/gh/521xueweihan/GitHub520@main/hosts`，选择刷新时间（比如1小时）

