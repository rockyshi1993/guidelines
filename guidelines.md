# 工作区通用规范（Junie）

- 目标：在同一仓库下支撑多个项目（库/服务/CLI，Node/Python/Go/Java/Rust…），以统一流程交付高质量变更。
- 平台与环境：默认示例基于 Windows/PowerShell；CI 建议同时覆盖 Linux（ubuntu-latest）。行结尾统一 LF；缩进 2 空格；注释内换行续行缩进 4 空格。
- 注释与文档：中文为主，英文术语用括号注明（如：命名空间（namespace））；公开 API/关键内部方法用 JSDoc/等价注释；敏感信息不出现在注释/日志；行宽≤100。
- 提交与 PR：遵循 Conventional Commits（feat|fix|docs|test|refactor|chore|build|perf|ci，建议带 scope，如 feat(api): …）。PR 必填：动机与方案、影响面（API/行为/性能/兼容性）、迁移建议、测试说明、文档更新（README/CHANGELOG/STATUS）。
- 文档与版本策略（通用）：
  - README：仅在公共 API/默认值/示例变更时更新；
  - CHANGELOG：每次对外可见变更都更新（Added/Changed/Fixed/Deprecated/Removed/Performance/Security；Keep a Changelog + SemVer）；
  - STATUS/ROADMAP：能力矩阵与路线图；“计划中→已实现”需同步 CHANGELOG Unreleased；
  - 版本号需与包/模块清单同步（package.json/pom.xml/go.mod/Cargo.toml 等）。
- 分支与发布：main 可发布；feature/xxx、fix/xxx 从 main 派生；发版步骤：整理 CHANGELOG Unreleased → 冻结为 [x.y.z] 写日期 → 同步版本号 → 打 Tag（vX.Y.Z）→ 发布；回滚采用 hotfix 分支 + patch 版本。
- 错误与日志：统一错误类型或错误码；错误消息可行动且去敏，保留 cause；日志分级 debug/info/warn/error；慢操作采用 warn，输出“形状/字段集合”，不含敏感值。
- 测试与质量：新增/修改路径需含正反与边界用例；核心路径保持基础覆盖线；时间/缓存/并发场景建议使用 fake timers 与并发去重测试；CI：Windows + Ubuntu × 受支持运行时矩阵，执行测试与（对库）包体检查（如 npm pack）。
- 安全与配置：示例/测试使用占位符；凭据通过环境变量或本地 .env 注入（不纳入版本控制）；默认安全参数合理（如超时/限流/缓存 TTL）。

## 自动选择策略（Junie 执行流程）
1) 路径判定：若改动集中在 D:\\Project\\<项目>\\...，优先查找 <项目根>\\.junie\\profile.md（或 <项目根>\\.junie\\guidelines.md）。
2) 根级索引：如项目内未提供 Profile，则回落至根级 .junie\\profiles/<project>.md（若存在）。
3) 兜底：仍未匹配则使用本节“通用规范”，并提示补充项目内 Profile。
4) 显式指定：若 issue/描述中提供“项目名”或 JUNIE_PROFILE 路径，按指定优先。

### 如何创建项目 Profile（三步法）
1) 在 <项目根>\\.junie 创建 profile.md（或沿用 .junie\\guidelines.md）。
2) 填写最小必要事实：关键目录与入口、测试命令（Windows/PowerShell 优先）、运行时范围、构建/发布要点、与 README/CHANGELOG 的联动、通用规范的“例外与覆盖”（如有）。
3) 验证：在项目目录执行测试，确认自动选择策略命中项目内 Profile；若 npm scripts/目录结构变更，请同步该文件。

## 多语言/技术栈默认约定（可被 Profile 覆盖）
- Node.js：测试 npm test（或 node test\\run-tests.js）；若有构建使用 npm run build；包发布遵循 package.json version + CHANGELOG；可选引入 tsd/dtslint 做 d.ts 轻量校验。
- Python：pytest；pip/poetry 安装；可选 build + twine 发布；CHANGELOG 记录。
- Go：go test ./...；go build；版本与 Tag 管理；CHANGELOG 记录。
- Java：mvn test/gradle test；mvn package/gradle build；版本文件同步；CHANGELOG 记录。
- Rust：cargo test/build；Cargo.toml 版本同步；CHANGELOG 记录。

## PR 检查清单（通用）
- [ ] 影响面：是否改变公开 API/行为/性能/兼容性/缓存键形状（如适用）
- [ ] 测试：在对应项目目录运行测试全部通过（见项目 Profile）
- [ ] 文档：README/CHANGELOG/STATUS 是否需要更新
- [ ] 安全：日志与注释去敏，无凭据与个人数据
- [ ] 版本：版本语义（patch/minor/major）与包/模块版本同步

