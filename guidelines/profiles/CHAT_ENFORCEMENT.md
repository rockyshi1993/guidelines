# 🔴 AI 助手强制执行规范（chat 项目）

> **这是最高优先级规范！必须 100% 遵守，不得有任何例外！**

---

## 🔴 强制规则（违反即视为任务失败）

### 1. 测试文件位置 🔴

**唯一正确的位置**：
```
test/unit/features/<功能名>.test.js
```

**禁止的位置**：
- ❌ `test/app/controller/` - 禁止！规范中未提及！
- ❌ `test/integration/` - 除非规范明确要求
- ❌ `test/e2e/` - 除非规范明确要求
- ❌ 任何其他位置

**示例**：
- ✅ 正确：`test/unit/features/user_preference.test.js`
- ❌ 错误：`test/app/controller/user_preference.test.js`
- ❌ 错误：`test/user_preference.test.js`

---

### 2. 测试框架 🔴

**强制使用**：
- ✅ Mocha（测试运行器）
- ✅ Chai（断言库，使用 `expect`）
- ✅ egg-mock（Egg.js 应用测试）

**禁止使用**：
- ❌ Jest - 禁止！
- ❌ Node.js `assert` - 禁止！应该用 Chai
- ❌ Ava、Tape、Jasmine - 禁止！

**正确示例**：
```javascript
// ✅ 正确
const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const { app } = require('egg-mock/bootstrap');

describe('UserPreference', () => {
  it('应该返回默认值', async () => {
    expect(result.body.success).to.be.true;
  });
});
```

**错误示例**：
```javascript
// ❌ 错误 - 使用了 Node.js assert
const { strict: assert } = require('node:assert');
assert.equal(result.body.success, true); // 禁止！

// ❌ 错误 - 使用了 Jest
import { describe, it, expect } from '@jest/globals';
```

---

### 3. 架构层次 🔴

**禁止创建**：
- ❌ `app/service/` - 禁止 Service 层
- ❌ `dto/` - 禁止 DTO 类
- ❌ `app/repository/` - 禁止 Repository 层

**正确做法**：
- ✅ Controller 直接使用 `ctx.utilsCrud` 操作数据库
- ✅ 复用逻辑放在 `app/utils/` 下

---

### 4. 参数验证 🔴

**强制使用**：
- ✅ Joi（`ctx.Joi` + `ctx.validateJoi`）

**禁止使用**：
- ❌ class-validator
- ❌ DTO 类
- ❌ ajv、yup 等其他库

---

### 5. 文件命名 🔴

**强制使用 snake_case**：
- ✅ `user_preference.ts`
- ✅ `chat_log.ts`
- ✅ `message_setting.ts`

**禁止使用**：
- ❌ `user-preference.ts` (kebab-case)
- ❌ `userPreference.ts` (camelCase)
- ❌ `UserPreference.ts` (PascalCase)

---

### 6. 注释语言 🔴

**强制使用中文**：
- ✅ Model 字段注释必须中文
- ✅ 函数注释必须中文
- ✅ 复杂逻辑必须中文注释

---

### 7. 接口文档 🔴

**强制创建**：
- ✅ 位置：`docs/api/<resource_name>.md`
- ✅ 时机：创建 Controller 时必须同步创建
- ✅ 内容：参考 chat.md 中的模板

---

## 🚨 AI 执行流程（强制）

### 步骤 0：读取规范（最高优先级）

```yaml
在写任何代码前，必须执行：

1. 🔴 读取：guidelines/profiles/chat.md
2. 🔴 检查：是否有禁止项？
3. 🔴 确认：我要用的技术是否被禁止？
4. 🔴 验证：我的文件路径是否符合规范？
5. 🔴 检查：我的测试框架是否正确？

如果任何一项不确定，立即停止，重新阅读规范！
```

### 步骤 1：创建文件前的检查清单

```yaml
创建测试文件前，必须回答：

Q1: 测试文件路径是什么？
A1: test/unit/features/<功能名>.test.js

Q2: 使用什么测试框架？
A2: Mocha + Chai + egg-mock

Q3: 使用什么断言库？
A3: Chai 的 expect

Q4: 是否会创建 Service 层？
A4: 否！禁止！

Q5: 是否会创建 DTO 类？
A5: 否！禁止！

Q6: 使用什么参数验证？
A6: Joi

Q7: 文件命名方式？
A7: snake_case（下划线）

Q8: 注释语言？
A8: 中文

Q9: 是否需要接口文档？
A9: 是！docs/api/<resource_name>.md

Q10: 是否会在 test/app/controller/ 创建测试文件？
A10: 否！绝对不会！规范中未提及！
```

### 步骤 2：创建文件后的验证清单

```yaml
创建文件后，必须检查：

[ ] 测试文件在 test/unit/features/ 下？
[ ] 使用了 Mocha + Chai？
[ ] 没有使用 Node.js assert？
[ ] 没有使用 Jest？
[ ] 没有创建 Service 层？
[ ] 没有创建 DTO 类？
[ ] 使用了 Joi 验证？
[ ] 文件名是 snake_case？
[ ] 注释是中文？
[ ] 创建了接口文档？
[ ] 没有在 test/app/controller/ 创建文件？

如果有任何一项为 ❌，立即修正！
```

---

## 📊 为什么 AI 会违反规范？

### 原因分析：

1. **通用最佳实践优先于项目规范**
   - AI 记住了 `test/app/controller/` 是常见做法
   - 但 chat 项目规范中**只提到了** `test/unit/features/`

2. **多个断言库混用**
   - AI 知道 Node.js `assert` 和 Chai 都可以用
   - 但规范**明确要求** Chai

3. **过度设计**
   - AI 倾向于创建多层结构（Service、DTO、Repository）
   - 但规范**明确禁止**

---

## ✅ 解决方案

### 方案 1：强化 copilot-instructions.md（推荐）

在 `.github/copilot-instructions.md` 中添加**项目规范绝对优先**规则：

```markdown
## 🔴 项目规范绝对优先

IF: 项目 Profile（guidelines/profiles/<project>.md）明确规定
THEN: 100% 遵守项目规范，忽略通用最佳实践

示例：
- Profile 说 "test/unit/features/"  →  只能用这个路径
- Profile 说 "Mocha + Chai"         →  不能用 Jest 或 assert
- Profile 说 "禁止 Service 层"      →  绝对不能创建
```

### 方案 2：在 chat.md 中添加负面清单

明确列出**禁止的做法**：

```markdown
## ❌ 禁止清单（chat 项目）

### 测试相关
- ❌ 在 test/app/controller/ 创建测试文件
- ❌ 使用 Node.js assert
- ❌ 使用 Jest

### 架构相关
- ❌ 创建 Service 层
- ❌ 创建 DTO 类
- ❌ 创建 Repository 层

### 其他
- ❌ 使用 class-validator
- ❌ 使用 kebab-case 命名
```

---

## 🎯 立即行动

让我现在就修改规范文档，添加强制执行机制：

