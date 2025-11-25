# payment 项目规范（AI 助手用）

## 📑 目录导航

- [📋 规范继承](#-规范继承)
- [📦 项目信息](#-项目信息)
  - [基本信息](#基本信息)
  - [核心依赖](#核心依赖)
  - [本地命令](#本地命令)
  - [目录结构](#目录结构)
- [🔒 MCP 配置（强制）](#-mcp-配置强制)
- [📋 代码风格](#-代码风格)
- [🏗️ 核心规则](#️-核心规则)
  - [1. 强制使用中间件](#1-强制使用中间件)
  - [2. 不使用 Service 层](#2-不使用-service-层)
  - [3. 内部服务通信](#3-内部服务通信)
  - [4. 数据库操作](#4-数据库操作)
  - [5. 国际化响应](#5-国际化响应)
  - [6. SSE 前端通信](#6-sse-前端通信)
- [🎯 架构规则](#-架构规则)
- [✅ 快速检查清单](#-快速检查清单)

---

## 📋 规范继承

本项目遵循 `D:/OneDrive/Project/common/guidelines/guidelines/v3.md` 通用规范。以下仅列出项目特定配置和例外。

---

## 📦 项目信息

### 基本信息

- **项目名称**: payment
- **项目类型**: Egg.js 企业级后端服务（TypeScript）
- **框架版本**: Egg.js 3.17.5
- **Node.js**: ≥16.0.0
- **数据库**: MongoDB (egg-mongoose), Redis (egg-redis), ShareDB
- **部署**: Docker + PM2

### 核心依赖
- `egg@^3.17.5`, `egg-mongoose@^4.0.1`, `egg-redis@^2.6.0`
- `egg-jwt@^3.1.7`, `egg-validate@^2.0.2`, `joi@^18.0.1`
- `sharedb@^5.1.1`, `ssekify@^0.1.5`, `openai@^4.71.1`

### 本地命令
```bash
npm i              # 安装依赖
npm run dev        # 开发
npm run tsc        # 编译
npm test           # 测试
npm start          # 生产启动
```

### 目录结构
```
app/
  controller/      # 控制器（业务逻辑在这里）
  middleware/      # 中间件
  model/           # MongoDB Model
  utils/           # 工具函数（调用≥2次才封装）
  validator/       # 参数校验
config/            # 配置文件
  error_messages.ts  # 多语言消息
test/              # 测试文件
```

---

## 🔒 MCP 配置（强制）

### 数据库连接信息

**项目数据库连接**: `mongodb://root:SYY54YsaXuBHndSe@47.84.66.151:28017/payment?authSource=admin&directConnection=true`

- **主机**: 47.84.66.151:28017
- **数据库名**: payment
- **用户名**: root
- **密码**: SYY54YsaXuBHndSe
- **认证数据库**: admin

### 数据库访问规范

涉及 MongoDB 操作时，必须先使用 MCP 查询实际结构：

1. 使用上述数据库连接信息连接数据库
2. 查询 `collection-schema` 获取字段结构
3. 查询 `collection-indexes` 获取索引信息
4. 基于真实字段编写代码

### 操作权限
- **读取**: 允许
- **写入**: 必须用户确认

---

## 📋 代码风格

### 缩进和格式
- **缩进**: 4 空格
- **引号**: 单引号
- **分号**: 必须
- **命名**: camelCase (函数/变量), PascalCase (类/组件)

### TypeScript
- 使用 `any` 类型（项目约定）
- 中间件类型转换: `(ctx as any).success`

---

## 🏗️ 核心规则

### 1. 强制使用中间件

#### 1.1 CRUD 操作必须使用 crudHelper

**所有数据库 CRUD 操作必须通过 `ctx.utilsCrud`**:

```typescript
const { paginate, findOne, createOne, updateOne, deleteOne } = (ctx as any).utilsCrud;

// 分页查询
const result = await paginate(
  ctx.model.Conversation, 
  { user_id: userId, del_flag: 0 },
  { 
    page: 1, 
    pageSize: 10,
    sort: { created_at: -1 },
    select: '_id title status created_at'
  }
);

// 单条查询
const doc = await findOne(ctx.model.Conversation, { _id: id });

// 创建
const doc = await createOne(ctx.model.Conversation, {
  user_id: userId,
  title: '新对话',
  del_flag: 0
});

// 更新
const updated = await updateOne(
  ctx.model.Conversation,
  { _id: id },
  { $set: { title: '更新标题' } }
);

// 删除（软删除，设置 del_flag=1）
const deleted = await deleteOne(ctx.model.Conversation, { _id: id });
```

#### 1.2 响应必须使用 responseHelper

**所有接口响应必须使用统一的响应方法**:

```typescript
export default class ConversationController extends Controller {
  async list() {
    const { ctx } = this;
    try {
      const data = await this.getData();
      // 成功响应
      return (ctx as any).success(data, message);
    } catch (err) {
      // 错误响应
      return (ctx as any).error('[Tag]', err, message);
    }
  }

  async create() {
    const { ctx } = this;
    // 参数校验失败时抛出
    if (!ctx.request.body.title) {
      throw (ctx as any).fail(message, 400);
    }
    // ...
    return (ctx as any).success(data, message);
  }
}
```

**响应格式**:
```typescript
// ctx.success(data, message)
{ code: 0, message: '成功', data: {...} }

// ctx.fail(message, code)
{ code: 400, message: '失败', data: null }

// ctx.error(tag, err, message)
{ code: 500, message: '错误', data: { error: '...' } }
```

#### 1.3 接口鉴权必须使用 userAuth

**路由配置**:
```typescript
// routes/home/index.ts
router.group({
  prefix: '/api',
  middlewares: ['userAuth'],  // 使用鉴权中间件
}, (group) => {
  group.get('/conversations', controller.home.conversation.list);
  group.post('/conversations', controller.home.conversation.create);
});

// 指定鉴权等级
router.group({
  prefix: '/api/admin',
  middlewares: [['userAuth', 'strict']],  // strict 严格鉴权
}, (group) => {
  group.delete('/users/:id', controller.admin.user.delete);
});
```

**鉴权等级**:
- `public`: 无需鉴权
- `basic`: JWT + 单点登录校验（默认）
- `strict`: JWT + 单点登录 + 登录有效性/风控校验

**Controller 中获取用户信息**:
```typescript
const user = ctx.state.user;  // 鉴权后自动注入
const userId = user._id;
```

#### 1.4 请求参数校验必须使用 validatorHelper

**Validator 文件**:
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
```

**Controller 中使用**:
```typescript
export default class ConversationController extends Controller {
  private readonly validator: ConversationValidator;

  constructor(ctx: any) {
    super(ctx);
    this.validator = new ConversationValidator(ctx);
  }

  async create() {
    const { ctx } = this;
    // 参数校验
    await this.validator.create();
    
    // 校验通过后数据已自动归一化
    const { title, user_id } = ctx.request.body;
    // ...
  }
}
```

#### 1.5 HTTP 请求必须使用 httpHelper

**所有对外部服务的 HTTP 请求必须使用 `ctx.http`**:

```typescript
export default class TripController extends Controller {
  async callExternalAPI() {
    const { ctx } = this;
    
    try {
      // GET 请求
      const result1 = await ctx.http.get('[ThirdParty]', 'https://api.example.com/users');
      
      // POST 请求
      const result2 = await ctx.http.postJSON('[ThirdParty]', 'https://api.example.com/orders', {
        userId: ctx.state.user._id,
        items: [{ id: 1, qty: 2 }]
      });
      
      // 带完整配置
      const result3 = await ctx.http.fetchJSON('[ThirdParty]', 'https://api.example.com/data', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ query: 'test' }),
        timeoutMs: 10000,
        retries: 2,
      });
      
      return (ctx as any).success(result3);
    } catch (err) {
      return (ctx as any).error('[ThirdParty]', err, '外部服务调用失败');
    }
  }
}
```

### 2. 不使用 Service 层

**本项目不使用 Service 层架构，业务逻辑直接写在 Controller 中**。

#### 2.1 业务逻辑写在 Controller

```typescript
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
    
    // 2. 获取用户信息
    const user = ctx.state.user;
    const { page, pageSize, keyword } = ctx.query;
    
    // 3. 业务逻辑直接写在这里
    const query: any = {
      user_id: user._id,
      del_flag: 0,
      status: 1
    };
    
    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }
    
    // 4. 数据库查询
    const { paginate } = (ctx as any).utilsCrud;
    const result = await paginate(ctx.model.Conversation, query, {
      page,
      pageSize,
      sort: { created_at: -1 }
    });
    
    // 5. 统一响应
    const message = ctx.i18n.getError('DONE');
    return (ctx as any).success(result, message);
  }

  async create() {
    const { ctx } = this;
    await this.validator.create();
    
    const user = ctx.state.user;
    const { title } = ctx.request.body;
    
    // 业务逻辑：检查是否存在同名对话
    const { findOne, createOne } = (ctx as any).utilsCrud;
    const existing = await findOne(ctx.model.Conversation, {
      user_id: user._id,
      title,
      del_flag: 0
    });
    
    if (existing) {
      const message = ctx.i18n.getError('CONVERSATION_ALREADY_EXISTS');
      throw (ctx as any).fail(message, 400);
    }
    
    // 创建对话
    const conversation = await createOne(ctx.model.Conversation, {
      user_id: user._id,
      title,
      status: 1,
      del_flag: 0,
      created_by: user._id
    });
    
    const message = ctx.i18n.getError('DONE');
    return (ctx as any).success(conversation, message);
  }
}
```

#### 2.2 通用工具函数封装规则

**只有调用≥2次的逻辑才封装到 `app/utils/`**:

```typescript
// app/utils/conversation-helper.ts
import { Types } from 'mongoose';

/**
 * 构建对话查询条件
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
 */
export function formatConversationList(conversations: any[]) {
  return conversations.map(conv => ({
    id: conv._id.toString(),
    title: conv.title,
    created_at: conv.created_at,
    updated_at: conv.updated_at
  }));
}

// Controller 中使用
import { buildConversationQuery, formatConversationList } from 'utils/conversation-helper';

const query = buildConversationQuery(user._id, { title: { $regex: keyword } });
result.list = formatConversationList(result.list);
```

#### 2.3 历史 Service 代码处理

项目中存在历史遗留的 Service 代码（40+ 个）：
- **旧代码**: 保持现状，不强制改造
- **新代码**: 不再创建新的 Service
- **重构时**: 逐步将 Service 逻辑迁移到 Controller + utils

### 3. 内部服务通信

#### 3.1 从 Nacos 获取服务配置

**所有内部服务的 URL 通过 Nacos 动态配置**，配置路径：`ctx.app.config.custom.microservices.*`

**Nacos 配置位置**:
- Group: `payment-service`
- DataId: `config.json`

**配置示例**:
```json
{
  "custom": {
    "microservices": {
      "payment": { "url": "http://payment-service:3000" },
      "chat_agent": { "url": "http://chat-agent-service:5000" },
      "user": { "url": "http://user-service:4000" }
    }
  }
}
```

#### 3.2 调用内部服务

**推荐使用 ctx.http（内置重试、日志）**:

```typescript
import _ from 'lodash';

export default class TripController extends Controller {
  async callPaymentService() {
    const { ctx } = this;
    
    // 1. 从 Nacos 获取服务 URL
    const microService = _.get(ctx.app.config.custom, 'microservices.payment');
    
    // 2. 检查配置是否存在（必须）
    if (!microService?.url) {
      ctx.logger.warn('[TripController] Payment service config missing');
      // 降级处理
      return { plan_type: 'free' };
    }
    
    // 3. 构建 API URL
    const apiUrl = `${microService.url}/api/subscription`;
    
    // 4. 使用 ctx.http 调用
    try {
      const result = await ctx.http.postJSON('[Payment Service]', apiUrl, {
        userId: ctx.state.user._id
      });
      return result;
    } catch (err) {
      ctx.logger.error('[TripController] Payment service call failed', err);
      // 降级处理
      return { plan_type: 'free' };
    }
  }
}
```

**调用规则**:
1. 必须从 Nacos 获取 URL（禁止硬编码）
2. 必须检查配置是否存在
3. 必须实现降级策略
4. 必须记录日志
5. 推荐使用 ctx.http

#### 3.3 内部服务路由

**内部服务路由 `/internal/*` 无需鉴权**:

```typescript
// routes/internal/index.ts
router.group({
  prefix: '/internal',
  middlewares: [],  // 不使用鉴权中间件
}, (group) => {
  group.post('/conversation/sync', controller.internal.conversation.sync);
  group.post('/webhook', controller.internal.webhook.handle);
});
```

### 4. 数据库操作

#### 4.1 查询数据库结构（强制）

**修复代码或开发新功能前，必须先使用 MCP 查询实际数据库结构**:

1. 使用 MCP 连接数据库
2. 查询 `collection-schema` 获取字段结构
3. 查询 `collection-indexes` 获取索引信息
4. 基于真实字段编写代码

#### 4.2 创建 Model

**Model 文件位置**: `app/model/{model_name}.ts`

**Model 定义规范**:

```typescript
// app/model/conversation.ts
export default (app: any) => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ConversationSchema = new Schema({
    // 用户ID（必填）
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    
    // 对话标题
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    
    // 状态（1:正常 0:禁用）
    status: {
      type: Number,
      default: 1,
      index: true,
    },
    
    // 删除标记（0:未删除 1:已删除）
    del_flag: {
      type: Number,
      default: 0,
      index: true,
    },
    
    // 创建人
    created_by: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    
    // 更新人
    updated_by: {
      type: Schema.Types.ObjectId,
    },
  }, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    versionKey: false,
  });

  // 复合索引
  ConversationSchema.index({ user_id: 1, del_flag: 1, created_at: -1 });
  ConversationSchema.index({ user_id: 1, title: 1 }, { unique: true });

  return mongoose.model('Conversation', ConversationSchema, 'conversations');
};
```

**Model 命名约定**:
- **文件名**: `snake_case.ts`（conversation.ts）
- **Model 名**: `PascalCase`（Conversation）
- **Collection 名**: 复数 `snake_case`（conversations）

**必须包含的字段**:
- `status`: 状态字段（1:正常 0:禁用）
- `del_flag`: 软删除标记（0:未删除 1:已删除）
- `created_by`: 创建人ID
- `updated_by`: 更新人ID（可选）
- `created_at`: 创建时间（自动）
- `updated_at`: 更新时间（自动）

**Schema 配置选项**:
```typescript
{
  timestamps: {
    createdAt: 'created_at',  // 自动管理创建时间
    updatedAt: 'updated_at',  // 自动管理更新时间
  },
  versionKey: false,  // 禁用 __v 版本字段（默认为 true 会添加）
}
```

**索引规范**:
1. 查询频繁的字段必须加索引
2. 常用的组合查询必须创建复合索引
3. 唯一约束使用 `unique: true`

**字段类型**:
- 字符串: `String`
- 数字: `Number`
- 布尔: `Boolean`
- 日期: `Date`
- ObjectId: `Schema.Types.ObjectId`
- 数组: `[String]` 或 `[Schema.Types.ObjectId]`
- 对象: `Schema.Types.Mixed` 或嵌套 Schema

#### 4.3 Model 使用规范

```typescript
// 在 Controller 中访问 Model
const Conversation = ctx.model.Conversation;
const Message = ctx.model.Message;

// 通过 ctx.utilsCrud 操作数据库（推荐）
const { findOne, createOne } = (ctx as any).utilsCrud;
const doc = await findOne(ctx.model.Conversation, { _id: id });
```

#### 4.4 写操作必须确认（强制）

**所有写入操作（创建、更新、删除）前必须**:

1. 展示操作影响范围
2. 显示将要修改的数据
3. 等待用户明确确认

```typescript
// 示例确认流程
console.log('即将执行以下操作：');
console.log('- 操作类型：更新');
console.log('- 影响文档：', { _id: xxx, title: 'xxx' });
console.log('- 更新字段：', { title: '新标题' });
console.log('请确认是否继续？(y/n)');
```


### 5. 国际化响应

Chat 服务通过 `language` 中间件自动处理多语言，支持 `en`（英文）、`zh`（简体中文）、`hk`（繁体中文）。

#### 5.1 国际化机制

**客户端传递语言标识**:
- 通过 `query.language` 或 `header.language` 传递
- 中间件自动注入 `ctx.i18n` 实例
- 响应的 `message` 字段为**单一语言字符串**

**客户端请求示例**:
```bash
# 请求中文
curl -H "language: zh" http://api.example.com/endpoint

# 请求英文
curl -H "language: en" http://api.example.com/endpoint
```

**响应格式**:
```json
// language=zh 时
{ "code": 0, "message": "请求成功", "data": {...} }

// language=en 时
{ "code": 0, "message": "Request successful", "data": {...} }
```

#### 5.2 消息常量定义

**所有消息必须在 `config/error_messages.ts` 中预定义**:

```typescript
// config/error_messages.ts
import { MultiLangMessage } from 'app/middleware/language';

export const ERROR_MESSAGES: Record<string, MultiLangMessage> = {
  DONE: {
    en: 'Request successful',
    zh: '请求成功',
    hk: '請求成功',
  },
  
  DATA_NOT_EXIST: {
    en: 'Data does not exist',
    zh: '数据不存在',
    hk: '數據不存在',
  },
  
  CONVERSATION_CREATED: {
    en: 'Conversation created successfully',
    zh: '创建对话成功',
    hk: '創建對話成功',
  },
  
  CONVERSATION_NOT_FOUND: {
    en: 'Conversation not found',
    zh: '对话不存在',
    hk: '對話不存在',
  }
};
```

#### 5.3 Controller 中使用

```typescript
export default class ConversationController extends Controller {
  async create() {
    const { ctx } = this;
    
    // 使用 ctx.i18n.getError 获取消息
    const successMessage = ctx.i18n.getError('CONVERSATION_CREATED');
    return (ctx as any).success(conversation, successMessage);
  }
  
  async delete() {
    const { ctx } = this;
    
    const conversation = await ctx.model.Conversation.findById(id);
    if (!conversation) {
      const errorMessage = ctx.i18n.getError('CONVERSATION_NOT_FOUND');
      throw (ctx as any).fail(errorMessage, 404);
    }
    
    // ...
    const successMessage = ctx.i18n.getError('DONE');
    return (ctx as any).success(null, successMessage);
  }
}
```

#### 5.4 带变量的消息

```typescript
// config/error_messages.ts
export const ERROR_MESSAGES = {
  INSUFFICIENT_CREDIT: {
    en: 'Insufficient credit. You need {amount} credits.',
    zh: '积分不足。需要 {amount} 积分。',
    hk: '積分不足。需要 {amount} 積分。'
  }
};

// Controller 中使用
const message = ctx.i18n.getErrorWithVars('INSUFFICIENT_CREDIT', { amount: 100 });
throw (ctx as any).fail(message, 400);
```

#### 5.5 新增消息流程

1. 在 `config/error_messages.ts` 中定义消息（必须包含 en/zh/hk）
2. 在 Controller 中使用 `ctx.i18n.getError(key)` 获取
3. 传递给 `ctx.success/fail/error`

**重要**:
- 响应格式为**字符串**（不是对象 `{en, zh, hk}`）
- 必须使用 `ctx.i18n.getError(key)` 转换
- 禁止直接使用 `ERROR_MESSAGES` 对象

### 6. SSE 前端通信

Chat 服务使用 **ssekify** 模块（v0.1.5）实现 SSE 实时通信。

#### 6.1 建立 SSE 连接

```typescript
import { PassThrough } from 'stream';

export default class SseController extends Controller {
  async stream() {
    const { ctx, app } = this;
    
    // 1. 设置响应为 PassThrough 流
    ctx.body = new PassThrough();
    
    const tag = 'sse.stream';
    try {
      // 2. 获取用户 ID（从 query 参数）
      const userId = ctx.query.userId;
      if (!userId) {
        const message = ctx.i18n.getError('INVALID_PARAMETER');
        throw (ctx as any).fail(message, 400);
      }
      
      // 3. 注册 SSE 连接
      app.sse.registerConnection(userId, ctx.res, {
        rooms: ['global']  // 可选：加入房间
      });
      
      ctx.logger.info(`${tag} open: user=${userId}`);
      
      // 4. 监听连接关闭
      ctx.res.on('close', () => {
        ctx.logger.info(`${tag} closed: user=${userId}`);
      });
      
      // 5. 发送初始消息
      ctx.body.write(`data: ${JSON.stringify({ 
        type: 'connected', 
        timestamp: new Date() 
      })}\n\n`);
      
    } catch (err) {
      const message = ctx.i18n.getError('FAILED');
      return (ctx as any).error(tag, err, message);
    }
  }
}
```

#### 6.2 推送消息给用户

```typescript
export default class ItineraryController extends Controller {
  async notifyUser() {
    const { ctx, app } = this;
    
    const {
      user_id,
      type,
      requestId,
      phase,          // progress | error | done
      project_id,
      session_id,
      payload,
      error
    } = ctx.request.body;
    
    // 使用 app.sse.publish 推送消息
    app.sse.publish(
      {
        type,                   // 消息类型
        requestId,              // 请求ID
        phase,                  // 状态：progress/error/done
        project_id,             // 项目ID
        session_id,             // 对话ID
        payload,                // 业务数据
        error,                  // 错误信息
        timestamp: new Date()
      },
      user_id,                  // 目标用户ID
      { event: 'notify' }       // SSE 事件名称
    );
    
    const message = ctx.i18n.getError('DONE');
    return (ctx as any).success({ status: 'success' }, message);
  }
}
```

#### 6.3 检查用户在线状态

```typescript
export default class CustomerSseController extends Controller {
  async checkOnline() {
    const { ctx, app } = this;
    
    const userId = ctx.query.userId;
    if (!userId) {
      const message = ctx.i18n.getError('INVALID_PARAMETER');
      throw (ctx as any).fail(message, 400);
    }
    
    // 检查在线状态
    const isOnline = app.sse.isUserOnline(userId);
    
    const message = ctx.i18n.getError('DONE');
    return (ctx as any).success({ isOnline }, message);
  }
}
```

#### 6.4 路由配置

**SSE 路由配置**:

```typescript
// routes/internal/index.ts
router.group({
  prefix: '/internal',
  middlewares: ['userAuth'],  // userAuth 会自动处理 SSE 场景
}, (group) => {
  group.get('/sse', controller.internal.sse.stream);
  group.get('/sse/check', controller.internal.customerSse.checkOnline);
});
```

**userAuth 中间件已自动支持 SSE**:
- 检测 `Accept: text/event-stream` 或路径包含 `/sse`
- Token 可从 `headers.authorization` 或 `query.token` 获取
- 自动从 `query.token` 回填到 `headers.authorization`（兼容 EventSource 无法设置自定义 Header 的场景）

#### 6.5 消息格式规范

**标准消息格式**:
```typescript
interface SSEMessage {
  type: string;              // 消息类型
  requestId: string;         // 请求ID
  phase: 'progress' | 'error' | 'done';  // 处理阶段
  project_id?: string;       // 项目ID
  session_id?: string;       // 对话ID
  payload?: any;             // 业务数据
  error?: string;            // 错误信息
  timestamp?: Date;          // 时间戳
}
```

**三种状态**:
- `phase: 'progress'` - 处理中，可多次推送
- `phase: 'done'` - 完成，最终消息
- `phase: 'error'` - 错误，终止处理

---

## 🎯 架构规则

### 代码分层
```
Controller - 业务逻辑 + 参数校验 + 鉴权 + 响应
    ↓
Utils - 通用函数（调用≥2次）
    ↓
Model - Schema 定义
```

### 职责划分
- **Controller**: ✅ 业务逻辑、参数校验、鉴权、响应
- **Utils**: ✅ 通用工具函数（纯函数）
- **Model**: ✅ Schema 定义、索引

---

## ✅ 快速检查清单

### 中间件检查（强制）
- [ ] CRUD 使用 `ctx.utilsCrud`
- [ ] 响应使用 `ctx.success/fail/error`
- [ ] 鉴权使用 `userAuth` 中间件
- [ ] 参数校验使用 `validator`
- [ ] HTTP 请求使用 `ctx.http`

### 架构检查（强制）
- [ ] 业务逻辑写在 Controller
- [ ] 不创建新的 Service
- [ ] 通用函数封装到 utils（调用≥2次）

### 数据库检查（强制）
- [ ] 修复前用 MCP 查询实际结构
- [ ] Model 文件位置正确（`app/model/{name}.ts`）
- [ ] Model 命名符合约定（文件snake_case，Model PascalCase，Collection复数snake_case）
- [ ] 包含必需字段（status, del_flag, created_by, updated_by, created_at, updated_at）
- [ ] 查询频繁字段已添加索引
- [ ] 写操作前等待用户确认

### 国际化检查（强制）
- [ ] 消息从 `ERROR_MESSAGES` 获取
- [ ] 使用 `ctx.i18n.getError(key)` 转换
- [ ] 包含 en/zh/hk 三种语言

### SSE 检查
- [ ] 使用 `app.sse.registerConnection` 建立连接
- [ ] 使用 `app.sse.publish` 推送消息
- [ ] Token 从 `headers.authorization` 或 `query.token` 获取

---

**最后更新**: 2025-11-25

