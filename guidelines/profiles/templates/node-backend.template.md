# Profile 模板 - Node.js 后端项目

> **模板名称**: node-backend  
> **适用场景**: Node.js/Express/Koa 后端 API 项目  
> **数据库**: MongoDB  
> **测试框架**: Jest  
> **最后更新**: 2025-11-21

---

## 📋 项目信息

```yaml
项目名称: [修改为你的项目名]
项目类型: Node.js 后端 API
技术栈:
  - Node.js >= 16
  - Express/Koa
  - MongoDB
  - Jest
```

---

## 🚫 禁止项

```yaml
禁止使用:
  - Service层模式 (使用Controller直接操作Model)
  - DTO模式 (直接使用MongoDB Model)
  - Sequelize ORM (使用Mongoose)

禁止删除:
  - 现有的 import/require 语句
  - 现有的路由定义
  - 现有的中间件
  - 现有的环境变量配置
```

---

## 📁 目录结构

```yaml
强制目录结构:
  src/
    controllers/    # 控制器
    models/         # Mongoose模型
    routes/         # 路由定义
    middleware/     # 中间件
    utils/          # 工具函数
    config/         # 配置文件
  
  test/
    unit/           # 单元测试
    integration/    # 集成测试
    api/            # API测试
  
  docs/
    api/            # API文档
    guides/         # 使用指南
```

---

## 📝 代码规范

```yaml
命名规范:
  文件名: kebab-case (user-controller.js)
  变量名: camelCase (userId)
  常量名: UPPER_SNAKE_CASE (MAX_RETRY)
  类名: PascalCase (UserModel)

代码风格:
  缩进: 2空格
  引号: 单引号
  分号: 必须
  行尾: LF

Lint配置:
  - ESLint: Airbnb风格
  - Prettier: 启用
```

---

## 🧪 测试规范

```yaml
测试覆盖率:
  单元测试: ≥85%
  集成测试: ≥70%
  API测试: 所有接口

测试框架:
  - Jest
  - Supertest (API测试)
  - mongodb-memory-server (测试数据库)

Mock策略:
  - 外部API: 必须Mock
  - 数据库: 使用内存数据库
  - 第三方服务: Mock
```

---

## 📚 文档规范

```yaml
必需文档:
  - README.md: 项目说明
  - API.md: API接口文档
  - SETUP.md: 环境搭建指南
  - CHANGELOG.md: 变更日志

API文档:
  - 使用 JSDoc 注释
  - 自动生成 Swagger
  - 包含请求/响应示例
```

---

## 🗄️ 数据库规范

```yaml
MongoDB规范:
  - 使用 Mongoose ODM
  - Model命名: PascalCase + Model后缀
  - Schema定义必须包含timestamps
  - 索引定义在Schema中

数据库操作:
  - 禁止直接使用原生MongoDB驱动
  - 所有查询必须有错误处理
  - 大量数据操作必须分批
```

---

## 🔧 脚本规范

```yaml
脚本语言: JavaScript (.js)

脚本位置:
  - scripts/ 目录

必需脚本:
  - scripts/db-seed.js (数据初始化)
  - scripts/db-migrate.js (数据迁移)
  - scripts/test-setup.js (测试环境搭建)

脚本格式:
  - 必须包含 shebang: #!/usr/bin/env node
  - 必须有使用说明
  - 必须有错误处理
```

---

## 🛠️ 工具调用

```yaml
允许的工具:
  - read_file: ✅
  - create_file: ✅
  - edit_file: ✅
  - grep_search: ✅
  - run_in_terminal: ⚠️ 需确认
  - MongoDB MCP: ✅ 优先使用开发环境

禁止的工具:
  - 无特殊禁止
```

---

## ⚙️ 特殊约束

```yaml
错误处理:
  - 所有async函数必须有try-catch
  - 使用统一的错误处理中间件
  - 错误响应格式统一

日志规范:
  - 使用 winston
  - 日志级别: error/warn/info/debug
  - 生产环境不输出debug

环境变量:
  - 所有配置使用环境变量
  - 提供 .env.example
  - 敏感信息不提交到Git
```

---

## 📦 依赖管理

```yaml
包管理器: npm

常用依赖:
  - express: ^4.18.0
  - mongoose: ^7.0.0
  - dotenv: ^16.0.0
  - winston: ^3.8.0

开发依赖:
  - jest: ^29.0.0
  - eslint: ^8.0.0
  - prettier: ^2.8.0
  - supertest: ^6.3.0
```

---

## 🚀 使用说明

### 如何使用此模板

1. **复制模板**
   ```bash
   cp templates/node-backend.template.md profiles/your-project.md
   ```

2. **修改项目信息**
   - 修改项目名称
   - 调整禁止项(如果需要)
   - 调整目录结构(如果需要)

3. **调整规范**
   - 根据团队习惯调整代码风格
   - 根据项目需求调整测试覆盖率
   - 添加项目特定约束

4. **启用Profile**
   - 将文件放到 `guidelines/profiles/` 目录
   - AI会自动读取并应用

---

## 📊 质量标准

```yaml
代码质量:
  - Lint: 0错误 0警告
  - 复杂度: ≤10
  - 函数长度: ≤50行

测试质量:
  - 单元测试: ≥85%
  - 集成测试: ≥70%
  - 所有测试通过: 100%

文档质量:
  - API文档: 100%覆盖
  - Swagger: 自动生成
  - 示例代码: 可运行

安全质量:
  - 敏感信息: 0个
  - 依赖漏洞: 0高危
```

---

**模板版本**: 1.0  
**兼容规范**: v3.0  
**最后更新**: 2025-11-21

