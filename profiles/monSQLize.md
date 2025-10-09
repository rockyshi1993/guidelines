# 项目 Profile：monSQLize（Junie 专用）

本节仅适用于路径 D:\Project\monSQLize\... 的改动。用于指导自动化执行（测试/校验）与贡献者快速定位。使用说明、API 与示例以 monSQLize/README.md 为准。

## 项目概览
- 目标：统一（Mongo 风格）的读 API（find/findOne/count），支持默认值（maxTimeMS、findLimit）、内存缓存（TTL/LRU）、基于命名空间的缓存失效、慢查询日志与输入校验。
- 适配：当前支持 MongoDB 适配器；其他数据库规划中。
- 运行时：CommonJS；提供 index.d.ts 类型声明。
- Node 版本建议：LTS（如 18.x/20.x）。

## 关键目录（根：D:\Project\monSQLize）
- lib\            已编译 JS（入口：lib\index.js）
- utils\          工具方法（注意：此目录在 monSQLize 根级，不在 lib\ 下）
- examples\        示例代码
- test\           包测试（入口脚本：test\run-tests.js）
- README.md       完整文档（中文）
- package.json    NPM 元数据与脚本

### 架构分层与扩展策略

本项目采用“通用层 + 适配器层”的分层，以便未来扩展 MySQL/PostgreSQL/SQLite 等。核心原则：跨数据库可复用逻辑沉到 `lib/common`，数据库族专属复用逻辑放在 `lib/<adapter>/common`，各适配器入口 `lib/<adapter>/index.js` 只做薄粘合。

#### 目录与职责边界
- 通用层（跨库）：`lib/common`
    - 错误与校验：`errors.js`（`makeValidationError`、`makeInvalidCursorError`），`validation.js`（`validateLimitAfterBefore` 等基础项）
    - 游标与分页：`cursor.js`（`encodeCursor/ decodeCursor`）、`page-result.js`（`makePageResult`）
    - 执行封装：`runner.js`（`createCachedRunner`，统一缓存/慢日志/命名空间）
    - 日志与形状：`log.js`（`withSlowQueryLog`）、`shape-builders.js`（通用去敏 shape）
    - 命名空间与序列化：`namespace.js`（解析 `iid` 流程）、`stable.js`（`stableStringify`、`sha256`）
    - 运算符映射预留：`operators/`（统一 `=, !=, >, >=, <, <=, in, nin, and, or, not` 映射注册）
- Mongo 专属层：`lib/mongodb/common`
    - 实例指纹：`iid.js`（`genInstanceId`，基于 `uri/db` 生成 `mdb:<hash>`）
    - 排序与锚点：`sort.js`（`ensureStableSort` 补 `_id`，`reverseSort`，`pickAnchor`）
    - `$expr` 词典序比较：`lexicographic-expr.js`（`buildLexiExpr`）
    - 聚合分页管道：`agg-pipeline.js`（`buildPagePipelineA`：先分页后联表；`buildPagePipelineB`：先联表后分页，预留）
    - 形状与稳定序列化：`shape.js`（Mongo 去敏 shape）、`stable-bson.js`（BSON 类型稳定序列化）
    - 常量/校验：`constants.js`（如 `MAX_LIMIT_DEFAULT`），`validation.js`（Mongo 定制补充）
- 适配器入口（薄）：`lib/mongodb/index.js`
    - 连接/关闭；集合访问器 `collection(db, coll)` 暴露 `findOne/find/count/invalidate/...`
    - 新增分页 API 通过公共模块拼装并走统一 Runner。

> 未来 SQL 族预留：`lib/sql/common`（`keyset.js` 生成 `(k1,k2,id)>(?,?,?)` 条件；`sort.js` 补 `id`；`shape.js`、`stable.js` SQL 版），按 `lib/mysql/index.js`、`lib/postgres/index.js` 增加适配器入口。

---

## 如何运行测试
- Windows/PowerShell：
    - cd D:\Project\monSQLize
    - npm test（等价：node test\run-tests.js）
- Linux（CI 参考）：
    - cd ./monSQLize && npm test

说明：目前无需构建步骤（lib\ 已提交）。若将来需要构建，会在 package.json 的 scripts 中定义。

## 约定与编码风格（差异点）
- 运行时：CommonJS；为 TS 使用者提供 index.d.ts。
- 测试：自包含；修复/特性优先补充覆盖。
- 日志：仅输出“形状/字段集合”，不含敏感值。
- 注释：中文为主；必要英文术语用括号注明（如：命名空间（namespace））；行宽 ≤100。

## 与文档联动
- 变更公共 API/默认值/示例时，更新 monSQLize/README.md。
- 对外可见变更在 monSQLize/CHANGELOG.md 的 [Unreleased] 追加条目。
- 每个功能都需要的在 monSQLize/examples/mongodb.js 添加演示示例

## Junie 如何校验改动
1. 定位影响文件（通常在 monSQLize/...）。
2. 在项目目录运行测试（见“如何运行测试”）。
3. 如 npm scripts/目录结构发生变化，请同步本 Profile。

## 例外与覆盖
- 如需对根级通用规范做例外（例如慢查询阈值不同），请在此处记录：
    - 条目、理由、影响面与迁移建议；并在 PR 中说明。

## 项目规范
- 需遵循 `.junie/guidelines.md` 文件
