### 工作区通用规范

本规范用于在同一仓库内统一管理多个项目（库/服务/CLI；Node/Python/Go/Java/Rust…），以一致流程交付高质量变更。各项目通过根级集中式 \.github\profiles/<project>.md 声明运行命令、约束与“例外/覆盖”。

---

### 1) 基线风格与语言
- 缩进：4 个空格
- 行结尾：`LF`
- 编码：`UTF-8`
- 注释与文档：中文为主，英文术语用括号注明（如：命名空间（namespace））
- 行宽：≤100
- **引号**：双引号（项目可覆盖为单引号）
- **分号**：可选（项目可覆盖为必须）
- **模块系统**：ESM（项目可覆盖为 CommonJS）
- 建议在仓库根提交 `.editorconfig` 与 `.gitattributes` 统一风格（模板见"附录 A"）

---

### 2) Profile 选择策略（集中式）
- 根级集中式：由 `.github/profiles/<project>.md` 与 `.github/guidelines.md` 共同构成，保证项目特有配置覆盖全局规范。, 其中`<project>` 表示根目录项目目录名称
- 兜底：若未找到 `<project>.md`，使用 \.github\guidelines.md（本文）并提示补齐。
- 显式指定：允许通过环境变量 `GITHUB_PROFILE` 指定自定义路径（临时/实验用途）。
- 迁移提示：不再读取项目内 `<项目根>\.github\profile.md`；如有历史文件，请迁移至根级 `profiles/<project>.md` 并删除旧文件，避免歧义。

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

### 3.1) 功能添加完整流程（四要素：代码-测试-示例-文档）
本章节适用于所有新增功能或修改现有功能的场景，确保交付完整、可验证、可维护的变更。

#### 必需步骤（按顺序执行）
1. **实现功能代码**
   - 遵循基线风格（第1章）
   - 进行输入校验（第9章）
   - 适当的错误处理和日志（第10章）

2. **编写测试用例**（强制）
   - 位置：`test/` 目录，文件名与功能模块对应（如 `findPage.test.js`）
   - 覆盖要求：
     - ✅ 正常路径（主要使用场景）
     - ✅ 异常路径（非法输入、边界条件）
     - ✅ 边界用例（空值、最小/最大值、并发、超时）
   - 命名规范：测试描述用中文，聚焦行为而非实现
   - 验证方式：`npm test` 或项目定义的测试命令

3. **提供示例代码**（强制）
   - 位置：`examples/` 目录，文件名与功能对应（如 `findPage.examples.js`）
   - 要求：
     - ✅ 独立可运行（可直接执行验证）
     - ✅ 详细注释（功能描述、参数说明、返回值、预期行为）
     - ✅ 覆盖主要使用场景（至少1-2个典型场景）
     - ✅ 使用占位配置（如 `.env.example`），不含真实凭据
   - 验证方式：手动运行示例文件，确保输出符合预期

4. **更新文档**（强制）
   - `CHANGELOG.md`：在 `[Unreleased]` 下添加条目（Added/Changed/Fixed 等）
   - `README.md`：
     - 添加/更新功能说明、API 参数、返回值
     - 引用 `examples/` 中的示例（保持一致性）
     - 标注默认值、限制、注意事项
   - `STATUS.md`：更新功能状态（计划中 → 进行中 → 已实现）
   - 类型声明文件（如 `index.d.ts`）：同步更新类型定义和 JSDoc

5. **自检与验证**（提交前）
   - [ ] 测试全部通过（本地 + CI 矩阵）
   - [ ] 示例可独立运行且输出正确
   - [ ] 文档与代码一致（API 签名、参数、返回值）
   - [ ] 无敏感信息泄露（日志、注释、示例）
   - [ ] 类型声明文件已更新（如适用）

#### 流程图（快速参考）
```
功能需求
   ↓
[1] 实现代码 → [2] 编写测试 → [3] 提供示例 → [4] 更新文档 → [5] 自检验证
   ↓              ↓                ↓                ↓                ↓
代码实现      test/*.test.js   examples/*.js    CHANGELOG +      全部通过
            （正反边界）      （可运行+注释）   README +         ↓
                                              STATUS +        提交 PR
                                              类型声明
```

