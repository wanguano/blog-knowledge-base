import DefaultTheme from 'vitepress/theme';
import './style.css';
import type { Theme } from 'vitepress';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import DemoButton from './components/DemoButton.vue';
import UploadPro from './components/UploadPro.vue';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(ElementPlus);
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
    app.component('DemoButton', DemoButton);
    app.component('UploadPro', UploadPro);
  }
} as Theme;
