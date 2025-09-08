# Mizuki 项目概述

## 项目简介

Mizuki 是一个现代化、功能丰富的静态博客模板，基于 [Astro](https://astro.build) 构建，具有先进的功能和精美的设计。它提供了多种特色页面（如追番、友链、日记、相册等），支持多语言、明暗主题切换、响应式设计等功能。

## 技术栈

- **核心框架**: Astro 5.13.2
- **样式**: Tailwind CSS 3.4.17
- **类型检查**: TypeScript 5.9.2
- **包管理**: pnpm 9.14.4
- **其他关键技术**:
  - Svelte 5.38.2 (用于部分交互组件)
  - Expressive Code 0.41.3 (增强代码块)
  - Swup 1.7.0 (页面过渡动画)
  - Pagefind 1.3.0 (搜索功能)
  - Katex 0.16.22 (数学公式渲染)
  - PhotoSwipe 5.4.4 (图片画廊)

## 项目架构

```
Mizuki/
├── src/                 # 源代码目录
│   ├── components/      # 可复用的 UI 组件
│   ├── content/         # 博客文章和特殊页面内容
│   ├── data/            # 静态数据文件（如项目、技能、时间线等）
│   ├── layouts/         # 页面布局组件
│   ├── pages/           # 页面路由文件
│   ├── plugins/         # 自定义 Markdown 插件
│   ├── styles/          # 全局样式文件
│   ├── utils/           # 工具函数
│   └── config.ts        # 主要配置文件
├── public/              # 静态资源目录
├── scripts/             # 脚本文件
├── astro.config.mjs     # Astro 配置文件
├── package.json         # 项目依赖和脚本
└── ...
```

## 核心配置

项目的大部分配置集中在 `src/config.ts` 文件中，包括：
- 站点基本信息（标题、副标题、语言等）
- 主题颜色和横幅设置
- 导航栏链接
- 侧边栏组件配置
- 个人资料和社交链接
- 评论系统配置（支持 Twikoo 和 Gitalk）
- 音乐播放器、公告等组件配置

## 构建与运行命令

| 命令 | 说明 |
|------|------|
| `pnpm install` | 安装项目依赖 |
| `pnpm dev` | 启动本地开发服务器 (localhost:4321) |
| `pnpm build` | 构建生产站点到 `./dist/` 目录 |
| `pnpm preview` | 本地预览构建后的站点 |
| `pnpm check` | 运行 Astro 类型检查 |
| `pnpm format` | 使用 Biome 格式化代码 |
| `pnpm lint` | 使用 Biome 检查并修复代码问题 |
| `pnpm new-post <文件名>` | 创建新博客文章 |

## 评论系统配置

项目支持两种评论系统：Twikoo 和 Gitalk。

### Twikoo 配置

在 `src/config.ts` 中配置 Twikoo：

```typescript
export const commentConfig: CommentConfig = {
  enable: true, // 启用评论功能
  twikoo: {
    envId: "https://your-twikoo-env-id.vercel.app", // Twikoo 环境 ID
  },
};
```

### Gitalk 配置

在 `src/config.ts` 中配置 Gitalk：

```typescript
export const commentConfig: CommentConfig = {
  enable: true, // 启用评论功能
  gitalk: {
    clientID: "YOUR_GITHUB_CLIENT_ID",
    clientSecret: "YOUR_GITHUB_CLIENT_SECRET",
    repo: "YOUR_REPO_NAME",
    owner: "YOUR_GITHUB_USERNAME",
    admin: ["YOUR_GITHUB_USERNAME"],
    // 以下为可选配置
    // id: window.location.pathname,
    // number: -1,
    // labels: ["Gitalk"],
    // title: document.title,
    // body: location.href,
    // language: navigator.language,
    // perPage: 10,
    // distractionFreeMode: false,
    // pagerDirection: "last",
    // createIssueManually: false,
    // proxy: "https://cors-anywhere.azm.workers.dev/https://github.com/login/oauth/access_token",
    // flipMoveOptions: {},
    // backgroundColor: "#fff"
  }
};
```

注意：Gitalk 需要先在 GitHub 上注册 OAuth Application，并将回调 URL 设置为 `http://localhost:4321`（开发环境）或你的博客域名（生产环境）。

## 开发约定

1. **代码风格**:
   - 使用 Biome 进行代码格式化和 linting
   - 缩进使用 Tab
   - 字符串字面量使用双引号
   - 遵循推荐的 lint 规则

2. **组件开发**:
   - 使用 Astro 和 Svelte 构建组件
   - 组件应具有良好的可复用性和可配置性
   - 遵循项目现有的组件结构和命名规范

3. **内容管理**:
   - 文章内容存储在 `src/content/posts/` 目录下
   - 特殊页面内容存储在 `src/content/spec/` 目录下
   - 使用 Markdown 格式编写内容，支持 YAML frontmatter

4. **样式管理**:
   - 主要使用 Tailwind CSS 进行样式开发
   - 自定义样式放在 `src/styles/` 目录下
   - 遵循响应式设计原则

5. **配置管理**:
   - 主要配置集中在 `src/config.ts` 文件中
   - 配置项应具有良好的类型定义和注释