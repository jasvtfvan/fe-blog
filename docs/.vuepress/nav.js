module.exports = [
  {
    text: '首页', link: '/'
  },
  {
    text: 'javascript',
    items: [
      { text: '柯里化', link: '/javascript/curring/' },
      { text: '反柯里化', link: '/javascript/uncurring/' },
      { text: 'promise', link: '/javascript/promise/' },
    ]
  },
  {
    text: '服务器',
    items: [
      { text: '常规部署', link: '/server/normal/' },
      { text: '持续集成', link: '/server/cicd/' }
    ]
  },
  {
    text: '主流框架',
    items: [
      {
        text: 'vue2',
        items: [
          { text: '核心源码', link: '/frame/vue2/coreSrcCode' },
          { text: '核心概念特性', link: '/frame/vue2/base' },
          { text: '核心应用', link: '/frame/vue2/2.base' },
          { text: '组件应用', link: '/frame/vue2/3.component' },
        ],
      },
      {
        text: 'react',
        items: [],
      }
    ],
  },
  {
    text: '工具箱',
    items: [
      {
        text: '在线编辑',
        items: [
          { text: '图片压缩', link: 'https://tinypng.com/' }
        ]
      },
      {
        text: '在线服务',
        items: [
          { text: '阿里云', link: 'https://www.aliyun.com/' },
          { text: '腾讯云', link: 'https://cloud.tencent.com/' }
        ]
      },
      {
        text: '博客指南',
        items: [
          { text: '掘金', link: 'https://juejin.im/' },
          { text: 'CSDN', link: 'https://blog.csdn.net/' }
        ]
      }
    ]
  },
  { text: 'github', link: 'https://github.com/jasvtfvan/fe-blog' }
];