#### 示例场景：新增 `findPage` 功能
```
1. 实现 lib/mongodb/find-page.js
2. 编写 test/findPage.test.js（正常分页、边界limit、空结果、并发请求）
3. 提供 examples/findPage.examples.js（基础分页、排序、过滤组合）
4. 更新文档：
   - CHANGELOG.md: "## [Unreleased]\n- Added: `findPage` 分页查询支持"
   - README.md: 添加 API 说明和示例引用
   - docs/findPage.md: 详细文档（可选）
   - index.d.ts: 添加类型定义
5. 运行 npm test 和 node examples/findPage.examples.js 验证
```

#### 例外情况
- **内部重构/性能优化**：若不改变公开 API，可省略示例和 README 更新，但仍需测试覆盖
- **紧急修复（hotfix）**：可简化流程，但必须保留测试和 CHANGELOG
- **实验性功能**：可在项目 Profile 中标注，放宽部分要求

#### CI 自动检查
- 测试用例存在且通过
- `examples/` 目录包含对应示例文件
- `CHANGELOG.md` 的 `[Unreleased]` 有更新（通过 git diff 检测）
- 文档文件存在（README/CHANGELOG/STATUS）

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
        - 示例调用（引用 examples/ 目录）
        - 注意事项或限制说明
    - 废弃功能标注 Deprecated 与迁移建议
- **示例引用与一致性**：
    - 示例必须与 examples/ 目录保持一致
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
    - 必须在 `examples/` 目录提供对应示例。
    - README 可通过注释引用示例路径或用简短说明保持文档完整性。
- **示例验证**
    - 文档更新后，需验证示例可运行，确保文档描述与代码行为一致。
    - CI 可选开启示例运行检查，提醒开发者同步更新。

#### 推荐实践
- 每次修改 API/功能时，先更新 CHANGELOG → 更新 README（含示例引用）→ 更新 STATUS → 更新 examples 示例。
- 通过脚本统一检查 `examples/` 目录、文档与版本号一致性，保证长期可执行性。

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

### 默认测试框架（可被 Profile 覆盖）
- **Node.js**: Vitest / Jest（项目可覆盖为 Mocha 等）
- **断言库**: Vitest/Jest 默认使用 expect；Mocha 可选 assert/chai/expect
- **Python**: pytest
- **Go**: 内置 testing 包
- **Java**: JUnit
- **Rust**: 内置 cargo test

### 测试覆盖率默认标准（可被 Profile 覆盖）
- **行覆盖率**: ≥ 60%
- **分支覆盖率**: ≥ 60%
- **核心 API**: ≥ 70%
- 项目可在 Profile 中设定更高或更低的标准

### 测试要求
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

### 9) 错误处理与输入校验
- 公开 API 必做基本校验（类型/必填/范围），报错信息可行动且去敏；避免泄露连接 URI/凭据；保留原始错误于 `cause`。
- 建议错误结构：
```
{
    code: "VALIDATION_ERROR",
    message: "参数校验失败",
    details: [ { path: ["field"], type: "number.min", message: "..." } ],
    cause?: any
}
```
- 校验方案选择（项目根据需求自行选择）：
    - Node.js: Joi / Zod / Yup / 自定义校验
    - Python: pydantic / voluptuous
    - Go: go-playground/validator
    - Java: Jakarta Bean Validation
    - Rust: validator

- 参考示例（Node.js with Joi）：
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
- 其他语言在各自 `profiles/<project>.md` 指定等效校验方案。

---

### 10) 日志分级与敏感信息清洗（含可观测性增强）
- 分级：`debug/info/warn/error`；慢操作使用 `warn`。
- 慢查询日志：记录集合/命名空间、查询形状（字段集合）、耗时与阈值，不含具体数据值。
- 敏感信息：严禁记录账号、密码、完整连接串、令牌、个人数据；对象输出使用“安全序列化”。
- 结构化日志：建议使用 JSON 或键值对形式；支持通过环境变量配置日志级别。
- Tracing：建议接入 OpenTelemetry，在核心调用链埋点 `traceId/spanId`。
- Metrics：按需暴露基础指标（请求量/错误率/延迟分布，缓存命中率/淘汰）。

---

