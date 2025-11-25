# monSQLize 项目规范（AI 助手用）

## 📋 规范继承
本项目遵循 `D:/OneDrive/Project/common/guidelines/guidelines/v3.md` 通用规范。以下仅列出项目特定配置和例外。

---

## 📦 项目信息

- **项目名称**: monSQLize
- **项目类型**: Node.js 库（开源 npm 包）
- **模块系统**: CommonJS（require/module.exports）
- **项目定位**: 多数据库统一查询 API（Mongo 风格）
- **当前版本**: v0.1.0（未发布）
- **功能完成度**: 77.6% (59/76 方法已实现)
  - CRUD + 索引 + 事务 + 便利性方法：**100%** ✅
  - 文档覆盖率：**100%** ✅
  - 核心功能完成度：**100%** ✅

### 运行时环境
- **Node.js 版本**: 18.x, 20.x
- **操作系统**: Windows, Ubuntu (Linux)
- **MongoDB 驱动版本**: 6.x（完全支持）
- **数据库支持**: 
  - ✅ MongoDB 4.x+（当前完整支持）
  - 🗺️ PostgreSQL（计划中）
  - 🗺️ MySQL（计划中）

### 依赖说明
- **核心依赖**: 
  - `mongodb@^6.17.0` - MongoDB 官方驱动
- **可选依赖**: 
  - `ioredis@^5.8.2` - Redis 多层缓存支持
- **开发依赖**:
  - `mocha@^11.7.4` - 测试框架（兼容 API）
  - `mongodb-memory-server@^10.1.2` - 测试用内存数据库
  - `eslint@^8.57.0` - 代码质量检查
  - `nyc@^15.1.0` - 代码覆盖率统计

---

## 🚀 本地命令

### 依赖管理
```powershell
# 安装依赖（推荐使用 ci 保证一致性）
npm ci

# 安装依赖（首次安装）
npm install
```

### 测试命令
```powershell
# 运行所有单元测试和集成测试
npm test

# 或直接运行测试脚本
node test/run-tests.js

# 仅运行单元测试
npm run test:unit

# 运行性能测试
npm run test:performance

# 运行代码覆盖率测试
npm run test:coverage

# 生成 HTML 覆盖率报告
npm run coverage
```

### 代码质量检查
```powershell
# 运行 ESLint 检查
npm run lint

# 自动修复 ESLint 问题
npm run lint:fix
```

### 基准测试
```powershell
# 运行性能基准测试
npm run benchmark
```

### 发布前检查
```powershell
# 打包预览（不会实际发布）
npm pack

# 检查包内容和大小
```

### 覆盖率标准
项目使用 nyc 进行覆盖率统计，配置在 package.json：
- **行覆盖率**: ≥ 70%
- **语句覆盖率**: ≥ 70%
- **函数覆盖率**: ≥ 70%
- **分支覆盖率**: ≥ 65%

---

## 📂 目录结构

