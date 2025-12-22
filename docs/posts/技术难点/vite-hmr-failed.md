---
title: Vite HMR 在特定网络环境下失效分析
description: 解决 Vite 项目在公司内网或代理环境下 HMR 无法连接的问题
date: 2025-12-22
tags: [Vite, 工程化, HMR]
difficulty: 中等
---

# {{ $frontmatter.title }}

## 背景与挑战
在内网开发环境下，Vite 默认的 WebSocket 连接地址无法通过代理服务器，导致页面修改后无法自动刷新，严重影响开发效率。

## 技术方案

### 方案对比
| 方案 | 优点 | 缺点 | 是否采用 |
|------|------|------|---------|
| 降级为全量刷新 | 配置简单 | 丢失当前页面状态 | ❌ |
| 修改 hmr clientPort | 彻底解决代理透传问题 | 需要了解网关配置 | ✅ |

### 实现代码
::: code-group
```typescript [vite.config.ts]
export default defineConfig({
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 24678,
      clientPort: 443 // 强制客户端连接 443 端口
    }
  }
})
```
:::

## 效果对比
| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| 更新延迟 | 5s+ (手动) | 300ms | 1500% ⚡ |

## 技术亮点
- ✅ 零侵入业务代码
- ✅ 解决跨域代理下的 WebSocket 握手失败

## 相关资源
- [Vite Server Configuration](https://vitejs.dev/config/server-options.html#server-hmr)
