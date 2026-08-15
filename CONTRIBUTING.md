# Contributing / 贡献指南

Thank you for improving DSH Desktop Pet. 感谢你参与改进 DSH Desktop Pet。

## Development setup / 开发环境

Requirements: Node.js 20+, pnpm 10+, and a compatible DSH Web installation.

需要 Node.js 20+、pnpm 10+，以及兼容的 DSH Web。

```bash
git clone https://github.com/guojiangli/dsh-plugin-desktop-pet.git
cd dsh-plugin-desktop-pet
pnpm install
pnpm check
```

Install the checkout into a local Web profile:

```bash
dsh plugin --profile web add .
```

Restart `dsh web` after adding or removing the plugin. Client code changes require rebuilding with `pnpm build`; refresh the existing DSH page afterwards.

添加或移除插件后需要重启 `dsh web`。修改客户端源码后执行 `pnpm build`，然后刷新现有 DSH 页面。

## Pull requests / Pull Request

- Keep changes focused and explain user-visible behavior.
- Add or update tests when changing configuration or progress logic.
- Run `pnpm check` before opening a pull request.
- Commit regenerated `lib` artifacts with source changes so GitHub installs remain usable.
- Do not commit `node_modules`, package tarballs, personal images, or secrets.
- Update `CHANGELOG.md` for user-visible changes.

请保持改动聚焦，说明用户可见行为；配置或进度逻辑变化需要补测试；提交前运行 `pnpm check`。源码变化需要同步提交重新生成的 `lib`，但不要提交依赖目录、打包产物、个人图片或密钥。

## Commit messages / 提交信息

Conventional-style messages are preferred:

```text
feat: add click interaction
fix: clamp pet position after resize
docs: clarify npm installation
```

## Reporting issues / 反馈问题

Use the GitHub issue templates for bugs and feature requests. Security reports must follow [SECURITY.md](SECURITY.md) and must not be posted publicly.
