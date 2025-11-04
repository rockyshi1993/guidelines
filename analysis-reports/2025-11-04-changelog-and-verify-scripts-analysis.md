# 规范分析：CHANGELOG管理和验证脚本目录规范

**分析日期**: 2025-11-04  
**分析范围**: CHANGELOG.md 管理策略、验证脚本目录规范  
**状态**: 待实施

---

## 📊 问题分析

### 问题 1: CHANGELOG.md 文件过长，是否应该按目录存储变更详细信息？

#### 当前状态

**guidelines 项目的 CHANGELOG.md**:
- 当前行数：约 200+ 行
- 结构：单文件记录所有变更
- 版本：[Unreleased] + [1.1.0]

**问题场景**:
```
随着项目演进，CHANGELOG.md 会越来越长：
- [Unreleased] 章节积累大量未发布变更
- 历史版本记录不断增加
- 单文件可能超过 1000+ 行
- 难以快速查找特定版本的变更
```

#### 业界实践调研

**方案 A: 单文件管理（当前方式）**
```
CHANGELOG.md
  [Unreleased]
  [1.1.0] - 2025-11-03
  [1.0.0] - 2025-10-01
  ...
```
优势：
- ✅ 简单直观，一个文件查看所有历史
- ✅ 符合 Keep a Changelog 标准
- ✅ 适合中小型项目

劣势：
- ⚠️ 大型项目文件过长（>1000行）
- ⚠️ Git 冲突风险高（多人同时编辑 [Unreleased]）
- ⚠️ 加载和搜索变慢

**方案 B: 按年份分目录（推荐）**
```
CHANGELOG.md                  # 最新版本 + 索引
changelogs/
  ├─ 2025.md                  # 2025年所有版本
  ├─ 2024.md                  # 2024年所有版本
  └─ archive/
     ├─ 2023.md
     └─ 2022.md
```
优势：
- ✅ 主文件保持简洁（仅最新版本）
- ✅ 历史记录按年归档
- ✅ 减少 Git 冲突
- ✅ 便于按时间查找

劣势：
- ⚠️ 需要维护多个文件
- ⚠️ 需要明确归档策略

**方案 C: 按版本分目录**
```
CHANGELOG.md                  # 索引
changelogs/
  ├─ unreleased.md            # 未发布变更
  ├─ v1.1.0.md
  ├─ v1.0.0.md
  └─ ...
```
优势：
- ✅ 每个版本独立文件
- ✅ 完全避免冲突

劣势：
- ❌ 文件过多，管理复杂
- ❌ 不符合 Keep a Changelog 标准
- ❌ 不适合大多数项目

**方案 D: 混合策略（大型项目）**
```
CHANGELOG.md                  # 最新 3 个版本 + 索引
changelogs/
  ├─ 2025/
  │  ├─ v1.1.0.md            # 详细变更
  │  └─ v1.0.0.md
  └─ 2024/
     └─ ...
```
优势：
- ✅ 主文件保持最新且简洁
- ✅ 详细变更独立存储
- ✅ 灵活性最高

劣势：
- ⚠️ 复杂度最高
- ⚠️ 需要维护策略

#### 推荐方案

**针对不同项目规模**:

| 项目规模 | 推荐方案 | 触发条件 | 说明 |
|---------|---------|---------|------|
| **小型** | 单文件 | <500行 | 当前方式，简单直观 |
| **中型** | 按年归档 | 500-2000行 | 主文件保留最近1年，旧版本归档 |
| **大型** | 混合策略 | >2000行 | 主文件保留最新3版本，详细变更分目录 |

**具体建议**（guidelines 项目）:
```yaml
当前状态: 小型项目（~200行）
建议方案: 单文件管理

触发归档条件:
  - CHANGELOG.md > 500 行
  - 或历史版本 > 10 个

归档策略:
  1. CHANGELOG.md 保留最近 1 年的版本
  2. 旧版本移至 changelogs/<YYYY>.md
  3. CHANGELOG.md 顶部添加归档索引
```

