# centOS 7 挂载硬盘

## Linux磁盘分区主要分为以下六步骤
* 1,检查可用磁盘
* 2,分区
* 3,内核读取新的分区表
* 4,创建文件系统
* 5,挂载
* 6,检查

## 配置实例
分区前提:有一个块空的磁盘或者一块磁盘中有多余的容量

## 1,检查可用磁盘
我有一块新的磁盘/dev/sdb<br>
fdisk -l
```py
[root@localhost ~]# fdisk -l

<省略部分输出>

Disk /dev/sdb: 214.7 GB, 214748364800 bytes, 419430400 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk label type: dos
Disk identifier: 0x000e577a

Device Boot Start End Blocks Id System

<省略部分输出>

```

## 2,给/dev/sdb这块硬盘创建一个主分区
fdisk /dev/sdb，常用分区命令简介
* m:显示帮助
* p:显示该硬盘下的分区
* n:创建一个分区;p表示主分区，e表示扩展分区
* d:删除一个分区
* t:修改分区类型
* w:保存退出
```py
[root@localhost ~]# fdisk /dev/sdb

//创建一个分区
Command (m for help): n Partition type:
   p   primary (0 primary, 0 extended, 4 free)
   e   extended

//创建住分区
Select (default p): p

//设置分区编号，只支持4个主分区
Partition number (1-4, default 1): 1

//设置其实扇区编号，直接回⻋，默认从2048开始，一个扇区占512个字节
First sector (2048-419430399, default 2048):
Using default value 2048

//设置分区大小100G（直接回撤默认全部 214.7 GB）
Last sector, +sectors or +size{K,M,G} (2048-419430399, default 419430399): +100G
Partition 1 of type Linux and of size 100 GiB is set

//查看创建好的分区，此时的分区表仅仅是显示，只有保存才会真正写入 Command (m for help): p

Disk /dev/sdb: 214.7 GB, 214748364800 bytes, 419430400 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk label type: dos
Disk identifier: 0x000e577a

Device Boot    Start   End         Blocks      Id  System
/dev/sdb1      2048    209717247   104857600   83  Linux

//保存退出
Command (m for help): w
The partition table has been altered!
 
Calling ioctl() to re-read partition table.
Syncing disks.

不放心的话，你也可以在fdisk /dev/sdb，进去用p在看下
```
**重要:/dev/sdb1是/dev/sdb这块硬盘的第一个分区哦!**

## 3,将硬盘的分区表写进内核
```py
[root@localhost ~]# partprobe /dev/sdb
```

## 4,创建文件系统
文件系统类型比较多，我这里使用的是xfs文件系统，不同的文件系统有不同的特点。
```py
[root@localhost ~]# mkfs.xfs /dev/sdb1
meta-data=/dev/sdb1        isize=256     agcount=4, agsize=6553600 blks
         =                 sectsz=512    attr=2, projid32bit=1
         =                 crc=0         finobt=0
data     =                 bsize=4096    blocks=26214400, imaxpct=25
         =                 sunit=0       swidth=0 blks
naming   =version 2        bsize=4096    ascii-ci=0 ftype=0
log      =internal log     bsize=4096    blocks=12800, version=2
         =                 sectsz=512    sunit=0 blks, lazy-count=1
realtime =none             extsz=4096    blocks=0, rtextents=0
```

## 5,挂载
所谓挂载，其实就是把这个分区和一个目录做关联，往这个目录里面写数据，就是往这个分区中写数据<br>
硬盘的挂载，最好是永久挂载，所以设置/etc/fstab
```py
//创建一个目录，把/dev/sdb1挂载到/lewis中
[root@localhost ~]# mkdir /lewis

//编辑/etc/fstab
[root@localhost ~]# vim /etc/fstab

//增加如下内容
/dev/sdb1     /lewis    xfs    defaults    0 0

//让系统重新读取一下/etc/fstab
[root@localhost ~]# mount -a
```

## 6,检查
```py
[root@localhost ~]# df -h
Filesystem               Size  Used Avail Use% Mounted on
/dev/mapper/centos-root   50G  8.3G   42G  17% /
devtmpfs                 7.8G     0  7.8G   0% /dev
tmpfs                    7.8G     0  7.8G   0% /dev/shm
tmpfs                    7.8G  8.9M  7.8G   1% /run
tmpfs                    7.8G     0  7.8G   0% /sys/fs/cgroup
/dev/sda1                497M  127M  370M  26% /boot
/dev/mapper/centos-home  142G  7.8G  134G   6% /home
tmpfs                    1.6G     0  1.6G   0% /run/user/0
/dev/sdb1                100G   33M  100G   1% /lewis      //看到这边已经挂载成功了
```

<br>

## 视频链接
[https://www.bilibili.com/video/BV1kv411V78Y?spm_id_from=333.337.top_right_bar_window_history.content.click](https://www.bilibili.com/video/BV1kv411V78Y?spm_id_from=333.337.top_right_bar_window_history.content.click)

--------------------------
## 特别声明
版权所属《B站UP主 刘贝斯》，如转载请注明《B站UP主 刘贝斯》。<br/>
