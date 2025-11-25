# chat 项目规范（AI 助手用）

## 📑 目录导航

- [📋 规范继承](#-规范继承)
- [📦 项目信息](#-项目信息)
  - [运行时环境](#运行时环境)
  - [核心依赖](#核心依赖)
  - [开发依赖](#开发依赖)
- [🚀 本地命令](#-本地命令)
  - [依赖管理](#依赖管理)
  - [开发命令](#开发命令)
  - [编译和构建](#编译和构建)
  - [测试命令](#测试命令)
  - [生产部署命令](#生产部署命令)
- [📂 目录结构](#-目录结构)
  - [核心代码结构](#核心代码结构)
  - [根目录文件](#根目录文件)
- [🔒 MCP 配置](#-mcp-配置强制)
  - [数据库访问配置](#数据库访问配置)
  - [操作权限](#操作权限)
  - [使用流程](#使用流程)
- [📋 例外与覆盖](#-例外与覆盖)
  - [代码风格例外](#代码风格例外)
  - [框架特定规范](#框架特定规范)
  - [TypeScript 配置](#typescript-配置)
- [🏗️ 项目特定规则](#️-项目特定规则)
  - [1. 强制使用中间件](#1--强制使用中间件必须遵守)
    - [1.1 CRUD 操作必须使用 crudHelper](#11-crud-操作必须使用-crudhelper)
    - [1.2 响应必须使用 responseHelper](#12-响应必须使用-responsehelper)
    - [1.3 接口鉴权必须使用 userAuth](#13-接口鉴权必须使用-userauth)
    - [1.4 请求参数校验必须使用 validatorHelper](#14-请求参数校验必须使用-validatorhelper)
    - [1.5 HTTP 请求必须使用 httpHelper](#15-http-请求必须使用-httphelper)
  - [2. 不使用 Service 层](#2-️-不使用-service-层架构规则)
    - [2.1 业务逻辑写在 Controller](#21-业务逻辑写在-controller)
    - [2.2 通用工具函数封装规则](#22-通用工具函数封装规则)
    - [2.3 历史 Service 代码处理](#23-历史-service-代码处理)
  - [3. 服务器之间路由通信无需鉴权](#3-服务器之间路由通信无需鉴权)
  - [4. 数据库操作规范](#4-数据库操作规范)
  - [5. 国际化响应规范](#5--国际化响应规范必须遵守)
- [🎯 架构层次规则](#-架构层次规则)
  - [代码分层](#代码分层本项目不使用-service-层)
  - [职责划分](#职责划分)
  - [代码示例](#代码示例)
- [✅ 快速检查清单](#-快速检查清单)
  - [代码风格检查](#代码风格检查)
  - [中间件使用检查](#中间件使用检查强制)
  - [数据库操作检查](#数据库操作检查强制)
  - [架构分层检查](#架构分层检查不使用-service-层)
  - [路由配置检查](#路由配置检查)
  - [TypeScript 类型检查](#typescript-类型检查)
  - [错误处理检查](#错误处理检查)
  - [国际化检查](#国际化检查)

---

## 📋 规范继承
本项目遵循 `D:/OneDrive/Project/common/guidelines/guidelines/v3.md` 通用规范。以下仅列出项目特定配置和例外。

---

## 📦 项目信息

- **项目名称**: chat
- **项目类型**: Egg.js 企业级后端服务（TypeScript）
- **模块系统**: CommonJS（require/exports）
- **项目定位**: AI 对话系统 + 行程管理 + 营销活动平台
- **当前版本**: v1.0.0
- **框架版本**: Egg.js 3.17.5

### 运行时环境
- **Node.js 版本**: ≥16.0.0
- **操作系统**: Linux（生产环境）
- **数据库**: 
  - ✅ MongoDB（主数据库，通过 egg-mongoose）
  - ✅ Redis（缓存和会话，通过 egg-redis）
  - ✅ ShareDB（实时协作，MongoDB 存储）
- **部署方式**: Docker + PM2

### 核心依赖
- **Web 框架**: 
  - `egg@^3.17.5` - Egg.js 核心框架
  - `egg-scripts@2` - 生产环境启动脚本
- **数据库**: 
  - `egg-mongoose@^4.0.1` - MongoDB ODM
  - `egg-redis@^2.6.0` - Redis 客户端
  - `sharedb@^5.1.1` - 实时协作引擎
  - `sharedb-mongo@^5.0.0` - ShareDB MongoDB 适配器
- **中间件与工具**:
  - `egg-jwt@^3.1.7` - JWT 认证
  - `egg-validate@^2.0.2` - 参数校验
  - `egg-cors@^3.0.1` - 跨域支持
  - `egg-websocket-plugin@^3.0.0-beta.0` - WebSocket 支持
  - `joi@^18.0.1` - 高级参数校验
- **AI 集成**:
  - `openai@^4.71.1` - OpenAI API 客户端
- **其他工具**:
  - `axios@^1.7.3` - HTTP 客户端
  - `moment@^2.30.1` - 日期处理
  - `uuid@^9.0.1` - UUID 生成
  - `exceljs@^4.4.0` - Excel 处理

### 开发依赖
- `egg-bin@^6.8.1` - 开发和测试工具
- `eslint@8` - 代码质量检查
- `eslint-config-egg@13` - Egg.js ESLint 配置

---

## 🚀 本地命令

### 依赖管理
```bash
# 安装依赖
npm install
```

### 开发命令
```bash
# 本地开发（热重载）
npm run dev

# 访问地址
# http://localhost:9001/
```

### 编译和构建
```bash
# TypeScript 编译
npm run tsc

# 清理编译输出
npm run clean
```

### 测试命令
```bash
# 运行所有测试
npm test

# 仅运行单元测试
npm run test:local

# 代码覆盖率
npm run cov

# 代码风格检查
npm run lint
```

### 生产部署命令
```bash
# 启动服务（守护进程）
npm start

# 停止服务
npm stop

# 不同环境启动
npm run sit         # SIT 环境（4 workers）
npm run aita-uat    # UAT 环境（4 workers）
npm run aita-prod   # 生产环境（4 workers）

# PM2 管理（推荐）
npm run pm2-sit     # PM2 启动 SIT
npm run pm2-stop-sit # PM2 停止
```

---

## 📂 目录结构

### 核心代码结构
```
app/
├── controller/              # 控制器层
│   ├── admin/              # 管理后台控制器（60+ 个）
│   ├── home/               # 前台用户控制器（60+ 个）
│   ├── internal/           # 内部服务接口
│   ├── open/               # 开放 API
│   ├── schedule/           # 定时任务控制器
│   └── ws/                 # WebSocket 控制器
│
├── service/                # ⚠️ 历史遗留，新代码不使用
│   └── ...                # 旧代码保留，不再新增
│
├── model/                  # 数据模型层（Mongoose Schemas）
│   ├── conversation.ts     # 对话模型
│   ├── message.ts         # 消息模型
│   ├── trip.ts            # 行程模型
│   └── ...                # 60+ 数据模型
│
├── middleware/             # 中间件层
│   ├── crudHelper.ts      # CRUD 工具注入 ⭐
│   ├── responseHelper.ts  # 统一响应处理 ⭐
│   ├── userAuth.ts        # 用户认证 ⭐
│   ├── validatorHelper.ts # 参数校验 ⭐
│   ├── httpHelper.ts      # HTTP 调用工具
│   ├── internalAuth.ts    # 内部服务认证
│   └── exceptions.ts      # 异常处理
│
├── routes/                 # 路由配置
│   ├── admin/             # 管理后台路由
│   ├── home/              # 前台路由
│   ├── internal/          # 内部路由
│   ├── open/              # 开放路由
│   ├── schedule/          # 定时任务路由
│   └── ws/                # WebSocket 路由
│
├── validator/              # 参数校验器（Joi Schemas）
│   ├── home/              # 前台校验器
│   └── admin/             # 后台校验器
│
├── utils/                  # 工具函数（⭐ 重要）
│   ├── crud.ts            # CRUD 通用操作
│   ├── repository.ts      # 数据仓储工具
│   └── ...                # 业务工具函数（调用次数 ≥2 时封装）
│
├── schedule/               # 定时任务
├── hooks/                  # 生命周期钩子
│   ├── app/               # 应用级钩子
│   └── agent/             # Agent 级钩子
│
└── public/                 # 静态资源

config/                     # 配置文件
├── config.default.ts       # 默认配置
├── config.local.ts         # 本地开发配置
├── config.sit.ts          # SIT 环境配置
├── config.uat.ts          # UAT 环境配置
└── config.prod.ts         # 生产环境配置

typings/                    # TypeScript 类型定义
├── enum/                   # 枚举类型
├── interface/              # 接口定义
└── app/                    # Egg 应用类型扩展
```

### 根目录文件
```
package.json                # 项目配置
tsconfig.json              # TypeScript 配置
.eslintrc                  # ESLint 配置（egg-config-egg）
.gitignore                 # Git 忽略配置
.gitlab-ci.yml             # GitLab CI/CD 配置
app.ts                     # 应用启动入口
agent.ts                   # Agent 启动入口
README.md                  # 项目说明
CHANGELOG.md               # 变更日志
```

---

## 🔒 MCP 配置（🔴 强制）

### 数据库访问配置
- **数据库类型**: MongoDB
- **连接字符串**: `mongodb://root:SYY54YsaXuBHndSe@47.84.66.151:28017/?directConnection=true`
- **数据库名称**: `trip`（通过 Nacos 配置）
- **允许的 MCP 服务器**: `mongodb-chat`

### 操作权限
- ✅ **允许：读取操作**
  - find, findOne, count, aggregate
  - 用于查询数据库实际结构
  - 用于分析数据和调试

- ⚠️ **谨慎：写入操作（必须用户确认）**
  - insertOne, insertMany
  - updateOne, updateMany
  - replaceOne
  - **规则**: 除了查询之外，所有数据库操作必须用户确认后才能执行

- 🔴 **禁止：删除操作（除非明确授权）**
  - deleteOne, deleteMany
  - drop
  - **规则**: 删除操作需要明确说明原因并获得用户同意

### 使用流程
1. **修复代码/写需求涉及数据库时**:
   - ✅ 必须先使用 MCP 查询数据库实际结构
   - ✅ 基于真实 Schema 编写代码
   - ✅ 避免字段名/类型错误

2. **查询后的操作**:
   - ✅ 展示查询结果给用户
   - ⚠️ 写入操作必须等待用户确认
   - 🔴 删除操作必须明确原因和影响

---

## 📋 例外与覆盖

### 代码风格例外
相对通用规范（v3.md 代码规范）的差异：
- **模块系统**: CommonJS（通用规范默认：ESM）
- **缩进**: 4 空格（通用规范默认：2 空格）
- **引号**: 单引号（与通用规范一致）
- **分号**: 必须（与通用规范一致）

### 框架特定规范
- **文件命名**: PascalCase（Controller/Service/Model）
  - 示例：`ConversationController.ts`, `TripService.ts`
- **路由命名**: kebab-case
  - 示例：`/home/conversation/list`
- **枚举命名**: PascalCase + Enum 后缀
  - 示例：`StatusEnum`, `MessageRoleEnum`

### TypeScript 配置
- **target**: ES2019
- **module**: CommonJS
- **strict**: true
- **noImplicitAny**: false（允许隐式 any）
- **路径别名**:
  ```typescript
  "paths": {
    "enum/*": ["typings/enum/*"],
    "interface/*": ["typings/interface/*"],
    "config/*": ["config/*"],
    "utils/*": ["app/utils/*"],
    "validator/*": ["app/validator/*"]
  }
  ```

---

## 🏗️ 项目特定规则

### 1. 🔴 强制使用中间件（必须遵守）

#### 1.1 CRUD 操作必须使用 crudHelper
```typescript
// ✅ 正确：使用 ctx.utilsCrud
const { paginate, createOne, updateOne, deleteOne } = (ctx as any).utilsCrud;

// 分页查询
const result = await paginate(ctx.model.Conversation, 
  { user_id: userId, del_flag: 0 },
  { page: 1, pageSize: 10, sort: { created_at: -1 } }
);

// 创建
const doc = await createOne(ctx.model.Conversation, { 
  user_id: userId,
  title: '新对话'
});

// 更新
const updated = await updateOne(ctx.model.Conversation,
  { _id: id },
  { $set: { title: '更新标题' } }
);

// 删除（软删除）
const deleted = await deleteOne(ctx.model.Conversation,
  { _id: id }
);
```

**❌ 禁止直接使用 Mongoose Model**:
```typescript
// ❌ 错误：直接使用 Model
const result = await ctx.model.Conversation.find({}).limit(10);
```

#### 1.2 响应必须使用 responseHelper
```typescript
// ✅ 正确：使用统一响应
export default class ConversationController extends Controller {
  async list() {
    const { ctx } = this;
    try {
      const data = await ctx.service.ai.conversationService.list();
      return ctx.success(data, '查询成功');
    } catch (err) {
      return ctx.error('[ConversationController]', err, '查询失败');
    }
  }

  async create() {
    const { ctx } = this;
    // 业务校验失败
    if (!ctx.request.body.title) {
      throw ctx.fail('标题不能为空', 400);
    }
    // ... 创建逻辑
    return ctx.success(result, '创建成功');
  }
}
```

**统一响应格式**:
```typescript
// 成功响应
ctx.success(data, 'ok')
// => { code: 0, message: 'ok', data: {...} }

// 业务失败
throw ctx.fail('参数错误', 400)
// => { code: 400, message: '参数错误', data: null }

// 系统错误
ctx.error('[Tag]', err, '操作失败')
// => { code: 500, message: '操作失败', data: { error: '...' } }
```

#### 1.3 接口鉴权必须使用 userAuth
```typescript
// routes/home/conversation.ts
export default (app: Application, group: RouterGroup) => {
  const ctrl = app.controller.home.conversationController;
  
  const sub = group.group({ prefix: '/conversation' });
  
  // ✅ 正确：使用 userAuth 中间件
  // basic 级别：JWT + 单点登录校验
  sub.get('/list', 
    app.middleware.userAuth({ level: 'basic' }), 
    ctrl.list
  );
  
  // strict 级别：JWT + 单点登录 + 登录有效性校验
  sub.post('/create',
    app.middleware.userAuth({ level: 'strict' }),
    ctrl.create
  );
  
  // public 级别：无需鉴权
  sub.get('/public',
    ctrl.public
  );
};
```

**鉴权等级说明**:
- `public`: 无需鉴权（直接放行）
- `basic`: JWT + 单点登录校验（默认）
- `strict`: JWT + 单点登录 + 登录有效性/风控校验

#### 1.4 请求参数校验必须使用 validatorHelper
```typescript
// validator/home/conversation_validator.ts
export default class ConversationValidator {
  private ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  async index() {
    const schema = (this.ctx as any).Joi.object({
      page: (this.ctx as any).Joi.number().integer().min(1).default(1),
      pageSize: (this.ctx as any).Joi.number().integer().min(1).max(100).default(10),
      keyword: (this.ctx as any).Joi.string().allow('', null),
    });
    return (this.ctx as any).validateJoi(schema, 'query');
  }

  async create() {
    const schema = (this.ctx as any).Joi.object({
      title: (this.ctx as any).Joi.string().required(),
      user_id: (this.ctx as any).Joi.string().required(),
    });
    return (this.ctx as any).validateJoi(schema, 'body');
  }
}

// controller/home/ConversationController.ts
export default class ConversationController extends Controller {
  private readonly validator: ConversationValidator;

  constructor(ctx: any) {
    super(ctx);
    this.validator = new ConversationValidator(ctx);
  }

  async create() {
    const { ctx } = this;
    
    // ✅ 正确：使用 validator 校验
    await this.validator.create();
    
    // 校验通过后的数据已自动归一化
    const { title, user_id } = ctx.request.body;
    
    // ... 业务逻辑
  }
}
```

#### 1.5 HTTP 请求必须使用 httpHelper

**所有对外部服务的 HTTP 请求必须使用 `ctx.http` 工具**，禁止直接使用 axios 或其他 HTTP 库。

```typescript
// ✅ 正确：使用 ctx.http
export default class ThirdPartyController extends Controller {
  async callExternalAPI() {
    const { ctx } = this;
    
    try {
      // 基本 GET 请求
      const result1 = await ctx.http.get(
        '[ThirdParty]',
        'https://api.example.com/users'
      );
      
      // POST 请求（带参数）
      const result2 = await ctx.http.post(
        '[ThirdParty]',
        'https://api.example.com/orders',
        {
          body: JSON.stringify({
            userId: ctx.state.user._id,
            items: [{ id: 1, qty: 2 }]
          })
        }
      );
      
      // 带完整配置的请求
      const result3 = await ctx.http.fetchJSON(
        '[ThirdParty]',
        'https://api.example.com/data',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: 'test' }),
          timeoutMs: 10000,        // 超时时间（默认 15000ms）
          retries: 2,              // 重试次数（默认 1）
          backoff: {               // 退避策略
            baseMs: 300,
            factor: 2,
            jitter: true
          },
          expectedStatuses: [200, 201],  // 期望的成功状态码
          map4xxToFail: true,      // 4xx 映射为业务错误（ctx.fail）
          idempotencyKey: uuid(),  // 幂等性键（用于安全重试）
          maxResponseBytes: 1024 * 1024,  // 响应大小限制（1MB）
          redactHeaders: ['authorization', 'cookie']  // 日志脱敏头
        }
      );
      
      return ctx.success(result3);
    } catch (err) {
      return ctx.error('[ThirdParty]', err, '外部服务调用失败');
    }
  }
}
```

**ctx.http API 说明**:

```typescript
// GET 请求（快捷方法）
ctx.http.get(tag: string, url: string, init?: RequestInit)

// POST 请求（快捷方法）
ctx.http.post(tag: string, url: string, init?: RequestInit)

// 完整请求方法
ctx.http.fetchJSON(tag: string, url: string, init?: {
  // 基本 fetch 选项
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  
  // httpHelper 扩展选项
  timeoutMs?: number;           // 超时时间（默认 15000ms）
  retries?: number;             // 重试次数（默认 1）
  backoff?: {                   // 退避策略
    baseMs?: number;            // 基础延迟（默认 300ms）
    factor?: number;            // 增长因子（默认 2）
    jitter?: boolean;           // 随机抖动（默认 true）
  };
  parseJson?: boolean | 'auto'; // 是否解析 JSON（默认 'auto'）
  expectedStatuses?: number[];  // 额外的成功状态码
  map4xxToFail?: boolean;       // 4xx 映射为业务错误（默认 true）
  idempotencyKey?: string;      // 幂等性键（添加到请求头）
  maxResponseBytes?: number;    // 响应大小限制（0 = 不限制）
  redactHeaders?: string[];     // 日志脱敏头（默认 ['authorization', 'cookie']）
})
```

**重要特性**:

1. **自动重试**: 5xx 错误自动重试，4xx 错误不重试
2. **退避策略**: 指数退避 + 随机抖动，避免雪崩
3. **超时控制**: 每个请求独立超时，避免阻塞
4. **追踪 ID**: 自动传递 `x-trace-id`，便于链路追踪
5. **错误分级**:
   - 4xx: 映射为 `ctx.fail()` 业务错误（不重试）
   - 5xx: 抛出系统错误（可重试）
6. **日志脱敏**: 自动脱敏敏感请求头（authorization, cookie）
7. **幂等性**: 支持幂等性键，确保重试安全

**配置项**（`config/config.default.ts`）:

```typescript
config.custom = {
  http: {
    timeoutMs: 15000,        // 全局默认超时
    retries: 1,              // 全局默认重试次数
    defaultHeaders: {        // 全局默认请求头
      'Content-Type': 'application/json'
    },
    backoff: {               // 全局默认退避策略
      baseMs: 300,
      factor: 2,
      jitter: true
    }
  }
};
```

**❌ 禁止直接使用 axios 或 fetch**:

```typescript
// ❌ 错误：直接使用 axios
import axios from 'axios';
const result = await axios.get('https://api.example.com/data');

// ❌ 错误：直接使用 fetch
const response = await fetch('https://api.example.com/data');
const result = await response.json();

// ✅ 正确：使用 ctx.http
const result = await ctx.http.get('[Tag]', 'https://api.example.com/data');
```

**错误处理示例**:

```typescript
async callAPI() {
  const { ctx } = this;
  
  try {
    const result = await ctx.http.post(
      '[Payment]',
      'https://payment.example.com/charge',
      {
        body: JSON.stringify({ amount: 100 }),
        timeoutMs: 5000,
        retries: 2,
        map4xxToFail: true  // 4xx 会抛出 ctx.fail 错误
      }
    );
    
    return ctx.success(result);
  } catch (err) {
    // 如果是 4xx 错误（map4xxToFail=true），err 已经是 { code: 4xx, message }
    // 直接抛出即可
    if (err.code && err.code >= 400 && err.code < 500) {
      throw err;  // ctx.fail 错误直接抛出
    }
    
    // 5xx 或网络错误，记录日志并返回通用错误
    return ctx.error('[Payment]', err, '支付服务调用失败');
  }
}
```

### 2. ⚠️ 不使用 Service 层（架构规则）

**重要**: 本项目不使用 Service 层，所有业务逻辑直接写在 Controller 中。

#### 2.1 业务逻辑写在 Controller
```typescript
// ✅ 正确：业务逻辑直接写在 Controller
export default class ConversationController extends Controller {
  async list() {
    const { ctx } = this;
    await this.validator.index();
    
    const user = ctx.state.user;
    const { page, pageSize } = ctx.query;
    
    // ✅ 业务逻辑直接写在这里
    const query = {
      user_id: new Types.ObjectId(user._id),
      del_flag: 0,
      status: 1
    };
    
    // 使用 CRUD 工具
    const { paginate } = (ctx as any).utilsCrud;
    const result = await paginate(
      ctx.model.Conversation,
      query,
      { page, pageSize, sort: { created_at: -1 } }
    );
    
    return ctx.success(result);
  }
  
  async create() {
    const { ctx } = this;
    await this.validator.create();
    
    const user = ctx.state.user;
    const { title } = ctx.request.body;
    
    // ✅ 业务逻辑直接写在这里
    const { createOne } = (ctx as any).utilsCrud;
    const conversation = await createOne(ctx.model.Conversation, {
      user_id: new Types.ObjectId(user._id),
      title,
      status: 1,
      del_flag: 0,
      created_by: user._id
    });
    
    return ctx.success(conversation, '创建成功');
  }
}
```

**❌ 错误：不要创建 Service**:
```typescript
// ❌ 错误：不要创建新的 Service 文件
// service/ConversationService.ts
export default class ConversationService extends Service {
  async list(userId: string) {
    // ❌ 不要这样做
  }
}
```

#### 2.2 通用工具函数封装规则

**封装条件**: 当同一段逻辑**被调用 ≥2 次**时，才封装到 `app/utils/` 目录。

**✅ 正确示例**：
```typescript
// app/utils/conversation-helper.ts
/**
 * 构建对话查询条件
 * @param userId 用户ID
 * @param filters 额外过滤条件
 */
export function buildConversationQuery(userId: string, filters: any = {}) {
  return {
    user_id: new Types.ObjectId(userId),
    del_flag: 0,
    status: 1,
    ...filters
  };
}

/**
 * 格式化对话列表
 * @param conversations 对话列表
 */
export function formatConversationList(conversations: any[]) {
  return conversations.map(conv => ({
    id: conv._id,
    title: conv.title,
    created_at: conv.created_at,
    updated_at: conv.updated_at
  }));
}

// controller/home/ConversationController.ts
import { buildConversationQuery, formatConversationList } from 'utils/conversation-helper';

export default class ConversationController extends Controller {
  async list() {
    const { ctx } = this;
    const user = ctx.state.user;
    
    // ✅ 使用封装的工具函数
    const query = buildConversationQuery(user._id, ctx.query);
    
    const { paginate } = (ctx as any).utilsCrud;
    const result = await paginate(ctx.model.Conversation, query, { page: 1, pageSize: 10 });
    
    // ✅ 使用封装的工具函数
    result.list = formatConversationList(result.list);
    
    return ctx.success(result);
  }
  
  async detail() {
    const { ctx } = this;
    const user = ctx.state.user;
    
    // ✅ 第二次使用，证明封装是对的
    const query = buildConversationQuery(user._id, { _id: ctx.params.id });
    
    // ... 其他逻辑
  }
}
```

**封装原则**:
- ✅ **调用次数 ≥2**: 封装到 utils
- ✅ **纯函数**: 无副作用，便于测试
- ✅ **单一职责**: 每个函数只做一件事
- ❌ **仅调用1次**: 不封装，直接写在 Controller

#### 2.3 历史 Service 代码处理

**现状**: 项目中存在历史遗留的 Service 代码（40+ 个）

**处理规则**:
- ✅ **旧代码**: 保持现状，不强制改造
- ❌ **新代码**: 不再创建新的 Service
- ✅ **重构时**: 逐步将 Service 逻辑迁移到 Controller + utils

```typescript
// ✅ 允许：调用历史 Service（兼容性）
export default class OldController extends Controller {
  async oldMethod() {
    const { ctx } = this;
    // ✅ 历史 Service 可以继续使用
    const result = await ctx.service.ai.conversationService.list();
    return ctx.success(result);
  }
}

// ❌ 禁止：创建新的 Service
// service/NewService.ts  ← 不要创建
```

### 3. 服务器之间路由通信无需鉴权

**内部服务路由**（`/internal/*`）无需鉴权：
```typescript
// routes/internal/index.ts
router.group({
  prefix: '/internal',
  middlewares: [],
}, (group) => {
  // 内部服务接口无需 userAuth
  group.post('/conversation/sync', ctrl.sync);
  group.get('/stats', ctrl.stats);
});
```

### 4. 数据库操作规范

#### 4.1 查询数据库结构（强制）
```typescript
// ✅ 修复代码/写需求前必须先查询实际结构
// 1. 使用 MCP 连接数据库
// 2. 查询 collection schema
// 3. 基于真实字段编写代码

// 示例：查询 conversations 表结构
db.conversations.findOne()
// 获取字段：_id, user_id, title, status, created_at, updated_at, del_flag
```

#### 3.2 所有写操作必须确认（强制）
```typescript
// ⚠️ 写入操作前必须：
// 1. 展示操作影响范围
// 2. 显示将要修改的数据
// 3. 等待用户明确确认

// 示例确认流程：
console.log('即将执行以下操作：');
console.log('- 操作类型：更新');
console.log('- 影响文档：', { _id: xxx, title: 'xxx' });
console.log('- 更新字段：', { title: '新标题' });
console.log('请确认是否继续？(y/n)');
// 等待用户输入 'y' 后执行
```

#### 3.3 Model 使用规范
```typescript
// ✅ 正确：通过 ctx.model 访问
const Conversation = ctx.model.Conversation;
const Message = ctx.model.Message;

// Model 命名约定：
// - 文件名：snake_case.ts（conversation.ts）
// - Model 名：PascalCase（Conversation）
// - Collection 名：复数 snake_case（conversations）
```

### 5. 🌐 国际化响应规范（必须遵守）

**所有给前端的接口响应必须支持三种语言：`en`（英文）、`zh`（简体中文）、`hk`（繁体中文）。**

#### 5.1 响应消息国际化（强制使用常量）

**🔴 重要规则：必须先定义常量，禁止在响应时直接写字面量对象。**

**✅ 正确：先定义常量，再使用**

```typescript
// app/utils/i18n-messages.ts
/**
 * 国际化消息常量定义
 * 所有响应消息必须在此文件中预先定义
 */

// 消息类型定义
export interface I18nMessage {
  en: string;
  zh: string;
  hk: string;
}

// 对话模块消息
export const ConversationMessages = {
  // 成功消息
  CREATED: {
    en: 'Conversation created successfully',
    zh: '创建对话成功',
    hk: '創建對話成功'
  } as I18nMessage,
  
  UPDATED: {
    en: 'Conversation updated successfully',
    zh: '更新对话成功',
    hk: '更新對話成功'
  } as I18nMessage,
  
  DELETED: {
    en: 'Conversation deleted successfully',
    zh: '删除对话成功',
    hk: '刪除對話成功'
  } as I18nMessage,
  
  // 错误消息
  NOT_FOUND: {
    en: 'Conversation not found',
    zh: '对话不存在',
    hk: '對話不存在'
  } as I18nMessage,
  
  ALREADY_EXISTS: {
    en: 'Conversation with the same name already exists',
    zh: '已存在同名对话',
    hk: '已存在同名對話'
  } as I18nMessage,
  
  PERMISSION_DENIED: {
    en: 'No permission to access this conversation',
    zh: '无权访问此对话',
    hk: '無權訪問此對話'
  } as I18nMessage
};

// 通用消息
export const CommonMessages = {
  // 成功消息
  SUCCESS: {
    en: 'Operation successful',
    zh: '操作成功',
    hk: '操作成功'
  } as I18nMessage,
  
  // 参数错误
  INVALID_PARAMETER: {
    en: 'Invalid parameter',
    zh: '参数错误',
    hk: '參數錯誤'
  } as I18nMessage,
  
  REQUIRED_FIELD_MISSING: {
    en: 'Required field missing',
    zh: '缺少必填字段',
    hk: '缺少必填字段'
  } as I18nMessage,
  
  // 系统错误
  INTERNAL_ERROR: {
    en: 'Internal server error',
    zh: '服务器内部错误',
    hk: '伺服器內部錯誤'
  } as I18nMessage,
  
  SERVICE_UNAVAILABLE: {
    en: 'Service temporarily unavailable',
    zh: '服务暂时不可用',
    hk: '服務暫時不可用'
  } as I18nMessage
};

// controller/home/ConversationController.ts
import { ConversationMessages, CommonMessages } from 'utils/i18n-messages';

export default class ConversationController extends Controller {
  async create() {
    const { ctx } = this;
    await this.validator.create();
    
    const user = ctx.state.user;
    const { title } = ctx.request.body;
    
    // 检查是否存在同名对话
    const { findOne } = (ctx as any).utilsCrud;
    const existing = await findOne(ctx.model.Conversation, {
      user_id: new Types.ObjectId(user._id),
      title,
      del_flag: 0
    });
    
    if (existing) {
      // ✅ 正确：使用预定义常量
      throw ctx.fail(ConversationMessages.ALREADY_EXISTS, 400);
    }
    
    const { createOne } = (ctx as any).utilsCrud;
    const conversation = await createOne(ctx.model.Conversation, {
      user_id: new Types.ObjectId(user._id),
      title,
      status: 1,
      del_flag: 0,
      created_by: user._id
    });
    
    // ✅ 正确：使用预定义常量
    return ctx.success(conversation, ConversationMessages.CREATED);
  }
  
  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    
    const { deleteOne } = (ctx as any).utilsCrud;
    const result = await deleteOne(ctx.model.Conversation, { _id: id });
    
    if (!result) {
      // ✅ 正确：使用预定义常量
      throw ctx.fail(ConversationMessages.NOT_FOUND, 404);
    }
    
    // ✅ 正确：使用预定义常量
    return ctx.success(null, ConversationMessages.DELETED);
  }
}
```

**❌ 错误：直接在响应中写字面量对象**

```typescript
// ❌ 错误：直接写字面量对象（禁止）
throw ctx.fail({
  en: 'Conversation with the same name already exists',
  zh: '已存在同名对话',
  hk: '已存在同名對話'
}, 400);

return ctx.success(data, {
  en: 'Conversation created successfully',
  zh: '创建对话成功',
  hk: '創建對話成功'
});

// ❌ 错误：仅单一语言
throw ctx.fail('已存在同名对话', 400);
return ctx.success(data, '创建成功');
```

#### 5.2 响应格式说明

**响应中的 message 必须是从常量文件导入的对象，不是字面量。**

**成功响应**:
```typescript
import { ConversationMessages } from 'utils/i18n-messages';

// ✅ 正确：使用常量
ctx.success(data, ConversationMessages.CREATED)

// 响应格式：
{
  code: 0,
  message: {
    en: 'Conversation created successfully',
    zh: '创建对话成功',
    hk: '創建對話成功'
  },
  data: { ... }
}
```

**失败响应**:
```typescript
import { ConversationMessages } from 'utils/i18n-messages';

// ✅ 正确：使用常量
throw ctx.fail(ConversationMessages.NOT_FOUND, 404)

// 响应格式：
{
  code: 404,
  message: {
    en: 'Conversation not found',
    zh: '对话不存在',
    hk: '對話不存在'
  },
  data: null
}
```

**系统错误响应**:
```typescript
import { CommonMessages } from 'utils/i18n-messages';

// ✅ 正确：使用常量
ctx.error('[Tag]', err, CommonMessages.INTERNAL_ERROR)

// 响应格式：
{
  code: 500,
  message: {
    en: 'Internal server error',
    zh: '服务器内部错误',
    hk: '伺服器內部錯誤'
  },
  data: { error: '...' }
}
```

#### 5.3 消息常量组织结构

**所有消息常量必须按模块组织在 `app/utils/i18n-messages.ts` 文件中。**

**文件结构示例**:

```typescript
// app/utils/i18n-messages.ts
export interface I18nMessage {
  en: string;
  zh: string;
  hk: string;
}

// ============================================================================
// 通用消息（所有模块共用）
// ============================================================================
export const CommonMessages = {
  // 操作成功
  SUCCESS: {
    en: 'Operation successful',
    zh: '操作成功',
    hk: '操作成功'
  } as I18nMessage,
  
  CREATED: {
    en: 'Created successfully',
    zh: '创建成功',
    hk: '創建成功'
  } as I18nMessage,
  
  UPDATED: {
    en: 'Updated successfully',
    zh: '更新成功',
    hk: '更新成功'
  } as I18nMessage,
  
  DELETED: {
    en: 'Deleted successfully',
    zh: '删除成功',
    hk: '刪除成功'
  } as I18nMessage,
  
  // 参数错误
  INVALID_PARAMETER: {
    en: 'Invalid parameter',
    zh: '参数错误',
    hk: '參數錯誤'
  } as I18nMessage,
  
  REQUIRED_FIELD_MISSING: {
    en: 'Required field missing',
    zh: '缺少必填字段',
    hk: '缺少必填字段'
  } as I18nMessage,
  
  INVALID_FORMAT: {
    en: 'Invalid format',
    zh: '格式错误',
    hk: '格式錯誤'
  } as I18nMessage,
  
  // 业务错误
  NOT_FOUND: {
    en: 'Resource not found',
    zh: '资源不存在',
    hk: '資源不存在'
  } as I18nMessage,
  
  ALREADY_EXISTS: {
    en: 'Resource already exists',
    zh: '资源已存在',
    hk: '資源已存在'
  } as I18nMessage,
  
  PERMISSION_DENIED: {
    en: 'Permission denied',
    zh: '权限不足',
    hk: '權限不足'
  } as I18nMessage,
  
  // 系统错误
  INTERNAL_ERROR: {
    en: 'Internal server error',
    zh: '服务器内部错误',
    hk: '伺服器內部錯誤'
  } as I18nMessage,
  
  SERVICE_UNAVAILABLE: {
    en: 'Service temporarily unavailable',
    zh: '服务暂时不可用',
    hk: '服務暫時不可用'
  } as I18nMessage,
  
  REQUEST_TIMEOUT: {
    en: 'Request timeout',
    zh: '请求超时',
    hk: '請求超時'
  } as I18nMessage
};

// ============================================================================
// 对话模块消息
// ============================================================================
export const ConversationMessages = {
  CREATED: {
    en: 'Conversation created successfully',
    zh: '创建对话成功',
    hk: '創建對話成功'
  } as I18nMessage,
  
  UPDATED: {
    en: 'Conversation updated successfully',
    zh: '更新对话成功',
    hk: '更新對話成功'
  } as I18nMessage,
  
  DELETED: {
    en: 'Conversation deleted successfully',
    zh: '删除对话成功',
    hk: '刪除對話成功'
  } as I18nMessage,
  
  NOT_FOUND: {
    en: 'Conversation not found',
    zh: '对话不存在',
    hk: '對話不存在'
  } as I18nMessage,
  
  ALREADY_EXISTS: {
    en: 'Conversation with the same name already exists',
    zh: '已存在同名对话',
    hk: '已存在同名對話'
  } as I18nMessage
};

// ============================================================================
// 消息模块消息
// ============================================================================
export const MessageMessages = {
  SENT: {
    en: 'Message sent successfully',
    zh: '发送消息成功',
    hk: '發送消息成功'
  } as I18nMessage,
  
  DELETED: {
    en: 'Message deleted successfully',
    zh: '删除消息成功',
    hk: '刪除消息成功'
  } as I18nMessage,
  
  NOT_FOUND: {
    en: 'Message not found',
    zh: '消息不存在',
    hk: '消息不存在'
  } as I18nMessage
};

// ============================================================================
// 用户模块消息
// ============================================================================
export const UserMessages = {
  LOGIN_SUCCESS: {
    en: 'Login successful',
    zh: '登录成功',
    hk: '登錄成功'
  } as I18nMessage,
  
  LOGOUT_SUCCESS: {
    en: 'Logout successful',
    zh: '退出成功',
    hk: '退出成功'
  } as I18nMessage,
  
  INVALID_CREDENTIALS: {
    en: 'Invalid username or password',
    zh: '用户名或密码错误',
    hk: '用戶名或密碼錯誤'
  } as I18nMessage,
  
  NOT_FOUND: {
    en: 'User not found',
    zh: '用户不存在',
    hk: '用戶不存在'
  } as I18nMessage
};

// 根据业务模块继续扩展...
```

**使用示例**:

```typescript
// controller/home/ConversationController.ts
import { 
  ConversationMessages, 
  CommonMessages 
} from 'utils/i18n-messages';

export default class ConversationController extends Controller {
  async list() {
    const { ctx } = this;
    // ...
    return ctx.success(result, CommonMessages.SUCCESS);
  }
  
  async create() {
    const { ctx } = this;
    // ...
    return ctx.success(conversation, ConversationMessages.CREATED);
  }
  
  async update() {
    const { ctx } = this;
    // ...
    if (!conversation) {
      throw ctx.fail(ConversationMessages.NOT_FOUND, 404);
    }
    return ctx.success(updated, ConversationMessages.UPDATED);
  }
}
```

#### 5.4 新增消息常量规范

**当需要新增响应消息时，必须遵循以下步骤：**

**步骤 1: 在 i18n-messages.ts 中定义常量**

```typescript
// app/utils/i18n-messages.ts

// 找到对应的模块，或创建新的模块分组
export const TripMessages = {
  CREATED: {
    en: 'Trip created successfully',
    zh: '创建行程成功',
    hk: '創建行程成功'
  } as I18nMessage,
  
  INVALID_DATE_RANGE: {
    en: 'Invalid date range',
    zh: '日期范围无效',
    hk: '日期範圍無效'
  } as I18nMessage,
  
  // 新增的消息...
};
```

**步骤 2: 在 Controller 中导入并使用**

```typescript
// controller/home/TripController.ts
import { TripMessages, CommonMessages } from 'utils/i18n-messages';

export default class TripController extends Controller {
  async create() {
    const { ctx } = this;
    // ...
    return ctx.success(trip, TripMessages.CREATED);
  }
}
```

**步骤 3: 如果是通用消息，优先使用 CommonMessages**

```typescript
// ✅ 优先使用通用消息
return ctx.success(data, CommonMessages.CREATED);  // 而不是每个模块都定义 CREATED

// ✅ 仅在消息有特殊性时才定义模块专属消息
return ctx.success(trip, TripMessages.DATE_CONFIRMED);  // 行程特有消息
```

#### 5.5 注意事项

1. **🔴 必须先定义常量**: 禁止在响应时直接写 `{ en, zh, hk }` 字面量
2. **🔴 必须提供三种语言**: en, zh, hk 三者缺一不可
3. **✅ 保持语义一致**: 三种语言表达的意思必须相同
4. **✅ 繁简转换**: zh 是简体中文，hk 是繁体中文
5. **✅ 标点符号**: 
   - 中文使用中文标点（。、，）
   - 英文使用英文标点（. ,）
6. **✅ 专业术语**: 保持一致的术语翻译
7. **✅ 模块化组织**: 按业务模块分组（CommonMessages/ConversationMessages/TripMessages）
8. **✅ 优先复用**: 通用消息优先使用 CommonMessages，避免重复定义
9. **✅ 命名规范**: 常量名使用 UPPER_SNAKE_CASE（如 ALREADY_EXISTS, NOT_FOUND）
10. **✅ 类型标注**: 所有消息对象都应标注 `as I18nMessage`

---

## 🎯 架构层次规则

### 代码分层（⚠️ 本项目不使用 Service 层）

```
Controller (控制器层) - 业务逻辑 + 参数校验 + 鉴权 + 响应
    ↓ 使用
Utils (工具层) - 通用函数（调用 ≥2 次）
    ↓ 调用
Model (数据模型层) - Schema 定义
```

### 职责划分

- **Controller**: 
  - ✅ 参数校验（validator）
  - ✅ 鉴权检查（middleware）
  - ✅ **业务逻辑实现** ⭐（本项目特色）
  - ✅ 数据库操作（通过 ctx.utilsCrud）
  - ✅ 统一响应（responseHelper）
  
- **Utils** (app/utils/):
  - ✅ 通用工具函数（调用次数 ≥2）
  - ✅ 纯函数（无副作用）
  - ✅ 单一职责
  - ❌ 不包含业务逻辑

- **Model**:
  - ✅ Schema 定义
  - ✅ 索引定义
  - ✅ 数据验证规则
  - ✅ 静态方法/实例方法（可选）

### 代码示例

#### ✅ 正确：业务逻辑写在 Controller

```typescript
// controller/home/ConversationController.ts
export default class ConversationController extends Controller {
  private readonly validator: ConversationValidator;

  constructor(ctx: any) {
    super(ctx);
    this.validator = new ConversationValidator(ctx);
  }

  async list() {
    const { ctx } = this;
    
    // 1. 参数校验
    await this.validator.index();
    
    // 2. 获取用户信息（鉴权后）
    const user = ctx.state.user;
    const { page, pageSize, keyword } = ctx.query;
    
    // 3. ✅ 业务逻辑直接写在这里
    const query: any = {
      user_id: new Types.ObjectId(user._id),
      del_flag: 0,
      status: 1
    };
    
    // 关键字搜索
    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }
    
    // 4. 使用 CRUD 工具查询
    const { paginate } = (ctx as any).utilsCrud;
    const result = await paginate(
      ctx.model.Conversation,
      query,
      { 
        page, 
        pageSize, 
        sort: { created_at: -1 },
        select: '_id title status created_at updated_at'
      }
    );
    
    // 5. 统一响应
    return ctx.success(result, '查询成功');
  }
  
  async create() {
    const { ctx } = this;
    
    // 1. 参数校验
    await this.validator.create();
    
    // 2. 获取用户信息
    const user = ctx.state.user;
    const { title } = ctx.request.body;
    
    // 3. ✅ 业务逻辑直接写在这里
    // 检查是否存在同名对话
    const { findOne } = (ctx as any).utilsCrud;
    const existing = await findOne(ctx.model.Conversation, {
      user_id: new Types.ObjectId(user._id),
      title,
      del_flag: 0
    });
    
    if (existing) {
      throw ctx.fail('已存在同名对话', 400);
    }
    
    // 4. 创建新对话
    const { createOne } = (ctx as any).utilsCrud;
    const conversation = await createOne(ctx.model.Conversation, {
      user_id: new Types.ObjectId(user._id),
      title,
      status: 1,
      del_flag: 0,
      created_by: user._id
    });
    
    // 5. 统一响应
    return ctx.success(conversation, '创建成功');
  }
}
```

#### ✅ 正确：通用函数封装到 Utils（调用 ≥2 次）

```typescript
// app/utils/conversation-helper.ts
import { Types } from 'mongoose';

/**
 * 构建对话查询条件
 * @param userId 用户ID
 * @param filters 额外过滤条件
 */
export function buildConversationQuery(userId: string, filters: any = {}) {
  return {
    user_id: new Types.ObjectId(userId),
    del_flag: 0,
    status: 1,
    ...filters
  };
}

/**
 * 格式化对话列表
 * @param conversations 对话列表
 */
export function formatConversationList(conversations: any[]) {
  return conversations.map(conv => ({
    id: conv._id.toString(),
    title: conv.title,
    created_at: conv.created_at,
    updated_at: conv.updated_at,
    message_count: conv.message_count || 0
  }));
}

// controller/home/ConversationController.ts
import { buildConversationQuery, formatConversationList } from 'utils/conversation-helper';

export default class ConversationController extends Controller {
  async list() {
    const { ctx } = this;
    const user = ctx.state.user;
    
    // ✅ 第一次调用：使用封装的工具函数
    const query = buildConversationQuery(user._id, { 
      title: { $regex: ctx.query.keyword, $options: 'i' } 
    });
    
    const { paginate } = (ctx as any).utilsCrud;
    const result = await paginate(ctx.model.Conversation, query, { page: 1, pageSize: 10 });
    
    // ✅ 使用格式化工具
    result.list = formatConversationList(result.list);
    
    return ctx.success(result);
  }
  
  async detail() {
    const { ctx } = this;
    const user = ctx.state.user;
    
    // ✅ 第二次调用：证明封装是必要的
    const query = buildConversationQuery(user._id, { _id: ctx.params.id });
    
    const { findOne } = (ctx as any).utilsCrud;
    const conversation = await findOne(ctx.model.Conversation, query);
    
    if (!conversation) {
      throw ctx.fail('对话不存在', 404);
    }
    
    return ctx.success(conversation);
  }
}
```

#### ❌ 错误：不要创建 Service

```typescript
// ❌ 错误：不要创建新的 Service 文件
// service/ConversationService.ts
export default class ConversationService extends Service {
  async list(userId: string) {
    // ❌ 不要这样做，业务逻辑应该在 Controller
  }
  
  async create(userId: string, title: string) {
    // ❌ 不要这样做
  }
}

// ❌ 错误：Controller 不应该调用 Service
export default class ConversationController extends Controller {
  async list() {
    const { ctx } = this;
    // ❌ 错误：不要调用 Service
    const result = await ctx.service.conversationService.list(user._id);
    return ctx.success(result);
  }
}
```

---

## ✅ 快速检查清单

### 代码风格检查
- [ ] 使用 **PascalCase** 命名 Controller/Service/Model
- [ ] 使用 **camelCase** 命名方法和变量
- [ ] 使用 **单引号**
- [ ] 所有语句结尾有**分号**
- [ ] 使用 **4 空格**缩进
- [ ] TypeScript 类型标注完整

### 中间件使用检查（🔴 强制）
- [ ] CRUD 操作使用 **ctx.utilsCrud** ⭐
- [ ] 响应使用 **ctx.success / ctx.fail / ctx.error** ⭐
- [ ] 接口鉴权使用 **userAuth middleware** ⭐
- [ ] 参数校验使用 **Validator + ctx.validateJoi** ⭐
- [ ] HTTP 请求使用 **ctx.http**（禁止直接用 axios/fetch）⭐
- [ ] 内部服务路由使用 **internalAuth** 而非 userAuth

### 数据库操作检查（🔴 强制）
- [ ] 修复代码前**先查询数据库实际结构** ⭐
- [ ] 使用正确的 **Model 名称和字段**
- [ ] 所有写操作（insert/update）**等待用户确认** ⭐
- [ ] 删除操作**明确说明原因和影响** ⭐
- [ ] 使用 **Types.ObjectId** 转换 ObjectId 字段

### 架构分层检查（⚠️ 不使用 Service 层）
- [ ] **业务逻辑写在 Controller** ⭐
- [ ] **通用函数封装在 Utils**（调用 ≥2 次）⭐
- [ ] Model 仅定义 **Schema 和索引**
- [ ] **不创建新的 Service 文件** ⭐
- [ ] Utils 函数为**纯函数**（无副作用）
- [ ] 历史 Service 代码保持现状（不强制改造）

### 路由配置检查
- [ ] 路由使用 **egg-router-group** 分组
- [ ] 前台路由在 **/home** 前缀下
- [ ] 管理路由在 **/admin** 前缀下
- [ ] 内部路由在 **/internal** 前缀下
- [ ] 每个路由配置正确的**鉴权中间件**

### TypeScript 类型检查
- [ ] 使用 **interface** 定义复杂类型
- [ ] 使用 **enum** 定义枚举
- [ ] Controller/Service 继承正确的基类
- [ ] 避免使用 **as any**（除非必要）
- [ ] 配置正确的**路径别名**

### 错误处理检查
- [ ] 使用 **try-catch** 包裹异步操作
- [ ] 业务错误抛出 **ctx.fail(message, 400)**
- [ ] 系统错误使用 **ctx.error(tag, err, message)**
- [ ] 记录错误日志使用 **ctx.logger.error**
- [ ] 不暴露敏感错误信息给前端

### 国际化检查
- [ ] **所有消息在 i18n-messages.ts 中定义常量** ⭐ 🔴
- [ ] **禁止在响应时直接写 { en, zh, hk } 字面量** ⭐ 🔴
- [ ] 所有响应消息包含 **en, zh, hk** 三种语言 ⭐
- [ ] 成功消息使用 **ctx.success(data, MessageConstant)** ⭐
- [ ] 失败消息使用 **ctx.fail(MessageConstant, code)** ⭐
- [ ] 系统错误使用 **ctx.error(tag, err, MessageConstant)** ⭐
- [ ] 三种语言语义保持一致
- [ ] 繁简转换正确（zh=简体，hk=繁体）
- [ ] 通用消息优先使用 CommonMessages
- [ ] 常量命名使用 UPPER_SNAKE_CASE

---

**最后更新**: 2025-11-25

