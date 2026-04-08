import { defineConfig } from 'vitepress';

export default defineConfig({
  title: '风不识途',
  description: '成长轨迹：技术、副业、效能与认知升级，记录点滴成长',
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '💻 技术实验室', link: '/tech-lab/' },
      { text: '💰 副业观察室', link: '/side-hustle/' },
      { text: '🚀 面试通关SOP', link: '/career-path/' },
      { text: '⚡ 效能黑客', link: '/productivity/' },
      { text: '🧠 认知升级', link: '/mindset/' }
    ],
    
    sidebar: {
      '/tech-lab/': [
        {
          text: '💻 技术实验室',
          collapsible: true,
          collapsed: false,
          items: [
            {
              text: '工程化/DevOps',
              collapsible: true,
              collapsed: false,
              items: [
                { text: 'GitHub Actions 实现博客自动化部署', link: '/tech-lab/devops/github-actions-deploy' }
              ]
            },
            {
              text: '组件库和HOOKS',
              collapsible: true,
              collapsed: false,
              items: [
                {
                  text: '组件',
                  collapsible: true,
                  collapsed: false,
                  items: [
                    { text: 'UploadPro 上传 (在线预览)', link: '/components/upload-pro' },
                    { text: 'Button 按钮 (在线预览)', link: '/components/button' },
                    { text: 'StatusBadge 状态徽章', link: '/components/status-badge' },
                    { text: 'NavMenu 导航菜单', link: '/components/nav-menu' }
                  ]
                },
                {
                  text: 'Hooks',
                  collapsible: true,
                  collapsed: false,
                  items: [
                    { text: 'useToggle (Vue)', link: '/hooks/vue/use-toggle' },
                    { text: 'useInteract (Vue)', link: '/hooks/vue/use-interact' },
                    { text: 'useLocalStorage (React)', link: '/hooks/react/use-local-storage' }
                  ]
                }
              ]
            },
            {
              text: '框架与踩坑',
              collapsible: true,
              collapsed: false,
              items: [
                { text: 'Vite HMR 失效', link: '/posts/技术难点/vite-hmr-failed' },
                { text: 'React Hydration 错误', link: '/posts/踩坑记录/react-hydration-error' }
              ]
            }
          ]
        }
      ],
      '/side-hustle/': [
        {
          text: '💰 副业观察室',
          collapsible: true,
          collapsed: false,
          items: [
            { text: '淘宝', link: '/side-hustle/taobao' },
            { text: 'Web3', link: '/side-hustle/web3' },
            { text: '商业逻辑', link: '/side-hustle/business-logic' },
            {
              text: 'IBKR美股投资',
              collapsible: true,
              collapsed: true,
              items: [
                { text: '入金IBKR磨损记录', link: '/side-hustle/ibkr/入金IBKR磨损记录' },
                { text: 'WISE出金到国内磨损最优解', link: '/side-hustle/ibkr/wise-withdrawal-optimal-solution' }
              ]
            }
          ]
        }
      ],
      '/career-path/': [
        {
          text: '🚀 面试通关SOP',
          collapsible: true,
          collapsed: false,
          items: [
            { text: '简历', link: '/career-path/resume' },
            { text: '真题', link: '/career-path/questions' },
            { text: '复盘', link: '/career-path/review' }
          ]
        }
      ],
      '/productivity/': [
        {
          text: '⚡ 效能黑客',
          collapsible: true,
          collapsed: false,
          items: [
            { text: '工具', link: '/productivity/tools' },
            { text: '工作流', link: '/productivity/workflow' }
          ]
        }
      ],
      '/mindset/': [
        {
          text: '🧠 认知升级',
          collapsible: true,
          collapsed: false,
          items: [
            { text: '财报', link: '/mindset/financial-report' },
            { text: '思考', link: '/mindset/thinking' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  
  markdown: {
    lineNumbers: true
  }
});