### 核心代码结构
```
lib/
├── common/                    # 通用层（跨数据库逻辑）
│   ├── cursor.js             # 游标编解码
│   ├── docs-urls.js          # 文档 URL 工具
│   ├── index-options.js      # 索引选项处理
│   ├── log.js                # 日志辅助工具
│   ├── namespace.js          # 命名空间管理
│   ├── normalize.js          # 参数规范化
│   ├── page-result.js        # 分页结果构建
│   ├── runner.js             # 统一执行器（缓存+慢日志）
│   ├── shape-builders.js     # 查询形状构建器
│   └── validation.js         # 参数校验
│
├── mongodb/                   # MongoDB 适配器
│   ├── common/               # MongoDB 专属工具
│   │   ├── accessor-helpers.js  # 访问器辅助函数
│   │   ├── agg-pipeline.js      # 聚合管道构建
│   │   ├── iid.js               # 实例 ID 生成
│   │   ├── lexicographic-expr.js # 字典序表达式
│   │   ├── shape.js             # MongoDB 查询形状
│   │   └── sort.js              # 排序处理
│   │
│   ├── management/           # 管理操作
│   │   ├── bookmark-ops.js   # 书签操作
│   │   ├── cache-ops.js      # 缓存操作
│   │   ├── collection-ops.js # 集合管理
│   │   ├── index-ops.js      # 索引管理
│   │   ├── namespace.js      # 命名空间操作
│   │   └── index.js          # 管理操作导出
│   │
│   ├── queries/              # 查询操作
│   │   ├── aggregate.js      # 聚合查询
│   │   ├── chain.js          # 链式调用 API
│   │   ├── count.js          # 计数查询
│   │   ├── distinct.js       # 去重查询
│   │   ├── find-and-count.js # 查询并计数
│   │   ├── find-by-ids.js    # 批量 ID 查询
│   │   ├── find-one-by-id.js # 单个 ID 查询
│   │   ├── find-one.js       # 单条查询
│   │   ├── find-page.js      # 分页查询
│   │   ├── find.js           # 多条查询
│   │   └── index.js          # 查询操作导出
│   │
│   ├── writes/               # 写入操作
│   │   ├── delete-many.js    # 批量删除
│   │   ├── delete-one.js     # 单条删除
│   │   ├── find-one-and-delete.js   # 原子删除
│   │   ├── find-one-and-replace.js  # 原子替换
│   │   ├── find-one-and-update.js   # 原子更新
│   │   ├── increment-one.js  # 原子递增/递减
│   │   ├── insert-batch.js   # 批量插入（分批）
│   │   ├── insert-many.js    # 批量插入
│   │   ├── insert-one.js     # 单条插入
│   │   ├── replace-one.js    # 替换文档
│   │   ├── result-handler.js # 结果处理器
│   │   ├── update-many.js    # 批量更新
│   │   ├── update-one.js     # 单条更新
│   │   ├── upsert-one.js     # 更新或插入
│   │   └── index.js          # 写入操作导出
│   │
│   ├── connect.js            # MongoDB 连接管理
│   ├── index.js              # MongoDB 适配器主入口
│   └── transaction-aware.js  # 事务感知层
│
├── transaction/              # 事务管理
│   ├── CacheLockManager.js   # 缓存锁管理器
│   ├── Transaction.js        # 事务类
│   └── TransactionManager.js # 事务管理器
│
├── model/                    # 数据模型层（预留）
│
├── cache.js                  # 内存缓存实现（LRU + TTL）
├── connect.js                # 连接管理器
├── constants.js              # 常量定义
├── errors.js                 # 统一错误类
├── index.js                  # 主入口
├── logger.js                 # 日志工具
├── multi-level-cache.js      # 多层缓存（内存+Redis）
├── operators.js              # 操作符处理
└── redis-cache-adapter.js    # Redis 缓存适配器
```

### 文档和示例
```
docs/                         # API 文档（30+ 个）
├── INDEX.md                  # 文档索引
├── connection.md             # 连接管理
├── cache.md                  # 缓存系统
├── events.md                 # 事件系统
├── find.md                   # 查询方法文档
├── insert-one.md             # 插入方法文档
├── transaction.md            # 事务文档
├── mongodb-native-vs-extensions.md  # 功能对比
└── ...                       # 其他 API 文档

examples/                     # 示例代码（30+ 个）
├── findOne.examples.js       # findOne 示例
├── transaction.examples.js   # 事务示例
├── aggregate.examples.js     # 聚合示例
└── ...                       # 其他示例

test/                         # 测试文件（45+ 个）
├── unit/                     # 单元测试
│   ├── features/             # 功能测试
│   ├── cache/                # 缓存测试
│   └── utils/                # 工具测试
├── integration/              # 集成测试
├── benchmark/                # 基准测试
├── performance/              # 性能测试
└── run-tests.js              # 测试运行器
```

