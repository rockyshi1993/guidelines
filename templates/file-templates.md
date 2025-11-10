# 项目文件模板

## .editorconfig
```
root = true

[*]
indent_style = space
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

## .gitattributes
```
* text=auto eol=lf
```

## README.md
```
# <项目名>

## 简介
一句话说明项目定位与核心能力。

## 支持矩阵
- OS: Windows/Ubuntu
- 运行时: <语言版本矩阵>

## 快速开始（PowerShell 示例）
```

## CHANGELOG.md
```
# Changelog

所有显著变更将记录在此文件，遵循 Keep a Changelog 与 SemVer。

## [Unreleased]
- Added:
- Changed:
- Fixed:
- Deprecated:
- Removed:
- Performance:
- Security:
```

## STATUS.md
```
# 状态与路线图

- 计划中：
- 进行中：
- 已实现：

注：由"计划中→已实现"需同步 CHANGELOG 的 [Unreleased]。
```

## 项目 Profile 模板（guidelines/profiles/<project>.md）
```
# <项目名> 的 Github Profile（集中式）

## 关键目录与运行时
- 主目录与入口：`src/`（示例）
- 运行时与 OS：Node 18/20；Windows/Ubuntu（示例）

## 本地与 CI 命令（PowerShell 优先）
- 安装：`npm ci`
- 测试：`npm test`
- 构建：`npm run build`
- 包体检查（库）：`npm pack`

## 文档与版本
- `CHANGELOG.md` 路径与维护方式（Keep a Changelog + SemVer）
- `README` 的更新触发条件

## MCP 配置（🔴 强制 - 使用 MCP 服务器的项目必填）
- 允许的 MCP 服务器: `<mcp-server-name>`（如：`mongodb-monsqlize`）
- 数据库/资源: `<database-name>`（如：`monsqlize`）
- 用途: `<purpose>`（如：测试数据查询和分析）
- 限制: `<restrictions>`（可选，如：只读权限、禁止删除操作）

**说明**: AI 助手必须先读取此配置才能调用 MCP 服务器。未配置则禁止调用任何 MCP。

## 例外与覆盖
- 例外 X：<规则项> —— 理由/影响面/迁移建议

## 质量门槛（可选）
- 覆盖率门槛：行/分支/语句（如：70%/70%/70%）

## 风险与回滚
- hotfix + patch 流程
```
