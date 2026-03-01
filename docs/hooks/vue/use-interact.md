---
title: useInteract
description: 基于 interact.js 的拖拽和缩放 Hook (完全重构版)
date: 2025-12-29
tags: [Vue, Hooks, interact.js, 拖拽, 缩放]
framework: vue
version: ">=3.0.0"
---

# {{ $frontmatter.title }}

<Badge type="tip" text="Vue" />
<Badge type="info" text="interact.js" />
<Badge type="warning" text="v2.0 重构版" />

## 功能说明

基于 `interact.js` 封装的 Vue Composable 函数,提供强大灵活的元素拖拽和缩放功能。

### ✨ v2.0 新特性

- ✅ **灵活的初始位置策略** - 支持居中、保持原位、自定义位置等多种策略
- ✅ **完整的状态管理** - 响应式的位置、尺寸和交互状态
- ✅ **位置持久化** - 自动保存和恢复元素位置
- ✅ **事件回调系统** - 完整的拖拽和缩放生命周期回调
- ✅ **灵活的限制区域** - 支持多种限制策略
- ✅ **自动初始化** - 可选的自动初始化和清理

### 适用场景

- ✅ 可拖拽的弹窗/对话框
- ✅ 可调整大小的面板
- ✅ 自定义窗口管理系统
- ✅ 可视化编辑器中的元素操作
- ✅ 需要记住位置的浮动工具栏

## 在线演示

::: tip 实时渲染
下面的窗口是使用 `useInteract` Hook 实现的,你可以直接拖拽和缩放。
:::

<DemoInteract />

## 快速开始

### 1. 安装依赖

```bash
npm install interactjs
# 或
yarn add interactjs
# 或
pnpm add interactjs
```

### 2. 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useDraggableAndResizable } from '@/hooks/vue/useInteract';

const windowRef = ref<HTMLElement | null>(null);

const { 
  initInteract, 
  destroyInteract,
  position,
  isDragging 
} = useDraggableAndResizable(windowRef, {
  initialPosition: 'center',
  draggable: true,
  resizable: true,
  autoInit: true, // 自动初始化和清理
});
</script>

<template>
  <div ref="windowRef" class="my-window">
    <p>位置: {{ position.x }}, {{ position.y }}</p>
    <p>拖拽中: {{ isDragging }}</p>
  </div>
</template>

<style scoped>
.my-window {
  position: absolute;
  touch-action: none; /* 必需:禁用触摸默认行为 */
}
</style>
```

## API 文档

### 参数

#### `useDraggableAndResizable(targetRef, options)`

| 参数 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| targetRef | `Ref<HTMLElement \| null>` | - | ✅ | 目标元素的 ref |
| options | `UseInteractOptions` | `{}` | ❌ | 配置选项 |

#### `UseInteractOptions`

##### 基础功能

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| draggable | `boolean` | `true` | 是否启用拖拽 |
| resizable | `boolean` | `true` | 是否启用缩放 |

##### 初始位置配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| initialPosition | `'center' \| 'current' \| 'custom' \| 'viewport-center'` | `'current'` | 初始位置策略 |
| customPosition | `{ x?: number; y?: number }` | - | 自定义位置 (仅当 initialPosition='custom' 时生效) |

**初始位置策略说明:**
- `center`: 窗口居中
- `current`: 保持当前位置 (不覆盖原有定位)
- `custom`: 自定义位置
- `viewport-center`: 视口居中

##### 定位模式

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| positioningMode | `'transform' \| 'absolute' \| 'fixed'` | `'transform'` | 定位模式 |

##### 尺寸限制

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| minWidth | `number` | `300` | 最小宽度(px) |
| minHeight | `number` | `200` | 最小高度(px) |
| maxWidth | `number` | - | 最大宽度(px) |
| maxHeight | `number` | - | 最大高度(px) |

##### 拖拽配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| dragHandle | `string` | - | 拖拽手柄的 CSS 选择器 |
| restrictTo | `'parent' \| 'viewport' \| HTMLElement \| Rect` | `'parent'` | 限制区域 |

##### 持久化

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| persistPosition | `boolean` | `false` | 是否持久化位置到 localStorage |
| storageKey | `string` | 自动生成 | localStorage 键名 |

##### 自动初始化

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| autoInit | `boolean` | `false` | 是否自动初始化和清理 |

##### 事件回调

| 属性 | 类型 | 说明 |
|------|------|------|
| onDragStart | `(position: Position) => void` | 拖拽开始回调 |
| onDragMove | `(position: Position) => void` | 拖拽移动回调 |
| onDragEnd | `(position: Position) => void` | 拖拽结束回调 |
| onResizeStart | `(size: Size) => void` | 缩放开始回调 |
| onResizeMove | `(size: Size) => void` | 缩放移动回调 |
| onResizeEnd | `(size: Size) => void` | 缩放结束回调 |
| onInitialized | `() => void` | 初始化完成回调 |

### 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| **初始化和销毁** | | |
| initInteract | `() => void` | 初始化 interact.js 监听器 |
| destroyInteract | `() => void` | 销毁 interact.js 实例 |
| **状态** | | |
| isInitialized | `Ref<boolean>` | 是否已初始化 |
| isDragging | `Ref<boolean>` | 是否正在拖拽 |
| isResizing | `Ref<boolean>` | 是否正在缩放 |
| **位置和尺寸** | | |
| position | `Ref<Position>` | 当前位置 `{ x, y }` |
| size | `Ref<Size>` | 当前尺寸 `{ width, height }` |
| **方法** | | |
| resetPosition | `() => void` | 重置到初始位置 |
| setPosition | `(position: Partial<Position>) => void` | 设置位置 |
| setSize | `(size: Partial<Size>) => void` | 设置尺寸 |
| savePosition | `() => void` | 保存位置到 localStorage |
| restorePosition | `() => void` | 从 localStorage 恢复位置 |

## 使用示例

### 基础拖拽和缩放

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useDraggableAndResizable } from '@/hooks/vue/useInteract';

const boxRef = ref<HTMLElement | null>(null);

const { position, size } = useDraggableAndResizable(boxRef, {
  autoInit: true, // 自动初始化
  initialPosition: 'center',
});
</script>

<template>
  <div ref="boxRef" class="box">
    <p>位置: {{ position.x.toFixed(0) }}, {{ position.y.toFixed(0) }}</p>
    <p>尺寸: {{ size.width.toFixed(0) }} x {{ size.height.toFixed(0) }}</p>
  </div>
</template>
```

