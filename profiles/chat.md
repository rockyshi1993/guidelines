# chat 项目规范（AI 助手用）

## 规范继承
本项目遵循 `.github/guidelines.md` 通用规范。以下仅列出项目特定配置和例外。

---

## 项目信息

- **类型**: Egg.js 微服务（TypeScript）
- **定位**: 旅行助手核心服务，提供行程规划、AI 对话、协同编辑等功能
- **运行时**: Node.js 18.x, 20.x (LTS)
- **操作系统**: Windows, Linux (Ubuntu)
- **数据库**: MongoDB (Mongoose), Redis
- **框架**: Egg.js 3.x + TypeScript
- **关键功能**: 
  - Trip 行程管理（CRUD）
  - AI 智能对话（OpenAI）
  - 实时协同编辑（ShareDB + WebSocket）
  - 文档生成（PDF/Excel/iCal）
  - 第三方集成（Google Maps, Pexels, Weather API）

---

## 本地命令

```powershell
# 安装依赖
npm ci

# 本地开发（启动开发服务器）
npm run dev

# 构建（TypeScript 编译）
npm run tsc

# 启动（生产模式）
npm start

# 代码检查
npm run lint

# 停止服务
npm stop
```

---

## 目录结构

```
app/
├── controller/          # 控制器层（路由处理）
│   ├── home/           # 用户端 API
│   └── admin/          # 管理端 API
├── service/            # 服务层（业务逻辑）
│   ├── trip/           # 行程相关服务
│   ├── ai/             # AI 相关服务
│   └── MongoDataModel.ts  # MongoDB 基类
├── model/              # Mongoose 数据模型
├── middleware/         # 中间件
├── validator/          # 参数校验器
├── utils/              # 工具类
│   ├── ex-error/       # 自定义错误处理
│   ├── response/       # 统一响应封装
│   └── http/           # HTTP 请求工具
├── extend/             # Egg.js 扩展
└── public/             # 静态资源

config/                 # 配置文件
├── config.default.ts   # 默认配置
├── config.local.ts     # 本地开发配置
├── config.prod.ts      # 生产环境配置
└── plugin.ts           # 插件配置

typings/                # TypeScript 类型定义
├── enum/               # 枚举类型
├── interface/          # 接口定义
└── ExEntitys.ts        # 实体类型

test/                   # 测试文件（预留）
docs/                   # 项目文档
bug-analysis/           # Bug 分析报告
```

---

## MCP 配置（🔴 强制）

- **允许的 MCP 服务器**: `mongodb-chat`
- **数据库/资源**: `chat` (旅行助手数据库)
- **用途**: 
  - 行程数据查询和分析
  - 用户行为数据分析
  - AI 对话历史查询
  - 系统运营数据统计
- **限制**: 
  - ✅ 允许：读取操作（find, findOne, count, aggregate）
  - ✅ 允许：开发/测试环境的写入操作（用于数据修复和测试）
  - ⚠️ 谨慎：生产环境的更新操作（需明确说明原因和影响范围）
  - ❌ 禁止：删除整个集合或数据库
  - ❌ 禁止：批量删除用户数据（需通过正常 API 流程）

**数据库连接信息**:
- 主机: `47.84.66.151:28017`
- 认证: 通过 MCP 配置管理（不在代码中硬编码）
- 连接方式: `directConnection=true`

**说明**: AI 助手在调用任何 MCP 数据库操作前，必须先读取本配置。未在此处声明的 MCP 服务器一律禁止调用。

---

## 例外与覆盖

### 测试策略例外 🔴 重要
相对通用规范（guidelines.md 第 7 节）的差异：

- **不需要编写脚本测试**: chat 项目作为 Egg.js 微服务，依赖复杂的运行时环境（Nacos 配置中心、MongoDB、Redis、WebSocket 连接等），自动化测试成本极高且收益有限
- **测试方式**: 采用**手动测试 + API 文档 + 回归测试清单**的方式
- **测试文档位置**: README.md 包含完整的回归测试清单
- **质量保障**: 
  - ✅ 通过 TypeScript 类型检查保障代码质量
  - ✅ 通过 ESLint 检查代码规范
  - ✅ 通过 Bug 分析文档（bug-analysis/）记录问题和修复
  - ✅ 通过详细的 API 文档（README.md）指导手动测试
  - ✅ 通过 CHANGELOG.md 追踪所有变更

