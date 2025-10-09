### 工作区通用规范

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

### 2) Profile 选择策略（集中式）
- 根级集中式：由 `.junie/profiles/<project>.md` 与 `.junie/guidelines.md` 共同构成，保证项目特有配置覆盖全局规范。, 其中`<project>` 表示根目录项目目录名称
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

## 5) 文档与版本策略（含自动创建与示例条款）
### README.md 更新规范
- **触发条件**：新增/修改/废弃功能、默认值变更、示例变化。
- **内容要求**：
    - 功能模块分节，每节对应一个功能模块
    - 每节包含：
        - 功能简介
        - 核心 API/方法（参数/返回值/异常/边界说明）
        - 示例调用（引用 example/ 目录）
        - 注意事项或限制说明
    - 废弃功能标注 Deprecated 与迁移建议
- **示例引用与一致性**：
    - 示例必须与 example/ 目录保持一致
    - 更新文档后，手动或通过脚本验证示例可运行
- **风格**：
    - 中文为主，英文术语用括号
    - 代码块标识语言，缩进 4 空格，LF 行尾，UTF-8

### CHANGELOG.md
- 所有对外变更记录，遵循 Keep a Changelog + SemVer
- 分类：Added/Changed/Fixed/Deprecated/Removed/Performance/Security
- 内部重构可按 Internal 简述或省略
- `[Unreleased]` 用于当前开发，发布时下沉到具体版本

### STATUS.md / ROADMAP.md
- 记录项目计划与状态：计划中 → 进行中 → 已实现
- 功能从“计划中”到“已实现”必须同步更新到 `[Unreleased]`

### 版本文件
- 与实际发布版本同步（package.json/go.mod/Cargo.toml 等）
- 发布时更新 CHANGELOG 与文档中版本引用

### 自动创建与自检
- **对象**：每个项目根的 README/CHANGELOG/STATUS，仓库根的 .editorconfig/.gitattributes
- **模式**：
    - check（CI）：检查文件是否缺失，缺失失败或告警
    - fix（本地/受控分支）：自动创建最小模板，提交 PR，不覆盖已有文件
- **例外**：可在 profiles/<project>.md 登记例外，CI 放宽
- **统一风格**：LF 行尾、4 空格缩进、UTF-8

#### 示例关联
- **新增/修改功能**
    - 必须在 `example/` 目录提供对应示例。
    - README 可通过注释引用示例路径或用简短说明保持文档完整性。
- **示例验证**
    - 文档更新后，需验证示例可运行，确保文档描述与代码行为一致。
    - CI 可选开启示例运行检查，提醒开发者同步更新。

#### 推荐实践
- 每次修改 API/功能时，先更新 CHANGELOG → 更新 README（含示例引用）→ 更新 STATUS → 更新 example 示例。
- 通过脚本统一检查 `example/` 目录、文档与版本号一致性，保证长期可执行性。

### 6) 代码修改与文档联动
- 适用范围：所有修改公开 API、默认值、示例、配置项、行为逻辑、重要内部能力的变更
- 要求：
    - 每次修改代码，必须确认以下文档是否需要同步更新：
    - README.md（示例、默认值、使用方法）
    - CHANGELOG.md（新增/修改/废弃功能）
        - STATUS.md（计划/已实现状态）
        - 类型声明文件（如 index.d.ts）或接口文档
        - 修改公共 API/行为时，PR 中必须列明受影响文档
- CI 自检：
    - 未同步更新文档时 PR 失败或警告（可按项目 Profile 放宽 STATUS.md）
    - 新增/修改示例代码必须手动验证可运行，保持与 README/文档一致

### 7) 测试与质量
- 覆盖要求：新增/修改路径提供正反与边界用例；核心路径维持基础覆盖线（门槛可在项目 Profile 设定）。
- 边界示例：
    - 输入为空/非法、分页参数边界、超时/重试边界；
    - 缓存/并发与时间相关行为（建议 fake timers 与并发去重测试）。
- 结构与命名：测试文件按功能域拆分，文件名 kebab-case；用例描述中文、聚焦行为。
- CI：Windows + Ubuntu × 受支持运行时矩阵；库项目建议补一次包体检查（如 `npm pack`）。

---

### 8) 多语言/技术栈默认命令（可被 Profile 覆盖）
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

### 9) 错误处理与输入校验（Node 默认使用 Joi，已修复）
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

### 10) 日志分级与敏感信息清洗（含可观测性增强）
- 分级：`debug/info/warn/error`；慢操作使用 `warn`。
- 慢查询日志：记录集合/命名空间、查询形状（字段集合）、耗时与阈值，不含具体数据值。
- 敏感信息：严禁记录账号、密码、完整连接串、令牌、个人数据；对象输出使用“安全序列化”。
- 结构化日志：建议使用 JSON 或键值对形式；支持通过环境变量配置日志级别。
- Tracing：建议接入 OpenTelemetry，在核心调用链埋点 `traceId/spanId`。
- Metrics：按需暴露基础指标（请求量/错误率/延迟分布，缓存命中率/淘汰）。

