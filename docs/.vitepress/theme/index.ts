import DefaultTheme from 'vitepress/theme';
import './style.css';
import type { Theme } from 'vitepress';
import { useRoute } from 'vitepress';
import { onMounted, watch, nextTick } from 'vue';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import DemoButton from './components/DemoButton.vue';
import UploadPro from './components/UploadPro.vue';
import DemoInteract from './components/DemoInteract.vue';

export default {
  ...DefaultTheme,
  setup() {
    const route = useRoute();
    
    const initZoom = async () => {
      // 动态导入 medium-zoom 避免服务端渲染报错
      const mediumZoom = (await import('medium-zoom')).default;
      // 选中 content 区域下的所有图片进行应用
      mediumZoom('.vp-doc img', { background: 'var(--vp-c-bg)' });
    };

    onMounted(() => {
      initZoom();
    });

    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    );
  },
  enhanceApp({ app }) {
    app.use(ElementPlus);
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
    app.component('DemoButton', DemoButton);
    app.component('UploadPro', UploadPro);
    app.component('DemoInteract', DemoInteract);
  }
} as Theme;
