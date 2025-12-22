---
title: StatusBadge 状态徽章
description: 用于展示流程或实体的状态标签
date: 2025-12-22
tags: [React, 组件, UI]
framework: react
---

# {{ $frontmatter.title }}

## 组件说明
提供统一的、带有语义化颜色的状态标签展示。

### 何时使用
- ✅ 表格中的状态列
- ✅ 详情页的标题状态展示

## 代码演示

### 基础用法
```tsx
<StatusBadge type="success">已完成</StatusBadge>
<StatusBadge type="warning">待处理</StatusBadge>
```

## API 文档

### Props
| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| children | ReactNode | - | ✅ | 文本内容 |
| type | 'success' \| 'error' \| 'warning' \| 'info' | 'info' | ❌ | 状态类型 |

## 完整代码
::: details 点击查看
```tsx
export const StatusBadge = ({ children, type = 'info' }) => {
  const colors = {
    success: '#52c41a',
    error: '#f5222d',
    warning: '#faad14',
    info: '#1890ff'
  };
  
  return (
    <span style={{
      backgroundColor: colors[type],
      color: '#fff',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '12px'
    }}>
      {children}
    </span>
  );
};
```
:::