### 11) 兼容性与 CI 矩阵
- 在项目 Profile 或 `README` 声明受支持的运行时/依赖主版本；大版本升级在 `CHANGELOG` 标注影响与迁移建议。
- CI 覆盖与声明矩阵一致（语言版本 × OS）。
- 参考矩阵：
    - OS：`Windows-latest`、`Ubuntu-latest`
    - Node：`18.x`、`20.x`
    - Python：`3.10`、`3.12`
    - Go：`1.22`
    - Shell：开发默认 PowerShell；CI（Ubuntu）使用 bash

---

### 12) 目录/导出与 TypeScript 声明
- 公共 API 门面清晰；Node 库仅通过入口导出，内部模块保持私有。
- 文件命名 kebab-case；导出采用驼峰（可按项目风格覆盖）。
- 若提供类型声明（如 `index.d.ts`），应为单一入口；实现变更需同步参数与返回类型与中文 JSDoc；可选引入 `tsd/dtslint` 做轻量校验。

---

### 13) API 稳定性与弃用（Deprecation）
- 稳定性：公开 API 在 patch/minor 中保持向后兼容；破坏性改动仅随 major 发布。
- 弃用流程：
    - 在 `CHANGELOG` 标注 `Deprecated` 与替代方案；
    - `README` 标注迁移建议（若影响使用者）；
    - 运行期打印一次性 `warn`（由 `MONOREPO_DEPRECATION_WARN` 控制：`1`=默认开，`0`=关），且不得包含敏感信息；
    - 至少保留一个 minor 周期后再移除，并提前在 `CHANGELOG` 说明目标移除版本。

---

### 14) 安全与配置
- 凭据通过环境变量或本地 `.env` 注入（不纳入版本控制）；示例/测试使用占位符。
- 默认提供合理的超时/限流/缓存 TTL 等安全参数；高敏场景避免过长 TTL。
- 供应链安全：建议启用 Dependabot/Renovate；在 CI 引入 SAST/Secret Scan（如 CodeQL/Trivy/Gitleaks 按需选择）。

---

### 15) 文档联动与自检
- 每次对外可见变更均需更新 `CHANGELOG [Unreleased]`；必要时更新 `README/STATUS`。
- 提交前比对 `README/示例` 与类型/接口声明（如 `index.d.ts`/接口文档）一致性。
- 在 CI 启用“文档自检”：缺失 `README/CHANGELOG` 直接失败；`STATUS` 可按项目 Profile 例外放宽。

---

### 16) PR 合并门禁清单
- [ ] 是否改变公开 API/行为/性能/兼容性/缓存键形状？
- [ ] 对应项目测试在声明矩阵下全部通过？
- [ ] **测试用例已添加/更新**（`test/` 目录，覆盖正常+异常+边界场景）？
- [ ] **示例代码已添加/更新**（`examples/` 目录，可独立运行且有详细注释）？
- [ ] **示例已手动验证**（运行成功且输出符合预期）？
- [ ] `CHANGELOG [Unreleased]` 已更新？是否需要更新 `README/STATUS`？
- [ ] **文档与代码一致**（API 签名、参数、返回值、类型声明文件）？
- [ ] 日志与注释已去敏，无凭据/个人数据？
- [ ] 版本语义（patch/minor/major）已判定并同步至版本文件？
- [ ] CI `docs-check` 通过（`README/CHANGELOG` 存在；`STATUS` 依项目规则）？
- [ ] **功能添加完整流程**（参见第3.1章）已遵循？

---

### 17) 项目 Profile 最小模板（位于 \.github\profiles/<project>.md）
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

## 例外与覆盖
- 例外 X：<规则项> —— 理由/影响面/迁移建议

## 质量门槛（可选）
- 覆盖率门槛：行/分支/语句（如：70%/70%/70%）

## 风险与回滚
- hotfix + patch 流程
```

### 18) 功能示例目录（examples）
- **适用范围**：每次新增功能或修改现有功能的行为/参数，都必须在仓库 `examples/` 目录下提供对应示例。
- **示例目录结构**（多语言项目可按语言分层）：
- **独立可运行**：示例代码应可直接执行，验证功能行为；仅允许使用 `.env.examples` 等占位配置。
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
- 通过脚本统一运行 `examples/*` 下所有示例，确保长期可执行性。
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
