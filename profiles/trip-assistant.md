# trip-assistant 的 Profile（集中式）

## 项目规范
本项目需遵循 `.github/guidelines.md` 通用规范。以下为项目特定配置和例外。

---

## 关键目录与运行时
- 主目录与入口：`trip-assistant/`（按实际结构调整）
- 运行时与 OS：Python 3.10/3.12；Windows/Ubuntu（示例）

## 本地与 CI 命令（PowerShell 优先）
- 安装：`pip install -r requirements.txt`（或使用 poetry/uv）
- 测试：`pytest`（若有 tests/）
- 运行：`python -m trip_assistant` 或 README 中的入口脚本

## 文档与版本
- 需要存在：`README.md`、`CHANGELOG.md`、`STATUS.md`。
- 版本策略：Keep a Changelog + SemVer；Tag 示例：`trip-assistant@vX.Y.Z`。

## 例外与覆盖
- 若为应用而非库，包体检查可省略；其余遵循通用规范。

## 质量门槛（可选）
- 覆盖率门槛：后续在稳定后设定。

## 风险与回滚
- 采用 hotfix/* + patch 回滚流程。
