module.exports = {
  title: 'jasvtfvan博客',
  description: '欢迎来到我的前端小屋',
  base: '/fe-blog/',
  head: [
    ['link', { rel: 'icon', href: '/github.ico' }]
  ],
  markdown: {
    lineNumbers: true
  },
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
