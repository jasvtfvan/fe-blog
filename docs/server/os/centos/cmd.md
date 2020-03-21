# linux常用命令

## 文件操作
* 查看文件夹内文件名及文件状态(绿色为可读写)
ls
* 查看文件内容
cat fileName
* 过滤掉`#`查看文件内容
cat fileName | grep -v '#'
* 删除文件
rm repurchase-0.0.1.jar
(yes)
* 给jar包文件授权，读写权限
chmod 777 -R repurchase-0.0.1.jar
* vim快速搜索，光标向下寻找
/someWord
* vim快速搜索，光标向上寻找
?someWord
* 移动文件
mv /home/user/aaa.jar /home/java/aaa.jar
* 备份文件
cp /etc/redis/6379.conf /etc/redis/6379_bk.conf
* 强制删除文件或文件夹
rm -rf someFileOrFolder
* 查看硬盘空间
df -h
* 查看当前目录，哪个文件占用空间最大
du -h --max-depth=1
* 查看当前目录，各文件及文件夹占用大小
du -sh *
* 删除当前文件夹所有文件
rm -rf *

## 进程操作
* 杀掉进程
kill -9 pid (netstat -apn | grep 8081可以获取pid)
* 运行jar包
java -Dfile.encoding=utf-8 -jar repurchase-0.0.1.jar
* 后台启动jar包（客户端关闭后，jar包程序继续运行）
nohup java -Dfile.encoding=utf-8 -jar repurchase-0.0.1.jar >/dev/null 2>&1 &
* 启动redis客户端
redis-cli -h 127.0.0.1 -p 6379 -a somepassword
* 停止6379端口的redis
service redis_6379 stop (redis-cli -a somepassword shutdown)
* 查看登录用户信息
w (who)
* 强制踢出用户
pkill -kill -t pts/2
* 查看cpu和内存占用情况
top
* 查看剩余内存
free -m

## 通信操作
* 查看端口是否启动
netstat -apn | grep 8081
* 重启ftp
systemctl restart vsftpd
* 查看redis状态
ps -ef | grep redis
* 查看防火墙状态
firewall-cmd --state
* 开放公共端口
firewall-cmd --zone=public --add-port=8080/tcp --permanent
* 关闭公共端口
firewall-cmd --zone=public --remove-port=8080/tcp --permanent
* 指定ip开放端口段
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source 
address="192.168.142.166" port protocol="tcp" port="30000-31000" accept"
* 指定ip关闭端口段
firewall-cmd --permanent --remove-rich-rule="rule family="ipv4" source 
address="192.168.142.166" port protocol="tcp" port="30000-31000" accept"
* 重启防火墙
firewall-cmd --reload
