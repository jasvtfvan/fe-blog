# Ansible + Jenkins + Nexus

* 使用 Ansible 在多台机器部署制品


<br />在部署之前，我们先将之前制作的测试 `Ansible` 镜像删除掉，重新制作一个新镜像。是用 `docker rm` 和 `docker rmi` 命令删除容器和镜像。
```bash
docker rm -f ansible
docker rmi -f ansible:t1
```


## 书写 Playbook

<br />在上一张我们讲到， `Playbook` 是 `Ansible` 的任务集，是定义 `Ansible` 任务的配置文件。我们用 `Ansible` 批量执行多条任务，当然离不开 `Playbook` 。<br />
<br />我们编写以下 `Playbook` ：
```bash
vim playbook.yml
```
> yum install vim -y

```yaml
---
- hosts: all
  remote_user: root
  vars:
    timestamp: 20200625233149
  tasks:
    - name: docker pull new images
      shell: 'chdir=~ docker pull 172.16.81.150:8082/fe/nginx-fe-{{timestamp}}'
    - name: docker rmf
      shell: 'chdir=~ docker ps | grep jenkins-test && docker rm -f jenkins-test'
      ignore_errors: true
    - name: docker run
      shell: 'chdir=~ docker run -p 80:80 -itd --name jenkins-test 172.16.81.150:8082/fe/nginx-fe-{{timestamp}}'
```
> ignore_errors: 忽略错误继续执行


<br />这里声明了三个任务:  **拉取镜像 => 删除正在运行的Nginx容器 => 运行新镜像** 。<br />
<br />同时修改 `Dockerfile` ，让其构建 `Ansible` 镜像时，也能将 `playbook.yml` 复制进去：
```py
FROM centos:7
RUN yum -y install wget curl vim openssh-clients
RUN wget -O /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-7.repo
RUN yum clean all
RUN yum makecache
# 拷贝公钥私钥进镜像内
COPY ssh /root/.ssh/
# 公钥私钥赋权
RUN chmod 755 ~/.ssh/
RUN chmod 600 ~/.ssh/id_rsa ~/.ssh/id_rsa.pub
RUN yum -y install ansible
# 拷贝主机组进ansible目录
COPY hosts /etc/ansible/
# 关闭known_hosts校验
RUN sed -i 's/^#host_key_checking = False/host_key_checking = False/' /etc/ansible/ansible.cfg
RUN ansible --version
# 拷贝playbook进镜像内
COPY playbook.yml /root/
```



## 生成新镜像

<br />使用 `docker build` 命令即可生成：
```bash
docker build -t ansible:t1 .
```


## 修改任务执行

<br />替换 `Jenkins` 脚本内关于远程对制品库执行的命令：<br />

```bash
set -e
timestamp=`date '+%Y%m%d%H%M%S'`

node -v
npm -v

npm install -g cnpm --registry=https://registry.npm.taobao.org

rm -rf node_modules/
rm -rf dist/

cnpm install

npm run build

(docker ps | grep ansible) && (docker rm -f ansible)

docker build -t 172.16.81.150:8082/fe/nginx-fe-$timestamp .
docker push 172.16.81.150:8082/fe/nginx-fe-$timestamp

docker run -id --name ansible ansible:t1

# 检查playbook语法
docker exec -i ansible ansible-playbook --syntax-check /root/playbook.yml
# playbook执行
docker exec -i ansible ansible-playbook -e "timestamp=$timestamp" /root/playbook.yml 

docker rm -f ansible
```



--------------------------
## 特别声明
**该CI/CD系列出自 《珠峰训练营CI/CD教练员 王圣松》** <br/>
如转载请注明《珠峰培训+王圣松联合版权》。<br/>
王圣松，00后程序员，文档撰写期间，他就职于开源中国。
