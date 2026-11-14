# AsmCompOrg（汇编与计组自习室）协作文档

> 多 Agent 协作约定：每次改动涉及功能、数据结构、工作流、约定时，同一次提交里同步更新本文档。

## 项目简介

《汇编语言与计算机系统组成》的高质量内容型复习网站：9 章结构化课程 + 14 张彩色 SVG 概念图解 + 每章自测 + 闪卡复习 + 全文搜索 + 学习进度记录 + 昼/夜双主题。美术风格为「暖纸书房」（选定记录见 skill `web-art-style`）：昼间米白暖纸底 `#FBF9F4`、墨色 `#1C1B18`、赭红强调 `#C2410C`、衬线标题；夜间为同色系加深暖黑（`html.dark` 覆盖全套 token，accent 提亮为 `#E8733A`）。

## 技术栈与构建

- React 19 + TypeScript + Vite 7 + Tailwind 3，**无 UI 框架依赖**（模板自带 shadcn 组件已删除，组件全部手写）
- 本机坑：`node` 在 PATH 中是 Kimi.exe 伪装，必须用全路径并清空 Electron 变量：
  ```bash
  PATH="/c/Program Files/nodejs:$PATH" ELECTRON_RUN_AS_NODE= npm run build
  ```
- `npm run dev` 开发；`npm run build`（`tsc -b && vite build`）→ `dist/index.html`
- **产物是单文件**：`vite-plugin-singlefile` 把 JS/CSS 内联进 `dist/index.html`，file:// 直接双击可开（桌面快捷方式指向它）。改 Vite 配置时不要去掉这个插件。

## 目录结构

```
src/
  App.tsx               # 应用骨架：hash 路由 + 侧栏 + 首页/章节/闪卡三视图
  index.css             # 暖纸书房主题 token（--paper/--ink/--accent 等）
  data/
    types.ts            # Block/Section/Chapter/QuizItem/Card 数据模型
    chapters/ch1..ch9.ts# 九章内容（全部为结构化数据，改内容只动这里）
    index.ts            # 章节聚合与统计
  components/
    Blocks.tsx          # 内容块渲染器 + 行内排版 Rich（**加粗**、`行内代码`）
    Quiz.tsx            # 自测：单题即时反馈、全部答完出分、记录最好成绩
    Flashcards.tsx      # 闪卡：3D 翻面、认识/不熟标记、随机打乱
    SearchModal.tsx     # 全文搜索（Ctrl+K），跳转章节锚点
    diagrams/           # 14 张 SVG 图解，index.tsx 注册表按 id 引用
hooks/useProgress.ts    # localStorage 进度（asmcomporg-progress-v1）
assets/icon.ico         # 快捷方式图标
```

## 数据规范

- 新增章节：在 `data/chapters/` 加 `chN.ts`（实现 `Chapter` 接口），到 `data/index.ts` 注册。
- 新增图解：在 `components/diagrams/` 写组件，到 `index.tsx` 注册表加 id，然后在章节 blocks 里用 `{ type: 'diagram', id }` 引用。
- 闪卡 key 为 `${chapterId}:${index}`，重排卡序会使学习记录错位，追加不要重排。
- 进度只存本浏览器 localStorage，清缓存即丢——这是设计使然，不要引入服务端。

## 已知坑

- 行内排版只支持 `**加粗**` 与 `` `行内代码` ``，嵌套不解析。
- 移动端顶栏曾横向溢出：标题必须 `min-w-0 truncate`、搜索按钮移动端只留图标。改动顶栏后要在 375px 复查。
- 推送用 dulwich（GitHub 直连被墙，托管 Python 网络可用），凭据从 `git credential fill` 取。
- **颜色一律走 `index.css` 的主题 token**（`--paper/--card/--ink/--amber-ink` 等），禁止写死 `bg-white`、`#4d7c0f` 这类颜色，否则夜间模式破相。SVG 图解是唯一的例外：固定暖纸图版（`#fbf9f4`），深浅两模式通用。
- 主题持久化 key 为 `asmcomporg-theme`；`index.html` 内有防闪烁预置脚本，改主题机制时两边同步。
- 快捷方式图标 `assets/icon.ico` 是主题定制（暖纸底 + 衬线「汇」+ 赭红书签），重绘需保持风格且走 `assets/` + 重建 .lnk 的流程。

## 待办

- [ ] 增补内容：总线一章、更多例题与历年真题
- [ ] 闪卡间隔重复（当前只有认识/不熟二分）
- [ ] 图解动画（流水线、数据通路逐步演示）
