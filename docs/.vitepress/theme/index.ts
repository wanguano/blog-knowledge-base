import DefaultTheme from 'vitepress/theme';
import './style.css';
import type { Theme } from 'vitepress';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // 可以在这里注册全局组件
  }
} as Theme;