---

### 问题 2: 验证脚本文件（如 verify-p0.js）应该存放在哪里？

#### 当前状态

**实际情况**:
```
monSQLize/
  test/
    verify-p0.js         # 当前位置
    run-tests.js
    unit/
    integration/
    e2e/

vsse/
  test/
    verify-config-changes.js
```

**问题**:
- ⚠️ 验证脚本与测试用例混在一起
- ⚠️ 缺乏统一规范
- ⚠️ 难以区分"测试"和"验证"

#### 验证脚本的类型

**类型 1: 合规性验证脚本**
```javascript
// verify-p0.js - 验证 P0 改进是否正确实施
// verify-config-changes.js - 验证配置变更
```
特点：
- 一次性执行（改进完成后验证）
- 不属于持续集成测试
- 验证规范遵守情况

**类型 2: 文档完整性验证**
```javascript
// verify-docs.js - 验证 README/CHANGELOG/STATUS 存在
// verify-examples.js - 验证示例可运行
```
特点：
- CI 持续执行
- 属于质量门禁
- 验证文档与代码一致性

**类型 3: 数据验证/迁移脚本**
```javascript
// verify-migration.js - 验证数据迁移
// verify-schema.js - 验证数据库 schema
```
特点：
- 运维相关
- 环境特定
- 可能需要访问生产数据

#### 目录方案对比

**方案 A: 独立 scripts/ 目录（推荐）**
```
<项目>/
  scripts/
    verify/                    # 验证脚本
      verify-p0.js
      verify-config-changes.js
      verify-docs.js
    build/                     # 构建脚本
    deploy/                    # 部署脚本
    utils/                     # 工具脚本
```
优势：
- ✅ 清晰分类，验证脚本独立
- ✅ 符合常见项目结构
- ✅ 便于查找和维护

劣势：
- ⚠️ 需要区分验证脚本类型

**方案 B: test/ 子目录**
```
<项目>/
  test/
    unit/
    integration/
    e2e/
    verify/                    # 验证脚本（当前方式）
      verify-p0.js
```
优势：
- ✅ 验证与测试相关，放在一起合理
- ✅ 最小改动

劣势：
- ❌ 验证脚本不是测试用例
- ❌ 概念混淆

**方案 C: 根级 verify/ 目录**
```
<项目>/
  verify/
    verify-p0.js
    verify-config-changes.js
```
优势：
- ✅ 独立性强
- ✅ 一目了然

劣势：
- ❌ 根级目录过多
- ❌ 不符合常见实践

**方案 D: utils/ 或 tools/ 目录**
```
<项目>/
  utils/
    verify-p0.js
    verify-config-changes.js
```
优势：
- ✅ 实用工具集合

劣势：
- ❌ utils 通常指库函数，不是可执行脚本
- ❌ 概念不清晰

#### 推荐方案

**方案 A（独立 scripts/ 目录）+ 细分**

```
<项目>/
  scripts/
    verify/                          # 验证脚本
      ├─ README.md                   # 说明文档
      ├─ compliance/                 # 合规性验证（一次性）
      │  ├─ verify-p0.js
      │  └─ verify-config-changes.js
      ├─ docs/                       # 文档完整性验证（CI）
      │  ├─ verify-docs.js
      │  └─ verify-examples.js
      └─ data/                       # 数据验证（运维）
         ├─ verify-migration.js
         └─ verify-schema.js
    build/                           # 构建脚本
    deploy/                          # 部署脚本
    utils/                           # 辅助工具
```

**命名规范**:
```
verify-<目标>-<方面>.js

示例:
- verify-p0-improvements.js     # 验证 P0 改进
- verify-docs-completeness.js   # 验证文档完整性
- verify-examples-runnable.js   # 验证示例可运行
- verify-migration-success.js   # 验证迁移成功
```

