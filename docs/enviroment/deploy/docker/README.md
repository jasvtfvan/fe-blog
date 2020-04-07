# Docker常用容器

## nginx
### 创建目录
```
mkdir -p /data/nginx/{config,logs,data}
```
### 配置文件
```
user  nginx;
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;

    server{
      listen  8090;
      server_name 0.0.0.0:8090;
      location / {
        root /var/opt/nginx/web_dist;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
      }
    }

    server{
      listen  80;
      server_name 0.0.0.0:80;
      location / {
        root /var/opt/nginx;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
      }
    }
}
```
### data目录
/data/nginx/data/{index.html,web_dist,www,mobile}
### 前端打包方式
* 路由使用绝对路径
**web_dist** 项目
(需要配置 8090 这样的端口)
* 路由使用相对路径
publicPath: './' （或 publicPath: ''）
**www** 项目 和 **mobile** 项目
### docker 启动命令
```
docker run --restart=always \
  -d --name nginx \
  -p 80:80 \
  -p 8090:8090 \
  -v /Users/jasvtfvan/Documents/data/nginx/config/nginx.conf:/etc/nginx/nginx.conf:ro \
  -v /Users/jasvtfvan/Documents/data/nginx/logs:/var/log/nginx \
  -v /Users/jasvtfvan/Documents/data/nginx/data:/var/opt/nginx \
  nginx:1.14.2
```
### 访问地址
> 访问地址需要使用ip 
1. http://192.168.3.2 => nginx首页
2. http://192.168.3.2:8090 => web_dist项目
3. http://192.168.3.2/www => www项目
4. http://192.168.3.2/mobile => mobile项目

*************************

## gitlab
### 创建目录
```
mkdir -p /data/gitlabzh/{config,logs,data}
```
gitlab(8080 used by docker, cannot use 8080):

### 拉取镜像
***运行时发现本地没有镜像，自动拉取官网镜像***
* 官网英文镜像
docker pull gitlab/gitlab-ce:latest
* 社区中文镜像
docker pull beginor/gitlab-ce:11.3.0-ce.0

### 初始化gitlab容器 (chinese):
```
sudo docker run --restart=always \
  --detach \
  --publish 443:443 \
  --publish 222:22 \
  --publish 8090:80 \
  --name gitlabzh \
  --restart always \
  --volume /data/gitlabzh/config:/etc/gitlabzh \
  --volume /data/gitlabzh/logs:/var/log/gitlabzh \
  --volume /data/gitlabzh/data:/var/opt/gitlabzh \
  beginor/gitlab-ce:11.3.0-ce.0
```

### 初始化gitlab容器 (english):
```
sudo docker run --restart=always \
  --detach \
  --publish 8443:443 \
  --publish 8222:22 \
  --publish 8089:80 \
  --name gitlab \
  --restart always \
  -v /data/gitlab/config:/etc/gitlab \
  --volume /data/gitlab/logs:/var/log/gitlab \
  --volume /data/gitlab/data:/var/opt/gitlab \
  gitlab/gitlab-ce:latest
```

### 首次加载
首次加载需要等待初始化，因此首次开启gitlab页面很慢，请耐心等待

*********************************

## redis
### 创建目录
```
mkdir -p /data/redis/{conf,data}
```

### redis配置文件
默认情况不需要，如果需要编辑配置文件

### 初始化redis容器
```
sudo docker run --restart=always \
  -d --name redis \
  -p 6379:6379 \
  -v /data/redis/data:/var/opt/redis \
 -v /data/redis/config/redis.conf:/etc/redis/redis.conf:ro \
  redis redis-server --appendonly yes
```

### 测试redis
```
docker exec -it redis redis-cli -h localhost -p 6379

select 1

keys *
```

*********************************

## mongo
### 创建目录
```
mkdir -p /data/mongo/data
```

### 初始化运行容器
```
sudo docker run --restart=always \
  -d --name mongo \
  -p 27017:27017 \
  -v /data/mongo/data:/var/opt/mongo \
  mongo
```

### 测试mongo
```
docker exec -it mongo mongo admin
show dbs
use local
show collections
db.startup_log.find()
```

*********************************

