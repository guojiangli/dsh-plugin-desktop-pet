# DSH Desktop Pet

[English](README.en.md) | 中文

[![CI](https://github.com/guojiangli/dsh-plugin-desktop-pet/actions/workflows/ci.yml/badge.svg)](https://github.com/guojiangli/dsh-plugin-desktop-pet/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/%40liguojiang%2Fdsh-plugin-desktop-pet)](https://www.npmjs.com/package/@liguojiang/dsh-plugin-desktop-pet)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

DeepSeek Harness Web 的桌面电子宠物插件。宠物显示在工作区悬浮层，可拖动、关闭、替换图片，并根据当前会话状态和任务列表显示工作进度。

![桌面电子宠物设置页](docs/desktop-pet.png)

## 功能

- 在 DSH 工作区显示可拖动电子宠物
- 从宠物按钮关闭，并在设置页重新打开
- 上传 PNG、JPEG、WebP 或 GIF 图片，最大 2 MB
- 编辑宠物名称、尺寸和待机动效
- 读取当前会话运行状态
- 在 DSH 发布 `todos` 投影时显示当前任务和完成数量
- 在“设置 > 插件 > 电子宠物”集中管理配置
- 支持深浅色主题和 `prefers-reduced-motion`

## 兼容性

- DeepSeek Harness：`0.1.0-rc.6`
- Node.js：`>=20`
- 浏览器：DSH Web 当前支持的现代浏览器

## 安装

从 npm 安装：

```bash
dsh plugin --profile web add @liguojiang/dsh-plugin-desktop-pet
```

重启 `dsh web`，然后打开“设置 > 插件 > 电子宠物”。

从 GitHub 安装开发版本：

```bash
dsh plugin --profile web add github:guojiangli/dsh-plugin-desktop-pet
```

卸载：

```bash
dsh plugin --profile web remove @liguojiang/dsh-plugin-desktop-pet
```

## 隐私

插件没有服务器接口，也不会上传图片。配置和自定义图片以 Data URL 形式保存在当前浏览器的 `localStorage` 中。清除站点数据会同时清除宠物配置。

## 已知限制

- 配置只在当前浏览器和当前站点生效，不会跨设备同步。
- 浏览器存储容量有限，因此单张图片限制为 2 MB。
- 只有当前会话提供 `todos` 投影时才显示任务进度条；否则只显示运行或待命状态。
- 新安装的 DSH 客户端插件需要重启 `dsh web` 才能进入客户端 roster。

## 开发

```bash
pnpm install
pnpm build
pnpm test
pnpm check
```

源码位于 `src/`，生成文件位于 `lib/`。`scripts/build.mjs` 使用 esbuild 生成 DSH `window.__ModuleLoader__` 客户端 bundle，TypeScript 同时生成公开类型声明。

本地安装当前目录：

```bash
dsh plugin --profile web add .
```

## 贡献

提交代码前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 和 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。安全问题请按 [SECURITY.md](SECURITY.md) 私下报告。

## 许可证

[MIT](LICENSE) © 2026 guojiangli
