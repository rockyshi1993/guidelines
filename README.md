# 说明
项目通用规范文件

# .github 规范文件说明

本目录包含仓库的所有代码规范和项目配置文件，主要供 **AI 助手**（如 GitHub Copilot）使用，用于指导代码生成。

## 📁 文件结构

```
.github/
├── copilot-instructions.md      # AI 助手入口配置
├── guidelines.md                # 通用规范（详细，20个章节）
├── profiles/                    # 各项目特定规范
│   ├── monSQLize.md
│   ├── vsse.md
│   ├── sseKify.md
│   ├── ndsk_core.md
│   ├── chatAI.md
│   └── trip-assistant.md
├── ensure-project-docs.ps1      # 文档自检脚本
└── .aiignore                    # AI 助手忽略配置
```

## 📖 文件说明

### copilot-instructions.md
- **用途**: AI 助手的入口配置文件
- **内容**: 指向通用规范，提供快速参考
- **目标用户**: AI 助手（Copilot、Cursor 等）

### guidelines.md
- **用途**: 详细的通用规范文档
- **内容**: 20个章节，涵盖代码风格、测试、文档、安全、性能等
- **适用范围**: 仓库中所有项目

### profiles/
- **用途**: 各项目的特定规范配置
- **内容**: 项目特定的代码生成规则、例外声明
- **规则**: 项目规范可覆盖通用规范

### ensure-project-docs.ps1
- **用途**: 检查项目必需文档是否存在
- **用法**: `pwsh .github/ensure-project-docs.ps1 -mode check`
- **功能**: 检查 README.md、CHANGELOG.md、STATUS.md 等

### .aiignore
- **用途**: 配置 AI 助手的文件忽略规则
- **语法**: 类似 .gitignore
- **作用**: 减少 AI 助手的噪音，提高效率

## 🎯 规范体系

```
通用规范 (guidelines.md)
    ↓ 继承
项目规范 (profiles/<项目>.md)
    ↓ 应用
项目代码
```

### 规范优先级
1. 项目 profile 中的例外和覆盖规则
2. 通用规范 guidelines.md
3. 代码默认行为

## 🚀 如何使用

### 对于开发者
- 查看 `guidelines.md` 了解通用规范
- 查看 `profiles/<项目>.md` 了解项目特定要求

### 对于 AI 助手
- 读取 `copilot-instructions.md` 获取入口
- 根据文件路径匹配对应的项目 profile
- 合并通用规范和项目规范生成代码

## 📝 维护指南

### 添加新项目
1. 在 `profiles/` 创建 `<项目名>.md`
2. 开头声明规范继承关系
3. 定义项目特定的代码生成规则
4. 声明例外和覆盖

### 修改规范
1. 通用规则 → 修改 `guidelines.md`
2. 项目特定规则 → 修改 `profiles/<项目>.md`
3. AI 入口配置 → 修改 `copilot-instructions.md`

---

**最后更新**: 2025-01-12
