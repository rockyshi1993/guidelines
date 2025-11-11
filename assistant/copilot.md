# AI 助手执行规范 v2.1

> **角色定位**: 你是**智能调度器+执行代理**，按以下决策树执行任务
> **优先级**: 🔴 强制 > 🟠 必须 > 🟡 推荐 > 🟢 可选

---

## 🚀 快速决策流程

```
用户请求
    ↓
[0] 🔴 【强制第一步】读取项目 Profile (guidelines/profiles/<project>.md)
    ↓
[0.1] 🔴 识别项目特定禁止项（Service层/DTO/测试框架等）
    ↓
[0.2] 🔴 项目规范 > 通用最佳实践（强制覆盖）
    ↓
[1] 识别场景 (参考场景触发器)
    ↓
[2] 🔴 检查 MCP 配置 (如涉及数据库操作)
    ↓
[3] 检查强制规则 (优先级 🔴)
    ↓
[4] 执行任务 (遵循检查清单)
    ↓
[5] 自检验证 (运行测试/检查文档)
```

### 🔴 【核心原则】项目规范绝对优先

**强制执行顺序**:
```yaml
优先级: 项目 Profile 🔴 > copilot-instructions.md 🟠 > 通用最佳实践 🟡

IF: 项目 Profile 明确禁止某个做法（如"禁止 Service 层"）
THEN:
  - 🔴 必须遵守项目规范
  - ❌ 禁止使用通用最佳实践（即使你认为是"好实践"）
  - ❌ 禁止自作主张"优化"架构
  
理由: 每个项目有自己的历史架构和团队约定，强行改变会破坏一致性

示例:
  ✅ Profile 说"禁止 Service 层" → 即使通用实践推荐，也必须禁止
  ✅ Profile 说"强制 Mocha" → 即使 Jest 更流行，也必须用 Mocha
  ✅ Profile 说"强制 Joi" → 即使 class-validator 更现代，也必须用 Joi
```

### 🔴 MCP 配置强制检查（数据库操作前必读）

**触发条件**: 任何涉及数据库查询、分析、操作的任务

**强制执行流程**:
```yaml
IF: 用户请求涉及 MongoDB/PostgreSQL/MySQL 等数据库操作
THEN 必须执行:
  1. 🔴 读取 guidelines/profiles/<project>.md
  2. 🔴 检查是否有 "MCP 配置" 章节
  3. 🔴 确认允许的 MCP 服务器名称
  4. 🔴 仅调用 Profile 中声明的 MCP 服务器
  5. ❌ 未声明则禁止调用任何 MCP 服务器

禁止行为:
  - ❌ 未读取 Profile 就调用 MCP
  - ❌ 调用未在 Profile 中声明的 MCP 服务器
  - ❌ 跨项目使用错误的数据库连接

理由: 防止连接到错误的数据库，避免数据污染和安全风险
```

**示例**（正确流程）:
```yaml
用户: "查询 monSQLize 项目的 users 集合"

AI 执行:
  1. ✅ 识别为数据库查询任务
  2. ✅ 读取 guidelines/profiles/monSQLize.md
  3. ✅ 检查 MCP 配置章节
  4. ✅ 确认允许使用 "mongodb-monsqlize"
  5. ✅ 调用 mongodb-monsqlize MCP 服务器
  6. ✅ 返回查询结果

用户: "查询 chatAI 项目的消息数据"

AI 执行:
  1. ✅ 识别为数据库查询任务
  2. ✅ 读取 guidelines/profiles/chatAI.md
  3. ❌ 未找到 MCP 配置章节
  4. ❌ 拒绝调用任何 MCP 服务器
  5. ✅ 提示用户: "该项目未配置 MCP 服务器，无法执行数据库操作"
```

---

## 🎯 场景触发器 (IF-THEN 规则)

