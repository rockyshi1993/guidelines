# 如何在 GitHub Copilot 中使用 v3 规范

> **文档日期**: 2025-11-20  
> **适用范围**: GitHub Copilot, GitHub Copilot Chat

---

## 🎯 方法总览

| 方法 | 适用场景 | 优先级 |
|-----|---------|--------|
| 方法1: `.github/copilot-instructions.md` | 项目级别，自动生效 | ⭐⭐⭐⭐⭐ 推荐 |
| 方法2: 对话中引用 | 临时使用 | ⭐⭐⭐ |
| 方法3: `#file` 引用 | 精确控制 | ⭐⭐⭐⭐ |
| 方法4: VSCode配置 | 团队共享 | ⭐⭐⭐⭐ |

---

## 方法1: 使用 .github/copilot-instructions.md（推荐）

### 步骤

1. **创建文件**: 在项目根目录创建 `.github/copilot-instructions.md`
2. **写入内容**:
   ```markdown
   # GitHub Copilot 执行规范

   你必须严格遵守以下规范文件：

   ## 主规范文件
   请立即读取并遵守：**guidelines/v3.md**

   ## 详细规范文件
   - `specs/core/流程.md` - 23个STEP流程
   - `specs/rules/代码规范.md` - 代码标准
   - `specs/rules/测试规范.md` - 测试要求
   （其他规范文件...）

   ## 工作方式
   1. 立即响应："✅ 收到！我将按照规范执行"
   2. 执行23个STEP
   3. 在确认点等待用户
   ```

3. **重启 Copilot**: 重新加载 VS Code 窗口

### 优点
- ✅ 自动生效，不需要每次都引用
- ✅ 项目级别，所有协作者都能使用
- ✅ GitHub 官方支持

### 验证方法
打开 Copilot Chat，输入任何消息，Copilot 应该自动响应：
```
✅ 收到！我将按照规范执行...
```

---

## 方法2: 在对话中直接引用

### 使用方式

**简单引用**:
```
@workspace 请按照 guidelines/v3.md 执行
```

**详细引用**:
```
请严格遵守 guidelines/v3.md 规范，包括：
1. 23个STEP执行流程
2. 5个用户确认点
3. 代码覆盖率≥80%
4. 生成完整文档和测试
```

**带任务的引用**:
```
按照 guidelines/v3.md 规范，帮我开发用户登录功能
```

### 优点
- ✅ 灵活，可以随时使用
- ✅ 可以指定特定的规范要求

### 缺点
- ❌ 每次都要手动引用
- ❌ 可能会忘记

---

## 方法3: 使用 #file 引用（精确控制）

### 使用方式

**引用主规范**:
```
#file:guidelines/v3.md 
帮我开发用户登录功能
```

**引用多个规范**:
```
#file:guidelines/v3.md 
#file:specs/rules/代码规范.md
#file:specs/rules/测试规范.md
帮我开发用户登录功能
```

**引用特定章节**:
```
#file:guidelines/v3.md#你必须查阅的规范文件
按照这个流程执行
```

### 优点
- ✅ 精确控制，Copilot 会实际读取文件内容
- ✅ 可以同时引用多个文件
- ✅ 可以引用特定章节

### 适用场景
- 需要精确遵守某个规范时
- 需要引用多个规范文件时
- 调试规范是否生效时

---

## 方法4: VSCode 项目配置（团队共享）

### 步骤

1. **创建配置**: `.vscode/settings.json`
2. **写入配置**:
   ```json
   {
     "github.copilot.chat.codeGeneration.instructions": [
       {
         "text": "你必须严格遵守 guidelines/v3.md 中定义的所有规范"
       },
       {
         "text": "你必须按照 23个STEP 执行，在 STEP 7/10/12/14/16 等待用户确认"
       },
       {
         "text": "代码覆盖率≥80%，复杂度≤10，0敏感信息泄露"
       }
     ]
   }
   ```

3. **提交到 Git**: 让团队成员共享

### 优点
- ✅ 团队共享
- ✅ 版本控制
- ✅ 自动生效

### 注意
- 需要 GitHub Copilot 最新版本
- 配置可能因版本而异

---

## 🔥 推荐的最佳实践

### 组合使用

1. **项目级**: 创建 `.github/copilot-instructions.md`（必须）
2. **团队级**: 配置 `.vscode/settings.json`（推荐）
3. **使用时**: 用 `#file` 引用具体规范（按需）

### 文件结构

