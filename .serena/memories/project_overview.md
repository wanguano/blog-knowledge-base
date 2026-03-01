# Project Overview

## Purpose
This project is a technical knowledge base and blog system built to document technical difficulties, pitfalls, learning notes, and reusable hooks/components. 

## Tech Stack
- Framework: VitePress (Vue 3 based static site generator)
- Languages: TypeScript, Markdown
- Styling: Sass, Element Plus (based on dependencies)
- Package Management: Yarn / npm (yarn.lock present, pnpm config inside package.json)

## Codebase Structure
- `docs/` - Main documentation folder.
  - `.vitepress/` - VitePress configuration and custom theme components.
    - `config.ts` - Main VitePress config defining navigation and sidebar.
    - `theme/` - Custom VitePress theme.
  - `posts/` - Markdown files for blog posts (technical difficulties, pitfalls, etc.).
  - `hooks/` - Documentation for reusable React/Vue hooks.
  - `components/` - Documentation for reusable UI components.
  - `guide/` - General guides like contribution guidelines.
  - `public/` - Static assets (images, etc.).
  - `utils/` - Utility scripts or docs.
- `package.json` - Project metadata and scripts.