### 根目录文件
```
index.d.ts                    # TypeScript 类型声明
package.json                  # 项目配置
.eslintrc.js                  # ESLint 配置
README.md                     # 项目说明
STATUS.md                     # 功能状态矩阵
CHANGELOG.md                  # 变更日志
CONTRIBUTING.md               # 贡献指南
LICENSE                       # MIT 许可证
```

---


## 📋 例外与覆盖

### 代码风格例外
相对通用规范（v3.md 代码规范）的差异：
- **引号**: **单引号**（通用规范默认：双引号）
- **分号**: 必须（通用规范默认：可选）
- **模块系统**: CommonJS（通用规范默认：ESM）
- **缩进**: 4 空格（通用规范默认：2 空格）

### 测试框架例外
相对通用规范（v3.md 测试规范）的差异：
- **测试框架**: 自定义测试运行器（兼容 Mocha API，通用规范默认：Vitest/Jest）
- **断言库**: Node.js 内置 assert（通用规范默认：expect）

### 测试覆盖率标准（项目提升）
相对通用规范（v3.md 测试规范默认 ≥80%）：
- **行覆盖率**: ≥ 70%（项目实际标准）
- **语句覆盖率**: ≥ 70%（项目实际标准）
- **函数覆盖率**: ≥ 70%（项目实际标准）
- **分支覆盖率**: ≥ 65%（项目实际标准，略低于通用规范）
- **核心 API**: ≥ 80%（提升标准）

### 其他例外
- **无构建步骤**: 直接发布 `lib/` 源码（非编译后代码）
- **无压缩**: 不使用代码混淆或压缩

---

## 🏗️ 项目特定规则

### 代码示例（遵循例外风格）

```javascript
// 导入导出（CommonJS + 单引号 + 分号）
const MonSQLize = require('./index');
module.exports = class MonSQLize { /* ... */ };

// JSDoc 注释（遵循通用规范：中文 + 括号英文术语）
/**
 * 查询单条文档
 * @param {Object} options - 查询选项
 * @param {Object} options.query - 查询条件（query）
 * @param {number} [options.cache] - 缓存时间（毫秒）
 * @returns {Promise<Object|null>}
 */
async findOne(options) { /* ... */ }

// 缩进：4 空格
function example() {
    if (condition) {
        doSomething();
    }
}
```

---

## 🎯 异步函数模式（项目特定）

所有查询方法使用 runner 模式：

```javascript
async findOne(options) {
    const runner = createRunner({ cache: this.cache, logger: this.logger });
    return await runner.execute(async () => {
        // 实际查询逻辑
    });
}
```

**Runner 模式特点**：
- ✅ 统一缓存处理
- ✅ 统一慢查询日志
- ✅ 统一错误处理
- ✅ 统一性能监控

---

## 🏛️ 架构层次规则（项目特定）

### 代码放置规则
- **通用层** (`lib/common/`): 跨数据库逻辑
  - 参数校验、错误处理
  - 缓存封装、日志封装
  - 游标编解码、分页结果构建
  - **规则**: 所有数据库适配器都可使用

- **适配器层** (`lib/<database>/`): 数据库特定逻辑
  - 连接管理
  - 查询执行
  - 数据库特定的形状构建
  - **规则**: 仅当前数据库使用

### 判断标准
- 适用于所有数据库 → `lib/common/`
- 仅适用于 MongoDB → `lib/mongodb/`
- 事务管理（可能通用）→ `lib/transaction/`

### 模块组织原则
- **按功能分组**: queries/writes/management
- **工厂函数模式**: createXxxOps() 返回操作函数
- **统一导出**: 每个子目录都有 index.js

---

## MongoDB 连接模式（项目特定，⚠️ 重要）

### 测试环境连接（自动 Memory Server）

**✅ 推荐方式**（项目约定）：
```javascript
msq = new MonSQLize({
    type: 'mongodb',
    databaseName: 'test_myfeature',
    config: { useMemoryServer: true }  // ← 自动启动 MongoDB Memory Server
});
```

**特点**：
- ✅ 自动管理 MongoDB Memory Server 生命周期
- ✅ 无需手动创建和清理
- ✅ 支持多个测试并发运行（自动端口分配）
- ✅ 自动在测试结束时清理

