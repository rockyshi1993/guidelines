# 验证脚本使用指南

## 概述

本目录包含两个等效的规范验证脚本：
- **validate-specs.ps1** - PowerShell 版本（Windows 原生）
- **validate-specs.js** - Node.js 版本（跨平台）

两个脚本功能完全相同，可根据运行环境选择使用。

## 功能说明

验证 guidelines 规范文件的一致性和完整性，包括：

### ✅ 检查项目

1. **Profile 文件结构完整性**
   - 检查必需章节（关键目录、本地命令、文档版本）
   - 检查重要章节（MCP 配置、架构规范、测试框架）
   - 验证 MCP 配置格式和必填字段

2. **copilot-instructions.md 引用正确性**
   - 验证 `guidelines/profiles/<project>.md` 引用
   - 验证 `guidelines/v2.md#<anchor>` 引用
   - 验证场景定义完整性（场景 0, 0.1, 0.5, A-G）

3. **场景触发器完整性**
   - 验证每个场景的触发条件
   - 验证执行顺序定义
   - 验证必需组件（STEP 1-6, 强制执行顺序等）

4. **Markdown 链接有效性**
   - 扫描所有 Markdown 文件
   - 验证相对路径链接
   - 检测断开的文件链接（跳过外部链接和锚点）

5. **MCP 配置规范性**
   - 验证服务器名称格式（推荐: `tool-project`）
   - 验证必填字段（服务器、数据库、用途）
   - 检查说明完整性

---

## 使用方法

### PowerShell 版本

#### 基本用法
```powershell
# 默认检查模式
.\validate-specs.ps1

# 自动修复模式（尚未实现修复功能）
.\validate-specs.ps1 -Mode fix

# 详细输出模式
.\validate-specs.ps1 -Verbose
```

#### 完整参数说明
```powershell
.\validate-specs.ps1 [-Mode <check|fix>] [-Verbose]

参数:
  -Mode <check|fix>   运行模式（默认: check）
                      check  - 仅检查，不修改文件
                      fix    - 检查并自动修复（未来功能）
  
  -Verbose            显示详细输出，包括所有成功的检查项
```

---

### Node.js 版本

#### 基本用法
```bash
# 默认检查模式
node validate-specs.js

# 自动修复模式（尚未实现修复功能）
node validate-specs.js --fix

# 详细输出模式
node validate-specs.js --verbose

# 生成报告文件
node validate-specs.js --report
```

#### 完整参数说明
```bash
node validate-specs.js [options]

选项:
  --fix       自动修复模式（未来功能）
  --verbose   显示详细输出，包括所有成功的检查项
  --report    生成 validation-report.md 报告文件
```

#### 报告文件
使用 `--report` 选项会在 `guidelines/` 目录下生成 `validation-report.md`，包含：
- 统计结果（错误、警告、修复数量）
- 检查项目列表
- 详细验证日志
- 结论和建议

---

## 输出说明

### 标准输出格式

```
═══════════════════════════════════════════════════
  规范一致性验证脚本 v1.0
  模式: check
═══════════════════════════════════════════════════

═══ 检查 1: Profile 文件结构完整性 ═══
ℹ️  找到 3 个 Profile 文件

ℹ️  检查文件: chat.md
✅ 包含: ## 关键目录与运行时
✅ 包含: ## 本地与 CI 命令
⚠️  建议添加章节: ## 测试框架

...（其他检查项）...

═══════════════════════════════════════════════════
  验证完成
═══════════════════════════════════════════════════

统计结果:
  错误: 0
  警告: 2

✅ 验证通过（有警告） - 发现 2 个警告
```

### 退出码

- **0** - 验证通过（无错误，可能有警告）
- **1** - 验证失败（有错误）

可在 CI/CD 中使用退出码判断验证结果：
```yaml
# GitHub Actions 示例
- name: Validate Specifications
  run: node scripts/validate-specs.js
```

---

## 示例场景

### 场景 1: 日常开发检查
```bash
# 快速检查所有规范
node validate-specs.js

# 预期输出: ✅ 验证通过（或显示需要修复的问题）
```

### 场景 2: PR 提交前验证
```powershell
# PowerShell 详细检查
.\validate-specs.ps1 -Verbose

# 预期输出: 显示所有检查项的详细结果
```

