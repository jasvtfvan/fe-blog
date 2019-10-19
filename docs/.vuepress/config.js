module.exports = {
  title: 'jasvtfvan前端博客',
  description: '欢迎来到我的前端工厂',
  base: '/fe-blog/',
  head: [
    ['link', { rel: 'icon', href: '/github.ico' }]
  ],
  markdown: {
    lineNumbers: true
  },
  plugins: ['@vuepress/plugin-back-to-top'],
  themeConfig: {
    nav: require('./nav'),
    sidebar: require('./sidebar'),
    sidebarDepth: 2,
    lastUpdated: 'Last Updated',
    searchMaxSuggestions: 10,
    serviceWorker: {
      updatePopup: {
        message: "有新的内容.",
        buttonText: '更新'
      }
    },
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页 ！',
  }
}