```
your-project/
├── .github/
│   └── copilot-instructions.md  ← 项目级规范引用
├── .vscode/
│   └── settings.json             ← 团队级配置
├── guidelines/
│   ├── v3.md                     ← 主规范文件
│   └── specs/
│       ├── core/                 ← 核心规范
│       ├── rules/                ← 规则规范
│       └── output/               ← 输出规范
└── src/
    └── your-code/
```

---

## 💡 使用示例

### 示例1: 开发新功能

**命令**:
```
#file:guidelines/v3.md
帮我开发用户登录功能，包含：
1. 登录接口
2. Token验证
3. 完整测试
4. API文档
```

**Copilot 响应**:
```
✅ 收到！我将按照规范执行：

STEP 0: 正在扫描 Profile 和禁止项...
✅ 未发现 Profile，使用默认规范

STEP 1: 分析你的意图...
✅ 识别到意图: Intent-02 (开发新功能)
✅ 风险等级: P1

STEP 2-4: 应用规范...
✅ 读取代码规范、测试规范、API规范、安全规范

STEP 5: 全面分析...
...
```

---

### 示例2: 代码审查

**命令**:
```
#file:guidelines/v3.md
#file:specs/rules/代码规范.md
#file:specs/rules/安全规范.md
审查 src/auth/login.js 的代码
```

**Copilot 响应**:
```
✅ 收到！我将按照规范执行：

STEP 1: 识别到意图: Intent-03 (代码审查)

正在检查：
✅ 命名规范
✅ 代码结构（函数长度≤50行）
✅ 复杂度（≤10）
✅ 敏感信息检测
⚠️ 发现问题...
```

---

### 示例3: 生成测试

**命令**:
```
#file:guidelines/v3.md
#file:specs/rules/测试规范.md
为 src/auth/login.js 生成完整测试
```

**Copilot 响应**:
```
✅ 收到！我将按照规范执行：

STEP 1: 识别到意图: Intent-06 (生成测试)

STEP 11: 编写测试用例...
生成测试文件：
- test/auth-login-unit.test.js (单元测试)
- test/auth-login-integration.test.js (集成测试)
- test/auth-login-api.test.js (API测试)

目标覆盖率: ≥80%
测试模式: AAA (Arrange-Act-Assert)
...
```

---

## ✅ 验证规范是否生效

### 测试方法

1. **发送测试消息**:
   ```
   帮我创建一个简单的用户注册功能
   ```

2. **检查响应**:
   - ✅ 应该响应："收到！我将按照规范执行"
   - ✅ 应该提到 STEP 0-22
   - ✅ 应该在 STEP 7 等待确认

3. **检查输出**:
   - ✅ 生成的代码应该符合命名规范
   - ✅ 应该自动生成测试文件
   - ✅ 应该生成 README 和 API 文档

### 不生效的解决方法

如果规范没有生效：

1. **检查文件位置**:
   ```
   .github/copilot-instructions.md 是否在项目根目录？
   guidelines/v3.md 路径是否正确？
   ```

2. **重启 Copilot**:
   - 按 `Ctrl+Shift+P` (Windows) 或 `Cmd+Shift+P` (Mac)
   - 输入 "Reload Window"
   - 重新加载窗口

3. **明确引用**:
   ```
   #file:guidelines/v3.md
   请严格按照这个规范执行
   ```

4. **检查 Copilot 版本**:
   - 确保使用最新版 GitHub Copilot
   - 确保启用了 Copilot Chat

---

## 🎯 最佳实践总结

### ✅ 推荐做法

1. **必须创建**: `.github/copilot-instructions.md`
2. **建议配置**: `.vscode/settings.json`
3. **使用时引用**: `#file:guidelines/v3.md`
4. **定期验证**: 确保规范生效

### ❌ 避免的做法

1. ❌ 不要只在对话中口头说明规范
2. ❌ 不要假设 Copilot 记住了之前的规范
3. ❌ 不要跳过验证步骤

### 💡 小技巧

1. **创建快捷命令**: 在 `.vscode/settings.json` 中配置
2. **使用模板**: 为常见任务创建提示词模板
3. **团队共享**: 将 `.github` 和 `.vscode` 提交到 Git

---

## 📚 相关资源

- [GitHub Copilot 官方文档](https://docs.github.com/en/copilot)
- [Copilot Instructions 说明](https://github.blog/changelog/2024-03-25-github-copilot-chat-now-supports-project-level-instructions/)
- [v3 规范完整文档](./guidelines/v3.md)

---

**创建日期**: 2025-11-20  
**最后更新**: 2025-11-20  
**状态**: ✅ 可用

