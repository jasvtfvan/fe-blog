module.exports = [
  {
    text: '首页', link: '/'
  },
  {
    text: 'javascript',
    items: [
      { text: '正则表达式', link: '/javascript/regexp/' },
      { text: '基础集锦', link: '/javascript/highlights/' },
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
          { text: 'react15源码', link: '/frame/react15/source/native' },
          { text: 'react16源码', link: '/frame/react16/source/fiber' },
        ],
      }
    ],
  },
  {
    text: '工具环境',
    items: [
      {
        text: '工具',
        items: [
          { text: 'git/git-flow', link: '/enviroment/tools/git/' },
          { text: 'node工具', link: '/enviroment/tools/node/' },
        ]
      },
      {
        text: '系统',
        items: [
          { text: 'centOS', link: '/enviroment/os/centos/mnt' },
          { text: 'linux常用命令', link: '/enviroment/os/centos/cmd' },
        ]
      },
      {
        text: '部署',
        items: [
          { text: '常规部署', link: '/enviroment/deploy/normal/' },
          { text: 'CI/CD持续集成', link: '/enviroment/deploy/cicd/' },
          { text: 'gitlab搭建', link: '/enviroment/deploy/gitlab/' },
          { text: 'docker常用容器', link: '/enviroment/deploy/docker/' },
        ]
      },
    ],
  },
];
