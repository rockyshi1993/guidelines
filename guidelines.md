### 工作区通用规范（Junie 通用版 v2.1，按建议修复版）

本规范用于在同一仓库内统一管理多个项目（库/服务/CLI；Node/Python/Go/Java/Rust…），以一致流程交付高质量变更。各项目通过根级集中式 \.junie\profiles/<project>.md 声明运行命令、约束与“例外/覆盖”。

---

### 1) 基线风格与语言
- 缩进：4 个空格
- 行结尾：`LF`
- 编码：`UTF-8`
- 注释与文档：中文为主，英文术语用括号注明（如：命名空间（namespace））
- 行宽：≤100
- 建议在仓库根提交 `.editorconfig` 与 `.gitattributes` 统一风格（模板见“附录 A”）

---

### 2) Profile 选择策略（集中式，已修复）
- 唯一来源：根级集中式 \.junie\profiles/<project>.md。
- 兜底：若未找到 `<project>.md`，使用 \.junie\guidelines.md（本文）并提示补齐。
- 显式指定：允许通过环境变量 `JUNIE_PROFILE` 指定自定义路径（临时/实验用途）。
- 迁移提示：不再读取项目内 `<项目根>\.junie\profile.md`；如有历史文件，请迁移至根级 `profiles/<project>.md` 并删除旧文件，避免歧义。

---

### 3) 提交与 PR 规范
- 提交信息：Conventional Commits（`feat|fix|docs|test|refactor|chore|build|perf|ci`），建议带 scope（如：`feat(api): ...`）。
- PR 必填：
    - 动机与背景
    - 方案概述
    - 影响面（API/行为/性能/兼容性/缓存键形状）
    - 迁移建议（如有）
    - 测试说明（正反/边界覆盖、时间与并发相关用例）
    - 文档更新（`README/CHANGELOG/STATUS`）
- PR 描述模板：
```
- 动机与背景：
- 方案概述：
- 影响面（API/行为/缓存键/性能/兼容性）：
- 迁移建议（如有）：
- 测试说明（用例要点/边界覆盖）：
- 文档更新（README/CHANGELOG/STATUS）：
- 风险与回滚预案：
```

---

### 4) 分支与发布
- 分支策略：
    - `main`：始终保持可发布状态
    - `feature/*`、`fix/*`：从 `main` 派生，以 PR 合并
- 发布步骤（SemVer）：
    1) 在 `<项目>\CHANGELOG.md` 的 `[Unreleased]` 补全条目；
    2) 下沉为 `[x.y.z]` 并填写日期；
    3) 同步版本文件（`package.json`/`pom.xml`/`go.mod`/`Cargo.toml` 等）；
    4) 打 Tag（`vX.Y.Z`）；
    5) 合并至 `main` 并发布；问题回滚采用 `hotfix/*` + patch。
- 版本语义：
    - `fix` → patch（`x.y.z → x.y.(z+1)`）
    - 向后兼容功能 → minor（`x.y.z → x.(y+1).0`）
    - 破坏性改动 → major（`(x+1).0.0`）

---

### 5) 文档与版本策略（含自动创建条款，已修复）
- `README.md`：凡影响公共 API/默认值/示例或新增/下线重要能力，必须更新；更新后手动验证示例可运行。
- `CHANGELOG.md`：每次对外可见变更都记录（分类：Added/Changed/Fixed/Deprecated/Removed/Performance/Security；内部重构可按 Internal 简述或省略）。
- `STATUS.md/ROADMAP.md`：计划→已实现需同步到 `CHANGELOG` 的 `[Unreleased]`。
- 版本文件需与实际发布版本同步（如 `package.json`、`go.mod`、`Cargo.toml` 等）。

#### 文档/风格文件缺失的自动创建策略
- 适用对象：
    - 每个项目根：`README.md`、`CHANGELOG.md`、`STATUS.md`
    - 仓库根：`.editorconfig`、`.gitattributes`
- 模式：
    - `check`（默认，CI）：仅检查是否缺失，缺失则失败或警告（阈值可在 `profiles/<project>.md` 配置）。
    - `fix`（可选，本地或受控分支）：自动创建最小模板并提交 PR（不覆盖已存在文件）。
- 统一风格：LF 行结尾、缩进 4 空格、UTF-8；创建过程保持幂等。
- 例外与覆盖：若某项目不需要 `STATUS.md` 等，请在其 `profiles/<project>.md` 登记例外，CI 自检据此放宽。
- 参考：附录提供 PowerShell 脚本与 GitHub Actions 示例（见“附录 C/D”）。