**❌ 不推荐方式**（手动管理，容易出错）：
```javascript
// ❌ 避免这样做
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoServer = await MongoMemoryServer.create();
const uri = mongoServer.getUri();

msq = new MonSQLize({
    type: 'mongodb',
    databaseName: 'test',
    config: { uri }
});

// 需要手动清理
await mongoServer.stop();
```

### 访问原生 MongoDB 实例

在测试中需要直接操作 MongoDB（如插入测试数据）时：

```javascript
// 通过 _adapter.db 访问原生 MongoDB 数据库实例
const db = msq._adapter.db;
const nativeCollection = db.collection('products');

// 直接操作 MongoDB
await nativeCollection.insertMany([
    { name: 'Product 1', price: 100 },
    { name: 'Product 2', price: 200 }
]);
```

**注意**：
- ✅ `msq._adapter.db` - 返回原生 MongoDB Db 实例
- ❌ `msq.db` - 不存在
- ❌ `msq.collection()` - 返回封装后的 MonSQLize 集合访问器（非原生）

### 生产/开发环境连接

```javascript
const msq = new MonSQLize({
    type: 'mongodb',
    databaseName: 'production',
    config: { 
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017'
    }
});
```

---

## 测试模板（遵循例外风格）

```javascript
// test/unit/features/findOne.test.js
const assert = require('assert');
const MonSQLize = require('../../../lib/index');

describe('findOne 方法测试套件', function() {
    this.timeout(30000);
    
    let msq, collection, nativeCollection;

    before(async () => {
        // ✅ 使用 useMemoryServer 自动管理测试数据库
        msq = new MonSQLize({
            type: 'mongodb',
            databaseName: 'test_findone',
            config: { useMemoryServer: true }
        });
        
        const conn = await msq.connect();
        collection = conn.collection;  // ← collection 是集合访问器函数
        
        // ✅ 获取原生 MongoDB 集合（用于测试数据准备）
        const db = msq._adapter.db;
        nativeCollection = db.collection('users');
        
        // 准备测试数据
        await nativeCollection.deleteMany({});
        await nativeCollection.insertMany([
            { name: 'Alice', age: 25 },
            { name: 'Bob', age: 30 }
        ]);
    });

    after(async () => {
        // 清理（可选，useMemoryServer 会自动清理）
        if (msq) await msq.close();
    });

    it('应该返回匹配的文档', async () => {
        // ✅ 正确：使用 collection('集合名').方法名()
        const doc = await collection('users').findOne({ 
            query: { name: 'Alice' } 
        });
        assert.ok(doc);
        assert.strictEqual(doc.name, 'Alice');
    });

    it('应该在无匹配时返回 null', async () => {
        // ✅ 正确：使用 collection('集合名').方法名()
        const doc = await collection('users').findOne({ 
            query: { name: 'nonexistent' } 
        });
        assert.strictEqual(doc, null);
    });
});
```

**⚠️ 常见错误**:
```javascript
// ❌ 错误：直接调用 collection.findOne()
const doc = await collection.findOne({ query: { name: 'Alice' } });
// 报错: collection.findOne is not a function

// ✅ 正确：collection 是函数，需要传入集合名
const doc = await collection('users').findOne({ query: { name: 'Alice' } });
```

---

## 示例代码模板（遵循例外风格）

```javascript
// examples/findOne.examples.js
const MonSQLize = require('../lib/index');

/**
 * findOne 示例
 * 演示基本查询、缓存、跨库访问
 */
(async () => {
    const client = new MonSQLize({
        type: 'mongodb',
        databaseName: 'test',
        config: { uri: process.env.MONGO_URI || 'mongodb://localhost:27017' }
    });

    const conn = await client.connect();
    const collection = conn.collection;

    // 基本查询
    const doc = await collection('users').findOne({
        query: { name: 'Alice' }
    });

    // 使用缓存
    const cached = await collection('users').findOne({
        query: { name: 'Alice' },
        cache: 5000  // 5秒
    });

    console.log('查询结果:', doc);
    console.log('缓存结果:', cached);
})();
```

