# 规范变更历史

> 本文档记录 AI 执行规范本身的变更历史

---

## [v2.3] - 2025-11-15

### Changed（重大修正）
- **章节 9.1**：Swagger/OpenAPI 规范方案调整（基于用户反馈）
  - **核心原则修正**：
    - ❌ 废弃：代码即文档（Code as Documentation）- 通过注解/装饰器生成
    - ✅ 采用：**API-First 设计**（Design First）- 先定义 API 规范，再实现代码
    - ✅ 采用：**统一规范文件**（Single Source of Truth）- 使用 OpenAPI YAML 集中管理
    - ✅ 采用：**框架无关**（Framework Agnostic）- 规范文件独立于框架
  - **维护方式调整**：
    - ❌ 废弃：通过代码注解/装饰器自动生成文档
    - ✅ 采用：手写 YAML 文件或使用可视化编辑器（Swagger Editor / Stoplight）
  - **集成方式调整**：
    - ❌ 废弃：框架特定工具（swagger-jsdoc / @fastify/swagger / egg-swagger-doc / @nestjs/swagger）
    - ✅ 采用：从 YAML 文件加载（swagger-ui-express / @fastify/swagger-ui / egg-swagger-ui）
  - **框架示例更新**：
    - 删除所有基于注解/装饰器的代码示例（Express JSDoc、Fastify schema、Egg.js 注解、NestJS 装饰器、FastAPI 原生）
    - 新增框架无关的 YAML 加载方式（5 个框架示例）
    - 业务代码保持简洁，无需注释污染
  - **最佳实践调整**：
    - DO ✅: 手写 YAML 文件、保持代码简洁、API-First 设计、使用 Git diff 追踪变更
    - DON'T ❌: 用代码注解/装饰器生成文档、手写 swagger.json 脱离版本控制
  - **新增工具**：
    - Swagger Editor（在线编辑）
    - Stoplight Studio（可视化编辑器）
    - Spectral（Lint 工具，CI 集成）
  - **新增验证脚本**：scripts/verify-api-sync.js（验证 API 定义与代码实现一致）

- **章节 17**：项目 Profile 模板调整
  - 维护方式：自动生成 → 手写 YAML 或使用 Swagger Editor
  - 集成方式：框架特定工具 → 从 YAML 文件加载（框架无关）
  - 更新策略：代码修改后自动更新 → 修改 openapi.yaml 后重启服务
  - 验证方式：新增同步验证（scripts/verify-api-sync.js）

- **templates/file-templates.md**：Profile 模板同步更新
  - 与章节 17 保持一致

### Motivation
- **用户反馈**："我认为规范有问题，swagger 最好不要根据框架来，而是统一生成 yaml 文件比较合适，不然写接口注释很乱"
- **问题分析**：
  - ❌ 框架绑定 - 5 个框架各自独立的注解方式，切换框架需要重新学习
  - ❌ 注释污染 - 代码中混入大量 JSDoc/装饰器，降低代码可读性
  - ❌ 维护困难 - 修改 API 时需要同步更新代码注释
  - ❌ 版本控制复杂 - 难以追踪 API 定义的变更历史
- **优化方案优势**：
  - ✅ 框架无关 - 统一的 YAML 文件，任何框架都能使用
  - ✅ 代码简洁 - 业务代码不被文档注释污染
  - ✅ 易于维护 - API 定义集中管理，修改清晰可追踪
  - ✅ 版本友好 - Git diff 可以清晰看到 API 变更

---

## [v2.2] - 2025-11-15（已废弃，v2.3 修正）

### Added
- **章节 9.1**：添加 API 接口规范与 Swagger/OpenAPI 验证（已被 v2.3 修正）
  - 定义适用场景：RESTful API、前后端分离、微服务、开放 API、多人团队
  - 豁免场景：CLI 工具、纯库项目、简单脚本
  - 核心原则：代码即文档、类型安全、版本管理、测试便利
  - 强制要求：OpenAPI 规范文件、文档访问方式、接口字段说明、错误码规范
  - 框架集成方案：Express、Fastify、Egg.js、NestJS、FastAPI（含代码示例）
  - 项目 Profile 配置示例
  - CI 集成示例
  - 最佳实践（DO ✅ / DON'T ❌）
  - 推荐工具清单

- **章节 18**：添加 API 项目额外要求
  - 强制提供：Swagger UI 截图、Postman Collection、API 调用示例文档
  - API 示例完整模板（认证方式、基础接口、高级功能、Swagger UI 访问、Postman 集成）
  - 更新规则：新增接口必须更新 examples/api/api-examples.md 和 Swagger 文档

- **章节 17**：更新项目 Profile 模板
  - 添加可选配置项：API 接口规范
  - Swagger/OpenAPI 配置说明（规范版本、文档路径、规范文件、自动生成、访问限制）
  - 集成方式说明（框架、工具、更新策略）
  - 强制字段说明（summary、tags、parameters、responses、错误码、认证方式）
  - 验证方式说明（开发环境、CI 检查、测试集成）