---

### 6) 测试与质量
- 覆盖要求：新增/修改路径提供正反与边界用例；核心路径维持基础覆盖线（门槛可在项目 Profile 设定）。
- 边界示例：
    - 输入为空/非法、分页参数边界、超时/重试边界；
    - 缓存/并发与时间相关行为（建议 fake timers 与并发去重测试）。
- 结构与命名：测试文件按功能域拆分，文件名 kebab-case；用例描述中文、聚焦行为。
- CI：Windows + Ubuntu × 受支持运行时矩阵；库项目建议补一次包体检查（如 `npm pack`）。

---

### 7) 多语言/技术栈默认命令（可被 Profile 覆盖）
- Node.js：
    - 安装：`npm ci`
    - 测试：`npm test`（或 `node test\run-tests.js`）
    - 构建：`npm run build`
    - 发布/校验：版本由 `package.json` + `CHANGELOG` 管理；可选 `npm pack`
- Python：`pytest`；安装使用 `pip`/`poetry`；可选 `build + twine`；记录 `CHANGELOG`
- Go：`go test ./...`；`go build`；版本与 Tag 管理；记录 `CHANGELOG`
- Java：`mvn test`/`gradle test`；`mvn package`/`gradle build`；同步版本；记录 `CHANGELOG`
- Rust：`cargo test`/`cargo build`；`Cargo.toml` 版本同步；记录 `CHANGELOG`

---

### 8) 错误处理与输入校验（Node 默认使用 Joi，已修复）
- 公开 API 必做基本校验（类型/必填/范围），报错信息可行动且去敏；避免泄露连接 URI/凭据；保留原始错误于 `cause`。
- Node/TypeScript 项目默认使用 `Joi`；建议错误结构：
```
{
    code: "VALIDATION_ERROR",
    message: "参数校验失败",
    details: [ { path: ["field"], type: "number.min", message: "..." } ],
    cause?: any
}
```
- 参考（Node）：
```
const Joi = require("joi");

const schema = Joi.object({
    id: Joi.string().uuid().required(),
    limit: Joi.number().integer().min(1).max(100).default(20),
    timeout: Joi.number().integer().greater(0).default(3000)
});

function validateInput(input) {
    const { value, error } = schema.validate(input, { abortEarly: false, convert: true });
    if (error) {
        const details = error.details.map(d => ({ path: d.path, type: d.type, message: d.message }));
        const err = new Error("参数校验失败");
        err.code = "VALIDATION_ERROR";
        err.details = details;
        throw err;
    }
    return value;
}
```
- 其他语言在各自 `profiles/<project>.md` 指定等效校验方案：
    - Python→`pydantic`/`voluptuous`；Go→`go-playground/validator`；Java→`Jakarta Bean Validation`；Rust→`validator`。

---

### 9) 日志分级与敏感信息清洗（含可观测性增强）
- 分级：`debug/info/warn/error`；慢操作使用 `warn`。
- 慢查询日志：记录集合/命名空间、查询形状（字段集合）、耗时与阈值，不含具体数据值。
- 敏感信息：严禁记录账号、密码、完整连接串、令牌、个人数据；对象输出使用“安全序列化”。
- 结构化日志：建议使用 JSON 或键值对形式；支持通过环境变量配置日志级别。
- Tracing：建议接入 OpenTelemetry，在核心调用链埋点 `traceId/spanId`。
- Metrics：按需暴露基础指标（请求量/错误率/延迟分布，缓存命中率/淘汰）。

---

### 10) 缓存策略（要点）
- 启用条件：仅当 `TTL>0` 时启用缓存；单位建议毫秒；`0/未传` 表示直连后端。
- 键形状：固定字段集（示例：`iid/type/db/collection/op/query/options`），采用稳定序列化。
- 稳定序列化建议：
    - 对象键名按字典序排序；
    - 数值/布尔/Null 标准化；日期使用 ISO 8601（UTC）；
    - 可使用稳定 JSON 序列化 + 哈希（如 SHA-256）生成最终键。
- 失效：按项目定义的接口（如 `collection.invalidate(op?)`）在当前命名空间生效；底层 `delPattern` 仅用于中小规模场景。
- 并发去重：相同键共享 inflight；异常/超时后清理 inflight，避免“幽灵占用”。
- 内存预算：支持 `maxSize/maxMemory`（估算），LRU 淘汰最久未使用项；可选“后台刷新”（stale-while-revalidate）。