---



## 文档与版本策略
- README（只在以下情况更新）：
  - 公共 API/默认值变更（例如 maxTimeMS、findLimit、缓存默认策略）。
  - 新增或下线重要能力（例如新增数据库适配器、缓存关键开关）。
  - 快速开始/示例需要调整时。
- CHANGELOG（每次对外可见的变更都要更新）：
  - Added / Changed / Fixed / Deprecated / Removed / Performance / Security。
  - 内部重构若不影响行为，可按 Internal 简述或省略（建议简述）。
- 实施方式：
  - 在 <项目>\CHANGELOG.md 的 [Unreleased] 下追加条目；发版时将 Unreleased 下沉为新版本块并写日期（具体路径见项目 Profile）；
  - 与对应项目的版本文件保持同步（如 package.json/pom.xml/go.mod/Cargo.toml 等），遵循 SemVer：
    - fix → patch（x.y.z → x.y.(z+1)）
    - 向后兼容功能 → minor（x.y.z → x.(y+1).0）
    - 破坏性改动 → major（(x+1).0.0）

### PR 检查清单补充
- [ ] 已更新 CHANGELOG（Unreleased）
- [ ] 是否需要更新 README（若公共行为/默认值/示例变更）
- [ ] 版本语义已判定（patch/minor/major）
- [ ] 如影响缓存键形状/性能/语义，是否标注影响面与迁移建议



## 流程与质量（补充规范）

### 分支与发布流程
- 分支策略：
  - main：始终保持可发布状态。
  - feature/xxx、fix/xxx：从 main 派生，完成后以 PR 合并。
- 发布步骤（与 SemVer 对齐）：
  1) 在 <项目>\CHANGELOG.md 的 [Unreleased] 补全条目（或按项目 Profile 指定路径）；
  2) 冻结为新版本块 [x.y.z] 并填写日期；
  3) 同步项目版本文件（如 package.json/pom.xml/go.mod/Cargo.toml 等）；
  4) 打 Tag（vX.Y.Z）；
  5) 合并至 main 并发布；问题回滚采用 hotfix 分支 + patch 版本快速发布。

### API 稳定性与弃用（Deprecation）
- 稳定性：公开 API 在 patch/minor 中保持向后兼容；破坏性改动仅随 major 发布。
- 弃用流程：
  - 在 CHANGELOG 标注 Deprecated 与替代方案；
  - README 标注迁移建议（若影响使用者）；
  - 运行期打印一次性 warn（可用环境变量关闭），不得包含敏感信息；
  - 至少保留一个 minor 周期后再移除，提前在 CHANGELOG 说明目标移除版本。
- 统一开关：通过环境变量 MONOREPO_DEPRECATION_WARN 控制一次性弃用告警（1=开启 默认；0=关闭）。

### 例外与覆盖机制
- 优先级：项目内 Profile > 根级 profiles/<project>.md > 根级通用指南。
- 要求：若对通用规则做例外，必须在项目 Profile 中记录条目、理由、影响面与迁移建议，并在 PR 描述同步说明。
- 审计：根级可维护“例外登记表”（可选，仅索引），便于回溯与治理。

### 错误处理与输入校验
- 公开 API 必做基本校验：类型/必填/范围；给出可行动的报错信息（避免泄露连接 URI/凭据）。
- 错误类型：建议统一为项目自定义错误（如 XxxError，或附带 code 字段）；保留原始错误于 cause。
- 常见边界（示例，具体以项目 Profile 为准）：
  - 分页/limit：未传时的默认策略、0 的语义（不限制或禁用）应明确定义；负数/NaN 应抛出校验错误。
  - 超时/重试：maxTimeMS/timeout 必须为 >0 的整数；非法值应报错或回退默认并给出一次性 warn。
  - 缓存：仅当 TTL>0 时启用，单位建议以毫秒为准；0/未传表示直连后端。

### 日志分级与敏感信息清洗
- 分级：debug/info/warn/error；慢查询采用 warn。
- 慢查询日志：记录集合/命名空间、查询形状（字段集合）、耗时与阈值，不含具体数据值。
- 敏感信息：严禁记录账号、密码、完整连接串、令牌、个人数据等；打印对象使用“安全序列化”。

