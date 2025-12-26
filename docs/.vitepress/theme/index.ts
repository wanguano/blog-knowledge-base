import DefaultTheme from 'vitepress/theme';
import './style.css';
import type { Theme } from 'vitepress';
import DemoButton from './components/DemoButton.vue';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('DemoButton', DemoButton);
  }
} as Theme;
