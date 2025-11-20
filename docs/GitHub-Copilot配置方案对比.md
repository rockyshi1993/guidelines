# GitHub Copilot 配置方案对比

> **文档日期**: 2025-11-20  
> **目的**: 帮助选择最适合的配置方式

---

## 📊 三种配置方式对比

| 配置方式 | 位置 | 适用场景 | 优先级 |
|---------|------|---------|--------|
| 全局配置 | User settings.json | 个人开发 | 低 |
| 项目配置 | .vscode/settings.json | 团队协作 | 中 |
| Copilot Instructions | .github/copilot-instructions.md | 项目特定 | 高 |

---

## 方案1: 全局配置（个人推荐）

### 配置位置

**Windows**:
```
C:\Users\{你的用户名}\AppData\Roaming\Code\User\settings.json
```

**快速打开**:
1. VS Code 中按 `Ctrl+Shift+P`
2. 输入 "Preferences: Open User Settings (JSON)"
3. 回车

### 配置内容

```json
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "你必须严格遵守项目中的 guidelines/v3.md 规范（如果存在）"
    },
    {
      "text": "你必须按照 23个STEP 执行流程，在 STEP 7/10/12/14/16 等待用户确认"
    },
    {
      "text": "代码覆盖率必须≥80%，复杂度≤10，0敏感信息泄露"
    },
    {
      "text": "你必须生成完整的代码、测试、文档和Swagger"
    }
  ],
  "github.copilot.chat.localeOverride": "zh-CN"
}
```

### 优点
- ✅ 所有项目自动生效
- ✅ 配置一次，永久使用
- ✅ 个人习惯统一

### 缺点
- ❌ 团队无法共享
- ❌ 新电脑需要重新配置
- ❌ 不能版本控制

### 适用场景
- 个人开发
- 所有项目都使用相同规范
- 不需要团队共享

---

## 方案2: 项目配置（团队推荐）

### 配置位置

```
{项目根目录}/.vscode/settings.json
```

### 配置内容

```json
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "你必须严格遵守 guidelines/v3.md 中定义的所有规范"
    },
    {
      "text": "你必须按照 23个STEP 执行流程，在 STEP 7/10/12/14/16 等待用户确认"
    },
    {
      "text": "代码覆盖率必须≥80%，复杂度≤10，0敏感信息泄露"
    },
    {
      "text": "你必须生成完整的代码、测试、文档和Swagger"
    }
  ],
  "github.copilot.chat.localeOverride": "zh-CN"
}
```

### 优点
- ✅ 团队共享（提交到 Git）
- ✅ 版本控制
- ✅ 新成员自动获得配置
- ✅ 可以覆盖全局配置

### 缺点
- ❌ 每个项目需要单独配置
- ❌ 维护多个配置文件

### 适用场景
- 团队协作
- 项目有特定规范要求
- 需要版本控制配置

---

## 方案3: Copilot Instructions（最推荐）

### 配置位置

```
{项目根目录}/.github/copilot-instructions.md
```

### 配置内容

```markdown
# GitHub Copilot 执行规范

你必须严格遵守以下规范文件：**guidelines/v3.md**

## 工作方式

当用户发送任何消息时，你必须：

1. 立即响应："✅ 收到！我将按照规范执行"
2. 从 STEP 0 开始执行 23个STEP
3. 在 STEP 7/10/12/14/16 等待用户确认
4. 严格遵守所有规范要求

## 质量要求

- ❌ 不能跳过任何STEP
- ✅ 代码覆盖率必须≥80%
- ✅ 复杂度必须≤10
- ✅ 必须生成完整文档和测试
```

### 优点
- ✅ GitHub 官方支持
- ✅ 优先级最高
- ✅ 可以写详细说明
- ✅ 团队共享
- ✅ 版本控制

### 缺点
- ❌ 相对较新的功能
- ❌ 需要 Copilot 最新版本

### 适用场景
- 所有场景（最推荐）
- 特别是团队协作

---

## 🎯 推荐的混合方案