**执行时机**:
| 类型 | 执行时机 | 存放位置 | 是否纳入 CI |
|------|---------|---------|-----------|
| **合规性验证** | 改进完成后手动执行 | scripts/verify/compliance/ | ❌ 否 |
| **文档完整性** | CI 自动执行 | scripts/verify/docs/ | ✅ 是 |
| **数据验证** | 部署/迁移时执行 | scripts/verify/data/ | ⚠️ 按需 |

---

## 📋 规范更新建议

### 建议 1: 新增章节 - CHANGELOG 管理策略

**位置**: 第5章"文档与版本策略"补充

**内容**:
```markdown
#### CHANGELOG.md 管理策略

**小型项目（<500行）**:
- 使用单文件 CHANGELOG.md
- 遵循 Keep a Changelog 格式
- 按 SemVer 版本号倒序排列

**中型项目（500-2000行）**:
- 主文件保留最近 1 年版本
- 旧版本归档到 changelogs/<YYYY>.md
- CHANGELOG.md 顶部添加归档索引

**大型项目（>2000行）**:
- 主文件保留最新 3 个版本
- 详细变更存储在 changelogs/<YYYY>/v<x.y.z>.md
- 主文件仅保留版本摘要

**归档触发条件**:
- CHANGELOG.md 超过 500 行
- 或历史版本超过 10 个
- 或跨越超过 1 年

**归档策略**:
```yaml
归档步骤:
  1. 创建 changelogs/ 目录
  2. 移动旧版本到 changelogs/<YYYY>.md
  3. 在 CHANGELOG.md 顶部添加归档索引
  4. 更新项目 Profile

归档索引格式:
  ## 📚 归档版本
  
  完整历史请参考：
  - [2024年版本](changelogs/2024.md)
  - [2023年版本](changelogs/2023.md)
```

**示例**:
```markdown
# CHANGELOG

## 📚 归档版本

完整历史请参考：
- [2024年版本](changelogs/2024.md) - v0.1.0 至 v0.9.0

---

## [Unreleased]

### Added
- 新功能...

## [1.1.0] - 2025-11-03

### Added
- ...

## [1.0.0] - 2025-01-15

### Added
- ...
```
```

### 建议 2: 新增第22章 - 验证脚本与工具目录规范

**位置**: 第21章"验证与测试策略"之后

**内容**:
```markdown
### 22) 验证脚本与工具目录规范

> **章节目标**: 规范验证脚本、构建脚本、部署脚本等工具的目录结构和命名规范

#### 目录结构

**标准目录**:
```
<项目>/
  scripts/                         # 所有脚本的根目录
    ├─ README.md                   # 脚本使用说明
    ├─ verify/                     # 验证脚本
    │  ├─ README.md
    │  ├─ compliance/              # 合规性验证（一次性）
    │  ├─ docs/                    # 文档完整性验证（CI）
    │  └─ data/                    # 数据验证（运维）
    ├─ build/                      # 构建脚本
    ├─ deploy/                     # 部署脚本
    ├─ migration/                  # 数据迁移脚本
    └─ utils/                      # 辅助工具
```

#### 验证脚本分类

**1. 合规性验证脚本**（scripts/verify/compliance/）

**用途**: 验证项目改进、重构是否正确实施

**特点**:
- 一次性执行（改进完成后）
- 不纳入 CI 持续集成
- 验证规范遵守情况

**示例**:
```javascript
// scripts/verify/compliance/verify-p0-improvements.js
// 验证 P0 优先级改进是否完整实施

// scripts/verify/compliance/verify-config-changes.js
// 验证配置项变更是否符合规范
```

**命名规范**:
```
verify-<目标>-<方面>.js

示例:
- verify-p0-improvements.js
- verify-error-code-system.js
- verify-log-enhancement.js
```

**2. 文档完整性验证脚本**（scripts/verify/docs/）

**用途**: 验证文档与代码一致性

**特点**:
- CI 持续执行
- 属于质量门禁
- 验证文档完整性

**示例**:
```javascript
// scripts/verify/docs/verify-docs-completeness.js
// 验证 README/CHANGELOG/STATUS 存在

