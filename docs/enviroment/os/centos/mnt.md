# centOS 7 挂载硬盘
## 1. ECS管理控制台操作
点击实例，点击硬盘，进入云盘页面，挂载扩展的`数据盘`
## 2. 查看磁盘分区
```bash
df -h
```
```py
文件系统        容量  已用  可用 已用% 挂载点
devtmpfs        1.8G     0  1.8G    0% /dev
tmpfs           1.8G     0  1.8G    0% /dev/shm
tmpfs           1.8G  492K  1.8G    1% /run
tmpfs           1.8G     0  1.8G    0% /sys/fs/cgroup
/dev/vda1        20G  2.6G   17G   14% /
tmpfs           361M     0  361M    0% /run/user/0
```
>发现有40G硬盘没有挂载
## 3. 查看数据盘情况
```bash
fdisk -l
```
```py
磁盘 /dev/vda：21.5 GB, 21474836480 字节，41943040 个扇区
Units = 扇区 of 1 * 512 = 512 bytes
扇区大小(逻辑/物理)：512 字节 / 512 字节
I/O 大小(最小/最佳)：512 字节 / 512 字节
磁盘标签类型：dos
磁盘标识符：0x000bxxx9

   设备 Boot      Start         End      Blocks   Id  System
/dev/vda1   *        2048    41943039    20970496   83  Linux

磁盘 /dev/vdb：42.9 GB, 42949672960 字节，83886080 个扇区
Units = 扇区 of 1 * 512 = 512 bytes
扇区大小(逻辑/物理)：512 字节 / 512 字节
I/O 大小(最小/最佳)：512 字节 / 512 字节
```
>系统盘: `/dev/vda` 20G左右<br>
>数据盘: `/dev/vdb` 40G左右，尚未挂载的<br>
## 4. 创建一个单分区的数据盘
```bash
fdisk /dev/vdb
```
```py {9,13,14,15,17,21}
欢迎使用 fdisk (util-linux 2.23.2)。

更改将停留在内存中，直到您决定将更改写入磁盘。
使用写入命令前请三思。

Device does not contain a recognized partition table
使用磁盘标识符 0x3bxxxx78 创建新的 DOS 磁盘标签。

命令(输入 m 获取帮助)：n
Partition type:
   p   primary (0 primary, 0 extended, 4 free)
   e   extended
Select (default p): p
分区号 (1-4，默认 1)：1
起始 扇区 (2048-83886079，默认为 2048)：
将使用默认值 2048
Last 扇区, +扇区 or +size{K,M,G} (2048-83886079，默认为 83886079)：
将使用默认值 83886079
分区 1 已设置为 Linux 类型，大小设为 40 GiB

命令(输入 m 获取帮助)：wq
The partition table has been altered!

Calling ioctl() to re-read partition table.
正在同步磁盘。
```
>1. 输入 n 并按回车键：创建一个新分区<br>
>2. 输入 p 并按回车键：选择主分区。因为创建的是一个单分区数据盘，所以只需要创建主分区<br>
>>如果要创建4个以上的分区，您应该创建至少一个扩展分区，即选择 e<br>
>3. 输入 1 并按回车键：分区编号，因为这里仅创建一个分区，可以输入 1<br>
>4. 按回车键：采用默认值，`2048`作为第一个可用的扇区编号<br>
>5. 按回车键：采用默认值，`83886079`作为第一个可用的扇区编号<br>
>6. 输入 wq 并按回车键，开始分区<br>
## 5. 查看新的分区
```bash
fdisk -l
```
```py {15,16,18,19}
磁盘 /dev/vda：21.5 GB, 21474836480 字节，41943040 个扇区
Units = 扇区 of 1 * 512 = 512 bytes
扇区大小(逻辑/物理)：512 字节 / 512 字节
I/O 大小(最小/最佳)：512 字节 / 512 字节
磁盘标签类型：dos
磁盘标识符：0x000bxxx9

   设备 Boot      Start         End      Blocks   Id  System
/dev/vda1   *        2048    41943039    20970496   83  Linux

磁盘 /dev/vdb：42.9 GB, 42949672960 字节，83886080 个扇区
Units = 扇区 of 1 * 512 = 512 bytes
扇区大小(逻辑/物理)：512 字节 / 512 字节
I/O 大小(最小/最佳)：512 字节 / 512 字节
磁盘标签类型：dos
磁盘标识符：0x3bxxxx78

   设备 Boot      Start         End      Blocks   Id  System
/dev/vdb1            2048    83886079    41942016   83  Linux
```
>发现高亮的行，说明新分区创建成功
## 6. 新分区创建文件系统
* 挂载硬盘，一般采用`ext`系列文件系统
* 挂载U盘，一般采用`fat`系列文件系统
```bash
mkfs.ext4 /dev/vdb1
```
```py
mke2fs 1.42.9 (28-Dec-2013)
文件系统标签=
OS type: Linux
块大小=4096 (log=2)
分块大小=4096 (log=2)
Stride=0 blocks, Stripe width=0 blocks
2621440 inodes, 10485504 blocks
524275 blocks (5.00%) reserved for the super user
第一个数据块=0
Maximum filesystem blocks=2157969408
320 block groups
32768 blocks per group, 32768 fragments per group
8192 inodes per group
Superblock backups stored on blocks: 
	32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208, 
	4096000, 7962624

Allocating group tables: 完成                            
正在写入inode表: 完成                            
Creating journal (32768 blocks): 完成
Writing superblocks and filesystem accounting information: 完成 
```
## 7. 备份目录树配置文件
* 磁盘Linux分区，必须挂载到目录树中的，某个具体的目录上，才能进行读写操作
### 7.1 查看目录树配置
```bash
cat /etc/fstab | grep -v ^# | grep -v ^$
```
> | grep -v ^# | grep -v ^$ 隐藏以'#'开头的行，隐藏空行
```py
UUID=11xxxx9e-2xx9-4xx0-bxx3-d77xxxxxx397 /    ext4    defaults    1 1
```
### 7.2 备份目录树配置
```bash
cp /etc/fstab /etc/fstab.bak
```
## 8. 写入新分区信息
```bash
echo '/dev/vdb1  /mnt ext4    defaults    0  0' >> /etc/fstab
cat /etc/fstab.bak | grep -v ^# | grep -v ^$
```
```py
UUID=11xxxx9e-2xx9-4xx0-bxx3-d77xxxxxx397 /    ext4    defaults    1 1
/dev/vdb1  /mnt ext4    defaults    0  0
```
## 9. 挂载目录
### 9.1 创建挂载目录
```bash
mkdir /mnt/data
```
### 9.2 挂载新硬盘
```bash
mount /dev/vdb1 /mnt/data
```
## 10. 查看磁盘分区
```bash
df -h
```
```py
文件系统        容量  已用  可用 已用% 挂载点
devtmpfs        1.8G     0  1.8G    0% /dev
tmpfs           1.8G     0  1.8G    0% /dev/shm
tmpfs           1.8G  496K  1.8G    1% /run
tmpfs           1.8G     0  1.8G    0% /sys/fs/cgroup
/dev/vda1        20G  2.6G   17G   14% /
tmpfs           361M     0  361M    0% /run/user/0
/dev/vdb1        40G   49M   38G    1% /mnt/data
```
>发现有40G硬盘已经挂载
## 参考文章
[https://my.oschina.net/hleva/blog/2246806](https://my.oschina.net/hleva/blog/2246806)
