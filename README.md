# marlindiary.github.io

个人学术主页。Astro + 系统字体，纯静态，推到 `main` 由 GitHub Actions 自动部署到
<https://marlindiary.github.io>。

## 本地开发

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 产物在 dist/
```

## 改内容

| 想改什么 | 改哪里 |
| --- | --- |
| 姓名、简介、社交链接 | `src/site.ts` |
| 头像 | 命名为 `avatar.jpg` 丢进 `src/assets/`（自动生效） |
| 合作者名单 | `src/authors.ts` |
| 论文 | `src/content/publications/` 加一个 `.md` |
| CV | `src/pages/cv.astro` 顶部的 `sections` 数组 |
| CV 的 PDF | 放到 `public/cv.pdf` |
| 博客 | `src/content/blog/` 加一个 `.md` |
| 字号、灰阶、间距 | `src/styles/global.css` 顶部的 CSS 变量 |

## 加一篇论文

作者先在 `src/authors.ts` 里登记一次，之后所有论文引用 id 即可。然后在
`src/content/publications/` 新建 `.md`：

```yaml
---
title: 论文标题
authors: [me, zhangsan, lisi]   # src/authors.ts 里的 id，顺序即署名顺序
venue: NeurIPS                  # 保持原始大小写
year: 2026
awards: [Oral Presentation]     # 可选，可以有多个
blurb: 一句大白话，讲清楚这篇论文做了什么。
project: https://...            # 可选
arxiv: '2601.00010'             # 可选，自动生成 PDF + arXiv 两个链接
github: owner/repo              # 可选，自动生成 Code 链接
image: ./thumb.jpg              # 可选。有图渲染成左图右文，没图自动走纯文字
imageHover: /pubs/demo.mp4      # 可选。悬停时才播，首屏不拉视频
links:                          # 兜底：Video / Poster / BibTeX 之类
  - { label: Video, href: 'https://...' }
---
```

**`arxiv` 必须加引号。** 不加引号 YAML 会把 `2301.00010` 解析成浮点数，尾部的 0
被吃掉，链接就废了。schema 强制要求字符串，写成数字会直接构建失败。

引用了没登记的作者 id 也会**构建失败**并指出是哪篇论文，不会在页面上静默少一个人。

`image` 是可选的 —— 有图的条目自动渲染成「左图右文」，没图的自动退回纯文字排版，
按条目决定，不是全站开关。图片放在同一个文件夹里，构建时由 `astro:assets`
自动转 WebP/AVIF 并生成尺寸。`imageHover` 是视频，放 `public/` 下写绝对路径，
首屏只加载静态图，鼠标移上去才拉视频。

## 设计约定

- **纯灰阶**，没有强调色。层级只靠字号、字重、灰度值三样。
- **不使用 `text-transform`**。`arXiv`、`NeurIPS`、`PhD` 的大小写必须原样保留。
- **字体走系统栈**，macOS / iOS 上命中 SF Pro。Apple 的字体不允许作为 webfont
  分发，所以不自托管，也因此零网络请求、无字体闪烁。
- **图像统一 `grayscale(1)`**。

## 首次部署

仓库 Settings → Pages → Source 选 **GitHub Actions**，然后推一次 `main` 即可。
