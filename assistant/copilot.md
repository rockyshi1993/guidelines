# AI 助手执行规范 v2.1

> **角色定位**: 你是**智能调度器+执行代理**，按以下决策树执行任务
> **优先级**: 🔴 强制 > 🟠 必须 > 🟡 推荐 > 🟢 可选

---

## 🚀 快速决策流程

```
用户请求
    ↓
[1] 识别场景 (参考场景触发器)
    ↓
[2] 读取项目 Profile (guidelines/profiles/<project>.md)
    ↓
[3] 检查强制规则 (优先级 🔴)
    ↓
[4] 执行任务 (遵循检查清单)
    ↓
[5] 自检验证 (运行测试/检查文档)
```

---

## 🎯 场景触发器 (IF-THEN 规则)

### 场景 A: 新增/修改功能 (API/函数/模块)
**触发条件**: 用户要求添加或修改代码功能
**强制执行**:
```yaml
IF: 修改了 src/ 或 lib/ 中的代码
THEN 执行:
  1. 🔴 [强制] 添加测试用例到 test/ → 读取 guidelines/guidelines/v2.md#31-功能添加完整流程四要素代码-测试-示例-文档
  2. 🔴 [强制] 添加示例到 examples/ → 读取 guidelines/guidelines/v2.md#31-功能添加完整流程四要素代码-测试-示例-文档
  3. 🔴 [强制] 更新 CHANGELOG.md [Unreleased] → 读取 guidelines/guidelines/v2.md#5-文档与版本策略含自动创建与示例条款
  4. 🟠 [必须] 更新 README.md (如果API变更) → 读取 guidelines/guidelines/v2.md#6-代码修改与文档联动
  5. 🟡 [推荐] 更新类型声明文件 (如 index.d.ts)

BEFORE 提交:
  - 运行: npm test (或项目定义的测试命令)
  - 验证: examples/ 中的示例可独立运行
  - 检查: 无敏感信息泄露
```

---

### 场景 B: Bug 修复
**触发条件**: 用户报告错误或异常行为
**强制执行**:
```yaml
IF: 用户描述问题或错误
THEN 执行:
  1. � [强制] 引导用户填写 Bug 分析模板
  → 读取 guidelines/templates/bug-fix-analysis-template.md
  2. 🔴 [强制] 记录到: <项目>/bug-analysis/YYYY-MM-DD-问题描述.md
  3. 🟠 [必须] 添加回归测试用例
  4. 🟠 [必须] 更新 CHANGELOG.md (类型: Fixed)

模板必填项:
  - 根本原因 (Why)
  - 影响对比 (修复前后)
  - 修复方案 (How + 为什么选择)
  - 验证方法 (测试用例)
```

---

### 场景 C: 大规模编辑 (>100行 或 删除大段内容)
**触发条件**: 需要删除/修改超过100行或整个章节
**强制执行**:
```yaml
IF: 编辑行数 > 100 OR 删除整个章节/附录
THEN 执行:
  1. 🔴 [强制] 使用 PowerShell 脚本而非 replace_string_in_file
  → 读取 guidelines/guidelines/v2.md#20-大规模文件编辑策略ai-辅助开发
  2. 🔴 [强制] 先备份文件: Copy-Item file.md file.md.backup
  3. 🟠 [必须] 使用 UTF-8 无BOM 编码
  4. 🟡 [推荐] 分步验证结果

禁止操作:
  - ❌ 使用 multi_edit 工具删除 >100行
  - ❌ 未备份时执行修改
  - ❌ 使用 Out-File 或 > 重定向 (编码问题)
```

---

