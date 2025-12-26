# 贡献与上传指南

欢迎参与 Dev Knowledge Base 的内容建设！为了保持文档的高质量和一致性，请遵循以下流程：

## 🚀 通用流程

1.  **创建文件**：在对应目录下创建 `.md` 文件。
2.  **选择模板**：根据内容类型（组件/Hook/踩坑）复制对应的 Frontmatter 和结构。
3.  **编写内容**：使用标准的 Markdown 语法，并利用 VitePress 的增强容器（::: tip 等）。
4.  **侧边栏注册**：在 `docs/.vitepress/config.ts` 中添加你的文档链接。

---

## 📦 前端组件 (Vue/React)

**目录**：`docs/components/`

### 操作步骤
1.  **源码存放**：
    - 如果是 Vue 组件且需要预览，将 `.vue` 文件放在 `docs/.vitepress/theme/components/` 下。
    - 在 `docs/.vitepress/theme/index.ts` 中注册该组件。
2.  **编写 MD**：在 `docs/components/` 创建文档。
3.  **在线预览**：在 MD 中直接使用组件标签（如 `<MyComponent />`）。

---

## 🪝 Hooks (React/Vue)

**目录**：`docs/hooks/react/` 或 `docs/hooks/vue/`

### 规范
- **文件命名**：使用 `use-` 前缀，如 `use-local-storage.md`。
- **必须包含**：快速开始（代码示例）、API 表格、完整源码（折叠）。

---

## 🛡️ 踩坑记录

**目录**：`docs/posts/踩坑记录/`

### 规范
- **状态标记**：顶部必须包含 `<Badge type="danger" text="踩坑" />`。
- **核心对比**：必须使用 `::: code-group` 展示 **❌ 错误代码** 与 **✅ 修复代码** 的对比。

---

## 💡 技巧：利用 AI (Cursor) 快速生成

由于项目已配置 `.cursorrules`，你可以直接对 AI 助手说：
- *“帮我生成一个关于 [组件名] 的组件文档，包含预览和 API 表格”*
- *“我遇到了一个 [具体报错]，帮我写一份踩坑记录”*

AI 会自动按照上述规范为你一键生成文件内容。

---

**核心原则：简洁、实用、可复制**
