# ndsk_core 的 Junie Profile（集中式）

## 关键目录与运行时
- 主目录与入口：`ndsk_core/`（按实际子目录调整）
- 运行时与 OS：Node 18/20；Windows/Ubuntu（示例）

## 本地与 CI 命令（PowerShell 优先）
- 安装：`npm ci`（如为 Node 项目；若为其他语言，请在后续补充）
- 测试：`npm test`（或按照项目实际替换）
- 构建：`npm run build`（或按实际替换）

## 文档与版本
- 需要存在：`README.md`、`CHANGELOG.md`、`STATUS.md`。
- 版本策略：遵循 Keep a Changelog + SemVer；Tag 示例：`ndsk_core@vX.Y.Z`。

## 例外与覆盖
- 如项目暂未提供测试，可在补齐代码后启用；此处不声明例外。

## 质量门槛（可选）
- 覆盖率门槛：视项目成熟度后续补充。

## 风险与回滚
- 采用 hotfix/* + patch 回滚流程。
