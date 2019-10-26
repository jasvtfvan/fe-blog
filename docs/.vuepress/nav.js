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
    text: '主流框架',
    items: [
      {
        text: 'vue2',
        items: [
          { text: '框架源码', link: '/frame/vue2/source/observer' },
          { text: '框架应用', link: '/frame/vue2/application/base' },
        ],
      },
      {
        text: 'react',
        items: [
          { text: '图片压缩', link: 'https://tinypng.com/' }
        ],
      }
    ],
  },
  {
    text: '服务器',
    items: [
      { text: '常规部署', link: '/server/normal/' },
      { text: '持续集成', link: '/server/cicd/' },
      { text: 'gitlab搭建', link: '/server/gitlab/' },
    ]
  },
  {
    text: '系统工具',
    items: [
      { text: 'Git', link: '/tools/git/' },
    ],
  },
  {
    text: '外部工具',
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