### 场景 3: CI/CD 自动化
```yaml
# .github/workflows/validate-specs.yml
name: Validate Specifications

on:
  pull_request:
    paths:
      - '.github/copilot-instructions.md'
      - 'guidelines/**/*.md'
      - 'profiles/**/*.md'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Run Validation
        run: node guidelines/scripts/validate-specs.js
      
      - name: Generate Report
        if: failure()
        run: node guidelines/scripts/validate-specs.js --report
      
      - name: Upload Report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: validation-report
          path: guidelines/validation-report.md
```

### 场景 4: 生成详细报告
```bash
# 生成 Markdown 报告
node validate-specs.js --verbose --report

# 报告位置: guidelines/validation-report.md
```

---

## 常见错误与解决方法

### 错误 1: "缺少必需章节"
```
❌ chat.md 缺少必需章节: ## 本地与 CI 命令
```
**解决**: 在对应 Profile 中添加缺失的章节

### 错误 2: "MCP 配置缺少必填字段"
```
❌ MCP 配置缺少必填字段: 允许的 MCP 服务器
```
**解决**: 在 `## MCP 配置` 章节中添加：
```markdown
## MCP 配置
- 允许的 MCP 服务器: `mongodb-monsqlize`
- 数据库: monsqlize
- 用途: 测试数据查询和分析
```

### 警告 1: "建议添加章节"
```
⚠️  建议添加章节: ## 测试框架
```
**解决**: 这是建议性警告，如果项目有特定测试框架要求，建议添加该章节

### 警告 2: "断开的链接"
```
⚠️  断开的链接: ../examples/example.md (在 README.md)
```
**解决**: 检查并修复断开的文件链接，或删除无效引用

---

## 开发说明

### 添加新的检查项

如需添加新的验证检查，在脚本中按以下模板添加函数：

#### PowerShell 版本
```powershell
function Test-NewCheck {
    Write-ColorOutput "`n═══ 检查 X: 新检查项 ═══" -Type Info
    
    # 检查逻辑
    if ($someCondition) {
        Add-Error "错误描述"
    } elseif ($anotherCondition) {
        Add-Warning "警告描述"
    } elseif ($Verbose) {
        Write-ColorOutput "  ✓ 检查通过" -Type Success
    }
}

# 在 Main 函数中调用
Test-NewCheck
```

#### Node.js 版本
```javascript
function testNewCheck() {
    colorOutput('\n═══ 检查 X: 新检查项 ═══', 'info');
    
    // 检查逻辑
    if (someCondition) {
        addError('错误描述');
    } else if (anotherCondition) {
        addWarning('警告描述');
    } else if (verbose) {
        colorOutput('  ✓ 检查通过', 'success');
    }
}

// 在 main() 函数中调用
testNewCheck();
```

---

## 维护指南

### 定期维护

1. **规范更新时**
   - 更新 `requiredSections` 和 `importantSections` 列表
   - 添加新的场景检查逻辑
   - 更新 `requiredComponents` 定义

2. **新增 Profile 文件时**
   - 无需修改脚本（自动扫描）
   - 确保新 Profile 符合必需章节要求

3. **版本升级时**
   - 更新脚本顶部的版本号
   - 在 CHANGELOG.md 中记录变更

### 测试方法

```bash
# 测试正常项目（应该无错误）
cd guidelines
node scripts/validate-specs.js

# 测试错误检测（临时破坏 Profile）
# 1. 删除某个必需章节
# 2. 运行脚本，应该检测到错误
# 3. 恢复文件

# 测试报告生成
node scripts/validate-specs.js --report
cat validation-report.md
```

---

## 相关文档

- [copilot-instructions.md](../../.github/copilot-instructions.md) - AI 执行规范
- [guidelines/v2.md](../guidelines/v2.md) - 详细规范文档
- [profiles/](../profiles/) - 项目配置目录
- [TEMPLATE-EXAMPLE.md](../profiles/TEMPLATE-EXAMPLE.md) - Profile 模板示例

---

## 版本历史

### v1.0 (2025-01-29)
- ✅ 初始版本
- ✅ 5 个核心检查功能
- ✅ PowerShell 和 Node.js 双版本
- ✅ 彩色输出和详细日志
- ✅ 报告生成功能（Node.js）
- ⏳ 自动修复功能（待开发）

---

## 许可证

本脚本遵循项目根目录的 LICENSE 文件。
