# node工具
* node官网: [https://nodejs.org/zh-cn/](https://nodejs.org/zh-cn/)
* node是后端运行javascript基础环境
* 与node直接相关的是npm，即`node`的`package manager`
```bash
node -v
```
>查看node版本

* **安装node之前，强力建议先安装nvm，详细介绍请看`nvm`**

## 1. npm
* node的包管理工具
```bash
npm -v
```
>查看npm版本
```bash
npm init -y
```
>初始化当前目录生成package<br>
>`-y`生成默认配置，不加`-y`需要选择package配置参数
```bash
npm list -g --depth=0
```
>查看所有已安装的包<br>
>`-g`查看全局，不加`-g`指向当前目录<br>
>`--depth=0`不显示整棵树，只显示第一层
```bash
npm install -g express
```
>安装express
```bash
npm uninstall -g express
```
>卸载express
```bash
npm show express
```
>显示express详情
```bash
npm update -g express
```
>升级express
```bash
npm update
```
>升级所有模块

## 2. nvm
* node版本管理工具，可以管理多个node版本 `node version management`
* nvm官方地址: [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)
* nvm安装，mac及linux，可根据官方说明安装，windows可参考其他网上方法
### 2.1 mac安装举例
* 以下两种命令，任意选择一个，可获取到资源即可
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```
```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```
>注意，该版本号为举例，请根据具体官方提供版本号进行安装
* `/etc/`目录下为全局文件，`~/`目录下为user文件，全局文件优先级更高
* 查看和修改配置，建议到`user`下完成
* `~/.bashrc`,`~/.profile`,`~/.zshrc`优先级如下图，其中`.zshrc`关联窗口
![shell-profile](./images/shell-profile.png)
* 查看`.zshrc`配置，修改`.bash_profile`
```bash
ls -a ~/
```
>查看`user`目录里包含上述哪些文件
```bash
cat ~/.zshrc
```
>source /Users/$USER/.bash_profile<br>
>说明真正的配置在`.bash_profile`中
* 将下边命令加入到`.bash_profile`中
```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```
* 如果未生效，重新开启命令窗口
### 2.2 常用命令
```bash
nvm --version
```
>查看nvm版本
```bash
nvm ls
```
>列出所有已经安装的node版本
```bash
nvm current
```
>当前node版本
```bash
nvm use v12.13.0
```
>切换node的版本
```bash
nvm ls-remote
```
>列出所有可以安装的node版本号
```bash
nvm install v12.13.0
```
>安装指定版本号的node
```bash
nvm uninstall v12.13.0
```
>卸载指定版本号的node

## nrm
## nodemon
## pm2
## yarn