### Motivation
- 用户建议："我觉得如果涉及到接口请求，需要在通用规范中添加 swagger 接口验证"
- 现有 API 项目缺少规范化的接口文档和验证机制
- Swagger/OpenAPI 可提供自动化文档生成、类型安全验证、测试便利、团队协作等好处
- 填补通用规范中 API 接口规范的空白

---

## [v2.1] - 2025-11-11

### Added
- **场景 0.1**：添加文档任务判断规则
  - 明确触发条件：文档中代码 ≥ 3 行触发场景 0
  - 添加代码行数计算标准
  - 添加错误案例和自我检查清单

- **快速自检清单**：添加任务开始前的检查清单
  - 场景 0 检查（项目识别、Profile 读取、规范确认）
  - MCP 检查（触发判断、配置验证）
  - 测试检查（规范确认、自动分类）
  - 文档任务检查（代码判断）
  - 输出确认（场景 0 输出、实时检查）

### Changed
- **场景 0 STEP 1**：项目名称识别规则
  - 从简单规则改为 4 级优先识别机制
  - 优先级 1：从用户请求中明确识别
  - 优先级 2：从当前工作目录推断
  - 优先级 3：从正在编辑的文件路径推断
  - 优先级 4：询问用户
  - 添加多项目任务处理规则

- **场景 0 STEP 2**：Profile 读取方式
  - 从"必须完整通读"改为"智能提取关键信息"
  - 添加 4 步结构化提取流程
  - 添加关键章节定位规则（按优先级搜索）
  - 添加关键词匹配提取方法
  - 添加提取结果验证标准

- **场景 0 STEP 6**：输出验证格式
  - 添加条件输出逻辑（IF-THEN 结构）
  - Profile 有禁止/强制项 → 完整格式输出
  - 仅使用通用规范 → 简化格式输出
  - 避免"一刀切"的强制完整输出

- **场景 0.5**：实时检查触发时机
  - 明确触发条件：文件创建/修改后立即触发
  - 添加智能输出格式规则
  - 连续创建 ≤ 3 个文件 → 每个独立输出
  - 连续创建 > 3 个文件 → 批量汇总输出

- **MCP 配置强制检查**：明确触发边界
  - 添加 3 类必须触发场景
    * 用户明确要求查询/分析/修改数据
    * 问题诊断需要查看实际数据
    * 数据探索与分析
  - 添加 3 类不触发场景
    * 编写操作数据库的代码（但不执行查询）
    * 讨论数据库设计（纯理论）
    * 文档/注释编写
  - 添加判断规则和 3 个场景示例

- **第 7 章（guidelines/v2.md）**：测试目录结构
  - 添加测试文件自动分类规则
  - 明确功能性测试触发条件（对外 API、业务功能、CRUD 操作）
  - 明确基础设施测试触发条件（底层支撑、跨功能基础设施）
  - 明确工具函数测试触发条件（纯函数、无副作用）
  - 添加边界情况处理规则（优先级、主要职责）
  - 添加 4 个自动分类示例

### Fixed
- 减少"完整通读"的模糊定义导致的 token 浪费
- 减少项目名称识别的不确定性
- 减少测试文件分类的主观判断
- 减少 MCP 触发条件的歧义

### Technical Details
- 修改文件：
  - `d:\Project\.github\copilot-instructions.md` (7 处修改)
  - `d:\Project\guidelines\guidelines\v2.md` (1 处修改)
- 新增文件：
  - `d:\Project\guidelines\SPECIFICATION-CHANGELOG.md` (本文件)
- 修改总行数：约 300+ 行
- Lint 警告：39 个（markdown 链接锚点警告，非阻塞性）

---

## [v2.0] - 2025-11-10

### Added
- 初始版本发布
- 完整的 22 章节规范（guidelines/v2.md）
- 场景触发器（copilot-instructions.md）
- Bug 修复分析模板
- MCP 调度规则

---

## 规范维护说明

### 如何更新本文档
1. 每次修改规范文件后，立即更新本文档
2. 按 [Keep a Changelog](https://keepachangelog.com/) 格式记录
3. 分类使用：Added/Changed/Deprecated/Removed/Fixed/Security

### 版本号规范
- 主版本号（Major）：破坏性变更
- 次版本号（Minor）：新增功能，向后兼容
- 修订号（Patch）：Bug 修复，向后兼容

### 相关文件
- 主规范文档：`guidelines/guidelines/v2.md`
- AI 执行规范：`.github/copilot-instructions.md`
- MCP 调度规则：`guidelines/mcp/v2.md`
- Bug 分析模板：`guidelines/templates/bug-fix-analysis-template.md`
