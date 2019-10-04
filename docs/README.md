---
home: true
heroImage: /github.png
actionText: 起步 →
actionLink: /guide/
features:
- title: 简明优先
  details: 对以 markdown 为中心的项目结构，做最简化的配置，帮助你专注于创作。
- title: Vue 驱动
  details: 享用 Vue + webpack 开发环境，在 markdown 中使用 Vue 组件，并通过 Vue 开发自定义主题。
- title: 性能高效
  details: VuePress 将每个页面生成为预渲染的静态 HTML，每个页面加载之后，然后作为单页面应用程序(SPA)运行。
footer: MIT Licensed | Copyright © 2019-present Jasvt Fvan
---

# 起步就像数 1, 2, 3 一样容易
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