---

### 11) 缓存策略（要点）
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

### 12) 性能预算与准入
- 目标：缓存命中 `p50 < 10ms`；直连 `p95 < 100ms`（示例指标，可按需调整）。
- 观测：启用统计（如 `enableStats`）查看命中率与淘汰；定期汇总慢日志。
- 准入：影响平均/尾延迟的改动需在 PR 中说明取舍与验证数据。

---

### 13) 兼容性与 CI 矩阵
- 在项目 Profile 或 `README` 声明受支持的运行时/依赖主版本；大版本升级在 `CHANGELOG` 标注影响与迁移建议。
- CI 覆盖与声明矩阵一致（语言版本 × OS）。
- 参考矩阵：
    - OS：`Windows-latest`、`Ubuntu-latest`
    - Node：`18.x`、`20.x`
    - Python：`3.10`、`3.12`
    - Go：`1.22`
    - Shell：开发默认 PowerShell；CI（Ubuntu）使用 bash

---

### 14) 目录/导出与 TypeScript 声明
- 公共 API 门面清晰；Node 库仅通过入口导出，内部模块保持私有。
- 文件命名 kebab-case；导出采用驼峰（可按项目风格覆盖）。
- 若提供类型声明（如 `index.d.ts`），应为单一入口；实现变更需同步参数与返回类型与中文 JSDoc；可选引入 `tsd/dtslint` 做轻量校验。

---

### 15) API 稳定性与弃用（Deprecation）
- 稳定性：公开 API 在 patch/minor 中保持向后兼容；破坏性改动仅随 major 发布。
- 弃用流程：
    - 在 `CHANGELOG` 标注 `Deprecated` 与替代方案；
    - `README` 标注迁移建议（若影响使用者）；
    - 运行期打印一次性 `warn`（由 `MONOREPO_DEPRECATION_WARN` 控制：`1`=默认开，`0`=关），且不得包含敏感信息；
    - 至少保留一个 minor 周期后再移除，并提前在 `CHANGELOG` 说明目标移除版本。

---

### 16) 安全与配置
- 凭据通过环境变量或本地 `.env` 注入（不纳入版本控制）；示例/测试使用占位符。
- 默认提供合理的超时/限流/缓存 TTL 等安全参数；高敏场景避免过长 TTL。
- 供应链安全：建议启用 Dependabot/Renovate；在 CI 引入 SAST/Secret Scan（如 CodeQL/Trivy/Gitleaks 按需选择）。

---

### 17) 文档联动与自检
- 每次对外可见变更均需更新 `CHANGELOG [Unreleased]`；必要时更新 `README/STATUS`。
- 提交前比对 `README/示例` 与类型/接口声明（如 `index.d.ts`/接口文档）一致性。
- 在 CI 启用“文档自检”：缺失 `README/CHANGELOG` 直接失败；`STATUS` 可按项目 Profile 例外放宽。

---

### 18) PR 合并门禁清单
- [ ] 是否改变公开 API/行为/性能/兼容性/缓存键形状？
- [ ] 对应项目测试在声明矩阵下全部通过？
- [ ] `CHANGELOG [Unreleased]` 已更新？是否需要更新 `README/STATUS`？
- [ ] 日志与注释已去敏，无凭据/个人数据？
- [ ] 版本语义（patch/minor/major）已判定并同步至版本文件？
- [ ] CI `docs-check` 通过（`README/CHANGELOG` 存在；`STATUS` 依项目规则）？

---

### 19) 项目 Profile 最小模板（位于 \.junie\profiles/<project>.md）
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

### 20) 功能示例目录（example）
- **适用范围**：每次新增功能或修改现有功能的行为/参数，都必须在仓库 `example/` 目录下提供对应示例。
- **示例目录结构**（多语言项目可按语言分层）：
- **独立可运行**：示例代码应可直接执行，验证功能行为；仅允许使用 `.env.example` 等占位配置。
- **详细注释**：每个示例需包含：
    - 功能描述
    - 参数说明（类型、默认值、限制）
    - 返回值示例
    - 预期行为
    - 可选：边界或异常情况说明
- **文档一致**：示例中的 API、参数、返回值必须与 `README.md` / 类型声明文件保持一致。
- **覆盖核心场景**：至少覆盖主要使用场景，边界与异常可选。
- **更新规则**：
- **新增功能** → 必须添加示例
- **修改功能** → 必须更新相关示例，保持示例与最新功能一致
- **内部优化/性能调整** → 可选更新示例，但建议在注释中说明差异
- **推荐实践**：
- 通过脚本统一运行 `example/*` 下所有示例，确保长期可执行性。
- CI 可选开启示例可运行检查，提醒开发者同步更新。
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
