import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Dev Knowledge Base',
  description: '技术难点、踩坑记录、学习笔记、Hooks 组件库',
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '技术难点', link: '/posts/技术难点/' },
      { text: '踩坑记录', link: '/posts/踩坑记录/' },
      { text: 'Hooks', link: '/hooks/react/' }
    ],
    
    sidebar: {
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
          text: 'React Hooks',
          items: [
            { text: 'useLocalStorage', link: '/hooks/react/use-local-storage' }
          ]
        },
        {
          text: 'Vue Hooks',
          items: []
        }
      ],
      '/components/': [
        {
          text: '通用组件',
          items: [
            { text: 'StatusBadge 状态徽章', link: '/components/status-badge' }
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