### 场景 D: 代码审查/安全检查
**触发条件**: 用户要求审查代码或检查问题
**强制执行**:
```yaml
IF: 审查包含日志输出/错误处理/API调用
THEN 检查:
  1. 🔴 [强制] 日志中无敏感信息 (密码/token/连接串)
  → 读取 guidelines/guidelines/v2.md#10-日志分级与敏感信息清洗含可观测性增强
  2. 🔴 [强制] 输入校验完整 (类型/必填/范围)
  → 读取 guidelines/guidelines/v2.md#9-错误处理与输入校验
  3. 🟠 [必须] 错误信息可行动且去敏
  4. 🟡 [推荐] 使用查询形状而非具体值

敏感信息正则:
  - API Keys: /(sk|pk|api|token)[-_]?[a-zA-Z0-9]{20,}/
  - 密码: /password|passwd|pwd|secret|credential/i
  - 连接串: /mongodb:\/\/|postgres:\/\/|mysql:\/\//
```

---

### 场景 E: 文档更新判断
**触发条件**: 代码修改完成，需判断是否更新文档
**决策矩阵**:
```yaml
IF 满足以下任一条件:
  - 修改了公开 API (函数签名/参数/返回值)
  - 修改了默认值
  - 修改了配置项
  - 修改了行为逻辑
  - 修改了示例代码
THEN:
  1. 🔴 [强制] 更新 CHANGELOG.md [Unreleased]
  2. 🟠 [必须] 更新 README.md (如果影响用户)
  3. 🟡 [推荐] 更新 STATUS.md (如果功能状态变化)
  4. 🟡 [推荐] 更新类型声明文件

IF 仅内部重构/性能优化 (不改API):
  - 🟡 可省略 README 更新
  - 🟠 仍需添加测试覆盖
```

---

### 场景 F: 主动改进/优化分析
**触发条件**: 项目改进、性能优化、架构重构、技术债务分析
**推荐执行**:
```yaml
IF: 主动性改进/优化（非Bug响应）
THEN 执行:
  1. 🟡 [推荐] 创建分析报告: <项目>/analysis-reports/YYYY-MM-DD-主题.md
     → 读取 guidelines/guidelines/v2.md#191-分析报告目录规范
  2. 🟡 [推荐] 填写分析内容:
     - 背景与动机
     - 方案分析
     - 实施步骤
     - 验证方法
     - 结果总结
  3. 🟠 [必须] 实施改进后更新 CHANGELOG.md
  4. 🟡 [推荐] 保留报告（永久保留，便于追溯）

适用场景:
  - P0/P1/P2 优先级改进
  - 性能优化分析
  - 架构重构评估
  - 技术债务分析
  - 依赖升级影响分析
```

---

### 场景 G: 验证流程执行
**触发条件**: 代码修改完成，需要执行完整验证
**强制执行**:
```yaml
IF: 代码修改完成
THEN 按优先级执行验证:

开发阶段（本地）:
  🔴 [强制]:
    - 单元测试: npm test
    - 示例运行: node examples/<功能>.examples.js
    - 文档一致性: 检查 README/CHANGELOG/类型声明
  🟠 [必须]:
    - 覆盖率检查: npm run coverage (≥60%)
    - 代码风格: npm run lint
    - 敏感信息: 检查日志/注释/示例

提交阶段（Pre-commit）:
  🔴 [强制]:
    - 所有测试通过
    - 文档完整性（CHANGELOG更新、README同步）
    - 无敏感信息泄露
  🟠 [必须]:
    - Lint 检查通过
    - 提交信息符合 Conventional Commits

详细验证流程:
  → 读取 guidelines/guidelines/v2.md#21-验证与测试策略完整流程
```

---

## 📊 优先级决策树（快速查询）

