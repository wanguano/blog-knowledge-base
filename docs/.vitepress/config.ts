import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Dev Knowledge Base',
  description: '技术难点、踩坑记录、学习笔记、Hooks 组件库',
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/contribution' },
      { text: '技术难点', link: '/posts/技术难点/vite-hmr-failed' },
      { text: '踩坑记录', link: '/posts/踩坑记录/react-hydration-error' },
      { text: '组件', link: '/components/button' },
      { text: 'Hooks', link: '/hooks/vue/use-toggle' }
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          items: [
            { text: '贡献指南', link: '/guide/contribution' }
          ]
        }
      ],
      '/posts/': [
        {
          text: '技术难点',
          collapsed: false,
          items: [
            { text: 'Vite HMR 失效', link: '/posts/技术难点/vite-hmr-failed' }
          ]
        },
        {
          text: '踩坑记录',
          collapsed: false,
          items: [
            { text: 'React Hydration 错误', link: '/posts/踩坑记录/react-hydration-error' }
          ]
        },
        {
          text: '学习笔记',
          collapsed: false,
          items: []
        }
      ],
      '/hooks/': [
        {
          text: 'Vue Hooks',
          collapsed: false,
          items: [
            { text: 'useToggle', link: '/hooks/vue/use-toggle' }
          ]
        },
        {
          text: 'React Hooks',
          collapsed: true,
          items: [
            { text: 'useLocalStorage', link: '/hooks/react/use-local-storage' }
          ]
        }
      ],
      '/components/': [
        {
          text: '基础组件',
          collapsed: false,
          items: [
            { text: 'UploadPro 上传 (在线预览)', link: '/components/upload-pro' },
            { text: 'Button 按钮 (在线预览)', link: '/components/button' },
            { text: 'StatusBadge 状态徽章', link: '/components/status-badge' }
          ]
        },
        {
          text: '导航组件',
          collapsed: false,
          items: [
            { text: 'NavMenu 导航菜单', link: '/components/nav-menu' }
          ]
        }
      ]
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    /* search: {
      provider: 'local'
    } */
  },
  
  markdown: {
    lineNumbers: true
  }
});