**AI 助手执行规则**:
- ❌ **禁止**要求或创建任何测试脚本（test/*.test.ts）
- ❌ **禁止**运行 `npm test` 命令（项目未配置测试命令）
- ✅ **允许**更新 README.md 中的回归测试清单
- ✅ **允许**创建 Bug 分析文档（bug-analysis/*.md）
- ✅ **强制**更新 CHANGELOG.md 记录变更

### 代码风格例外
相对通用规范（guidelines.md 第 1 节）的差异：
- **缩进**: 4 空格（Egg.js 默认，通用规范默认：2 空格）
- **TypeScript**: 严格模式但允许 `noImplicitAny: false`
- **路径别名**: 使用 TypeScript paths 简化导入
  ```typescript
  import { TripStatusEnum } from 'enum/trip/trip_status'
  import { responseHelper } from 'utils/response/response'
  import { TripValidator } from 'validator/home/trip_validator'
  ```

### 文档更新策略
相对通用规范（guidelines.md 第 5-6 节）的差异：
- **README.md**: 作为主要 API 文档和测试清单，任何对外 API 变更都需要更新
- **Bug 分析**: 使用 `bug-analysis/*.md` 而不是独立的 Bug 跟踪系统
- **CHANGELOG.md**: 必须记录所有对外可见变更（包括 Bug 修复）

### 其他例外
- **日志语言**: 中文（便于运维团队查看）
- **注释语言**: 中文为主，技术术语保留英文
- **错误信息**: 中文（面向用户）+ 错误码（便于追踪）

---

## 接口开发规范

### 1. 接口开发完整流程

```
步骤1: 定义 Model（如不存在）→ app/model/<model_name>.ts
       ↓
步骤2: 定义路由配置 → app/routes/<group>/<resource>.ts
       ↓
步骤3: 选择鉴权方式 → userAuth/dbToken/internalAuth
       ↓
步骤4: 实现控制器方法 → app/controller/<group>/<Resource>Controller.ts
       ↓
步骤5: 参数校验（Joi）→ 使用 ctx.validateJoi
       ↓
步骤6: 数据库操作 → 使用 ctx.utilsCrud
       ↓
步骤7: 统一响应处理 → 使用 ctx.success/fail/error
       ↓
步骤8: 错误兜底处理 → try-catch + ctx.error
       ↓
步骤9: 手动测试与文档更新
```

### 2. Mongoose 模型定义规范

**位置**: `app/model/<model_name>.ts`

**标准模板**:
```typescript
import { Application } from 'egg';
import { StatusEnumValues, StatusEnum } from 'enum/status';
import { DelFlagEnum } from 'enum/del_flag';

export default (app: Application) => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const schema = new Schema(
        {
            // 业务主键（必须加索引）
            user_id: {
                type: Schema.Types.ObjectId,
                required: true,
                index: true,
            },
            
            // 字符串字段
            title: {
                type: Schema.Types.String,
                required: true,
                trim: true,
                maxlength: 100,
            },
            
            // 枚举字段
            status: {
                type: Schema.Types.Number,
                enum: StatusEnumValues,
                default: StatusEnum.Enable,
                required: true,
            },
            
            // 数组字段
            tags: {
                type: [Schema.Types.String],
                required: false,
                default: [],
            },
            
            // 对象字段（灵活扩展）
            extends: {
                type: Schema.Types.Mixed,
                required: false,
            },
            
            // 必备字段：软删除标记
            del_flag: {
                type: Schema.Types.Number,
                required: true,
                default: DelFlagEnum.Normal,
            },
            
            // 必备字段：操作人追踪
            created_by: { type: Schema.Types.ObjectId, required: false },
            updated_by: { type: Schema.Types.ObjectId, required: false },
        },
        {
            // 🔴 自动维护时间戳
            timestamps: {
                createdAt: 'created_at',
                updatedAt: 'updated_at',
            },
        }
    );

    // 🔴 复合索引（根据查询场景定义）
    schema.index({ user_id: 1, status: 1 });
    schema.index({ created_at: -1 });

    return mongoose.model('ModelName', schema, 'collection_name');
};
```

**字段命名规范**:
- ID 字段: `<关联对象>_id` (如 `user_id`, `trip_id`)
- 时间字段: `<动作>_at` 或 `<状态>_date` (如 `created_at`, `start_date`)
- 标志字段: `is_<状态>` 或 `<名词>_flag` (如 `is_public`, `del_flag`)
- 计数字段: `<名词>_count` (如 `view_count`, `traveler_count`)

**必须包含的字段** 🔴:
```typescript
{
    del_flag: { type: Number, default: 0 },       // 软删除标记
    created_by: { type: ObjectId },               // 创建人
    updated_by: { type: ObjectId },               // 更新人
    // created_at, updated_at 由 timestamps 自动维护
}
```

### 3. 路由配置规范

**位置**: `app/routes/<group>/<resource>.ts`

**标准模板**:
```typescript
import { Application } from 'egg';
import { RouterGroup } from 'egg-router-group';

export default (app: Application, groupRouter: RouterGroup) => {
    const { controller } = app;

    groupRouter.group({
        name: '<资源名称>',
        prefix: '/<resources>',
        middlewares: [],  // 分组级中间件
    }, (sub: RouterGroup) => {
        const ctrl = controller.home.<resource>Controller;

        // RESTful 风格路由
        sub.get('/', ctrl.index);           // 列表
        sub.get('/:id', ctrl.detail);       // 详情
        sub.post('/', ctrl.create);         // 创建
        sub.put('/:id', ctrl.update);       // 更新
        sub.delete('/:id', ctrl.delete);    // 删除
        
        // 自定义动作路由
        sub.post('/:id/regenerate', ctrl.regenerate);
    });
};
```

**路由分组策略**（参考 `app/routes/home/index.ts`）:

```typescript
// 分组1：公开接口（无鉴权）
router.group({
    prefix: '/home',
    middlewares: [],
}, (group) => {
    articleGroup(app, group);              // 文章列表
    featureModulesGroup(app, group);       // 功能模块
});

// 分组2：需要登录（JWT + 单点登录）
router.group({
    prefix: '/home',
    middlewares: [userJwt, singleLogin],
}, (group) => {
    tripGroup(app, group);                 // 我的行程
    messageGroup(app, group);              // 消息
});

// 分组3：需要登录 + 权限校验（写操作）
router.group({
    prefix: '/home',
    middlewares: [userJwt, singleLogin, loginCheck],
}, (group) => {
    // 写操作路由
});
```

**路由命名规范**:
| 场景 | 路径格式 | 示例 |
|------|---------|------|
| 资源列表 | `GET /<resources>` | `GET /trips` |
| 资源详情 | `GET /<resources>/:id` | `GET /trips/123` |
| 创建资源 | `POST /<resources>` | `POST /trips` |
| 更新资源 | `PUT /<resources>/:id` | `PUT /trips/123` |
| 删除资源 | `DELETE /<resources>/:id` | `DELETE /trips/123` |
| 自定义动作 | `POST /<resources>/:id/<action>` | `POST /messages/123/regenerate` |

### 4. 鉴权方式选择指南

**鉴权方式对比表**:

| 鉴权方式 | 使用场景 | 请求头要求 | 代码示例 |
|---------|---------|-----------|---------|
| **无鉴权** | 公开接口 | 无 | `middlewares: []` |
| **userAuth (basic)** | 用户读操作 | `Authorization: Bearer <token>` | `app.middleware.userAuth({ level: 'basic' })` |
| **userAuth (strict)** | 用户写操作 | `Authorization: Bearer <token>` | `app.middleware.userAuth({ level: 'strict' })` |
| **dbToken** | 批量写入 | `x-action-token: <token>` | `app.middleware.dbToken()` |
| **internalAuth** | 服务间调用 | `x-internal-token: <token>` | `app.middleware.internalAuth()` |

**userAuth 三级鉴权模式**（实际使用，参考 `app/middleware/userAuth.ts`）:

```typescript
// Level 1: public - 无需鉴权
const publicAuth = app.middleware.userAuth({ level: 'public' });
sub.get('/articles/list', publicAuth, ctrl.list);

// Level 2: basic - JWT + 单点登录（默认）
const basicAuth = app.middleware.userAuth({ level: 'basic' });
sub.get('/trips', basicAuth, ctrl.index);

// Level 3: strict - JWT + 单点登录 + 权限校验（非 GET 需 Trial 及以上）
const strictAuth = app.middleware.userAuth({ level: 'strict' });
sub.post('/trips', strictAuth, ctrl.create);
```

**鉴权流程**:
```
请求
 ↓
[SSE场景] 从 Query 提取 Token → ctx.request.header.authorization
 ↓
[Cookie场景] 从 Cookie 提取 Token → ctx.request.header.authorization
 ↓
[JWT校验] 验证 Token 有效性 → 解析用户信息 → ctx.state.user
 ↓
[单点登录] 校验 Session 是否有效
 ↓
[strict模式] 校验用户权限（非 GET 需 Trial 及以上）
 ↓
业务处理
```

**特殊场景 - SSE 连接鉴权**（参考 `app/routes/internal/index.ts`）:
```typescript
// 服务端
const baseAuth = app.middleware.userAuth({ level: 'basic' });
sub.get('/sse', baseAuth, internal.sseController.stream);

// 客户端（支持 Query 传 Token）
const token = localStorage.getItem('token');
const eventSource = new EventSource(
    `/internal/sse?userId=123&authorization=Bearer ${token}`
);
```

### 5. 数据库操作规范（utilsCrud）

**注入方式**: 通过 `crudHelper` 中间件全局注入 `ctx.utilsCrud`

**方法总览**:

| 方法 | 用途 | 返回值 |
|------|-----|-------|
| `paginate` | 分页查询 | `{ list, total, page, pageSize, pages }` |
| `findOne` | 查询单条 | `Document \| null` |
| `findById` | 按 ID 查询（自动校验） | `Document \| null` |
| `findMany` | 查询多条（不分页） | `Document[]` |
| `createOne` | 新增单条 | `Document` |
| `updateOne` | 更新单条 | `boolean` |
| `deleteMany` | 批量删除 | `{ deleted: number }` |
| `saveMany` | 批量新增/更新（支持 upsert） | `{ inserted, updated, errors }` |

**分页查询标准模式**:
```typescript
public async list() {
    const { ctx } = this;
    const { Joi, validateJoi, utilsCrud } = ctx as any;
    
    // 1. 参数校验
    const query = await validateJoi(Joi.object({
        page: Joi.number().integer().min(1).default(1),
        pageSize: Joi.number().integer().min(1).max(100).default(10),
        keyword: Joi.string().trim().optional(),
    }), 'query');
    
    // 2. 构建过滤条件
    const filter: any = { del_flag: 0 };
    if (query.keyword) {
        filter.$or = [
            { title: { $regex: query.keyword, $options: 'i' } },
            { summary: { $regex: query.keyword, $options: 'i' } }
        ];
    }
    
    // 3. 执行分页查询
    const { paginate } = utilsCrud;
    const data = await paginate(ctx.model.Article, filter, {
        page: query.page,
        pageSize: query.pageSize,
        sort: { created_at: -1, _id: -1 },  // 🔴 双字段排序保证稳定性
        projection: { _id: 1, title: 1, summary: 1, created_at: 1 },
        lean: true,  // 🔴 返回纯对象（性能优化）
    });
    
    return ctx.success(data);
}
```

**查询单条（findById 自动校验）**:
```typescript
public async detail() {
    const { ctx } = this;
    const { utilsCrud } = ctx as any;
    
    // findById 自动校验 24 位 hex ID，自动从 ctx.query.id 提取
    const { findById } = utilsCrud;
    const article = await findById(ctx.model.Article, ctx, {
        populate: 'author_id',
        lean: true,
    });
    
    if (!article) {
        throw ctx.fail('文章不存在', 404);
    }
    
    return ctx.success(article);
}
```

**批量新增/更新（支持 upsert）**:
```typescript
public async add() {
    const { ctx } = this;
    const { Joi, validateJoi, utilsCrud } = ctx as any;
    
    // 支持两种格式
    await validateJoi(Joi.alternatives().try(
        // 格式1：数组直投（全部新增）
        Joi.array().items(Joi.object({
            title: Joi.string().required(),
        })).min(1),
        
        // 格式2：包裹对象（支持 upsert）
        Joi.object({
            docs: Joi.array().items(Joi.object()).min(1).required(),
            matchFields: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
            onExist: Joi.string().valid('update', 'skip').default('update'),
            ordered: Joi.boolean().default(true),
        })
    ), 'body');
    
    const { saveMany } = utilsCrud;
    const result = await saveMany(ctx.model.Article, ctx);
    
    return ctx.success(result, '批量保存成功');
}
```

**批量删除（带保护）**:
```typescript
public async delete() {
    const { ctx } = this;
    const { Joi, validateJoi, utilsCrud } = ctx as any;
    
    // 校验删除参数
    await validateJoi(Joi.object({
        ids: Joi.array().items(Joi.string().length(24).hex()),
        filter: Joi.object().unknown(true),
        all: Joi.boolean().default(false),
    }).or('ids', 'filter', 'all'), 'body');
    
    const { body } = ctx.request;
    
    // 🔴 删除保护：防止误删全表
    if ((!body.ids || body.ids.length === 0) && !body.filter && body.all !== true) {
        throw ctx.fail('缺少删除条件', 400);
    }
    
    const { deleteMany } = utilsCrud;
    const result = await deleteMany(ctx.model.Article, ctx);
    
    return ctx.success({ deleted: result.deleted }, '删除成功');
}
```

**强制规则** 🔴:
1. 禁止直接调用 `ctx.model.*.find()` 等方法，必须使用 `utilsCrud`
2. 分页查询必须使用 `paginate`
3. 按 ID 查询必须使用 `findById`（自动校验格式）
4. 所有查询优先使用 `lean: true`（性能优化）
5. 分页排序使用双字段：`{ created_at: -1, _id: -1 }`

### 6. 参数校验规范（validatorHelper）

**注入方式**: 通过 `validatorHelper` 中间件全局注入 `ctx.Joi` 和 `ctx.validateJoi`

**参考**: `app/middleware/validatorHelper.ts` 和 `chat/README.md`

**标准模式**:
```typescript
public async create() {
    const { ctx } = this;
    const { Joi, validateJoi } = ctx as any;
    
    // 定义校验规则
    const bodySchema = Joi.object({
        // 必填字符串
        trip_name: Joi.string().trim().min(1).max(100).required()
            .messages({
                'string.empty': '行程名称不能为空',
                'string.max': '行程名称不能超过 100 字符',
            }),
        
        // 枚举值
        share_type: Joi.string().valid('public', 'private', 'link').default('public'),
        
        // 数值范围
        traveler_count: Joi.number().integer().min(1).max(50).required(),
        
        // 日期格式
        start_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
        
        // 数组
        tags: Joi.array().items(Joi.string().trim().min(1)).max(10).default([]),
        
        // 嵌套对象
        owner: Joi.object({
            id: Joi.string().length(24).hex().required(),
            name: Joi.string().required(),
        }).required(),
    });
    
    // 执行校验
    const body = await validateJoi(bodySchema, 'body');
    
    // 业务逻辑...
}
```

**常用校验规则**:
```typescript
// 字符串
Joi.string().trim().min(1).max(100).pattern(/^[a-zA-Z0-9]+$/).uri().email()

// 数值
Joi.number().integer().min(0).max(100).positive()

// 枚举
Joi.string().valid('draft', 'published', 'archived')
Joi.number().valid(...StatusEnumValues)

// 数组
Joi.array().items(Joi.string()).min(1).max(10).unique()

// ObjectId
Joi.string().length(24).hex()

// 日期
Joi.date().iso()
Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/)
```

**多来源参数校验**:
```typescript
// Query 参数
const query = await validateJoi(querySchema, 'query');

// Body 参数
const body = await validateJoi(bodySchema, 'body');

// Params 参数
const params = await validateJoi(paramsSchema, 'params');

// Headers 参数
const headers = await validateJoi(headersSchema, 'headers');
```

**默认选项**（参考 `validatorHelper.ts`）:
- `stripUnknown: true` - 清洗未知字段
- `abortEarly: false` - 返回所有错误
- `convert: true` - 类型转换

### 7. 统一响应规范（responseHelper）

**注入方式**: 通过 `responseHelper` 中间件全局注入 `ctx.success/fail/error`

**参考**: `app/middleware/responseHelper.ts` 和 `chat/README.md`

**核心方法**:

| 方法 | 用途 | 响应体 | 使用方式 |
|------|-----|-------|---------|
| `ctx.success` | 成功响应 | `{ code: 0, message, data }` | `return ctx.success(data, message)` |
| `ctx.fail` | 业务失败 | 构造错误对象 | `throw ctx.fail(message, code)` |
| `ctx.error` | 异常兜底 | `{ code: 4xx/5xx, message, data }` | `return ctx.error(tag, err, message)` |

**成功响应模式**:
```typescript
// 返回数据 + 自定义消息
return ctx.success({ trip_id: '123', status: 'ok' }, '创建成功');
// 响应: { code: 0, message: '创建成功', data: { trip_id: '123', status: 'ok' } }

// 返回数据（message 默认 'ok'）
return ctx.success({ list: [...], total: 100 });
// 响应: { code: 0, message: 'ok', data: { list: [...], total: 100 } }

// 无数据返回
return ctx.success(null, '删除成功');
// 响应: { code: 0, message: '删除成功', data: null }
```

**业务失败模式**:
```typescript
// 🔴 注意：ctx.fail 仅构造错误对象，必须 throw 才会生效

// 默认 400 错误
if (!trip) {
    throw ctx.fail('行程不存在');
}

// 指定错误码
if (privilege < PrivilegeEnum.Trial) {
    throw ctx.fail('权限不足，请升级会员', 403);
}

// 业务规则校验失败
if (moment(endDate).isBefore(startDate)) {
    throw ctx.fail('结束日期不能早于开始日期', 422);
}
```

**标准控制器模式**:
```typescript
export default class TripController extends Controller {
    public async getTrip() {
        const { ctx } = this;
        const tag = 'home.trip.getTrip';  // 🔴 格式：分组.控制器.方法
        
        try {
            // 1. 参数校验
            const { Joi, validateJoi } = ctx as any;
            await validateJoi(Joi.object({
                id: Joi.string().length(24).hex().required(),
            }), 'query');
            
            // 2. 数据库操作
            const { findById } = ctx.utilsCrud;
            const trip = await findById(ctx.model.Trip, ctx, {
                populate: 'owner_id',
                lean: true,
            });
            
            // 3. 业务校验
            if (!trip) {
                throw ctx.fail('行程不存在', 404);
            }
            
            // 4. 成功响应
            return ctx.success(trip);
            
        } catch (err) {
            // 5. 异常兜底
            return ctx.error(tag, err, '获取行程失败');
        }
    }
}
```

**错误分级规则**:

| HTTP Code | 响应 code | 场景 | 日志级别 |
|-----------|----------|------|---------|
| 200 | 0 | 成功 | info |
| 200 | 400 | 参数错误 | warn |
| 200 | 401 | 未授权 | warn |
| 200 | 403 | 权限不足 | warn |
| 200 | 404 | 资源不存在 | warn |
| 200 | 422 | 业务规则失败 | warn |
| 200 | 500 | 系统异常 | error |
| 200 | 502 | 上游服务异常 | error |

**注意**: 项目默认所有响应 HTTP 状态码都是 200，通过 `body.code` 区分成功/失败

**强制规则** 🔴:
1. 禁止直接设置 `ctx.body`
2. `ctx.success/ctx.error` 后必须 `return`
3. `ctx.fail` 必须 `throw`，不能 `return`
4. 所有 try-catch 必须有 `ctx.error` 兜底
5. tag 格式：`分组.控制器.方法`

### 8. SSE 推送实现规范

**架构概览**:
- 核心库: `ssekify` (app.sse)
- 初始化位置: `app.ts → willReady()`
- Redis 发布订阅: 跨实例消息同步

**服务端实现 - 建立 SSE 连接**（参考 `app/controller/internal/sseController.ts`）:

```typescript
// 路由配置（app/routes/internal/index.ts）
const baseAuth = app.middleware.userAuth({ level: 'basic' });
sub.get('/sse', baseAuth, internal.sseController.stream);

// 控制器实现
import { Controller } from 'egg';
import { PassThrough } from 'stream';

export default class SseController extends Controller {
    public async stream() {
        const { ctx, app } = this;
        ctx.body = new PassThrough();  // 🔴 创建流
        const tag = 'internal.sse.stream';
        
        try {
            // 1. 获取用户 ID
            const userId = ctx.query.userId || ctx.state.user?._id?.toString();
            if (!userId) {
                throw ctx.fail('userId is required');
            }
            
            // 2. 注册 SSE 连接
            app.sse.registerConnection(userId, ctx.res, { 
                rooms: ['global']  // 可选：加入房间
            });
            
            ctx.logger.info(`${tag} open: user=${userId}`);
            
            // 3. 监听断开
            ctx.res.on('close', () => {
                ctx.logger.info(`${tag} closed: user=${userId}`);
            });
            
            // 4. 发送初始心跳
            ctx.body.write(`data: ${JSON.stringify({ type: 'connected', time: new Date() })}\n\n`);
            
        } catch (err) {
            return ctx.error(tag, err, 'SSE 连接失败');
        }
    }
}
```

**服务端实现 - 推送消息**（参考 `app/controller/internal/itineraryController.ts`）:

```typescript
// 路由配置（内部鉴权）
const internalAuth = app.middleware.internalAuth();
sub.post('/itinerary/callback/progress', internalAuth, itinerary.progress);

// 控制器实现（Agent 回调场景）
export default class ItineraryController extends Controller {
    public async progress() {
        const { ctx, app } = this;
        const tag = 'internal.itinerary.progress';
        
        try {
            // 1. 参数校验
            const { Joi, validateJoi } = ctx as any;
            const value = await validateJoi(Joi.object({
                type: Joi.string().valid('itinerary').required(),
                phase: Joi.string().valid('start', 'progress', 'done', 'error').required(),
                user_id: Joi.string().required(),
                request_id: Joi.string().required(),
                payload: Joi.object().optional(),
                error: Joi.any().optional(),
            }), 'body');
            
            const { user_id, request_id, payload, phase, error } = value;
            
            // 2. 发布 SSE 消息（跨实例广播）
            app.sse.publish(
                {
                    type: 'itinerary',
                    requestId: request_id,
                    phase,
                    payload,
                    error,
                },
                [user_id]  // 🔴 目标用户 ID 数组
            );
            
            return ctx.success({ status: 'published' });
            
        } catch (err) {
            return ctx.error(tag, err, '推送失败');
        }
    }
}
```

**客户端对接**:
```typescript
// 建立连接（支持 Query 传 Token）
const token = localStorage.getItem('token');
const userId = getUserId();

const eventSource = new EventSource(
    `/internal/sse?userId=${userId}&authorization=Bearer ${token}`
);

// 监听消息
eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('SSE message:', data);
    
    if (data.type === 'itinerary') {
        handleItineraryUpdate(data);
    }
};

// 监听错误（浏览器会自动重连）
eventSource.onerror = (error) => {
    console.error('SSE error:', error);
};

// 断开连接
eventSource.close();
```

**SSE 高级特性**:
```typescript
// 1. 房间机制（分组推送）
app.sse.registerConnection(userId, ctx.res, { 
    rooms: ['trip-editing', `project-${projectId}`] 
});
app.sse.publishToRoom('trip-editing', data);

// 2. 在线状态检查
if (app.sse.isUserOnline(userId)) {
    app.sse.publish(data, [userId]);
}

// 3. 批量推送
app.sse.publishBatch([
    { data: msg1, userIds: [user1] },
    { data: msg2, userIds: [user2, user3] }
]);
```

**强制规则** 🔴:
1. SSE 连接必须鉴权（使用 userAuth）
2. 禁止在 SSE 连接中进行重业务逻辑
3. 消息推送必须指定目标用户
4. 连接断开必须记录日志
5. 所有消息必须包含 `type` 字段

### 9. HTTP 请求规范（httpHelper）

**注入方式**: 通过 `httpHelper` 中间件全局注入 `ctx.http`

**参考**: `app/middleware/httpHelper.ts` 和 `chat/README.md`

**方法总览**:

| 方法 | 用途 | 返回值 |
|------|-----|-------|
| `postJSON` | POST JSON 数据 | `Promise<any>` |
| `getJSON` | GET JSON 数据 | `Promise<any>` |
| `fetchJSON` | 通用 JSON 请求 | `Promise<any>` |
| `getStream` | GET 流数据 | `Promise<{ stream, response, ... }>` |
| `download` | 下载文件 | `Promise<{ stream, response, ... }>` |
| `postForm` | POST 表单数据 | `Promise<any>` |
| `getText` | GET 纯文本 | `Promise<string>` |
| `postText` | POST 纯文本 | `Promise<string>` |

**标准 JSON 请求**:
```typescript
public async callUpstream() {
    const { ctx } = this;
    const tag = 'home.trip.callUpstream';
    
    try {
        const data = await ctx.http.postJSON(
            tag,
            'https://api.example.com/trips',
            { trip_name: '东京之旅', days: 7 },
            {
                timeoutMs: 15000,
                retries: 1,
                idempotencyKey: uuid(),
                expectedStatuses: [200, 201],
                map4xxToFail: true,
            }
        );
        
        return ctx.success(data);
    } catch (err) {
        return ctx.error(tag, err, '上游调用失败');
    }
}
```

**流式下载**:
```typescript
public async downloadFile() {
    const { ctx } = this;
    const tag = 'home.media.download';
    
    try {
        const { stream, contentType, contentLength } = await ctx.http.download(
            tag,
            fileUrl,
            { timeoutMs: 30000 }
        );
        
        ctx.set('Content-Type', contentType || 'application/octet-stream');
        if (contentLength) {
            ctx.set('Content-Length', String(contentLength));
        }
        ctx.set('Content-Disposition', 'attachment; filename="file.pdf"');
        
        ctx.body = stream;
        
    } catch (err) {
        return ctx.error(tag, err, '下载失败');
    }
}
```

**表单上传**:
```typescript
public async uploadFile() {
    const { ctx } = this;
    const tag = 'home.media.upload';
    
    try {
        const fd = new (global as any).FormData();
        fd.append('file', fileBuffer, 'avatar.jpg');
        fd.append('category', 'avatar');
        
        const result = await ctx.http.postForm(
            tag,
            'https://api.example.com/upload',
            fd,
            { timeoutMs: 30000 }
        );
        
        return ctx.success(result);
    } catch (err) {
        return ctx.error(tag, err, '上传失败');
    }
}
```

**错误处理**:
```typescript
try {
    const data = await ctx.http.postJSON(tag, url, payload);
    return ctx.success(data);
} catch (err) {
    // 4xx: ctx.fail 抛出的业务错误（不重试）
    // 5xx/网络/超时: 已按配置重试，仍失败则抛出 Error（附 status）
    return ctx.error(tag, err, '上游处理失败');
}
```

### 10. 接口开发检查清单

#### 开发前检查 ✅
- [ ] 确认 Model 是否存在（不存在则创建）
- [ ] 确认路由分组（home/admin/internal）
- [ ] 确认鉴权方式（public/basic/strict/dbToken/internalAuth）
- [ ] 确认是否需要 SSE 推送

#### Model 定义检查 ✅
- [ ] 包含必备字段（del_flag, created_by, updated_by）
- [ ] 启用 timestamps（created_at, updated_at）
- [ ] 查询字段添加索引
- [ ] 枚举字段使用 enum 约束
- [ ] 字段命名符合规范

#### 路由配置检查 ✅
- [ ] 路由文件放在正确目录
- [ ] 使用 RouterGroup 分组
- [ ] 正确应用中间件
- [ ] RESTful 风格命名

#### 控制器实现检查 ✅
- [ ] 定义清晰的 tag（格式：`分组.控制器.方法`）
- [ ] 使用 try-catch 包裹
- [ ] 参数校验使用 ctx.validateJoi
- [ ] 数据库操作使用 ctx.utilsCrud
- [ ] 成功使用 ctx.success
- [ ] 失败使用 throw ctx.fail
- [ ] 异常使用 ctx.error 兜底
- [ ] 记录关键日志

#### 参数校验检查 ✅
- [ ] 所有必填参数使用 .required()
- [ ] 字符串参数使用 .trim()
- [ ] 数值参数设置范围
- [ ] 枚举参数使用 .valid()
- [ ] 数组参数限制长度
- [ ] 自定义错误消息

#### 响应处理检查 ✅
- [ ] 成功后 return ctx.success
- [ ] 失败 throw ctx.fail
- [ ] 异常 return ctx.error
- [ ] 不直接设置 ctx.body

#### SSE 实现检查 ✅（如适用）
- [ ] 使用 PassThrough 创建流
- [ ] 调用 app.sse.registerConnection
- [ ] 监听 ctx.res.on('close')
- [ ] 消息包含 type 字段
- [ ] 记录连接/断开日志
- [ ] 使用 userAuth 鉴权

#### 测试与文档检查 ✅
- [ ] 使用 .http 文件手动测试
- [ ] 测试所有路径（成功/失败/边界）
- [ ] 更新 CHANGELOG.md
- [ ] 更新 README.md（如有 API 变更）
- [ ] 检查日志无敏感信息

---

## 项目特定规则

### TypeScript 路径别名（必须遵循）

```typescript
// ✅ 正确：使用路径别名
import { TripStatusEnum } from 'enum/trip/trip_status'
import ExError from 'utils/ex-error/ex_error'

// ❌ 错误：使用相对路径穿越多层
import { TripStatusEnum } from '../../../typings/enum/trip/trip_status'
```

### 错误处理（必须遵循）

使用 `ExError` 自定义错误类，保留错误原因链：

```typescript
import ExError from 'utils/ex-error/ex_error'

try {
    const result = await externalApiCall()
} catch (error) {
    // ✅ 正确：保留原始错误
    throw new ExError('EXTERNAL_API_ERROR', '调用外部 API 失败', { cause: error })
}

// ❌ 错误：丢失错误上下文
throw new Error('调用外部 API 失败')
```

### 日志安全（必须遵循）

日志中禁止记录敏感信息：

```typescript
// ❌ 错误：记录完整 URL（可能包含 token）
this.ctx.logger.info('请求 OpenAI API', url)

// ✅ 正确：去敏后记录
this.ctx.logger.info('请求 OpenAI API', { 
    endpoint: '/v1/chat/completions',
    model: 'gpt-4'
})

// ❌ 错误：记录密码
this.ctx.logger.info('用户登录', { username, password })

// ✅ 正确：不记录密码
this.ctx.logger.info('用户登录', { username })
```

---

**参考文档**: 
- [chat/README.md](../../chat/README.md) - 完整的中间件使用文档
- [guidelines/v2.md](../guidelines/v2.md) - 通用开发规范

export default class AppBootHook implements ILifeCycleBoot {
    async didLoad() {
        // ✅ 同步加载配置（确保启动顺序）
        const nacosConfig = await nacosClient.getConfig({
            dataId: 'chat-service',
            group: 'DEFAULT_GROUP'
        })
        
        // ✅ 订阅配置热更新
        nacosClient.subscribe({
            dataId: 'chat-service',
            group: 'DEFAULT_GROUP'
        }, content => {
            this.app.logger.info('Nacos 配置更新', content)
        })
    }
}
```

### 环境变量

敏感信息通过环境变量注入：

```bash
# .env (本地开发，不提交到版本控制)
OPENAI_API_KEY=sk-xxxxx
MONGODB_URI=mongodb://localhost:27017/chat
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 安全与合规

### 敏感信息清洗（强制）

1. **API Keys**: 禁止硬编码，使用环境变量
2. **日志去敏**: 使用查询形状而非具体值
   ```typescript
   // ❌ 错误
   logger.info('查询用户', { email: 'user@example.com', phone: '13812345678' })
   
   // ✅ 正确
   logger.info('查询用户', { queryType: 'email', resultCount: 1 })
   ```
3. **错误信息**: 不暴露内部路径和数据库结构
   ```typescript
   // ❌ 错误
   throw new Error(`文件不存在: /var/app/uploads/secret.pdf`)
   
   // ✅ 正确
   throw new ExError('FILE_NOT_FOUND', '请求的文件不存在')
   ```

### 输入校验（强制）

所有用户输入必须校验：

- **类型校验**: 使用 Joi schema
- **长度限制**: 防止 DoS 攻击
- **格式校验**: 正则表达式验证（日期、邮箱、手机号等）
- **范围校验**: 枚举值、数值范围

---

## 文档联动规则

### README.md 更新时机
- ✅ 新增公开 API 接口
- ✅ 修改接口参数或返回值
- ✅ 修改默认配置值
- ✅ 修改环境变量
- ✅ 更新回归测试清单

### CHANGELOG.md 更新时机（强制）
- 🔴 **所有对外可见变更**都必须记录在 `[Unreleased]` 部分
- 分类标签：
  - `Added` - 新增功能
  - `Changed` - 功能变更
  - `Fixed` - Bug 修复
  - `Deprecated` - 功能弃用
  - `Removed` - 功能移除
  - `Security` - 安全修复

示例：
```markdown
## [Unreleased]

### Fixed - 2025-11-03

#### 修复 addDay 方法导致日期格式不一致问题

**问题描述**: ...
**根本原因**: ...
**修复方案**: ...
**相关文档**: bug-analysis/2025-11-03-xxx.md
```

### Bug 分析文档（强制）

所有 Bug 修复必须创建 `bug-analysis/YYYY-MM-DD-问题描述.md`：

**必填内容**:
1. 问题描述（现象、复现步骤）
2. 根本原因分析（Why - 为什么会出现）
3. 修复方案（How - 如何修复，Why - 为什么选择这个方案）
4. 验证方法（手动测试步骤或验证脚本）
5. 影响对比（修复前后对比）

---

## AI 助手执行检查清单

### 阶段 1: 任务开始前
```yaml
[ ] 确认项目类型: Egg.js + TypeScript 微服务
[ ] 确认不需要测试脚本（chat 项目例外）
[ ] 确认测试方式: 手动测试 + API 文档
[ ] 识别场景类型: 功能/Bug/重构/文档
```

### 阶段 2: 代码修改时
```yaml
[ ] 🔴 使用 TypeScript 路径别名
[ ] 🔴 遵循 4 空格缩进
[ ] 🔴 使用 responseHelper 统一响应
[ ] 🔴 使用 Joi 进行参数校验
[ ] 🔴 使用 ExError 处理错误并保留 cause
[ ] 🔴 日志去敏（无密码/token/连接串）
[ ] 🟠 注释使用中文 + 英文术语
```

### 阶段 3: 文档更新（替代测试）
```yaml
[ ] 🔴 更新 CHANGELOG.md [Unreleased]
    - 分类: Added/Changed/Fixed/Deprecated/Removed
    - 格式: - [类型] 简短描述
[ ] 🟠 更新 README.md (如果 API 变更)
    - API 参数/返回值
    - 回归测试清单
    - 配置项说明
[ ] 🔴 创建 Bug 分析文档 (如果是 Bug 修复)
    - bug-analysis/YYYY-MM-DD-问题描述.md
    - 包含：问题/原因/方案/验证/对比
[ ] 🟡 更新类型声明 (typings/)
```

### 阶段 4: 提交前验证
```yaml
[ ] 🔴 TypeScript 编译通过（npm run tsc）
[ ] 🔴 ESLint 检查通过（npm run lint）
[ ] 🔴 无敏感信息泄露（日志/注释/配置）
[ ] 🔴 文档与代码一致（API 签名/参数/返回值）
[ ] ❌ 不需要运行测试脚本（chat 项目例外）
[ ] ❌ 不需要创建测试文件（chat 项目例外）
```

---

## 常见问题 (FAQ)

### Q: 为什么 chat 项目不需要测试脚本？
**A**: 
1. **依赖复杂**: 需要 Nacos、MongoDB、Redis、WebSocket 等完整运行时环境
2. **集成性强**: 大量外部 API 调用（OpenAI、Google Maps、Pexels 等）
3. **Mock 成本高**: Mock 所有依赖的成本远超收益
4. **测试替代方案**:
   - ✅ TypeScript 类型检查
   - ✅ ESLint 静态分析
   - ✅ 详细的 API 文档和回归测试清单
   - ✅ Bug 分析文档追踪问题

### Q: 如何保障代码质量？
**A**:
1. **开发阶段**: TypeScript 类型检查 + ESLint
2. **提交阶段**: 代码审查 + CHANGELOG 记录
3. **上线前**: 手动回归测试（参考 README.md 测试清单）
4. **上线后**: 日志监控 + Bug 分析文档

### Q: 修复 Bug 后需要做什么？
**A**:
1. 🔴 修改代码并添加注释
2. 🔴 创建 Bug 分析文档（bug-analysis/*.md）
3. 🔴 更新 CHANGELOG.md [Unreleased]
4. 🟠 更新 README.md（如果影响 API 或测试清单）
5. 🟠 手动验证修复效果（参考分析文档的验证方法）

---

## 参考文档

- **通用规范**: `.github/guidelines.md`
- **API 文档**: `chat/README.md`
- **变更日志**: `chat/CHANGELOG.md`
- **Bug 分析**: `chat/bug-analysis/*.md`
- **Egg.js 官方文档**: https://www.eggjs.org/zh-CN
- **ShareDB 文档**: https://share.github.io/sharedb/

---

**版本**: v1.0.0  
**创建日期**: 2025-11-03  
**适用对象**: GitHub Copilot / Claude / 其他 AI 助手  
**维护者**: Chat 服务开发团队

