module.exports = [
  {
    text: '首页', link: '/'
  },
  {
    text: 'javascript',
    items: [
      { text: '精彩集锦', link: '/javascript/highlights/' },
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
      { text: 'centOS', link: '/server/centos/mnt' },
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
    text: '友情链接',
    items: [
      { text: '涛神微前端', link: 'https://github.com/YataoZhang/my-single-spa/issues/4' },
    ]
  },
];