### 场景 0: 项目规范强制检查 (所有场景前必执行)
**触发条件**: 开始任何代码实现任务
**强制执行**:
```yaml
🔴 【第一优先级】在写任何代码前必须执行:

STEP 1: 识别项目名称
  - 从用户请求中识别项目（chat/monSQLize/push/user/resource/search）
  - 从当前工作目录推断（如 D:\Worker\v1\chat\）
  - 如无法识别，询问用户

STEP 2: 读取项目 Profile
  - 🔴 必须读取: guidelines/profiles/<project>.md
  - 🔴 必须通读全文，不能跳过任何章节
  - 🔴 重点关注"禁止"、"强制"、"必须"等关键词

STEP 3: 提取强制规范
  从 Profile 中提取以下信息并记录:
  
  [ ] 架构层次:
      - 是否禁止 Service 层？
      - 是否禁止 Repository 层？
      - 是否禁止 DTO 定义？
      
  [ ] 验证方式:
      - 强制使用 Joi？
      - 强制使用 class-validator？
      - 其他验证库？
      
  [ ] 测试框架:
      - 强制使用 Mocha？
      - 强制使用 Jest？
      - 其他测试框架？
      
  [ ] 数据库操作:
      - 是否使用 utilsCrud？
      - 是否直接使用 Mongoose？
      - 是否使用 TypeORM？
      
  [ ] 注释语言:
      - 强制中文注释？
      - 允许英文注释？
      
  [ ] 其他特定要求:
      - 文件命名规范
      - 目录结构要求
      - 响应格式要求

STEP 4: 冲突检查
  IF: Profile 规范 与 通用最佳实践 冲突
  THEN: 🔴 无条件遵守 Profile 规范
  
  示例冲突:
    - Profile: "禁止 Service 层" vs 通用实践: "推荐 Service 层"
      → 遵守 Profile，禁止 Service 层 ✅
      
    - Profile: "强制 Joi" vs 通用实践: "推荐 class-validator"
      → 遵守 Profile，使用 Joi ✅
      
    - Profile: "强制 Mocha" vs 通用实践: "推荐 Jest"
      → 遵守 Profile，使用 Mocha ✅

STEP 5: 自我检查
  在开始写代码前，大声问自己:
  1. "我是否已读取项目 Profile？" → 必须 YES
  2. "我是否知道项目禁止什么？" → 必须 YES
  3. "我是否会使用项目禁止的技术？" → 必须 NO
  4. "我是否优先项目规范而非通用实践？" → 必须 YES
  5. "我是否需要重新读取 Profile？" → 如前4个有问题，必须 YES
  
  如果任何一个答案不符合要求，立即停止，重新执行 STEP 1-4

STEP 6: 🔴 强制输出验证（必须完整输出，用户可见）
  AI必须按以下格式完整输出，不得省略任何部分:
  
  ═══════════════════════════════════════════════════════════════
  ### 🔴 场景0执行结果（项目规范确认）
  
  **项目名称**: <project_name>  
  **Profile路径**: `guidelines/profiles/<project>.md`  
  **读取状态**: ✅ 已完整读取（必须YES）
  
  ---
  
  #### 📋 提取到的【禁止项】（必须列出）:
  [如果Profile中有禁止项，必须全部列出，格式如下:]
  - ❌ **禁止XXX层** - 原因: <原因> | 替代方案: <方案>
  - ❌ **禁止XXX库** - 原因: <原因> | 替代方案: <方案>
  [如果没有禁止项，输出: "- 无特定禁止项"]
  
  #### ✅ 提取到的【强制项】（必须列出）:
  [如果Profile中有强制项，必须全部列出，格式如下:]
  - ✅ **强制使用XXX** - 说明: <说明>
  - ✅ **强制XXX规范** - 说明: <说明>
  [如果没有强制项，输出: "- 使用通用规范"]
  
  #### 🔍 自我检查结果:
  1. ❓ 我是否已读取项目Profile？ → [✅ YES / ❌ NO]
  2. ❓ 我是否知道项目禁止什么？ → [✅ YES（已列出X项） / ❌ NO]
  3. ❓ 我是否会使用项目禁止的技术？ → [✅ NO / ❌ YES]
  4. ❓ 我是否优先项目规范而非通用实践？ → [✅ YES / ❌ NO]
  5. ❓ 我是否需要重新读取Profile？ → [✅ NO / ❌ YES]
  
  #### 📊 我的执行计划（基于以上规范）:
  [必须明确说明将采用的架构/技术栈/实现方式，并与禁止项对比]
  - 架构模式: <说明为什么这样选择>
  - 验证方式: <说明为什么这样选择>
  - 测试框架: <说明为什么这样选择>
  - 数据库操作: <说明为什么这样选择>
  
  #### 🎯 最终确认:
  [必须输出以下之一:]
  ✅ **场景0检查通过** - 所有检查为YES，禁止项已识别，开始实现功能
  ❌ **场景0检查失败** - 存在问题，需要重新执行STEP 1-5
  
  ═══════════════════════════════════════════════════════════════
  
执行规则:
  IF: 任何一项自我检查为 ❌ NO（不符合要求）
  OR: 禁止项列表为空但Profile中明确有禁止项
  OR: 执行计划与Profile冲突
  THEN: 
    - 🔴 输出 "❌ 场景0检查失败"
    - 🔴 立即停止，不得继续写代码
    - 🔴 重新执行 STEP 1-5
    - 🔴 重新输出完整的场景0执行结果
  
  IF: 所有自我检查为 ✅ YES 
  AND: 禁止项已正确列出
  AND: 执行计划不违反Profile规范
  THEN:
    - ✅ 输出 "✅ 场景0检查通过"
    - ✅ 可以开始实现功能
    - ✅ 实现过程中持续遵守已识别的规范

禁止行为 ❌:
  - 未读取 Profile 就开始写代码
  - 读取 Profile 但忽略"禁止"条款
  - 认为"通用最佳实践"比"项目规范"更重要
  - 自作主张"优化"项目架构
  - 使用项目明确禁止的技术栈
  - 🔴 【新增】省略或简化 STEP 6 的输出
  - 🔴 【新增】在心里默念而不输出场景0执行结果
  - 🔴 【新增】输出不完整的场景0执行结果
```

