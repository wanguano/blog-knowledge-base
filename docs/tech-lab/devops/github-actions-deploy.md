---
title: GitHub Actions 实现博客自动化部署
description: 记录如何使用 GitHub Actions 自动化部署基于 VitePress 的博客系统到个人服务器
date: 2026-03-01
tags: [DevOps, GitHub Actions, CI/CD, 自动化部署]
---

# {{ $frontmatter.title }}

::: tip 背景
每次写完博客都要手动打包、连接服务器、上传文件，不仅繁琐还容易出错。本文记录了如何通过 **GitHub Actions** 实现：代码只要 push 到 `main` 分支，就自动触发构建并部署到个人服务器上。
:::

## 整体思路

1. 在 GitHub 仓库中配置好服务器的敏感信息（IP、用户名、SSH 密钥）。
2. 在项目中添加 `.github/workflows/deploy.yml` 配置文件。
3. 每次提交代码，GitHub 会自动启动一个 Linux 容器，帮我们执行安装依赖、打包构建的操作。
4. 构建完成后，通过 SSH 插件自动将 `dist` 目录下的静态文件同步到服务器指定目录。

## GitHub Secrets 配置

为了安全，千万不要把服务器密码或私钥硬编码到代码库中！需要在 GitHub 仓库的 **Settings -> Secrets and variables -> Actions** 中添加以下三个 Secret：

- `SERVER_IP`：你的服务器公网 IP 地址。
- `SERVER_USER`：登录服务器的用户名（如 `root`）。
- `SERVER_SSH_KEY`：用于免密登录服务器的 SSH 私钥内容（需要先在服务器配置好对应的公钥）。

## 完整 Workflow 脚本

在项目根目录下创建文件 `.github/workflows/deploy.yml`，填入以下内容：

```yaml
name: Deploy Blog to Server

on:
  push:
    branches:
      - main  # 监听 main 分支的变动

jobs:
  deploy:
    runs-on: ubuntu-latest # 使用 GitHub 提供的 Linux 环境

    steps:
      # 第一步：把代码拉下来
      - name: Checkout code
        uses: actions/checkout@v4

      # 第二步：配置 Node.js 环境
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20' # 2025年了，用 LTS 版本
          cache: 'npm'       # 开启缓存，加速安装依赖

      # 第三步：安装依赖并打包
      - name: Install & Build
        run: |
          # npm ci 是专门用于 CI 环境的安装命令，更稳定、更快
          # 它会严格按照 package-lock.json安装
          npm ci
          
          # 确保 vitepress 被安装了（可选，用于调试）
          npm list vitepress || echo "Vitepress not found via list"
          
          # 执行构建
          npm run build
        # 注意：Vue3 打包后通常会生成 dist 目录

      # 第四步：把 dist 目录推送到服务器
      - name: Deploy to Server
        uses: easingthemes/ssh-deploy@v5.0.0 # 这是一个成熟的第三方 Action
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_KEY }}
          ARGS: "-rltgoDzvO --delete" # rsync 参数，保证同步
          SOURCE: "docs/.vitepress/dist/"  # 👈 或者是你实际生成的路径
          REMOTE_HOST: ${{ secrets.SERVER_IP }}
          REMOTE_USER: ${{ secrets.SERVER_USER }}
          TARGET: "/www/wwwroot/my-blog/" # 服务器目标路径
          REMOTE_PORT: "9527"  # 👈 加上这一行！注意是字符串格式
```

## 注意事项与避坑指北

1. **打包路径 `SOURCE`**：
   如果你使用的是常规 Vue/React 项目，打包产物通常在 `dist/`。而本文是基于 VitePress 构建的，默认产物路径是 `docs/.vitepress/dist/`，配置时一定要注意路径末尾的斜杠 `/`。
2. **`--delete` 参数**：
   `ARGS: "-rltgoDzvO --delete"` 这个配置非常重要，它保证了服务器端的文件会与构建产物完全一致，**不在构建产物中的旧文件会被自动删除**，避免服务器空间被旧的静态资源塞满。
3. **免密登录**：
   如果你之前没配置过服务器的 SSH 免密登录，可以在本地使用 `ssh-keygen` 生成密钥对，把 `id_rsa.pub` 追加到服务器的 `~/.ssh/authorized_keys` 中，然后把 `id_rsa` 的内容复制到 GitHub Secret `SERVER_SSH_KEY` 中。

## 最终效果

将代码推送到 GitHub 的 `main` 分支后，点开仓库的 **Actions** 面板，就能看到一个绿色的打钩✅。只需等待约 1~2 分钟，再刷新你的个人博客域名，最新的文章就已经安静地躺在那里了，整个过程如丝般顺滑！
