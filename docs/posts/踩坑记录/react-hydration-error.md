---
title: React Hydration failed 导致页面闪烁
date: 2025-12-22
tags: [React, Next.js, SSR]
severity: 高
status: 已解决
---

# {{ $frontmatter.title }}

<Badge type="danger" text="踩坑" />
<Badge type="tip" text="已解决" />

## 问题现象
```bash
Error: Hydration failed because the initial UI does not match what was rendered on the server.
```

## 环境信息
| 项目 | 版本 |
|------|------|
| Node.js | v18.17.0 |
| React | 18.2.0 |
| Next.js | 14.0.0 |

## 解决方案
::: code-group
```typescript [❌ 问题代码]
// 在渲染过程中直接读取 window
export default function TimeDisplay() {
  return <div>{window.location.href}</div>;
}
```
```typescript [✅ 修复代码]
// 使用 useEffect 确保只在客户端执行
export default function TimeDisplay() {
  const [url, setUrl] = useState('');
  useEffect(() => {
    setUrl(window.location.href);
  }, []);
  return <div>{url}</div>;
}
```
:::

## 原理分析
服务端无法获取浏览器的 `window` 对象，导致生成的 HTML 与客户端首次计算的 UI 结构不一致。

## 预防措施
- ✅ 避免在 Render 阶段访问 CSR 特有的 API。
- ✅ 使用 `useSyncExternalStore` 处理外部状态。