### 仅拖拽功能

```vue
<script setup lang="ts">
const { initInteract } = useDraggableAndResizable(boxRef, {
  draggable: true,
  resizable: false, // 禁用缩放
  autoInit: true,
});
</script>
```

### 保持原有位置

```vue
<script setup lang="ts">
// 不覆盖 CSS 定位,保持元素原有位置
const { initInteract } = useDraggableAndResizable(boxRef, {
  initialPosition: 'current', // 默认值
  autoInit: true,
});
</script>

<template>
  <div ref="boxRef" style="position: absolute; left: 100px; top: 100px;">
    保持原有位置
  </div>
</template>
```

### 自定义初始位置

```vue
<script setup lang="ts">
const { initInteract } = useDraggableAndResizable(boxRef, {
  initialPosition: 'custom',
  customPosition: { x: 100, y: 200 },
  autoInit: true,
});
</script>
```

### 指定拖拽手柄

```vue
<script setup lang="ts">
const { initInteract } = useDraggableAndResizable(windowRef, {
  dragHandle: '.drag-handle', // 只有 .drag-handle 元素可拖拽
  minWidth: 400,
  minHeight: 300,
  autoInit: true,
});
</script>

<template>
  <div ref="windowRef" class="window">
    <div class="drag-handle">拖动这里移动窗口</div>
    <div class="content">窗口内容</div>
  </div>
</template>
```

### 位置持久化

```vue
<script setup lang="ts">
const { position, savePosition, restorePosition } = useDraggableAndResizable(boxRef, {
  persistPosition: true,
  storageKey: 'my-window-position', // 自定义存储键名
  autoInit: true,
  onDragEnd: () => {
    console.log('位置已自动保存');
  },
});

// 手动保存/恢复
function handleSave() {
  savePosition();
}

function handleRestore() {
  restorePosition();
}
</script>
```

### 事件回调

```vue
<script setup lang="ts">
const { isDragging, isResizing } = useDraggableAndResizable(boxRef, {
  autoInit: true,
  onDragStart: (pos) => {
    console.log('开始拖拽:', pos);
  },
  onDragMove: (pos) => {
    console.log('拖拽中:', pos);
  },
  onDragEnd: (pos) => {
    console.log('拖拽结束:', pos);
  },
  onResizeStart: (size) => {
    console.log('开始缩放:', size);
  },
  onResizeEnd: (size) => {
    console.log('缩放结束:', size);
  },
});
</script>

<template>
  <div ref="boxRef" class="box">
    <div v-if="isDragging" class="status">拖拽中...</div>
    <div v-if="isResizing" class="status">缩放中...</div>
  </div>
</template>
```

### 限制在视口内

```vue
<script setup lang="ts">
const { initInteract } = useDraggableAndResizable(boxRef, {
  restrictTo: 'viewport', // 限制在视口内
  autoInit: true,
});
</script>
```

### 手动控制位置和尺寸

```vue
<script setup lang="ts">
const { position, size, setPosition, setSize, resetPosition } = useDraggableAndResizable(boxRef, {
  autoInit: true,
});

function moveToCenter() {
  const rect = boxRef.value?.getBoundingClientRect();
  if (rect) {
    setPosition({
      x: (window.innerWidth - rect.width) / 2,
      y: (window.innerHeight - rect.height) / 2,
    });
  }
}

function resize() {
  setSize({ width: 500, height: 400 });
}

function reset() {
  resetPosition();
}
</script>

<template>
  <div>
    <button @click="moveToCenter">移到中心</button>
    <button @click="resize">调整尺寸</button>
    <button @click="reset">重置位置</button>
    <div ref="boxRef" class="box">可控制的窗口</div>
  </div>
</template>
```

