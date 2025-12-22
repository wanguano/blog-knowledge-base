---
title: useLocalStorage
description: 响应式的 LocalStorage 操作 Hook
date: 2025-12-22
tags: [React, Hooks, Storage]
framework: react
version: ">=18.0.0"
---

# {{ $frontmatter.title }}

<Badge type="tip" text="React" />

## 功能说明
提供了一个方便的接口来读写 LocalStorage，并且在跨标签页时能自动同步状态。

### 适用场景
- ✅ 用户配置保存（暗色模式、侧边栏收起等）
- ✅ 表单草稿自动保存

## 快速开始

```tsx
import { useLocalStorage } from '@/hooks/react/useLocalStorage';

function App() {
  const [name, setName] = useLocalStorage('user-name', 'Guest');
  return <input value={name} onChange={e => setName(e.target.value)} />;
}
```

## API 文档

### 参数
| 参数 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| key | string | - | ✅ | 存储的 Key |
| initialValue | T | - | ✅ | 初始值 |

### 返回值
| 属性 | 类型 | 说明 |
|------|------|------|
| storedValue | T | 当前存储的值 |
| setValue | (val: T) => void | 更新值的函数 |

## 完整代码
::: details 点击查看
```typescript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}
```
:::