### 决策流程
```
识别操作类型
    ↓
┌─────────────────────────────────────────────────────────┐
│ 新增/修改功能？                                          │
│  → 测试🔴 + 示例🔴 + CHANGELOG🔴 + README🟠 + 验证🔴    │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ Bug修复？                                               │
│  → Bug模板🔴 + bug-analysis/🔴 + 测试🟠 + 验证🟠     │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 主动改进/优化？                                         │
│  → analysis-reports/🟡 + 测试🟠 + CHANGELOG🔴 + 验证🟠│
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 性能优化？                                              │
│  → 测试🟠 + CHANGELOG🔴 + 性能测试🔴 + 验证🔴         │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 内部重构？                                              │
│  → 测试🟠 + CHANGELOG🟡 + 验证🟠 (行为不变)           │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 文档修改？                                              │
│  → README🟠 + CHANGELOG🟡                             │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 代码修改完成？                                          │
│  → 执行完整验证流程🔴 (参见场景G)                      │
└─────────────────────────────────────────────────────────┘
```

### 详细对照表（参考）

<details>
<summary>点击展开完整矩阵</summary>

| 操作类型 | 测试 | 示例 | CHANGELOG | README | 类型声明 | 验证 |
|---------|-----|-----|-----------|--------|---------|-----|
| **新增功能** | 🔴 | 🔴 | 🔴 | 🟠 | 🟡 | 🟠 |
| **修改功能** | 🔴 | 🔴 | 🔴 | 🟠 | 🟡 | 🟠 |
| **Bug修复** | 🟠 | 🟢 | 🔴 | 🟡 | 🟢 | 🟠 |
| **内部重构** | 🟠 | 🟢 | 🟡 | 🟢 | 🟢 | 🟠 |
| **文档修改** | 🟢 | 🟢 | 🟡 | 🟠 | 🟢 | 🟢 |
| **性能优化** | 🟠 | 🟡 | 🔴 | 🟡 | 🟢 | 🔴 |

</details>

**优先级说明**:
- 🔴 强制 = 不执行则任务失败
- 🟠 必须 = 应该执行，除非特殊情况
- 🟡 推荐 = 最佳实践，建议执行
- 🟢 可选 = 根据实际情况判断

---

## ✅ 执行检查清单 (按执行顺序)

### 阶段 1: 任务开始前 (信息收集)
```yaml
[ ] 读取项目 Profile: guidelines/profiles/<project>.md
[ ] 确认项目类型: Node.js / Python / Go / Java / Rust
[ ] 确认测试命令: npm test / pytest / go test / mvn test / cargo test
[ ] 确认覆盖率标准: 默认≥60%, 核心API≥70% (Profile可覆盖)
[ ] 识别场景类型: 功能/Bug/重构/文档/性能
```

### 阶段 2: 代码修改时 (强制检查)
```yaml
[ ] 🔴 遵循编码风格: 4空格/LF/UTF-8/行宽≤100
[ ] 🔴 添加输入校验: 类型/必填/范围
[ ] 🔴 日志去敏: 无密码/token/连接串
[ ] 🔴 错误处理: 可行动的错误信息 + cause
[ ] 🟠 文件命名: kebab-case
```

### 阶段 3: 测试与示例 (强制检查)
```yaml
[ ] 🔴 添加测试到 test/<功能>.test.js
    - 正常路径 (主要场景)
    - 异常路径 (非法输入/边界)
    - 边界用例 (空值/最小最大/并发/超时)
    
    测试目录结构:
    - test/unit/features/        # 功能性测试（业务功能）
    - test/unit/infrastructure/  # 基础设施测试（logger/errors/connection）
    - test/unit/utils/           # 工具函数测试（纯函数）
    
[ ] 🔴 添加示例到 examples/<功能>.examples.js
    - 可独立运行
    - 详细注释 (功能/参数/返回值/预期行为)
    - 使用占位配置 (不含真实凭据)
[ ] 🟠 运行测试: npm test
[ ] 🟠 运行示例: node examples/<功能>.examples.js
```

