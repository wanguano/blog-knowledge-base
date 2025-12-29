# UploadPro 文件上传对话框

<script setup>
  import { ref } from 'vue';
  const visible = ref(false);
  const handleUpload = (files) => {
    console.log('用户上传了文件:', files);
  };
</script>

`UploadPro` 是一个高度封装、纯净无业务依赖的文件/文件夹上传对话框组件，基于 Vue 3 和 Element Plus 构建。

## 核心特性

- 🚀 **双模式支持**：自由切换文件或文件夹上传模式。
- 🖱️ **完美拖放**：支持文件和文件夹的拖拽识别。
- 🔍 **智能校验**：内置文件类型、大小、数量限制及**全量查重**逻辑。
- 📁 **文件夹递归**：高效递归读取文件夹内容，保留 `webkitRelativePath`。
- 🔔 **用户体验优化**：采用防抖消息提示，避免批量上传时的消息轰炸。

## 在线演示

::: tip 交互体验
点击下方按钮打开对话框。你可以在此尝试拖入文件或切换文件夹模式测试递归效果。
:::

<ClientOnly>
  <div class="demo-container" style="padding: 24px; border: 1px dashed var(--vp-c-divider); border-radius: 12px; display: flex; justify-content: center;">
    <el-button type="primary" size="large" @click="visible = true">
      <el-icon style="margin-right: 8px"><Upload /></el-icon>
      打开上传对话框
    </el-button>
    <UploadPro v-model:visible="visible" @upload="handleUpload" />
  </div>
</ClientOnly>

## 安装与配置

### 1. 依赖安装
```bash
pnpm add element-plus @element-plus/icons-vue
```

### 2. 全局注册
在 `.vitepress/theme/index.ts` 中：
```typescript
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import UploadPro from './components/UploadPro.vue';

export default {
  enhanceApp({ app }) {
    app.use(ElementPlus);
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
    app.component('UploadPro', UploadPro);
  }
}
```

## API 参考

### Props
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `visible` | `boolean` | `false` | 是否显示对话框 |
| `config` | `UploadConfig` | `-` | 上传功能的详细配置项 |

### UploadConfig 详情
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `maxFileSize` | `number` | `10` | 单个文件最大限制 (MB) |
| `maxFilesCount` | `number` | `10` | 最大允许上传文件数量 |
| `allowedFileTypes`| `object` | *参考源码* | 包含 `documents`, `images`, `spreadsheets` 的扩展名数组 |

### Events
| 事件名 | 参数 | 说明 |
|------|------|------|
| `upload` | `(files: File[])` | 用户点击“确定”时触发，返回筛选后的有效文件数组 |
| `cancel` | `-` | 用户点击“取消”或关闭对话框时触发 |

## 源码实现
::: details 点击查看 UploadPro.vue 完整代码
render_diffs(file:///g:/Code/01%20FrondEnd/04_WEB_Learn_Code/Project/dev-knowledge-base/docs/.vitepress/theme/components/UploadPro.vue)
:::
