# Profile 模板库说明

> **目录**: guidelines/profiles/templates/  
> **用途**: 常见项目类型的Profile模板  
> **版本**: v3.0  
> **最后更新**: 2025-11-21

---

## 📚 可用模板

### 1. node-backend.template.md ✅
**适用**: Node.js 后端 API 项目

**技术栈**:
- Node.js + Express/Koa
- MongoDB + Mongoose
- Jest测试

**特点**:
- 禁用Service层和DTO模式
- 使用Controller直接操作Model
- ESLint Airbnb风格

---

### 2. react-frontend.template.md (待创建)
**适用**: React 前端项目

**技术栈**:
- React + TypeScript
- Tailwind CSS
- Vitest测试

---

### 3. python-api.template.md (待创建)
**适用**: Python FastAPI 项目

**技术栈**:
- Python + FastAPI
- PostgreSQL
- pytest测试

---

## 🚀 使用方法

### 方法1: 复制模板

```bash
# 1. 复制模板到profiles目录
cp templates/node-backend.template.md ../your-project.md

# 2. 编辑模板
vim ../your-project.md

# 3. 修改以下内容:
#    - 项目名称
#    - 禁止项(根据实际情况)
#    - 目录结构(如有特殊要求)
#    - 质量标准(根据团队要求)
```

### 方法2: 使用脚本 (推荐)

```bash
# 运行模板生成脚本
npm run create-profile

# 按提示选择:
? 选择项目类型:
  > Node.js 后端
    React 前端
    Python API

? 项目名称: my-project

? 使用MongoDB? (Y/n) Y

✅ Profile已创建: guidelines/profiles/my-project.md
```

---

## 📝 模板结构

每个模板包含以下章节:

```yaml
1. 📋 项目信息
   - 项目类型
   - 技术栈
   - 版本要求

2. 🚫 禁止项
   - 禁止使用的模式/技术
   - 禁止删除的内容

3. 📁 目录结构
   - 强制目录结构
   - 文件组织方式

4. 📝 代码规范
   - 命名规范
   - 代码风格
   - Lint配置

5. 🧪 测试规范
   - 覆盖率要求
   - 测试框架
   - Mock策略

6. 📚 文档规范
   - 必需文档
   - 文档格式
   - API文档要求

7. 🗄️ 数据库规范 (如适用)
   - ORM选择
   - 命名规范
   - 操作约束

8. 🔧 脚本规范
   - 脚本语言
   - 脚本位置
   - 必需脚本

9. 🛠️ 工具调用
   - 允许的工具
   - 禁止的工具
   - 特殊约束

10. ⚙️ 特殊约束
    - 错误处理
    - 日志规范
    - 环境变量

11. 📦 依赖管理
    - 包管理器
    - 常用依赖
    - 版本约束

12. 📊 质量标准
    - 代码质量
    - 测试质量
    - 文档质量
    - 安全质量
```

---

## ✏️ 自定义建议

### 常见自定义点

1. **禁止项**
   ```yaml
   # 根据团队习惯调整
   禁止使用:
     - Service层 ✓ (如果团队不用)
     - TypeORM   ✓ (如果用Mongoose)
     - Class组件 ✓ (React项目如果只用Hook)
   ```

2. **代码风格**
   ```yaml
   # 根据团队Lint规则
   Lint配置:
     - ESLint: Airbnb/Standard/Google
     - 缩进: 2空格/4空格/Tab
     - 引号: 单引号/双引号
   ```

3. **测试覆盖率**
   ```yaml
   # 根据项目要求
   单元测试: 80%/85%/90%
   集成测试: 60%/70%/80%
   ```

4. **目录结构**
   ```yaml
   # 根据项目规模
   小项目: src/ + test/
   中项目: src/ + test/ + docs/
   大项目: packages/ + test/ + docs/ (monorepo)
   ```

---

## 🔄 模板维护

### 添加新模板

1. **创建模板文件**
   ```bash
   touch templates/new-template.template.md
   ```

2. **遵循模板结构**
   - 复制现有模板
   - 修改技术栈相关内容
   - 调整规范约束

3. **测试模板**
   ```bash
   # 用模板创建测试Profile
   cp templates/new-template.template.md profiles/test-project.md
   
   # 运行验证脚本
   npm run validate-profile -- profiles/test-project.md
   ```

4. **更新README**
   - 在本文件中添加模板说明
   - 更新可用模板列表

### 更新现有模板

1. **版本号管理**
   ```yaml
   # 在模板文件头部
   模板版本: 1.0 → 1.1
   兼容规范: v3.0
   更新日期: 2025-11-21
   ```

2. **变更记录**
   ```yaml
   # 在模板文件末尾添加
   ## 更新历史
   
   v1.1 (2025-11-21):
     - 添加XX规范
     - 调整测试覆盖率要求
   
   v1.0 (2025-11-20):
     - 初始版本
   ```

---

## 🎯 最佳实践

### 团队使用建议

1. **统一团队Profile**
   ```bash
   # 创建团队共享Profile
   profiles/team-standard.md
   
   # 所有项目继承
   profiles/project-a.md:
     继承: team-standard.md
     特殊约束: [...]
   ```

2. **Profile版本控制**
   ```bash
   # 提交到Git
   git add profiles/
   git commit -m "docs: 添加项目Profile"
   
   # 团队成员pull
   git pull origin main
   ```

3. **定期Review**
   ```yaml
   频率: 每月/每季度
   内容:
     - Profile是否还适用?
     - 是否需要调整规范?
     - 是否有新的约束?
   ```

---

## 🤝 贡献模板

欢迎贡献新的Profile模板！

### 贡献步骤

1. Fork 项目
2. 创建模板文件 `templates/xxx.template.md`
3. 遵循模板结构
4. 测试模板可用性
5. 提交 Pull Request

### 模板质量要求

```yaml
必须包含:
  ✅ 完整的12个章节
  ✅ 清晰的技术栈说明
  ✅ 实际可用的配置
  ✅ 使用说明

推荐包含:
  ✅ 使用示例
  ✅ 常见问题
  ✅ 最佳实践
```

---

## 📋 模板对比

| 模板 | 语言 | 框架 | 数据库 | 测试框架 | 难度 |
|------|------|------|--------|---------|------|
| node-backend | JavaScript | Express/Koa | MongoDB | Jest | ⭐⭐ |
| react-frontend | TypeScript | React | - | Vitest | ⭐⭐ |
| python-api | Python | FastAPI | PostgreSQL | pytest | ⭐⭐⭐ |

---

**最后更新**: 2025-11-21  
**维护者**: AI规范团队  
**反馈**: 欢迎提Issue或PR