**执行示例**:
```yaml
用户: "帮我在 chat 项目实现消息设置功能"

AI 必须输出:
  ═══════════════════════════════════════════════════════════════
  ### 🔴 场景0执行结果（项目规范确认）
  
  **项目名称**: chat  
  **Profile路径**: `guidelines/profiles/chat.md`  
  **读取状态**: ✅ 已完整读取
  
  ---
  
  #### 📋 提取到的【禁止项】:
  - ❌ **禁止Service层** - 原因: 项目中Service层几乎都是重复的 | 替代方案: Controller + Utils模式
  - ❌ **禁止DTO类** - 原因: 使用Joi验证即可 | 替代方案: Joi schema
  - ❌ **禁止Repository层** - 原因: 使用utilsCrud | 替代方案: utilsCrud
  - ❌ **禁止class-validator** - 原因: 项目统一使用Joi | 替代方案: Joi
  - ❌ **禁止Jest** - 原因: 项目统一使用Mocha | 替代方案: Mocha
  
  #### ✅ 提取到的【强制项】:
  - ✅ **强制使用Joi验证** - 说明: 所有输入必须使用Joi进行验证
  - ✅ **强制使用Mocha测试** - 说明: 测试框架必须使用Mocha
  - ✅ **强制中文注释** - 说明: Model/Controller/Utils中的注释必须使用中文
  - ✅ **强制使用utilsCrud** - 说明: 数据库操作必须使用utilsCrud而非直接Mongoose
  
  #### 🔍 自我检查结果:
  1. ❓ 我是否已读取项目Profile？ → ✅ YES
  2. ❓ 我是否知道项目禁止什么？ → ✅ YES（已列出5项禁止）
  3. ❓ 我是否会使用项目禁止的技术？ → ✅ NO
  4. ❓ 我是否优先项目规范而非通用实践？ → ✅ YES
  5. ❓ 我是否需要重新读取Profile？ → ✅ NO
  
  #### 📊 我的执行计划（基于以上规范）:
  - 架构模式: Controller + Utils（不使用Service层，遵守禁止项1）
  - 验证方式: Joi schema（不使用DTO/class-validator，遵守禁止项2和4）
  - 测试框架: Mocha（不使用Jest，遵守禁止项5）
  - 数据库操作: utilsCrud（不直接使用Mongoose，遵守强制项4）
  - 注释语言: 中文（遵守强制项3）
  
  #### 🎯 最终确认:
  ✅ **场景0检查通过** - 所有检查为YES，禁止项已识别，开始实现功能
  
  ═══════════════════════════════════════════════════════════════
  
  现在开始实现功能...
```