### 完整示例:模态窗口

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useDraggableAndResizable } from '@/hooks/vue/useInteract';

const modalRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

const { 
  initInteract, 
  destroyInteract,
  position,
  size,
  isDragging,
  resetPosition,
} = useDraggableAndResizable(modalRef, {
  initialPosition: 'center',
  draggable: true,
  resizable: true,
  minWidth: 600,
  minHeight: 400,
  maxWidth: 1200,
  maxHeight: 800,
  dragHandle: '.modal-header',
  persistPosition: true,
  storageKey: 'app-modal-position',
  onDragStart: () => {
    console.log('开始拖拽模态窗口');
  },
});

function showModal() {
  isVisible.value = true;
  // 等待 DOM 更新后初始化
  nextTick(() => {
    initInteract();
  });
}

function closeModal() {
  isVisible.value = false;
  destroyInteract();
}
</script>

<template>
  <div>
    <button @click="showModal">打开模态窗口</button>
    
    <div v-if="isVisible" class="modal-overlay">
      <div ref="modalRef" class="modal" :class="{ dragging: isDragging }">
        <div class="modal-header">
          <h3>可拖拽模态窗口</h3>
          <button @click="resetPosition">重置位置</button>
          <button @click="closeModal">关闭</button>
        </div>
        <div class="modal-body">
          <p>位置: {{ position.x.toFixed(0) }}, {{ position.y.toFixed(0) }}</p>
          <p>尺寸: {{ size.width.toFixed(0) }} x {{ size.height.toFixed(0) }}</p>
          <p>窗口内容...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal {
  position: absolute;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  touch-action: none;
  transition: box-shadow 0.2s;
}

.modal.dragging {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 16px;
  background: #f5f5f5;
  cursor: move;
  user-select: none;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 20px;
}
</style>
```

## 技术要点

### 1. 位置管理策略

- **current**: 保持原有位置,不覆盖 CSS 定位
- **center**: 窗口居中,适合弹窗
- **custom**: 自定义位置,适合特定场景
- **viewport-center**: 视口居中,适合固定定位元素

### 2. 响应式状态

所有状态都是响应式的,可以直接在模板中使用:
- `position` - 实时位置
- `size` - 实时尺寸
- `isDragging` - 拖拽状态
- `isResizing` - 缩放状态

### 3. 自动初始化

设置 `autoInit: true` 后,Hook 会自动:
- 在 `onMounted` 时初始化
- 在 `onUnmounted` 时清理资源

### 4. 位置持久化

启用 `persistPosition: true` 后:
- 拖拽结束自动保存位置
- 下次初始化自动恢复位置
- 可自定义 `storageKey`

### 5. 样式要求

- 目标元素必须设置 `position: absolute` 或 `position: fixed`
- 必须添加 `touch-action: none` 禁用触摸默认行为

## 迁移指南

### 从 v1.0 迁移到 v2.0

#### 1. 返回值变更

```typescript
// v1.0
const { initInteract, destroyInteract } = useDraggableAndResizable(ref);

// v2.0 - 新增了状态和方法
const { 
  initInteract, 
  destroyInteract,
  // 新增
  isInitialized,
  isDragging,
  isResizing,
  position,
  size,
  resetPosition,
  setPosition,
  setSize,
  savePosition,
  restorePosition,
} = useDraggableAndResizable(ref);
```

#### 2. 默认行为变更

```typescript
// v1.0 - 默认强制居中
useDraggableAndResizable(ref); // 会强制居中

// v2.0 - 默认保持原位
useDraggableAndResizable(ref); // 保持原有位置

// v2.0 - 需要居中请显式设置
useDraggableAndResizable(ref, {
  initialPosition: 'center',
});
```

#### 3. positioning 配置变更

```typescript
// v1.0
useDraggableAndResizable(ref, {
  positioning: {
    vertical: 1.3, // 垂直偏移因子
  },
});

// v2.0 - 使用新的位置策略
useDraggableAndResizable(ref, {
  initialPosition: 'center', // 或 'current', 'custom', 'viewport-center'
  customPosition: { x: 100, y: 100 }, // 自定义位置
});
```

## 注意事项

> [!WARNING]
> 目标元素必须设置 `touch-action: none`,否则在触摸设备上可能无法正常工作。

> [!IMPORTANT]
> **默认行为变更**: v2.0 默认使用 `initialPosition: 'current'`,不会覆盖原有定位。如需居中,请显式设置 `initialPosition: 'center'`。

> [!TIP]
> 使用 `autoInit: true` 可以自动管理生命周期,无需手动调用 `initInteract()` 和 `destroyInteract()`。

> [!TIP]
> 启用 `persistPosition: true` 可以记住用户的窗口位置,提升用户体验。

## 相关资源

- [interact.js 官方文档](https://interactjs.io/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