// scripts/verify/docs/verify-examples-runnable.js
// 验证 examples/ 中的示例可运行

// scripts/verify/docs/verify-api-docs-sync.js
// 验证 API 文档与代码同步
```

**CI 集成**:
```yaml
# .github/workflows/ci.yml
- name: Verify Documentation
  run: node scripts/verify/docs/verify-docs-completeness.js
```

**3. 数据验证脚本**（scripts/verify/data/）

**用途**: 验证数据迁移、数据库 schema

**特点**:
- 部署/迁移时执行
- 环境特定
- 可能访问生产数据

**示例**:
```javascript
// scripts/verify/data/verify-migration-success.js
// 验证数据迁移成功

// scripts/verify/data/verify-schema-consistency.js
// 验证数据库 schema 一致性
```

#### 构建脚本（scripts/build/）

**用途**: 构建、打包、编译

**示例**:
```
scripts/build/
  ├─ build.js
  ├─ pack.js
  └─ minify.js
```

#### 部署脚本（scripts/deploy/）

**用途**: 部署、发布

**示例**:
```
scripts/deploy/
  ├─ deploy.js
  ├─ rollback.js
  └─ health-check.js
```

#### scripts/README.md 模板

```markdown
# 项目脚本说明

本目录包含项目的各类脚本工具。

## 📁 目录结构

- `verify/` - 验证脚本
  - `compliance/` - 合规性验证（改进完成后执行）
  - `docs/` - 文档完整性验证（CI 自动执行）
  - `data/` - 数据验证（部署/迁移时执行）
- `build/` - 构建脚本
- `deploy/` - 部署脚本
- `utils/` - 辅助工具

## 🚀 使用方法

### 验证脚本

**合规性验证**（手动执行）:
```bash
# 验证 P0 改进
node scripts/verify/compliance/verify-p0-improvements.js
```

**文档完整性验证**（CI 自动执行）:
```bash
# 验证文档完整性
node scripts/verify/docs/verify-docs-completeness.js
```

### 构建脚本

```bash
# 构建项目
node scripts/build/build.js
```

### 部署脚本

```bash
# 部署到生产环境
node scripts/deploy/deploy.js --env production
```

## 📝 规范参考