### 阶段 4: 文档更新 (强制检查)
```yaml
[ ] 🔴 更新 CHANGELOG.md [Unreleased]
    - 分类: Added/Changed/Fixed/Deprecated/Removed
    - 格式: - [类型] 简短描述
[ ] 🟠 更新 README.md (如果API变更)
    - 功能说明
    - API参数/返回值
    - 示例引用
    - 注意事项
[ ] 🟡 更新 STATUS.md (如果状态变化)
    - 计划中 → 进行中 → 已实现
[ ] 🟡 更新类型声明 (index.d.ts)
    - 参数类型
    - 返回类型
    - JSDoc 中文注释
```

### 阶段 5: 提交前验证 (强制检查)
```yaml
[ ] 🔴 测试全部通过
[ ] 🔴 示例可运行且输出正确
[ ] 🔴 无敏感信息 (日志/注释/示例)
[ ] 🔴 文档与代码一致 (API签名/参数/返回值)
[ ] 🟠 运行 lint (如果项目有)
[ ] 🟡 检查类型声明 (tsd/dtslint)
```

---

## 🔍 快速查询表

### 按关键词查询
| 关键词 | 场景触发器 | 详细规范章节 |
|-------|----------|------------|
| **新增功能** | 场景A | [第3.1章](../guidelines/guidelines/v2.md#31-功能添加完整流程四要素代码-测试-示例-文档) |
| **修改API** | 场景A + E | [第6章](../guidelines/guidelines/v2.md#6-代码修改与文档联动) |
| **Bug修复** | 场景B | [Bug模板](../guidelines/templates/bug-fix-analysis-template.md) + [第19.1章](../guidelines/guidelines/v2.md#191-分析报告目录规范) |
| **主动改进** | 场景F | [第19.1章](../guidelines/guidelines/v2.md#191-分析报告目录规范) |
| **验证流程** | 场景G | [第21章](../guidelines/guidelines/v2.md#21-验证与测试策略完整流程) |
| **验证脚本** | - | [第22章](../guidelines/guidelines/v2.md#22-验证脚本与工具目录规范) |
| **CHANGELOG管理** | - | [第5章](../guidelines/guidelines/v2.md#5-文档与版本策略含自动创建与示例条款) |
| **大规模编辑** | 场景C | [第20章](../guidelines/guidelines/v2.md#20-大规模文件编辑策略ai-辅助开发) |
| **代码审查** | 场景D | [第9章](../guidelines/guidelines/v2.md#9-错误处理与输入校验) + [第10章](../guidelines/guidelines/v2.md#10-日志分级与敏感信息清洗含可观测性增强) |
| **测试** | 阶段3 + 场景G | [第7章](../guidelines/guidelines/v2.md#7-测试与质量) + [第21章](../guidelines/guidelines/v2.md#21-验证与测试策略完整流程) |
| **文档** | 阶段4 | [第5章](../guidelines/guidelines/v2.md#5-文档与版本策略含自动创建与示例条款) |
| **API弃用** | 场景E | [第13章](../guidelines/guidelines/v2.md#13-api-稳定性与弃用deprecation) |
| **提交信息** | 阶段5 | [第3章](../guidelines/guidelines/v2.md#3-提交与-pr-规范) |

### 按文件操作查询
| 文件类型 | 何时必须更新 | 优先级 | 参考章节 |
|---------|------------|-------|---------|
| **test/*.test.js** | 新增/修改功能、Bug修复 | 🔴 强制 | [第7章](../guidelines/guidelines/v2.md#7-测试与质量) + [第21章](../guidelines/guidelines/v2.md#21-验证与测试策略完整流程) |
| **examples/*.examples.js** | 新增/修改功能 | 🔴 强制 | [第18章](../guidelines/guidelines/v2.md#18-功能示例目录examples) |
| **scripts/verify/**/*.js** | 改进完成后验证 | 🟡 推荐 | [第22章](../guidelines/guidelines/v2.md#22-验证脚本与工具目录规范) |
| **CHANGELOG.md** | 所有对外可见变更 | 🔴 强制 | [第5章](../guidelines/guidelines/v2.md#5-文档与版本策略含自动创建与示例条款) |
| **changelogs/**/*.md** | CHANGELOG归档（>500行） | 🟡 推荐 | [第5章](../guidelines/guidelines/v2.md#5-文档与版本策略含自动创建与示例条款) |
| **README.md** | API变更、默认值变更 | 🟠 必须 | [第6章](../guidelines/guidelines/v2.md#6-代码修改与文档联动) |
| **STATUS.md** | 功能状态变化 | 🟡 推荐 | [第5章](../guidelines/guidelines/v2.md#5-文档与版本策略含自动创建与示例条款) |
| **index.d.ts** | TypeScript项目API变更 | 🟡 推荐 | [第12章](../guidelines/guidelines/v2.md#12-目录导出与-typescript-声明) |
| **analysis-reports/*.md** | 主动性改进分析 | 🟡 推荐 | [第19.1章](../guidelines/guidelines/v2.md#191-分析报告目录规范) |
| **bug-analysis/*.md** | Bug修复分析 | 🔴 强制 | [第19.1章](../guidelines/guidelines/v2.md#191-分析报告目录规范) |

---

## 🚨 禁止操作清单

**绝对禁止**:
- ❌ 使用 multi_edit 删除 >100行内容 → 使用 PowerShell 脚本
- ❌ 在日志中记录密码/token/连接串 → 使用查询形状
- ❌ 未添加测试就修改功能代码 → 先写测试
- ❌ 修改API但不更新文档 → 同步更新 CHANGELOG + README
- ❌ 未备份就执行大规模编辑 → 先备份
- ❌ 使用 Out-File 或 > 重定向 → 使用 [System.IO.File]::WriteAllText

**强烈不推荐**:
- ⚠️ 跳过示例代码验证 → 手动运行确认
- ⚠️ 测试覆盖率 <60% → 补充边界用例
- ⚠️ 错误信息包含内部路径 → 使用相对路径或去敏

---

## 📚 详细规范引用

- 📖 [完整规范文档](../guidelines/guidelines/v2.md) - 20个章节的详细规范
- 📁 [项目配置目录](../guidelines/profiles/) - 各项目的特定覆盖配置
- 📝 [Bug 修复分析模板](../guidelines/templates/bug-fix-analysis-template.md) - 修复前必填
- 🤖 [MCP 调度规则](../guidelines/mcp/v2.md) - AI模型选择与调度
- 📄 [文件模板](../guidelines/templates/file-templates.md) - .editorconfig/.gitattributes等
- 🔧 [自动化脚本](../guidelines/templates/automation-scripts.md) - PowerShell/GitHub Actions

---

## � 实际执行案例

### 案例1：新增 findPage 功能
**用户请求**: "帮我添加MongoDB分页查询功能"

**AI执行流程**:
```yaml
1. 识别场景: 场景A - 功能新增/修改
2. 读取Profile: guidelines/profiles/monSQLize.md
3. 读取规范: guidelines/guidelines/v2.md#31
4. 执行任务:
  [代码] 创建 lib/mongodb/find-page.js
    [测试] 创建 test/findPage.test.js
    - ✅ 正常分页测试
    - ✅ 边界条件测试（limit=0, limit=1000）
    - ✅ 空结果测试
    [示例] 创建 examples/findPage.examples.js
    - ✅ 可独立运行
    - ✅ 详细注释
    [文档] 更新 CHANGELOG.md [Unreleased]
    更新 README.md API说明
5. 验证:
  - ✅ npm test 全部通过
  - ✅ node examples/findPage.examples.js 运行成功
  - ✅ 无敏感信息泄露
6. 提交: PR包含完整四要素
```

**耗时**: 约5分钟  
**检查清单**: 全部通过 ✅

---

### 案例2：修复并发连接问题
**用户请求**: "连接池在高并发下会耗尽，帮我修复"

**AI执行流程**:
```yaml
1. 识别场景: 场景B - Bug修复
2. 引导填写: Bug分析模板
               - 根本原因: 连接未正确释放
               - 影响对比: 并发>50时连接池耗尽 vs 正常释放
               - 修复方案: 添加 finally 块确保释放
3. 记录分析: monSQLize/bug-analysis/2025-10-30-connection-leak.md
4. 实施修复: 修改 lib/connect.js
5. 添加测试: test/connection.test.js (并发测试)
6. 更新文档: CHANGELOG.md [Fixed]
7. 验证: npm test 通过，并发测试通过
```

**耗时**: 约10分钟  
**检查清单**: 全部通过 ✅

---

### 案例3：优化大文档
**用户请求**: "README.md太长了，帮我优化"

**AI执行流程**:
```yaml
1. 识别场景: 场景C - 大规模编辑
2. 检查条件: README.md = 841行 > 100行 ✅
3. 读取规范: guidelines/guidelines/v2.md#20
4. 执行策略:
  [备份] Copy-Item README.md README.md.backup
    [脚本] 使用PowerShell精确删除附录
    [编码] UTF-8无BOM
    [验证] 每步后read_file检查
5. 结果:
  - 原始: 35KB
  - 优化: 5KB
  - 节省: 86% ✅
6. 清理: Remove-Item README.md.backup
```

**耗时**: 约3分钟  
**检查清单**: 全部通过 ✅

---

### 案例4：代码审查
**用户请求**: "审查这段日志代码"

**AI执行流程**:
```yaml
1. 识别场景: 场景D - 代码审查/安全检查
2. 读取规范:
  - guidelines/guidelines/v2.md#9 (输入校验)
  - guidelines/guidelines/v2.md#10 (日志安全)
3. 检查项目:
  [日志安全]
  - ❌ 发现: logger.info(`连接: ${connectionString}`)
  - ✅ 修复: logger.info(`连接: ${maskUri(connectionString)}`)

  [输入校验]
  - ❌ 发现: 缺少类型检查
  - ✅ 修复: 添加 Joi schema

  [错误处理]
  - ✅ 已有可行动错误信息
  - ✅ 已保留原始错误cause
4. 输出报告: 不符合项清单 + 修复建议
```

**耗时**: 约8分钟  
**检查清单**: 全部通过 ✅

---

## �🔄 错误恢复策略

### 如果测试失败
```yaml
1. 检查测试用例是否覆盖新增代码路径
2. 运行单个测试: npm test -- <test-file>
  3. 检查错误日志是否包含敏感信息
4. 回滚代码: git checkout -- <file>
```

### 如果文档不一致
```yaml
1. 对比 README 与代码实际行为
  2. 检查 CHANGELOG [Unreleased] 是否有条目
3. 运行示例验证: node examples/<file>
4. 更新类型声明: index.d.ts
```

### 如果大规模编辑失败
```yaml
1. 恢复备份: Copy-Item file.md.backup file.md -Force
2. 检查编码: Get-Content file.md -Encoding UTF8
3. 分段执行: 每次编辑 <50行
4. 验证结果: read_file 检查内容
```

---

## 🎯 执行模式

### 标准模式 (默认)
- 严格遵循所有 🔴 强制规则
- 执行所有 🟠 必须规则
- 提示所有 🟡 推荐规则

### 快速模式 (紧急修复)
- 仅遵循 🔴 强制规则
- 记录跳过的 🟠 必须规则
- 稍后补充测试和文档

### 审查模式 (代码审查)
- 检查所有优先级规则
- 输出不符合项清单
- 提供修复建议

---

**版本**: v2.1.0  
**更新日期**: 2025-10-30  
**适用对象**: GitHub Copilot / Claude / 其他 AI 助手  
**基于规范**: [guidelines/v2.md v2.0](../guidelines/guidelines/v2.md) - 完整的20章节详细规范
