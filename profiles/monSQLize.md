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
- **测试框架**: Mocha（通用规范默认：Vitest/Jest）
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

## 测试模板（遵循例外风格）

```javascript
// test/findOne.test.js
const assert = require('assert'); // Node.js 内置断言
const MonSQLize = require('../lib/index'); // CommonJS

describe('findOne', () => {
    let client, collection;

    before(async () => {
        client = new MonSQLize({
            type: 'mongodb',
            databaseName: 'test',
            config: { uri: 'mongodb://localhost:27017' }
        });
        const conn = await client.connect();
        collection = conn.collection('test');
    });

    after(async () => {
        // 清理
    });

    it('应该返回匹配的文档', async () => {
        const doc = await collection.findOne({ query: { name: 'test' } });
        assert.ok(doc);
    });

    it('应该在无匹配时返回 null', async () => {
        const doc = await collection.findOne({ query: { name: 'nonexistent' } });
        assert.strictEqual(doc, null);
    });
});
```

---

## 示例代码模板（遵循例外风格）

```javascript
// examples/findOne.examples.js
const MonSQLize = require('../lib/index'); // CommonJS + 单引号

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

    const { collection } = await client.connect();

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
- [ ] 使用 Mocha + assert 编写测试
- [ ] 测试初始化包含 MonSQLize 实例创建

### 示例代码检查
- [ ] 示例使用 CommonJS require
- [ ] 连接串使用环境变量或占位符

### 性能检查
- [ ] 慢查询日志仅输出形状（不含具体值）
- [ ] 缓存键包含完整标识（iid:db:coll:op:hash）

---

## 常见问题

### Q: 为什么使用 CommonJS 而不是 ESM？
**A**: 为了兼容更多 Node.js 版本和用户环境，当前保持 CommonJS。未来可能迁移到 ESM。

### Q: 为什么使用 Mocha 而不是 Vitest/Jest？
**A**: 项目历史原因，已有大量 Mocha 测试。保持一致性比迁移带来的收益更大。

### Q: 逻辑应该放在 common 还是 mongodb？
**A**: 
- 参数校验、缓存、日志 → `lib/common/`
- Aggregation pipeline、连接管理 → `lib/mongodb/`

### Q: 测试需要真实 MongoDB 环境吗？
**A**: 是的。使用本地 MongoDB 或测试容器。CI 环境会自动启动 MongoDB 服务。

---

**最后更新**: 2025-10-12