---

## TypeScript 类型声明模板

```typescript
// index.d.ts
declare module 'monsqlize' {
    interface FindOneOptions {
        query: Record<string, any>;
        projection?: Record<string, 1 | 0> | string[];
        cache?: number;
        maxTimeMS?: number;
    }

    interface Collection {
        findOne(options: FindOneOptions): Promise<any | null>;
        find(options: FindOptions): Promise<any[]>;
        count(options: CountOptions): Promise<number>;
        invalidate(op?: 'find' | 'findOne' | 'count'): Promise<void>;
    }
}
```

---

## 性能要求（项目特定）

### 慢查询阈值
- **默认**: 500ms
- **行为**: 超过阈值输出 warn 日志（仅输出形状，遵循通用规范第10节）

### 缓存键规则
```javascript
// 缓存键格式
const cacheKey = `${iid}:${db}:${coll}:${op}:${queryShapeHash}`;
// 示例: "abc123:mydb:users:findOne:hash456"
```

---

## ✅ 快速检查清单（项目特定补充）

在遵循 v3.md 规范基础上，额外检查：

### 代码风格检查
- [ ] 使用**单引号**（不是双引号）✨
- [ ] 所有语句结尾有**分号**
- [ ] 使用 **CommonJS** 导出（require/module.exports）
- [ ] 使用 **4 空格**缩进（不是 2 空格）✨
- [ ] 函数/类/方法使用 **JSDoc 中文注释**

### 架构层次检查
- [ ] 代码放置在正确的层级（common vs mongodb）
- [ ] 使用 **runner 模式**封装异步操作
- [ ] 使用**工厂函数模式**（createXxxOps）
- [ ] 新增查询/写入操作需要在对应 index.js 导出

### 测试框架检查
- [ ] 使用自定义测试运行器（兼容 Mocha API）
- [ ] 使用 **assert** 断言库（不是 expect）
- [ ] **测试使用 `useMemoryServer: true` 自动管理 MongoDB** ⭐
- [ ] **使用 `msq._adapter.db` 访问原生 MongoDB**（不是 msq.db）⭐
- [ ] **使用 `conn.collection` 获取集合访问器函数** ⭐
- [ ] **调用方法时使用 `collection('集合名').方法名()` 模式**（不是 `collection.方法名()`）⭐
- [ ] 使用 `describe(function() { this.timeout(30000); })` 设置超时
- [ ] 监听事件使用 `msq._emitter.on()` 而不是 `msq.on()`
- [ ] 测试文件命名：`{功能}.test.js`

### 示例代码检查
- [ ] 示例使用 **CommonJS require**
- [ ] 连接串使用**环境变量或占位符**（不硬编码）
- [ ] 使用 `const conn = await client.connect()` 模式
- [ ] 示例文件命名：`{功能}.examples.js`
- [ ] 包含完整的数据准备和清理代码
- [ ] 使用 `stopMemoryServer()` 清理内存数据库

### 文档检查
- [ ] 每个 API 方法都有独立的 `.md` 文档
- [ ] 文档包含：简介、参数、返回值、示例、最佳实践
- [ ] 更新 `docs/INDEX.md` 文档索引
- [ ] TypeScript 类型定义同步更新（index.d.ts）

### 性能检查
- [ ] 慢查询日志仅输出**形状**（不含具体值）
- [ ] 缓存键包含完整标识（iid:db:coll:op:hash）
- [ ] 事务操作使用缓存锁机制
- [ ] 写操作传递 metadata 支持文档级别锁

### 事务支持检查（如适用）
- [ ] 所有写操作支持 `session` 参数
- [ ] 使用 `this.lockManager.addLock()` 添加缓存锁
- [ ] 传递 `metadata` 参数用于文档级别锁
- [ ] 测试事务回滚场景

---

**最后更新**: 2025-11-25