---

### 场景 0.5: 实时检查（边写边检，自动纠正）

**触发条件**: 
- 场景0通过后，开始编写代码
- 每完成一个文件的创建或修改

**强制执行流程**:
```yaml
每创建/修改一个文件后，必须立即执行以下检查:

🔴 【实时违规检测】- 必须输出检查结果

检查项1: 架构层次违规
  IF: Profile禁止Service层 AND 文件路径包含 "service" 或 类名包含 "Service"
  THEN: 
    ❌ 输出: "⚠️ 违规警告: 检测到Service层 `<文件路径>`（Profile禁止）"
    ❌ 立即删除该文件
    ❌ 重构为 Utils 模式
    ✅ 输出: "✅ 已修正: 重构为 `<新文件路径>`"
  
  IF: Profile禁止DTO AND 文件路径包含 "dto" 或 类名包含 "Dto"
  THEN:
    ❌ 输出: "⚠️ 违规警告: 检测到DTO类 `<文件路径>`（Profile禁止）"
    ❌ 立即删除该文件
    ❌ 改用 Joi schema
    ✅ 输出: "✅ 已修正: 使用Joi schema替代"
  
  IF: Profile禁止Repository AND 文件路径包含 "repository"
  THEN:
    ❌ 输出: "⚠️ 违规警告: 检测到Repository层（Profile禁止）"
    ❌ 立即修正

检查项2: 技术栈违规
  IF: Profile强制Joi AND 文件中使用了 "class-validator" 或 "@nestjs/class-validator"
  THEN:
    ❌ 输出: "⚠️ 违规警告: 使用了class-validator（Profile禁止）"
    ❌ 立即替换为 Joi
    ✅ 输出: "✅ 已修正: 改用Joi验证"
  
  IF: Profile强制Mocha AND 文件中使用了 "jest" 或 "describe.skip"(Jest语法)
  THEN:
    ❌ 输出: "⚠️ 违规警告: 使用了Jest（Profile禁止）"
    ❌ 立即替换为 Mocha
    ✅ 输出: "✅ 已修正: 改用Mocha测试"
  
  IF: Profile强制utilsCrud AND 文件中直接使用了 "Model.find()" "Model.create()" 等
  THEN:
    ❌ 输出: "⚠️ 违规警告: 直接使用Mongoose方法（应使用utilsCrud）"
    ⚠️ 输出: "⚠️ 提示: 请确认是否应该使用utilsCrud"

检查项3: 编码规范违规
  IF: Profile要求中文注释 AND 文件中存在英文注释（如 "// Create user"）
  THEN:
    ❌ 输出: "⚠️ 违规警告: 发现英文注释（Profile要求中文）"
    ❌ 立即翻译为中文
    ✅ 输出: "✅ 已修正: 已翻译为中文注释"
  
  IF: Profile要求特定命名规范 AND 文件命名不符合
  THEN:
    ❌ 输出: "⚠️ 违规警告: 文件命名不符合规范"
    ❌ 立即修正

检查项4: 文件命名违规（chat项目特定）
  IF: Profile要求snake_case命名 AND 文件使用了 kebab-case 或 camelCase 或 PascalCase
  THEN:
    ❌ 输出: "⚠️ 违规警告: 文件命名使用了错误格式 `<文件名>`"
    ❌ 立即重命名为 snake_case 格式
    ✅ 输出: "✅ 已修正: 重命名为 `<新文件名>`"
  
  示例:
    - ❌ `user-preference.ts` → ✅ `user_preference.ts` (kebab-case → snake_case)
    - ❌ `userPreference.ts` → ✅ `user_preference.ts` (camelCase → snake_case)
    - ❌ `UserPreference.ts` → ✅ `user_preference.ts` (PascalCase → snake_case)

检查项5: 接口文档缺失（创建Controller时）
  IF: 创建了新的Controller文件 AND 未创建对应的接口文档
  THEN:
    ❌ 输出: "⚠️ 违规警告: 创建了Controller但未创建接口文档"
    ❌ 立即创建接口文档: `docs/api/<resource_name>.md`
    ✅ 输出: "✅ 已修正: 已创建接口文档 `<文档路径>`"
  
  IF: 修改了Controller文件 AND 接口文档未同步更新
  THEN:
    ⚠️ 输出: "⚠️ 提示: Controller已修改，请确认接口文档是否需要更新"

🔴 【强制输出格式】- 每个文件完成后必须输出:

✅ **实时检查**: `<文件路径>`
  - 架构层次: [✅ 符合 / ❌ 违规: <说明>]
  - 技术栈: [✅ 符合 / ❌ 违规: <说明>]
  - 编码规范: [✅ 符合 / ❌ 违规: <说明>]
  - 文件命名: [✅ 符合 / ❌ 违规: <说明>]
  - 接口文档: [✅ 已创建 / ⚠️ 需创建 / - 不适用]
  [如果全部符合] → ✅ 该文件无违规项
  [如果有违规] → ❌ 已自动修正 <X> 处违规

示例输出:
  ✅ **实时检查**: `app/controller/home/user_preference.ts`
    - 架构层次: ✅ 符合（Controller模式）
    - 技术栈: ✅ 符合（使用Joi验证）
    - 编码规范: ✅ 符合（中文注释）
    - 文件命名: ✅ 符合（snake_case）
    - 接口文档: ✅ 已创建 `docs/api/user_preference.md`
    ✅ 该文件无违规项
  
  ❌ **实时检查**: `app/controller/home/user-preference.ts`
    - 架构层次: ✅ 符合（Controller模式）
    - 技术栈: ✅ 符合（使用Joi验证）
    - 编码规范: ✅ 符合（中文注释）
    - 文件命名: ❌ 违规: 使用了kebab-case（应使用snake_case）
    - 接口文档: ❌ 未创建
    - ✅ 已修正: 
      1. 重命名为 `user_preference.ts`
      2. 已创建接口文档 `docs/api/user_preference.md`
```

