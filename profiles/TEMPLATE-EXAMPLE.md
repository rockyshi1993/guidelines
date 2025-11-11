# Profile 模板示例集

> **目的**: 本文提供完整的 Profile 示例，展示最佳实践和常见模式

---

## 📋 目录

1. [示例 1: 有禁止项的项目（chat-like）](#示例-1-有禁止项的项目chat-like)
2. [示例 2: 通用项目（generic）](#示例-2-通用项目generic)
3. [注解说明](#注解说明)
4. [常见模式](#常见模式)
5. [反模式（避免）](#反模式避免)

---

## 示例 1: 有禁止项的项目（chat-like）

```markdown
# chat 的 Github Profile（集中式）

## 关键目录与运行时
- 主目录与入口：`app/` (Controller/Model/Utils)
- 运行时与 OS：Node 18/20；Windows/Ubuntu
- 框架：Egg.js

## 本地与 CI 命令（PowerShell 优先）
- 安装：`npm ci`
- 测试：`npm test`
- 构建：`npm run build`
- 包体检查（库）：不适用（服务项目）

## 文档与版本
- `CHANGELOG.md` 路径与维护方式（Keep a Changelog + SemVer）
- `README` 的更新触发条件：新增/修改 API

## 🔴 MCP 配置（强制 - 使用 MCP 服务器的项目必填）
- 允许的 MCP 服务器: `mongodb-chat`
- 数据库: chat
- 用途: 测试数据查询和分析
- 限制: 只读权限，禁止删除操作

**说明**: AI 助手必须先读取此配置才能调用 MCP 服务器。未配置则禁止调用任何 MCP。

## 架构规范（🔴 强制遵守）

### ❌ 禁止项（必须 100% 遵守）
1. **禁止 Service 层**
   - 原因: 项目中 Service 层几乎都是重复的
   - 替代方案: Controller + Utils 模式
   - 示例:
     ```javascript
     // ❌ 错误: 创建 Service 层
     // app/service/user.js
     
     // ✅ 正确: Controller + Utils
     // app/controller/user.js
     // lib/utils/user_helper.js
     ```

2. **禁止 DTO 类**
   - 原因: 使用 Joi 验证即可
   - 替代方案: Joi schema
   - 示例:
     ```javascript
     // ❌ 错误: 创建 DTO 类
     class UserDto {
       constructor(name, age) { ... }
     }
     
     // ✅ 正确: Joi schema
     const schema = Joi.object({
       name: Joi.string().required(),
       age: Joi.number().min(0)
     });
     ```

3. **禁止 Repository 层**
   - 原因: 使用 utilsCrud 统一数据库操作
   - 替代方案: utilsCrud
   - 示例:
     ```javascript
     // ❌ 错误: 创建 Repository
     // app/repository/user.js
     
     // ✅ 正确: utilsCrud
     const { utilsCrud } = require('lib/utils');
     utilsCrud.find(ctx, 'users', { query: { ... } });
     ```

4. **禁止 class-validator**
   - 原因: 项目统一使用 Joi
   - 替代方案: Joi
   - 示例:
     ```javascript
     // ❌ 错误: 使用 class-validator
     import { IsString, IsNumber } from 'class-validator';
     
     // ✅ 正确: Joi
     const Joi = require('joi');
     const schema = Joi.object({ ... });
     ```

5. **禁止 Jest 测试框架**
   - 原因: 项目统一使用 Mocha
   - 替代方案: Mocha + Chai
   - 示例:
     ```javascript
     // ❌ 错误: Jest
     describe.skip('test', () => { ... });
     
     // ✅ 正确: Mocha + Chai
     const { describe, it } = require('mocha');
     const { expect } = require('chai');
     describe('test', () => { ... });
     ```

### ✅ 强制项（必须使用）
1. **强制使用 Joi 验证**
   - 说明: 所有输入必须使用 Joi 进行验证
   - 位置: `lib/validator/` 目录
   - 示例:
     ```javascript
     const Joi = require('joi');
     const schema = Joi.object({
       id: Joi.string().uuid().required(),
       limit: Joi.number().integer().min(1).max(100).default(20)
     });
     ```

2. **强制使用 Mocha 测试**
   - 说明: 测试框架必须使用 Mocha
   - 断言库: Chai 的 expect
   - 位置: `test/unit/features/`
   - 示例:
     ```javascript
     const { describe, it } = require('mocha');
     const { expect } = require('chai');
     
     describe('User Feature', () => {
       it('应该返回用户信息', () => {
         expect(result.success).to.be.true;
       });
     });
     ```

3. **强制中文注释**
   - 说明: Model/Controller/Utils 中的注释必须使用中文
   - 示例:
     ```javascript
     // ✅ 正确: 中文注释
     /**
      * 查询用户信息
      * @param {Object} ctx - 上下文对象
      * @returns {Object} 用户信息
      */
     async function getUser(ctx) { ... }
     
     // ❌ 错误: 英文注释
     /**
      * Get user information
      * @param {Object} ctx - Context object
      * @returns {Object} User info
      */
     ```

4. **强制使用 utilsCrud**
   - 说明: 数据库操作必须使用 utilsCrud
   - 禁止: 直接使用 Mongoose 方法
   - 示例:
     ```javascript
     // ✅ 正确: utilsCrud
     const { utilsCrud } = require('lib/utils');
     const users = await utilsCrud.find(ctx, 'users', {
       query: { status: 'active' }
     });
     
     // ❌ 错误: 直接 Mongoose
     const users = await User.find({ status: 'active' });
     ```

## 测试框架强制规范
- ✅ 测试框架：Mocha（强制）
- ✅ 断言库：Chai 的 expect（强制）
- ❌ 禁止：Jest、Node.js assert、其他断言库
- ✅ 测试目录：`test/unit/features/<功能名>.test.js`（唯一位置）
- ❌ 禁止：`test/app/controller/`、`test/integration/`、其他位置
- ✅ 文件命名：snake_case（如 `user_preference.test.js`）
- ❌ 禁止：kebab-case、camelCase

## 编码规范
- ✅ 文件命名：snake_case（如 `user_preference.ts`）
- ❌ 禁止：kebab-case、camelCase、PascalCase
- ✅ 接口文档：创建 Controller 时必须创建对应文档 `docs/api/<resource_name>.md`

## 例外与覆盖
- 无特殊例外

## 质量门槛（可选）
- 覆盖率门槛：行 ≥60%，分支 ≥60%，核心 API ≥70%

## 风险与回滚
- hotfix + patch 流程: 紧急修复走 hotfix 分支，合并后打 patch tag
```

### 📝 注解说明（示例 1）

```yaml
关键特征:
  1. 🔴 有明确禁止项（5 项）
  2. ✅ 有明确强制项（4 项）
  3. 🔴 有 MCP 配置（mongodb-chat）
  4. 🔴 有测试框架强制规范（Mocha + Chai）
  5. 🔴 有文件命名规范（snake_case）

章节结构:
  - 关键目录与运行时（必需）
  - 本地与 CI 命令（必需）
  - 文档与版本（必需）
  - MCP 配置（🔴 如有数据库操作，必需）
  - 架构规范（重点：禁止项 + 强制项）
  - 测试框架强制规范（重点）
  - 编码规范（可选但推荐）
  - 例外与覆盖（如有）
  - 质量门槛（可选）
  - 风险与回滚（可选）

禁止项格式:
  每个禁止项必须包含:
    - ❌ 标识
    - 原因（为什么禁止）
    - 替代方案（应该用什么）
    - 代码示例（错误 vs 正确）

强制项格式:
  每个强制项必须包含:
    - ✅ 标识
    - 说明（为什么必须）
    - 位置/配置（在哪里使用）
    - 代码示例（如何正确使用）
```

---

## 示例 2: 通用项目（generic）

```markdown
# monSQLize 的 Github Profile（集中式）

## 关键目录与运行时
- 主目录与入口：`lib/` (核心库代码)
- 运行时与 OS：Node 18/20；Windows/Ubuntu
- 类型：开源库（npm 包）

## 本地与 CI 命令（PowerShell 优先）
- 安装：`npm ci`
- 测试：`npm test`
- 构建：`npm run build`（如适用）
- 包体检查（库）：`npm pack`

## 文档与版本
- `CHANGELOG.md` 路径与维护方式（Keep a Changelog + SemVer）
- `README` 的更新触发条件：新增/修改公开 API

## 🔴 MCP 配置（强制 - 使用 MCP 服务器的项目必填）
- 允许的 MCP 服务器: `mongodb-monsqlize`
- 数据库: monsqlize
- 用途: 测试数据查询和分析
- 限制: 只读权限

**说明**: AI 助手必须先读取此配置才能调用 MCP 服务器。未配置则禁止调用任何 MCP。

## 架构规范

### 技术栈
- 语言：JavaScript (Node.js)
- 数据库：MongoDB
- 测试：Vitest
- 类型：TypeScript 类型声明文件（index.d.ts）

### 代码规范
- 引号：单引号（如 `'use strict'`）
- 分号：可选
- 模块系统：CommonJS（require/module.exports）
- 缩进：4 空格
- 行尾：LF

### 测试规范
- 测试框架：Vitest
- 测试目录：`test/unit/`
  - `features/` - 功能性测试（业务功能）
  - `infrastructure/` - 基础设施测试（logger/errors/connection）
  - `utils/` - 工具函数测试（纯函数）
- 文件命名：kebab-case（如 `find-page.test.js`）
- 覆盖率：行 ≥60%，分支 ≥60%，核心 API ≥70%

### 文档规范
- API 文档：`docs/<功能>.md`（每个公开 API 一个文件）
- 示例代码：`examples/<功能>.examples.js`（可运行）
- 类型声明：`index.d.ts`（同步更新）

## 例外与覆盖
- 无特殊例外

## 质量门槛
- 覆盖率门槛：行 ≥60%，分支 ≥60%，核心 API ≥70%
- CI 矩阵：Node 18.x/20.x × Windows/Ubuntu

## 风险与回滚
- hotfix 流程: 从 main 拉 hotfix 分支 → 修复 → 测试 → 合并 → 打 patch tag
```

### 📝 注解说明（示例 2）

```yaml
关键特征:
  1. ⭐ 无特殊禁止项（使用通用规范）
  2. ⭐ 无特殊强制项（使用通用规范）
  3. 🔴 有 MCP 配置（mongodb-monsqlize）
  4. ✅ 有明确的技术栈说明
  5. ✅ 有详细的测试规范（目录结构、命名）

章节结构:
  - 关键目录与运行时（必需）
  - 本地与 CI 命令（必需）
  - 文档与版本（必需）
  - MCP 配置（🔴 如有数据库操作，必需）
  - 架构规范（说明技术栈、代码规范、测试规范、文档规范）
  - 例外与覆盖（明确标注"无特殊例外"）
  - 质量门槛（可选但推荐）
  - 风险与回滚（可选）

与示例 1 的区别:
  - 无"禁止项"章节（使用通用规范）
  - 无"强制项"章节（使用通用规范）
  - 更详细的"技术栈"说明
  - 测试规范明确了目录分类（features/infrastructure/utils）
  - 明确标注"无特殊例外"（避免歧义）
```

---

## 注解说明

### MCP 配置章节（🔴 强制 - 有数据库操作时必填）

```yaml
何时必填:
  ✅ 项目需要查询/分析/修改数据库数据
  ✅ AI 助手可能需要调用 MCP 服务器
  ✅ 项目有数据探索需求

何时可选:
  ❌ 纯前端项目（无数据库）
  ❌ 纯计算库（无外部依赖）
  ❌ 工具脚本项目

必填字段:
  - 允许的 MCP 服务器: `<mcp-server-name>`（精确名称）
  - 数据库/资源: `<database-name>`
  - 用途: `<purpose>`（简短说明）
  - 限制: `<restrictions>`（可选，如：只读、禁止删除）

示例:
  # 好的示例（完整）
  - 允许的 MCP 服务器: `mongodb-chat`
  - 数据库: chat
  - 用途: 测试数据查询和分析
  - 限制: 只读权限，禁止删除操作
  
  # 不好的示例（不完整）
  - 数据库: chat  ❌ 缺少 MCP 服务器名称
  
  # 不好的示例（模糊）
  - 允许的 MCP 服务器: mongodb  ❌ 不够精确（应该是 mongodb-chat）
```

### 禁止项章节（🔴 有则必须详细）

```yaml
何时需要:
  ✅ 项目有明确的架构约束
  ✅ 团队有统一的技术选型
  ✅ 避免重复的反模式

格式要求（每个禁止项）:
  必须包含:
    1. ❌ 标识（明确标注禁止）
    2. 原因（为什么禁止，技术原因或团队约定）
    3. 替代方案（应该用什么）
    4. 代码示例（错误 vs 正确，可运行）
  
  可选包含:
    - 影响范围（哪些模块受影响）
    - 历史背景（为什么做这个决定）
    - 参考资料（相关文档链接）

示例:
  # 好的禁止项（完整）
  **禁止 Service 层**
  - 原因: 项目中 Service 层几乎都是重复的
  - 替代方案: Controller + Utils 模式
  - 示例:
    ```javascript
    // ❌ 错误: 创建 Service 层
    // app/service/user.js
    
    // ✅ 正确: Controller + Utils
    // app/controller/user.js
    // lib/utils/user_helper.js
    ```
  
  # 不好的禁止项（不完整）
  **禁止 Service 层**
  ❌ 缺少原因、替代方案、示例
```

### 强制项章节（✅ 有则必须详细）

```yaml
何时需要:
  ✅ 项目必须使用特定技术
  ✅ 统一的编码规范
  ✅ 关键的质量保证要求

格式要求（每个强制项）:
  必须包含:
    1. ✅ 标识（明确标注强制）
    2. 说明（为什么必须）
    3. 位置/配置（在哪里使用）
    4. 代码示例（如何正确使用）
  
  可选包含:
    - 检查方法（如何验证）
    - 错误示例（常见错误）
    - 参考文档（详细说明）

示例:
  # 好的强制项（完整）
  **强制使用 Joi 验证**
  - 说明: 所有输入必须使用 Joi 进行验证
  - 位置: `lib/validator/` 目录
  - 示例:
    ```javascript
    const Joi = require('joi');
    const schema = Joi.object({
      id: Joi.string().uuid().required(),
      limit: Joi.number().integer().min(1).max(100).default(20)
    });
    ```
  
  # 不好的强制项（不完整）
  **强制使用 Joi**
  ❌ 缺少说明、位置、示例
```

### 测试规范章节（🔴 重点章节）

```yaml
必须明确:
  1. 测试框架（Mocha/Jest/Vitest）
  2. 断言库（Chai/Node.js assert/Jest expect）
  3. 测试目录结构（features/infrastructure/utils）
  4. 文件命名规范（snake_case/kebab-case）
  5. 覆盖率标准（行/分支/核心 API）

示例:
  # 好的测试规范（完整）
  ## 测试框架强制规范
  - ✅ 测试框架：Mocha（强制）
  - ✅ 断言库：Chai 的 expect（强制）
  - ❌ 禁止：Jest、Node.js assert、其他断言库
  - ✅ 测试目录：`test/unit/features/<功能名>.test.js`（唯一位置）
  - ❌ 禁止：`test/app/controller/`、其他位置
  - ✅ 文件命名：snake_case（如 `user_preference.test.js`）
  - ❌ 禁止：kebab-case、camelCase
  
  # 不好的测试规范（不完整）
  - 测试框架：Mocha  ❌ 缺少断言库、目录、命名规范
```

---

## 常见模式

### 模式 1: 有明确架构约束的项目

```yaml
适用场景:
  - Egg.js/NestJS 等框架项目
  - 有团队统一技术栈
  - 避免重复的架构问题

Profile 结构:
  1. 关键目录与运行时
  2. 本地与 CI 命令
  3. 文档与版本
  4. MCP 配置（如适用）
  5. 🔴 架构规范（重点）:
     - ❌ 禁止项（3-5 项）
     - ✅ 强制项（3-5 项）
  6. 🔴 测试框架强制规范（重点）
  7. 编码规范（可选）
  8. 例外与覆盖
  9. 质量门槛
  10. 风险与回滚

参考: 示例 1（chat-like）
```

### 模式 2: 通用库项目

```yaml
适用场景:
  - npm/PyPI 包
  - 开源库
  - 工具类项目

Profile 结构:
  1. 关键目录与运行时
  2. 本地与 CI 命令（含 pack）
  3. 文档与版本
  4. MCP 配置（如适用）
  5. 架构规范:
     - 技术栈说明
     - 代码规范（引号/分号/模块系统）
     - 测试规范（目录/框架/命名）
     - 文档规范（API 文档/示例/类型）
  6. 例外与覆盖（明确"无"）
  7. 质量门槛（覆盖率/CI 矩阵）
  8. 风险与回滚

参考: 示例 2（monSQLize）
```

### 模式 3: 纯前端项目

```yaml
适用场景:
  - React/Vue/Angular 项目
  - 无后端/数据库
  - 静态网站

Profile 结构:
  1. 关键目录与运行时（含框架版本）
  2. 本地与 CI 命令（含 build）
  3. 文档与版本
  4. ❌ MCP 配置（不需要）
  5. 架构规范:
     - 组件结构（pages/components/layouts）
     - 状态管理（Redux/Vuex/Pinia）
     - 路由规范
     - 样式规范（CSS Modules/Styled Components）
  6. 测试规范（Jest/Vitest）
  7. 构建规范（Webpack/Vite）
  8. 质量门槛
  9. 风险与回滚
```

---

## 反模式（避免）

### ❌ 反模式 1: 缺少 MCP 配置（有数据库操作时）

```markdown
# ❌ 错误示例
## 架构规范
- 数据库: MongoDB
- 使用 Mongoose

问题:
  - 缺少 MCP 配置章节
  - AI 助手不知道是否允许调用 MCP
  - 可能导致连接错误的数据库

✅ 正确做法:
  必须添加 "MCP 配置" 章节，明确允许的 MCP 服务器
```

### ❌ 反模式 2: 禁止项缺少替代方案

```markdown
# ❌ 错误示例
## 架构规范
❌ 禁止 Service 层

问题:
  - 只说禁止，没说应该用什么
  - AI 助手不知道如何实现功能
  - 可能导致架构混乱

✅ 正确做法:
  **禁止 Service 层**
  - 原因: ...
  - 替代方案: Controller + Utils 模式
  - 示例: ...
```

### ❌ 反模式 3: 测试规范不明确

```markdown
# ❌ 错误示例
## 测试规范
- 使用 Mocha 测试

问题:
  - 没说断言库（Chai? assert? expect?）
  - 没说测试目录（test/? tests/? test/unit/?）
  - 没说文件命名（kebab-case? snake_case?）
  - AI 助手可能放错目录或用错断言库

✅ 正确做法:
  ## 测试框架强制规范
  - ✅ 测试框架：Mocha（强制）
  - ✅ 断言库：Chai 的 expect（强制）
  - ✅ 测试目录：test/unit/features/（唯一位置）
  - ✅ 文件命名：snake_case
```

### ❌ 反模式 4: 混淆"禁止"和"不推荐"

```markdown
# ❌ 错误示例
## 架构规范
- 不建议使用 Service 层

问题:
  - "不建议" 不是"禁止"
  - AI 助手可能仍然使用 Service 层
  - 规范不够强制

✅ 正确做法:
  明确使用 ❌ 禁止 或 ✅ 强制
  - ❌ 禁止 Service 层（100% 不能用）
  - 🟡 不推荐 XXX（可以用但不建议）
```

### ❌ 反模式 5: 缺少代码示例

```markdown
# ❌ 错误示例
## 架构规范
❌ 禁止直接使用 Mongoose
✅ 强制使用 utilsCrud

问题:
  - 没有代码示例
  - AI 助手不知道具体如何写
  - 可能导致实现错误

✅ 正确做法:
  ❌ 禁止直接使用 Mongoose
  ```javascript
  // ❌ 错误
  const users = await User.find({ ... });
  ```
  
  ✅ 强制使用 utilsCrud
  ```javascript
  // ✅ 正确
  const { utilsCrud } = require('lib/utils');
  const users = await utilsCrud.find(ctx, 'users', { ... });
  ```
```

### ❌ 反模式 6: 通用项目误标注"无例外"

```markdown
# ❌ 错误示例（通用项目）
## 架构规范
[无特殊禁止项]

## 例外与覆盖
- 例外 X: ...
- 例外 Y: ...

问题:
  - 自相矛盾（既说"无"又列出例外）
  - 应该明确"无特殊例外"

✅ 正确做法（通用项目）:
  ## 例外与覆盖
  - 无特殊例外
```

---

## 📚 参考资料

- [项目 Profile 最小模板](../../guidelines/v2.md#17-项目-profile-最小模板位于-guidelinesprofilesprojectmd)
- [MCP 配置强制检查](../../guidelines/v2.md#2-profile-选择策略集中式)
- [测试目录结构规范](../../guidelines/v2.md#7-测试与质量)
- [文档联动规范](../../guidelines/v2.md#6-代码修改与文档联动)

---

**版本**: v1.0  
**更新日期**: 2025-01-29  
**维护者**: AI 助手规范团队