---

### 11) 性能预算与准入
- 目标：缓存命中 `p50 < 10ms`；直连 `p95 < 100ms`（示例指标，可按需调整）。
- 观测：启用统计（如 `enableStats`）查看命中率与淘汰；定期汇总慢日志。
- 准入：影响平均/尾延迟的改动需在 PR 中说明取舍与验证数据。

---

### 12) 兼容性与 CI 矩阵
- 在项目 Profile 或 `README` 声明受支持的运行时/依赖主版本；大版本升级在 `CHANGELOG` 标注影响与迁移建议。
- CI 覆盖与声明矩阵一致（语言版本 × OS）。
- 参考矩阵：
    - OS：`Windows-latest`、`Ubuntu-latest`
    - Node：`18.x`、`20.x`
    - Python：`3.10`、`3.12`
    - Go：`1.22`
    - Shell：开发默认 PowerShell；CI（Ubuntu）使用 bash

---

### 13) 目录/导出与 TypeScript 声明
- 公共 API 门面清晰；Node 库仅通过入口导出，内部模块保持私有。
- 文件命名 kebab-case；导出采用驼峰（可按项目风格覆盖）。
- 若提供类型声明（如 `index.d.ts`），应为单一入口；实现变更需同步参数与返回类型与中文 JSDoc；可选引入 `tsd/dtslint` 做轻量校验。

---

### 14) API 稳定性与弃用（Deprecation）
- 稳定性：公开 API 在 patch/minor 中保持向后兼容；破坏性改动仅随 major 发布。
- 弃用流程：
    - 在 `CHANGELOG` 标注 `Deprecated` 与替代方案；
    - `README` 标注迁移建议（若影响使用者）；
    - 运行期打印一次性 `warn`（由 `MONOREPO_DEPRECATION_WARN` 控制：`1`=默认开，`0`=关），且不得包含敏感信息；
    - 至少保留一个 minor 周期后再移除，并提前在 `CHANGELOG` 说明目标移除版本。

---

### 15) 安全与配置
- 凭据通过环境变量或本地 `.env` 注入（不纳入版本控制）；示例/测试使用占位符。
- 默认提供合理的超时/限流/缓存 TTL 等安全参数；高敏场景避免过长 TTL。
- 供应链安全：建议启用 Dependabot/Renovate；在 CI 引入 SAST/Secret Scan（如 CodeQL/Trivy/Gitleaks 按需选择）。

---

### 16) 文档联动与自检
- 每次对外可见变更均需更新 `CHANGELOG [Unreleased]`；必要时更新 `README/STATUS`。
- 提交前比对 `README/示例` 与类型/接口声明（如 `index.d.ts`/接口文档）一致性。
- 在 CI 启用“文档自检”：缺失 `README/CHANGELOG` 直接失败；`STATUS` 可按项目 Profile 例外放宽。

---

### 17) PR 合并门禁清单
- [ ] 是否改变公开 API/行为/性能/兼容性/缓存键形状？
- [ ] 对应项目测试在声明矩阵下全部通过？
- [ ] `CHANGELOG [Unreleased]` 已更新？是否需要更新 `README/STATUS`？
- [ ] 日志与注释已去敏，无凭据/个人数据？
- [ ] 版本语义（patch/minor/major）已判定并同步至版本文件？
- [ ] CI `docs-check` 通过（`README/CHANGELOG` 存在；`STATUS` 依项目规则）？

---

### 18) 项目 Profile 最小模板（位于 \.junie\profiles/<project>.md）
```
# <项目名> 的 Junie Profile（集中式）

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

## 例外与覆盖
- 例外 X：<规则项> —— 理由/影响面/迁移建议

## 质量门槛（可选）
- 覆盖率门槛：行/分支/语句（如：70%/70%/70%）

## 风险与回滚
- hotfix + patch 流程
```

---

### 附录 A：根级风格文件模板
- `.editorconfig`
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
- `.gitattributes`
```
* text=auto eol=lf
```

---

### 附录 B：文档最小模板
- `README.md`
```
# <项目名>

## 简介
一句话说明项目定位与核心能力。

## 支持矩阵
- OS: Windows/Ubuntu
- 运行时: <语言版本矩阵>

## 快速开始（PowerShell 示例）
```
- `CHANGELOG.md`
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
- `STATUS.md`
```
# 状态与路线图

- 计划中：
- 进行中：
- 已实现：

注：由“计划中→已实现”需同步 CHANGELOG 的 [Unreleased]。
```