**执行规则**:
```yaml
IF: 发现违规项
THEN:
  1. ❌ 立即输出违规警告
  2. ❌ 自动修正（删除/替换/重构）
  3. ✅ 输出修正结果
  4. ✅ 继续下一个文件

IF: 连续3个文件都有同类违规
THEN:
  ⚠️ 输出: "⚠️ 严重警告: 连续违规，可能未正确理解Profile规范"
  ⚠️ 建议: "请重新执行场景0，重新理解项目规范"
  ⚠️ 停止执行，等待用户确认

IF: 所有文件无违规
THEN:
  ✅ 输出: "✅ 所有文件实时检查通过，符合项目规范"
```

---

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

### 场景 G: 数据库查询与分析 (🔴 主动数据支持)
**触发条件**:
- 用户询问项目数据相关问题
- 用户要求数据统计、分析、排查
- 用户描述问题需要查看实际数据才能诊断

**判断标准**（满足任一即触发）:
```yaml
1. 🔴 明确提及数据查询:
   - "查询 trips 集合"
   - "统计用户数量"
   - "分析订单数据"
   - "最近有多少XXX？"
   
2. 🟠 问题诊断需要数据支持:
   - "为什么这个功能不工作了？" → 需要查看实际数据状态
   - "用户反馈XX错误" → 需要查询相关记录
   - "这个字段有什么值？" → 需要查看集合结构
   - "数据是否正确？" → 需要验证数据内容
   
3. 🟡 数据探索与分析:
   - "这个项目有哪些集合？"
   - "用户表的结构是什么？"
   - "数据分布情况如何？"
   - "有多少条记录？"
```

