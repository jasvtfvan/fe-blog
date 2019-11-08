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
      {
        text: '工具',
        items: [
          { text: 'git和git-flow', link: '/server/tools/git/' },
        ]
      },
      {
        text: '系统',
        items: [
          { text: 'centOS', link: '/server/os/centos/mnt' },
        ]
      },
      {
        text: '部署',
        items: [
          { text: '常规部署', link: '/server/deploy/normal/' },
          { text: '持续集成', link: '/server/deploy/cicd/' },
          { text: 'gitlab搭建', link: '/server/deploy/gitlab/' },
        ]
      },
    ],
  },
];
