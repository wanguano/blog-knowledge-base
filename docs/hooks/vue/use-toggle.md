---
title: useToggle
description: 简单的开关状态 Hook
date: 2025-12-26
tags: [Vue, Hooks]
framework: vue
version: ">=3.0.0"
---

# {{ $frontmatter.title }}

<Badge type="tip" text="Vue" />

## 功能说明
用于切换布尔值状态的简单 Hook。

### 适用场景
- ✅ 弹窗显示/隐藏
- ✅ 开关按钮

## 快速开始

```vue
<script setup>
import { useToggle } from '@/hooks/vue/useToggle';
const [value, toggle] = useToggle(false);
</script>

<template>
  <button @click="toggle">当前状态: {{ value }}</button>
</template>
```

## API 文档

### 参数
| 参数 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| initialValue | boolean | false | ❌ | 初始状态 |

### 返回值
| 属性 | 类型 | 说明 |
|------|------|------|
| value | Ref\<boolean\> | 当前值 |
| toggle | () => void | 切换函数 |

## 完整代码
::: details 点击查看
```typescript
import { ref } from 'vue';

export function useToggle(initialValue = false) {
  const state = ref(initialValue);
  const toggle = () => {
    state.value = !state.value;
  };
  return [state, toggle] as const;
}
```
:::