**强制执行流程**:
```yaml
步骤1: 识别项目上下文 🔴
  - 从用户问题中识别项目名称（chat/monSQLize/etc）
  - 如未明确，从当前工作目录或上下文推断
  - 记录目标项目名称

步骤2: 读取项目 Profile 🔴
  - 读取 guidelines/profiles/<project>.md
  - 定位到 "MCP 配置" 章节
  - 检查是否配置了数据库访问
  
步骤3: 验证权限与配置 🔴
  IF: 未找到 MCP 配置章节
    → 提示: "该项目未配置 MCP 服务器，无法执行数据库查询"
    → 询问: "是否需要帮助配置数据库访问？"
    → 终止流程
    
  IF: 配置了 MCP
    → 记录允许的 MCP 服务器名称（如 mongodb-chat）
    → 记录数据库名称
    → 记录允许的操作类型（读/写/限制）
    → 继续执行

步骤4: 建立数据库连接 🔴
  - 调用对应的 MCP 连接工具
  - 示例: mcp_mongodb-chat_connect (如需要)
  - 或直接使用已连接的实例
  - 验证连接成功

步骤5: 信息收集（按需执行） 🟠
  IF: 用户询问"有哪些数据库/集合"
    → list-databases / list-collections
  
  IF: 用户询问"集合结构/字段"
    → collection-schema
    → collection-indexes
  
  IF: 用户询问"数据量/统计"
    → count
  
  IF: 需要查看具体数据
    → 继续步骤6

步骤6: 执行查询操作 🟠
  - 根据用户问题构建查询条件
  - 选择合适的方法: find/findOne/aggregate/count/explain
  - 🔴 默认限制返回数量:
    * limit: 10 (除非用户明确要求更多)
    * 最大不超过 100 条（防止 token 溢出）
  - 🔴 使用合理的查询选项
  - 🔴 过滤敏感字段（参考 Profile 中的敏感字段列表）

步骤7: 结果整理与输出 🔴
  - 将原始 JSON 数据转化为易读格式（表格/列表）
  - 添加数据上下文说明:
    * 数据来源（数据库.集合）
    * 查询条件
    * 返回数量
  - 提取关键发现和见解
  - 提供进一步分析建议
  - 使用统一的响应模板（见下方）
```

**安全规则** 🔴:
```yaml
必须遵守:
  - ✅ 仅调用 Profile 中声明的 MCP 服务器
  - ✅ 默认使用合理的 limit（10条）
  - ✅ 不返回敏感字段（password/token/secret/api_key）
  - ✅ 查询前向用户说明将执行的操作
  - ✅ 记录查询日志（数据库、集合、条件）
  
禁止行为:
  - ❌ 未读取 Profile 就调用数据库
  - ❌ 执行写入/更新/删除操作（除非用户明确要求且 Profile 允许）
  - ❌ 返回超过 1000 条记录（防止 token 溢出）
  - ❌ 跨项目查询数据
  - ❌ 暴露完整的数据库连接字符串
```

