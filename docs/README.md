---
home: true
heroImage: /github.png
actionText: 工厂起步 →
actionLink: /guide/
features:
- title: 免责声明
  details: 本项目旨在学习前端架构知识，不可用于商业和个人其他意图。
- title: 内容描述
  details: 核心知识来自对《珠峰前端架构课》的学习和理解，属于学习笔记类内容。
- title: 强烈呼吁
  details: 保护《珠峰培训》的知识产权，营造更优质的学习环境。
- title: 工具使用
  details: 利用VuePress进行构建，基于markdown为中心的项目结构
footer: MIT Licensed | Copyright © 2019-present Jasvt Fvan
---

# VuePress起步
* 起步就像数 1, 2, 3 一样容易
```js
# 安装
yarn global add vuepress # 或 npm install -g vuepress

# 创建一个 markdown 文件
echo '# Hello VuePress' > README.md

# 开始编写
vuepress dev

# 构建为静态文件
vuepress build
```

::: warning
兼容性注意事项

VuePress 要求 Node.js >= 8。
:::
