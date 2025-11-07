# monSQLize 项目规范（AI 助手用）

## 规范继承
本项目遵循 `.github/guidelines.md` 通用规范。以下仅列出项目特定配置和例外。

---

## 项目信息

- **类型**: Node.js 库（CommonJS）
- **定位**: 多数据库统一读 API
- **运行时**: Node.js 18.x, 20.x
- **操作系统**: Windows, Ubuntu (Linux)
- **数据库**: MongoDB 4.x+（当前），未来扩展 MySQL、PostgreSQL

---

## 本地命令

```powershell
# 安装依赖
npm ci

# 运行测试
npm test
# 或
node test/run-tests.js

# 发布前检查
npm pack
```

---

## 目录结构

```
lib/
├── common/          # 通用层（跨数据库逻辑）
├── mongodb/         # MongoDB 适配器
│   └── common/      # MongoDB 专属工具
├── cache.js         # 缓存实现
└── index.js         # 主入口

examples/            # 示例代码（.examples.js）
test/               # 测试文件（.test.js）
docs/               # API 文档
index.d.ts          # TypeScript 类型声明
```

---

## 例外与覆盖

### 代码风格例外
相对通用规范（guidelines.md 第1节）的差异：
- **引号**: 单引号（通用规范默认：双引号）
- **分号**: 必须（通用规范默认：可选）
- **模块系统**: CommonJS（通用规范默认：ESM）

### 测试框架例外
相对通用规范（guidelines.md 第7节）的差异：
- **测试框架**: 自定义测试运行器（兼容 Mocha API，通用规范默认：Vitest/Jest）
- **断言库**: Node.js 内置 assert（通用规范默认：expect）

### 测试覆盖率标准（项目提升）
相对通用规范（guidelines.md 第7节默认 60%/60%/70%）：
- **行覆盖率**: ≥ 70%（提升 10%）
- **分支覆盖率**: ≥ 70%（提升 10%）
- **核心 API**: ≥ 80%（提升 10%）

### 其他例外
- **无构建步骤**: 直接发布 `lib/` 源码

---

## 项目特定规则

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
```

---

## 异步函数模式（项目特定）

所有查询方法使用 runner 模式：

```javascript
async findOne(options) {
    const runner = createRunner({ cache: this.cache, logger: this.logger });
    return await runner.execute(async () => {
        // 实际查询逻辑
    });
}
```

---

## 架构层次规则（项目特定）

### 代码放置规则
- **通用层** (`lib/common/`): 跨数据库逻辑
  - 参数校验、错误处理
  - 缓存封装、日志封装
  - 游标编解码、分页结果构建

- **适配器层** (`lib/<database>/`): 数据库特定逻辑
  - 连接管理
  - 查询执行
  - 数据库特定的形状构建

### 判断标准
- 适用于所有数据库 → `lib/common/`
- 仅适用于 MongoDB → `lib/mongodb/`

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

## 快速检查清单（项目特定补充）

在遵循 guidelines.md 第 3.1 节流程基础上，额外检查：

### 代码风格检查
- [ ] 使用单引号（不是双引号）
- [ ] 所有语句结尾有分号
- [ ] 使用 CommonJS 导出（require/module.exports）

### 架构层次检查
- [ ] 代码放置在正确的层级（common vs mongodb）
- [ ] 使用 runner 模式封装异步操作

### 测试框架检查
- [ ] 使用自定义测试运行器（兼容 Mocha API）
- [ ] 使用 assert 断言库
- [ ] **测试使用 `useMemoryServer: true` 自动管理 MongoDB**
- [ ] **使用 `msq._adapter.db` 访问原生 MongoDB（不是 msq.db）**
- [ ] **使用 `conn.collection` 获取集合访问器函数**
- [ ] **调用方法时使用 `collection('集合名').方法名()` 模式（不是 `collection.方法名()`）**
- [ ] 使用 `describe(function() { this.timeout(30000); })` 设置超时
- [ ] 监听事件使用 `msq._emitter.on()` 而不是 `msq.on()`

### 示例代码检查
- [ ] 示例使用 CommonJS require
- [ ] 连接串使用环境变量或占位符
- [ ] 使用 `const conn = await client.connect()` 模式

### 性能检查
- [ ] 慢查询日志仅输出形状（不含具体值）
- [ ] 缓存键包含完整标识（iid:db:coll:op:hash）

---

**最后更新**: 2025-11-06