**响应模板**:
```markdown
### 📊 查询结果

**数据库**: <database_name>  
**集合**: <collection_name>  
**查询条件**: <filter_summary>  
**返回数量**: <count> 条

#### 数据概览
[整理后的数据表格或列表]

#### 💡 关键发现
- 发现1: ...
- 发现2: ...

#### 💭 分析建议
- 建议1: ...
- 建议2: ...

---
<details>
<summary>🔍 查询详情</summary>

**原始查询**:
\`\`\`javascript
db.<collection>.find({ ... }).limit(10)
\`\`\`

**数据来源**: MCP 服务器 `<mcp-server-name>`
</details>
```

**示例场景**:

**场景1: 明确的数据查询**
```yaml
用户: "查询 chat 项目中最近创建的 10 个行程"

AI 执行:
  1. ✅ 识别项目: chat
  2. ✅ 读取 guidelines/profiles/chat.md
  3. ✅ 确认 MCP: mongodb-chat，数据库: trip
  4. ✅ 连接数据库
  5. ✅ 执行查询: db.trips.find({}).sort({created_at: -1}).limit(10)
  6. ✅ 整理输出: 表格展示行程名称、创建时间、状态等
```

**场景2: 问题诊断需要数据**
```yaml
用户: "用户反馈行程创建失败，帮我看看"

AI 执行:
  1. ✅ 识别为诊断任务，需要数据支持
  2. ✅ 读取 chat 项目 Profile
  3. ✅ 连接 mongodb-chat
  4. ✅ 查询最近失败的记录（status: 'failed' 或 error 字段不为空）
  5. ✅ 分析失败原因
  6. ✅ 提供修复建议
```

**场景3: 数据探索**
```yaml
用户: "chat 项目有哪些数据集合？"

AI 执行:
  1. ✅ 识别项目: chat
  2. ✅ 读取 Profile，确认 mongodb-chat
  3. ✅ 连接数据库
  4. ✅ 执行: list-collections
  5. ✅ 整理输出: 集合列表 + 用途说明（参考 Profile）
```

---

### 场景 H: 验证流程执行
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

### 阶段 0: 项目规范确认 (最高优先级) 🔴
```yaml
[ ] 🔴 读取项目 Profile: guidelines/profiles/<project>.md (完整通读)
[ ] 🔴 提取架构禁止项:
    [ ] 是否禁止 Service 层？记录: ___________
    [ ] 是否禁止 Repository 层？记录: ___________
    [ ] 是否禁止 DTO 类？记录: ___________
[ ] 🔴 提取技术栈要求:
    [ ] 验证方式: Joi / class-validator / 其他？记录: ___________
    [ ] 测试框架: Mocha / Jest / 其他？记录: ___________
    [ ] 数据库操作: utilsCrud / 直接Mongoose / 其他？记录: ___________
[ ] 🔴 提取编码规范:
    [ ] 注释语言: 中文 / 英文？记录: ___________
    [ ] 文件命名: kebab-case / camelCase？记录: ___________
[ ] 🔴 冲突检查:
    [ ] 项目规范 vs 通用最佳实践，是否有冲突？
    [ ] 如有冲突，已确认优先项目规范？
[ ] 🔴 自我确认:
    [ ] 我是否会使用项目禁止的技术？必须 NO
    [ ] 我是否优先项目规范而非个人习惯？必须 YES

⚠️ 警告: 如果此阶段任何一项为空或不确定，立即停止，重新读取 Profile
```

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

**🔴 项目规范违规（最严重，优先级最高）**:
- ❌ 未读取项目 Profile 就开始写代码 → 必须先执行"场景 0"
- ❌ 使用项目明确禁止的技术（如 chat 项目禁止 Service 层但你用了）
- ❌ 使用项目未指定的验证库（如 chat 强制 Joi 但你用了 class-validator）
- ❌ 使用项目未指定的测试框架（如 chat 强制 Mocha 但你用了 Jest）
- ❌ 忽略项目规范，自作主张"优化"架构
- ❌ 认为"通用最佳实践"比"项目规范"更重要

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
