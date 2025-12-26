---
title: Button 按钮
description: 基础交互组件
date: 2025-12-23
tags: [Vue, 组件, UI]
framework: vue
---

# {{ $frontmatter.title }}

## 组件预览

::: tip 实时渲染
下面的按钮是由 Vue 组件直接在文档中渲染生成的，你可以直接交互。
:::

<div style="display: flex; gap: 10px; align-items: center; padding: 20px; border: 1px solid var(--vp-c-divider); border-radius: 8px;">
  <DemoButton type="primary">主要按钮</DemoButton>
  <DemoButton type="success">成功按钮</DemoButton>
  <DemoButton type="danger">危险按钮</DemoButton>
</div>

### 不同尺寸
<div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;">
  <DemoButton size="small">小型</DemoButton>
  <DemoButton size="medium">中型</DemoButton>
  <DemoButton size="large">大型</DemoButton>
</div>

## 代码演练

### 基础用法
```vue
<template>
  <DemoButton type="primary">点击我</DemoButton>
</template>
```

## API 文档

### Props
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | 'primary' \| 'success' \| 'danger' | 'primary' | 按钮类型 |
| size | 'small' \| 'medium' \| 'large' | 'medium' | 按钮尺寸 |

## 完整代码
::: details 查看 DemoButton.vue 源码
```vue
<template>
  <button :class="['demo-button', type, size]">
    <slot></slot>
  </button>
</template>

<style scoped>
/* 见上文样式定义 */
</style>
```
:::