详细规范请参考：[第22章 验证脚本与工具目录规范](../../guidelines/guidelines/v2.md#22-验证脚本与工具目录规范)
```

#### 命名规范

**验证脚本**:
```
verify-<目标>-<方面>.js

规则:
- 使用 kebab-case
- 动词-名词结构
- 清晰表达验证目的

示例:
✅ verify-p0-improvements.js
✅ verify-docs-completeness.js
✅ verify-examples-runnable.js
✅ verify-migration-success.js

❌ verifyP0.js              # 不使用驼峰
❌ check-p0.js              # 统一使用 verify 前缀
❌ p0-verify.js             # 前缀应该是 verify
```

**其他脚本**:
```
<动词>-<名词>.js

示例:
- build-project.js
- deploy-production.js
- migrate-database.js
- generate-docs.js
```

#### 迁移指南

**从 test/ 迁移到 scripts/verify/**:

```bash
# 1. 创建目录
mkdir -p scripts/verify/compliance
mkdir -p scripts/verify/docs
mkdir -p scripts/verify/data

# 2. 移动验证脚本
mv test/verify-p0.js scripts/verify/compliance/verify-p0-improvements.js
mv test/verify-config-changes.js scripts/verify/compliance/

# 3. 更新 package.json
# 更新脚本路径引用

# 4. 更新 CI 配置
# 更新 .github/workflows/ 中的脚本路径

# 5. 创建 README.md
# 添加脚本使用说明
```

#### 最佳实践

**1. 验证脚本应该自包含**:
```javascript
// ✅ 好的做法
const results = verifyP0Improvements();
if (results.failed.length > 0) {
    console.error('验证失败:', results.failed);
    process.exit(1);
}
console.log('✅ 验证通过');
process.exit(0);
```

**2. 提供详细的错误信息**:
```javascript
// ✅ 好的做法
console.error(`
❌ 错误码系统验证失败

未找到的错误码:
  - VALIDATION_ERROR
  - INVALID_COLLECTION_NAME

修复建议:
  1. 检查 lib/errors.js 是否导出所有错误码
  2. 运行 npm test 确保测试覆盖
`);
```

**3. 支持选项参数**:
```javascript
// ✅ 好的做法
const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const fix = args.includes('--fix');
```

**4. 记录验证结果**:
```javascript
// ✅ 好的做法
const results = {
    timestamp: new Date().toISOString(),
    passed: [...],
    failed: [...],
    warnings: [...]
};

if (args.includes('--output')) {
    fs.writeFileSync(
        'verify-results.json',
        JSON.stringify(results, null, 2)
    );
}
```

#### 与第21章的关系

| 内容 | 第21章（验证与测试策略） | 第22章（验证脚本目录） |
|------|---------------------|-------------------|
| **焦点** | 测试用例的验证流程 | 验证脚本的组织管理 |
| **范围** | test/ 目录中的测试 | scripts/ 目录中的脚本 |
| **执行** | npm test / CI 自动 | 手动 / CI 按需 |
| **目的** | 保证代码质量 | 保证规范遵守 |

**互补关系**:
- 第21章：如何验证（测试用例、覆盖率、CI）
- 第22章：如何组织验证工具（脚本目录、命名、分类）
```

---

## 📊 影响范围

### CHANGELOG 管理策略

**当前受影响项目**:
- guidelines 项目（当前 ~200 行，未触发归档）

**触发归档的项目**:
- 暂无（所有项目 CHANGELOG 均 <500 行）

**建议**:
- 🟡 立即：补充规范定义
- 🟢 可选：等触发条件后再归档

### 验证脚本目录规范

**当前受影响项目**:
- monSQLize: test/verify-p0.js
- vsse: test/verify-config-changes.js

**迁移工作量**:
| 项目 | 现有脚本 | 迁移难度 | 估计时间 |
|------|---------|---------|---------|
| monSQLize | 1个 | 低 | 5分钟 |
| vsse | 1个 | 低 | 5分钟 |

**迁移优先级**:
- 🟡 推荐：新项目立即采用
- 🟢 可选：现有项目逐步迁移

---

## ✅ 推荐方案总结

### CHANGELOG 管理

**小型项目**（当前）:
- ✅ 继续使用单文件
- ✅ 补充规范定义（归档触发条件）
- ⏸️ 等触发条件后再执行归档

**中型项目**（未来）:
- 📋 CHANGELOG.md > 500 行时
- 📋 创建 changelogs/<YYYY>.md
- 📋 主文件保留最近 1 年

### 验证脚本目录

**新项目**:
- ✅ 采用 scripts/verify/ 目录结构
- ✅ 按类型分类（compliance/docs/data）
- ✅ 遵循命名规范

**现有项目**:
- 🟡 推荐迁移（低成本，5分钟）
- 🟢 可选：保持现状直到下次重构

---

## 📝 下一步行动

### 立即执行（优先级：🔴）

1. ✅ 新增第5章补充内容 - CHANGELOG 管理策略
2. ✅ 新增第22章 - 验证脚本与工具目录规范
3. ✅ 更新 CHANGELOG.md 记录变更

### 推荐执行（优先级：🟠）

1. ⏸️ 创建 scripts/README.md 模板文件
2. ⏸️ 迁移现有验证脚本（monSQLize/vsse）

### 可选执行（优先级：🟡）

1. ⏸️ 监控 CHANGELOG.md 行数
2. ⏸️ 为其他项目创建 scripts/ 目录

---

**分析完成日期**: 2025-11-04  
**分析师**: AI Assistant  
**状态**: ✅ 分析完成，待实施