---

### 附录 C：本地自检与初始化脚本（PowerShell 示例，幂等）
```
Param(
    [Parameter(Mandatory=$false)] [ValidateSet("check","fix")] [string] $mode = "fix",
    [Parameter(Mandatory=$false)] [string[]] $projects = @(
        "D:\\Project\\vsse" # 示例：按需维护项目根路径清单
    )
)

function Ensure-File {
    param([string] $Path, [string] $Content)
    if (Test-Path -LiteralPath $Path) { return $false }
    if ($mode -eq "check") { throw "缺失文件: $Path" }
    $dir = Split-Path -Parent $Path
    if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    $lf = $Content -replace "\r\n?","\n"
    [System.IO.File]::WriteAllText($Path, $lf, [System.Text.Encoding]::UTF8)
    return $true
}

# 1) 仓库根风格文件
$repoRoot = (Get-Location).Path
$changed = $false
$changed = (Ensure-File -Path (Join-Path $repoRoot ".editorconfig") -Content @"
root = true

[*]
indent_style = space
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
"@) -or $changed
$changed = (Ensure-File -Path (Join-Path $repoRoot ".gitattributes") -Content "* text=auto eol=lf
") -or $changed

# 2) 各项目文档文件
$readme = @"# <项目名>

## 简介
一句话说明项目定位与核心能力。

## 支持矩阵
- OS: Windows/Ubuntu
- 运行时: <语言版本矩阵>

## 快速开始（PowerShell 示例）
"@
$changelog = @"# Changelog

所有显著变更将记录在此文件，遵循 Keep a Changelog 与 SemVer。

## [Unreleased]
- Added:
- Changed:
- Fixed:
- Deprecated:
- Removed:
- Performance:
- Security:
"@
$status = @"# 状态与路线图

- 计划中：
- 进行中：
- 已实现：

注：由“计划中→已实现”需同步 CHANGELOG 的 [Unreleased]。
"@

foreach ($p in $projects) {
    if (-not (Test-Path -LiteralPath $p)) { Write-Host "跳过不存在目录: $p"; continue }
    $changed = (Ensure-File -Path (Join-Path $p "README.md") -Content $readme) -or $changed
    $changed = (Ensure-File -Path (Join-Path $p "CHANGELOG.md") -Content $changelog) -or $changed
    $changed = (Ensure-File -Path (Join-Path $p "STATUS.md") -Content $status) -or $changed
}

if ($mode -eq "fix" -and $changed) { Write-Host "已创建缺失模板文件。" }
elseif ($mode -eq "check") { Write-Host "自检完成：未发现缺失文件。" }
```

---

### 附录 D：GitHub Actions（CI 自检与自动补齐 PR 示例）
```
name: docs-ensure

on:
  pull_request:
  workflow_dispatch:
    inputs:
      autofix:
        description: "Auto-fix missing docs and open PR"
        required: false
        default: "false"

jobs:
  docs-check:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, ubuntu-latest]
    steps:
      - uses: actions/checkout@v4
      - name: Run docs check
        shell: pwsh
        run: |
          pwsh tools/ensure-project-docs.ps1 -mode check

  docs-fix-pr:
    if: ${{ github.event.inputs.autofix == 'true' && github.ref != 'refs/heads/main' }}
    runs-on: windows-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - name: Auto fix missing docs
        shell: pwsh
        run: |
          pwsh tools/ensure-project-docs.ps1 -mode fix
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v6
        with:
          commit-message: "chore(docs): auto-create missing docs and style files"
          title: "chore(docs): auto-create missing docs and style files"
          body: |
            自动创建缺失的 README/CHANGELOG/STATUS 以及根级 .editorconfig/.gitattributes。
            - 统一缩进 4 空格、LF 行结尾。
          branch: chore/auto-create-docs
          base: ${{ github.ref_name }}
```

---

### 与旧版的主要差异（本次修复点）
- 统一缩进为 4 空格（替换旧文档的 2 空格描述），行结尾统一 `LF`。
- Profile 选择策略改为“仅集中式 \.junie\profiles/<project>.md”，不再读取项目内 `profile.md`。
- 新增“文档/风格文件缺失的自动创建策略”，并提供脚本与 CI 示例。
- 固化“Node 默认使用 `Joi` 进行公开 API 输入校验”，并给出错误结构与示例代码。