### 缓存策略细化
- 何时不使用缓存：强一致需求（写后立即读）、低复用、高动态性查询。
- TTL 建议：热点 100–1000ms；中频 1–5s；低频 >10s；避免过长导致陈旧。
- 键形状：包含受控字段集（例如 iid/type/db/collection/op/query/options），采用稳定序列化；
- 失效：按项目定义的失效接口（例如 collection.invalidate(op?)）在当前命名空间生效；底层 delPattern 仅用于中小规模场景。
- 并发去重：相同键共享 inflight Promise；异常/超时后清理 inflight，避免“幽灵占用”。
- 内存预算：支持 maxSize/maxMemory（估算），LRU 淘汰最久未使用项。

### 性能与慢查询预算
- 目标：缓存命中 p50 < 10ms；直连 p95 < 100ms（示例指标，可按需调整）。
- 观测：enableStats 查看命中率与淘汰；定期汇总慢日志。
- 准入：影响平均/尾延迟的改动需在 PR 中解释取舍与验证数据。

### 兼容性与支持策略
- 运行时与依赖：受支持的运行时/依赖主版本应在项目 Profile 或 README 中声明；大版本升级需在对应项目 CHANGELOG 标注影响与迁移建议。
- 操作系统与 Shell：开发默认 Windows/PowerShell；CI 建议同时覆盖 Windows 与 Linux（ubuntu-latest）。
- CI 覆盖：CI 应与声明的兼容矩阵保持一致（语言版本 × OS）。

### 运行时与 CI 矩阵模板（说明性）
- OS：Windows-latest、Ubuntu-latest
- 运行时矩阵（示例）：
  - Node：18.x、20.x（LTS）
  - Python：3.10、3.12
  - Go：1.22
- Shell：开发默认 PowerShell；CI（Ubuntu）使用 bash
- Node 项目任务约定：
  - 安装：npm ci
  - 测试：npm test（或 node test\\run-tests.js）
  - 构建（如有）：npm run build
  - 包体检查（库）：npm pack（仅库项目）

### 测试规范细化
- 覆盖范围（示例）：
  - 功能：对新增/修改路径提供正反向用例；
  - 边界：输入为空/非法、超时/重试参数边界、分页参数边界、缓存/并发与时间相关行为（如适用）；
  - 互操作：跨组件/跨模块调用的契约测试（如适用）；
  - 日志与去敏：慢操作日志触发路径与敏感信息不泄露（如适用）。
- 结构与命名：测试文件按功能域拆分，文件名 kebab-case；用例描述使用中文，聚焦行为与期望。
- 要求：变更公共行为需补充测试用例；核心路径保持基础覆盖率（可先软约束，如 >70%）。

### 目录/导出规范
- 各项目应保持清晰的公共 API 门面；Node 库建议仅通过入口文件导出，内部模块保持私有。
- 工具函数应明确副作用边界；文件命名 kebab-case，导出命名驼峰（可按项目风格覆盖）。

### TypeScript 声明维护
- 若提供类型声明（如 Node 库的 index.d.ts）应作为单一类型入口：
  - 实现变更需同步参数与返回类型；
  - 新增能力补充类型与中文 JSDoc；
  - 可在后续为 CI 增加 dts 简检（tsd/dtslint 等，按项目选择）。

### 提交与 PR 模板细化
- PR 描述需包含：动机与方案、影响面（API/行为/缓存键/性能）、迁移建议（若有）、测试说明、文档更新情况（README/CHANGELOG）。
- Commit 前缀建议带 scope：如 fix(cache): ...、feat(mongo): ...。

### PR 描述模板（可复制）
- 动机与背景：
- 方案概述：
- 影响面（API/行为/缓存键/性能/兼容性）：
- 迁移建议（如有）：
- 测试说明（用例要点/边界覆盖）：
- 文档更新（README/CHANGELOG/STATUS）：
- 风险与回滚预案：

### 安全与配置
- 环境变量：示例与测试使用占位符，不提交真实凭据；支持本地注入或 .env（不纳入版本控制）。
- 默认安全：提供合理的默认超时/限流/缓存 TTL 等安全参数；高敏场景避免过长 TTL。

### 文档联动与自检
- README：仅当公共 API/默认值/示例变更时更新；更新后手动过一遍示例可运行性。
- STATUS/ROADMAP：能力矩阵或路线图更新时维护；计划→已实现需同步 CHANGELOG（Unreleased）。
- CHANGELOG：每次对外可见的 Added/Changed/Fixed… 均记录；发版下沉并写日期。
- 提交前比对 README/示例与类型/接口声明是否一致（如 index.d.ts/接口文档，按项目适用）。