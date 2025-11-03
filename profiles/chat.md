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

## 项目特定规则

### TypeScript 路径别名（必须遵循）

```typescript
// ✅ 正确：使用路径别名
import { TripStatusEnum } from 'enum/trip/trip_status'
import { TripService } from '../service/trip/TripService'
import ExError from 'utils/ex-error/ex_error'

// ❌ 错误：使用相对路径穿越多层
import { TripStatusEnum } from '../../../typings/enum/trip/trip_status'
```

### 统一响应格式（必须遵循）

所有控制器方法必须使用 `responseHelper` 返回：

```typescript
import { responseHelper } from 'utils/response/response'

export default class TripController extends Controller {
    public async getTrip() {
        const { ctx } = this
        try {
            const trip = await ctx.service.trip.tripService.getTripInfo(ctx.params.id)
            // ✅ 正确：使用 responseHelper
            return responseHelper.success(ctx, trip)
        } catch (error) {
            // ✅ 正确：统一错误处理
            return responseHelper.error(ctx, error)
        }
    }
}
```

### 参数校验（必须遵循）

使用 Joi 进行参数校验，校验器放在 `app/validator/` 目录：

```typescript
import * as Joi from 'joi'

export default class TripValidator {
    public async create() {
        const schema = Joi.object({
            trip_name: Joi.string().required().messages({
                'string.empty': '行程名称不能为空',
                'any.required': '行程名称是必填项'
            }),
            start_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
            end_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
        })
        
        await schema.validateAsync(this.ctx.request.body)
    }
}
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

### 数据库操作模式（推荐）

所有 Service 继承 `MongoDataModel` 基类：

```typescript
import MongoDataModel from '../MongoDataModel'
import { Context } from 'egg'

export default class TripService extends MongoDataModel {
    constructor(ctx: Context) {
        super(ctx)
        this.model = ctx.model.Trip
    }
    
    // 使用基类方法
    public async getTrip(id: string) {
        return this.queryData({ _id: id, del_flag: 0 })
    }
    
    // 自定义业务方法
    public async getTripWithDays(id: string) {
        return this.aggregateData([
            { $match: { _id: new Types.ObjectId(id) } },
            { $lookup: { /* ... */ } }
        ])
    }
}
```

### WebSocket 与协同编辑（项目特定）

使用 ShareDB 实现实时协同编辑：

```typescript
import * as ShareDB from 'sharedb'
import * as WebSocket from 'ws'

// 遵循 ShareDB OT (Operational Transformation) 协议
// 详细文档参考：README.md 相关章节
```

---

## 配置管理（项目特定）

### Nacos 动态配置

生产环境使用 Nacos 配置中心：

```typescript
// app.ts
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