### 方案A: 个人开发者

**1. 全局配置基础规范**

User settings.json:
```json
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "代码覆盖率≥80%，复杂度≤10，0敏感信息泄露"
    }
  ],
  "github.copilot.chat.localeOverride": "zh-CN"
}
```

**2. 项目中添加规范文件**

每个项目复制 `guidelines/v3.md`

**优点**: 灵活，基础规范全局生效，项目可以有特定规范

---

### 方案B: 团队协作（推荐）

**1. 项目配置**

.vscode/settings.json:
```json
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "你必须严格遵守 guidelines/v3.md 规范"
    }
  ]
}
```

**2. Copilot Instructions**

.github/copilot-instructions.md:
```markdown
# GitHub Copilot 执行规范
你必须严格遵守：**guidelines/v3.md**
```

**3. 规范文件**

guidelines/v3.md + specs/

**优点**: 
- 团队所有成员使用相同规范
- 版本控制
- 新成员自动获得

---

### 方案C: 大型项目

**1. 全局配置**（个人习惯）

User settings.json:
```json
{
  "github.copilot.chat.localeOverride": "zh-CN"
}
```

**2. 项目配置**（团队规范）

.vscode/settings.json:
```json
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "你必须严格遵守 guidelines/v3.md 规范"
    }
  ]
}
```

**3. Copilot Instructions**（详细说明）

.github/copilot-instructions.md

**4. 规范文件**（完整规范）

guidelines/ + specs/

**优点**: 
- 层次清晰
- 灵活性高
- 适合复杂项目

---

## ⚠️ 重要注意事项

### 1. 配置优先级

```
.github/copilot-instructions.md （最高）
    ↓
.vscode/settings.json （中）
    ↓
User settings.json （最低）
```

### 2. 规范文件路径

**全局配置时的问题**:
```json
{
  "text": "你必须严格遵守 guidelines/v3.md 规范"
}
```
这要求**每个项目**都有 `guidelines/v3.md` 文件。

**解决方案**:

**选项1**: 统一路径
- 所有项目都复制规范文件到 `guidelines/v3.md`

**选项2**: 条件判断
```json
{
  "text": "你必须严格遵守项目中的 guidelines/v3.md 规范（如果存在）"
}
```

**选项3**: 项目特定配置
- 不用全局配置规范文件路径
- 只在需要的项目中配置

### 3. 重启生效

修改配置后：
1. 重启 VS Code 或
2. 重新加载窗口 (Ctrl+Shift+P → "Reload Window")

---

## ✅ 我的推荐

### 如果你是个人开发者

```
✅ 全局配置基础质量要求
✅ 项目中复制规范文件
✅ 使用 #file: 引用时精确控制
```

**配置**:
```json
// User settings.json
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "代码覆盖率≥80%，复杂度≤10"
    },
    {
      "text": "必须生成完整测试和文档"
    }
  ],
  "github.copilot.chat.localeOverride": "zh-CN"
}
```

---

### 如果你是团队成员

```
✅ 使用项目配置
✅ 添加 .github/copilot-instructions.md
✅ 提交到 Git 供团队共享
```

**配置**:
```json
// .vscode/settings.json
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "你必须严格遵守 guidelines/v3.md 规范"
    }
  ]
}
```

```markdown
// .github/copilot-instructions.md
你必须严格遵守：**guidelines/v3.md**
```

---

## 🚀 快速开始

### 步骤1: 选择方案

- 个人 → 全局配置
- 团队 → 项目配置 + Copilot Instructions

### 步骤2: 配置文件

按照上述示例创建配置

### 步骤3: 添加规范文件

复制 `guidelines/` 和 `specs/` 到项目

### 步骤4: 重启 VS Code

### 步骤5: 测试验证

```
#file:guidelines/v3.md
帮我创建一个函数
```

检查 Copilot 是否响应："收到！我将按照规范执行..."

---

**文档创建**: 2025-11-20  
**推荐方案**: 方案B（团队协作）

