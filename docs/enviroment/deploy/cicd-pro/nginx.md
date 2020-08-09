# Docker Nginx
为了部署前端资源文件，我们另外启动一台服务器安装 Nginx。在Nginx之前，先安装 `Docker`

## 安装 Docker
参考《Docker》

## 安装Nginx
### 1. 拉取镜像
这里的Nginx我们直接使用docker安装即可：
```bash
docker pull nginx
```
接着启动一个 `Nginx` 容器，将配置文件，资源文件，日志文件挂载到宿主机的 `/home/nginx`

### 2. 创建目录
```bash
mkdir -p /home/nginx/{html,logs,conf.d}
```

### 3. 配置文件
*如果不修改配置文件，可以忽略配置文件的步骤*
* 创建根配置文件（只读）
```bash
touch /home/nginx/nginx.conf
```
```
user  nginx;
worker_processes  1;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
```
* 创建默认配置文件
```bash
touch /home/nginx/conf.d/default.conf
```
```
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
```

### 4. 创建页面
* 创建欢迎页面
```bash
touch /home/nginx/html/index.html
```
```
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

* 创建50x页面
```bash
touch /home/nginx/html/50x.html
```
```
<!DOCTYPE html>
<html>
<head>
<title>Error</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>An error occurred.</h1>
<p>Sorry, the page you are looking for is currently unavailable.<br/>
Please try again later.</p>
<p>If you are the system administrator of this resource then you should check
the error log for details.</p>
<p><em>Faithfully yours, nginx.</em></p>
</body>
</html>
```

### 5. 启动容器
* 不加配置文件启动
```bash
docker run -d -p 80:80 --name nginx \
  -v /home/nginx/html:/usr/share/nginx/html \
  -v /home/nginx/logs:/var/log/nginx \
  --restart always \
  nginx
```
* 加配置文件启动（第3步为前提）
```bash
docker run -d -p 80:80 --name nginx \
  -v /home/nginx/html:/usr/share/nginx/html \
  -v /home/nginx/logs:/var/log/nginx \
  -v /home/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
  -v /home/nginx/conf.d:/etc/nginx/conf.d \
  --restart always \
  nginx
```
>`ro`代表只读，默认不写等价于`rw`(读写)

* 进入docker容器参考命令
```bash
docker exec -it nginx /bin/bash
```
