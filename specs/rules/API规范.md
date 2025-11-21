# v3 API规范

> **文件**: specs/rules/API规范.md  
> **版本**: v3.0  
> **日期**: 2025-11-20  
> **说明**: API接口和Swagger文档生成规范

---

## 📑 目录导航

> 🔴 = 必须遵守 | 🟡 = 建议遵守 | 🟢 = 参考

- [RESTful API 设计规范](#-restful-api-设计规范) 🔴 - URL/方法/状态码
  - [URL 设计](#url-设计) 🔴 - 复数名词，最多3层
  - [HTTP 方法规范](#http-方法规范) 🔴 - GET/POST/PUT/DELETE语义
  - [HTTP 状态码规范](#http-状态码规范) 🔴 - 200/201/400/401/404/500
  - [请求/响应格式](#请求响应格式) 🔴 - 统一JSON格式
- [Swagger 文档自动生成](#-swagger-文档自动生成) 🔴 - STEP 15自动生成
  - [OpenAPI 3.0 规范](#openapi-30-规范) 🔴 - 标准格式
  - [信息来源](#信息来源) 🔴 - JSDoc→路由→类型定义
  - [自动生成流程](#自动生成流程) 🔴 - 扫描代码自动生成
  - [输出位置](#输出位置) 🔴 - /docs/{模块名}/api/openapi.yaml
- [认证授权规范](#-认证授权规范) 🔴 - JWT Token
- [错误处理规范](#-错误处理规范) 🔴 - 统一错误码
- [API 文档示例](#-api-文档示例) 🟡 - 参考模板
- [Profile 优先](#-profile-优先) 🟡 - 项目可自定义规范

---

## 📚 相关规范文件

**API开发时必须配合使用**:
- 📦 [流程.md](../core/流程.md) 🔴 - STEP 15生成API文档
- 📦 [意图分类.md](../core/意图分类.md) 🔴 - Intent-07/17需要
- 📐 [代码规范.md](./代码规范.md) 🔴 - API代码质量
- 📐 [测试规范.md](./测试规范.md) 🔴 - API测试覆盖
- 📐 [文档规范.md](./文档规范.md) 🔴 - API文档格式

**Profile优先**:
- 🔴 如果项目使用GraphQL/gRPC，使用项目规范

---

## 📋 RESTful API 设计规范

### URL 设计

```yaml
资源命名:
  格式: 复数名词
  示例: /api/users, /api/orders, /api/products
  禁止: /api/user, /api/getUsers, /api/user_list

URL层级:
  最多: 3层
  示例: 
    ✅ /api/users/{id}/orders
    ✅ /api/users/{id}/orders/{orderId}
    ❌ /api/users/{id}/orders/{orderId}/items/{itemId}/details

路径参数:
  格式: {参数名}
  示例: /api/users/{userId}
  类型: 通常是ID

查询参数:
  用途: 过滤、排序、分页
  示例: 
    /api/users?status=active
    /api/users?page=1&pageSize=20
    /api/users?sort=createdAt&order=desc

动作表示:
  使用: HTTP方法，而非URL
  
  ✅ 好:
    GET /api/users/{id}
    DELETE /api/users/{id}
  
  ❌ 不好:
    GET /api/getUser/{id}
    POST /api/deleteUser/{id}
```

### HTTP 方法规范

```yaml
GET:
  用途: 获取资源
  特性: 幂等、安全
  
  示例:
    GET /api/users - 获取用户列表
    GET /api/users/{id} - 获取单个用户
    GET /api/users/{id}/orders - 获取用户的订单

POST:
  用途: 创建资源
  特性: 非幂等
  
  示例:
    POST /api/users - 创建用户
    POST /api/orders - 创建订单

PUT:
  用途: 完整更新资源
  特性: 幂等
  
  示例:
    PUT /api/users/{id} - 完整更新用户
  
  要求: 必须提供完整的资源数据

PATCH:
  用途: 部分更新资源
  特性: 幂等
  
  示例:
    PATCH /api/users/{id} - 部分更新用户
  
  要求: 只提供要更新的字段

DELETE:
  用途: 删除资源
  特性: 幂等
  
  示例:
    DELETE /api/users/{id} - 删除用户
```

### HTTP 状态码规范

```yaml
成功状态码 (2xx):
  200 OK:
    用途: 请求成功
    使用: GET, PUT, PATCH, DELETE
    
  201 Created:
    用途: 资源创建成功
    使用: POST
    响应: 包含Location header
    
  204 No Content:
    用途: 请求成功，无返回内容
    使用: DELETE

客户端错误 (4xx):
  400 Bad Request:
    用途: 请求参数错误
    示例: 缺少必填字段、字段类型错误
    
  401 Unauthorized:
    用途: 未认证
    示例: 缺少token、token无效
    
  403 Forbidden:
    用途: 无权限
    示例: 用户没有访问该资源的权限
    
  404 Not Found:
    用途: 资源不存在
    示例: 请求的用户ID不存在
    
  409 Conflict:
    用途: 资源冲突
    示例: 邮箱已存在
    
  422 Unprocessable Entity:
    用途: 语义错误
    示例: 业务规则验证失败
    
  429 Too Many Requests:
    用途: 请求过于频繁
    示例: 超过API限流

服务器错误 (5xx):
  500 Internal Server Error:
    用途: 服务器内部错误
    
  503 Service Unavailable:
    用途: 服务暂时不可用
    示例: 维护中、过载
```

---

## 📝 请求和响应格式

### 请求格式

```yaml
Content-Type:
  JSON: application/json
  表单: application/x-www-form-urlencoded
  文件: multipart/form-data

请求头 (Headers):
  Authorization: Bearer {token}
  Content-Type: application/json
  Accept: application/json
  Accept-Language: zh-CN

请求体 (Body) - POST/PUT/PATCH:
  格式: JSON
  
  示例:
    {
      "email": "user@example.com",
      "name": "Test User",
      "age": 25
    }

查询参数 (Query) - GET:
  分页:
    page: 页码（从1开始）
    pageSize: 每页数量
    
  排序:
    sort: 排序字段
    order: asc 或 desc
    
  过滤:
    status: 状态值
    startDate: 开始日期
    endDate: 结束日期
    
  搜索:
    q: 搜索关键词
    
  示例:
    GET /api/users?page=1&pageSize=20&sort=createdAt&order=desc&status=active
```

### 响应格式

```yaml
统一响应结构:
  成功响应:
    {
      "success": true,
      "data": { /* 数据 */ },
      "message": "操作成功"
    }
  
  列表响应:
    {
      "success": true,
      "data": {
        "items": [ /* 数据列表 */ ],
        "pagination": {
          "page": 1,
          "pageSize": 20,
          "total": 100,
          "totalPages": 5
        }
      }
    }
  
  错误响应:
    {
      "success": false,
      "error": {
        "code": "USER_NOT_FOUND",
        "message": "用户不存在",
        "details": { /* 详细错误信息 */ }
      }
    }

响应头:
  Content-Type: application/json; charset=utf-8
  X-Request-Id: {唯一请求ID}
  X-Response-Time: {响应时间ms}
```

---

## 🔐 认证和授权

### 认证方式

```yaml
推荐: JWT (JSON Web Token)

请求头:
  Authorization: Bearer {token}

Token格式:
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature

Token内容:
  {
    "userId": "123",
    "email": "user@example.com",
    "role": "user",
    "exp": 1640000000
  }

Token过期:
  access_token: 24小时
  refresh_token: 7天
```

### 权限验证

```yaml
权限级别:
  public: 无需认证
  authenticated: 需要登录
  admin: 需要管理员权限
  owner: 需要资源所有者

检查逻辑:
  1. 验证token有效性
  2. 检查token是否过期
  3. 检查用户角色
  4. 检查资源权限（如需要）

错误响应:
  401: 未认证（token无效/过期）
  403: 无权限（角色不足/非所有者）
```

---

## 📄 Swagger/OpenAPI 规范

### Swagger 版本

```yaml
使用版本: OpenAPI 3.0

输出位置:
  /docs/{模块名}/api/openapi.yaml

示例位置:
  /docs/{模块名}/examples/
```

### 自动生成规则

```yaml
信息来源优先级:
  1. 代码注释（JSDoc/装饰器）
  2. 路由定义
  3. TypeScript类型定义
  4. 请求/响应验证schema

必须包含的信息:
  - API基本信息（title, version, description）
  - 服务器地址
  - 认证方式
  - 所有API端点
  - 请求参数
  - 请求体schema
  - 响应schema
  - 错误响应
  - 示例数据
```

### Swagger 文档结构

```yaml
openapi: 3.0.0

info:
  title: User API
  version: 1.0.0
  description: 用户管理API接口
  contact:
    name: API Support
    email: api@example.com

servers:
  - url: https://api.example.com/v1
    description: 生产环境
  - url: https://staging.example.com/v1
    description: 测试环境

tags:
  - name: users
    description: 用户相关接口
  - name: orders
    description: 订单相关接口

paths:
  /users:
    get:
      summary: 获取用户列表
      tags: [users]
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: pageSize
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
    
    post:
      summary: 创建用户
      tags: [users]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: 创建成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'

components:
  schemas:
    User:
      type: object
      required:
        - id
        - email
        - name
      properties:
        id:
          type: string
          example: "123"
        email:
          type: string
          format: email
          example: "user@example.com"
        name:
          type: string
          example: "Test User"
        age:
          type: integer
          minimum: 0
          maximum: 150
          example: 25
        createdAt:
          type: string
          format: date-time
          example: "2025-11-20T10:00:00Z"
    
    UserListResponse:
      type: object
      properties:
        success:
          type: boolean
          example: true
        data:
          type: object
          properties:
            items:
              type: array
              items:
                $ref: '#/components/schemas/User'
            pagination:
              $ref: '#/components/schemas/Pagination'
    
    Pagination:
      type: object
      properties:
        page:
          type: integer
          example: 1
        pageSize:
          type: integer
          example: 20
        total:
          type: integer
          example: 100
        totalPages:
          type: integer
          example: 5
    
    ErrorResponse:
      type: object
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          properties:
            code:
              type: string
              example: "USER_NOT_FOUND"
            message:
              type: string
              example: "用户不存在"
  
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

security:
  - BearerAuth: []
```

### 从代码注释生成

```yaml
JavaScript/TypeScript - JSDoc:
  /**
   * 获取用户信息
   * 
   * @route GET /api/users/{id}
   * @tags users
   * @param {string} id.path.required - 用户ID
   * @returns {User} 200 - 成功返回用户信息
   * @returns {Error} 404 - 用户不存在
   * @security BearerAuth
   */
  async getUserById(req, res) {
    // ...
  }

TypeScript - 装饰器:
  @Get('/users/:id')
  @Summary('获取用户信息')
  @Tags('users')
  @Params({
    id: { type: 'string', required: true, description: '用户ID' }
  })
  @Returns(200, User, '成功返回用户信息')
  @Returns(404, Error, '用户不存在')
  @Security('BearerAuth')
  async getUserById(@Param('id') id: string) {
    // ...
  }

Python - docstring:
  @app.route('/api/users/<id>', methods=['GET'])
  def get_user_by_id(id):
      """
      获取用户信息
      ---
      tags:
        - users
      parameters:
        - name: id
          in: path
          type: string
          required: true
      responses:
        200:
          description: 成功返回用户信息
          schema:
            $ref: '#/definitions/User'
        404:
          description: 用户不存在
      """
      # ...
```

---

## 🔍 API 文档生成逻辑

### 生成流程

```yaml
STEP 1: 扫描路由定义
  - 识别所有API端点
  - 提取HTTP方法
  - 提取路径参数

STEP 2: 分析代码注释
  - 提取JSDoc/docstring
  - 解析@route, @param, @returns
  - 提取示例数据

STEP 3: 分析类型定义
  - TypeScript接口
  - JSON Schema
  - 验证规则

STEP 4: 生成Schema
  - 请求参数schema
  - 请求体schema
  - 响应schema
  - 错误响应schema

STEP 5: 生成示例
  - 基于schema生成示例
  - 使用注释中的示例
  - 生成curl命令示例

STEP 6: 输出文档
  - 生成openapi.yaml
  - 生成endpoints.md
  - 生成示例文件
```

### 触发条件

```yaml
IF: 意图涉及API开发
  Intent-02: 开发新功能（包含API）
  Intent-04: 生成文档
  Intent-17: API文档生成

THEN:
  自动生成Swagger文档
  
位置: STEP 15 生成和更新文档

输出:
  /docs/{模块名}/api/openapi.yaml
  /docs/{模块名}/api/endpoints.md
  /docs/{模块名}/examples/requests.http
```

---

## 📊 API 设计最佳实践

### 版本控制

```yaml
推荐方式: URL路径
  示例: /api/v1/users, /api/v2/users

不推荐: Header版本
  示例: Accept: application/vnd.api+json;version=1

版本策略:
  - 重大变更（Breaking Changes）→ 新版本
  - 向后兼容变更 → 同版本
  - 保持至少2个版本可用
```

### 分页

```yaml
请求参数:
  page: 页码（从1开始）
  pageSize: 每页数量（默认20，最大100）

响应格式:
  {
    "data": {
      "items": [...],
      "pagination": {
        "page": 1,
        "pageSize": 20,
        "total": 100,
        "totalPages": 5,
        "hasNext": true,
        "hasPrev": false
      }
    }
  }

分页链接:
  Link: <https://api.example.com/users?page=2>; rel="next",
        <https://api.example.com/users?page=1>; rel="first",
        <https://api.example.com/users?page=5>; rel="last"
```

### 过滤和搜索

```yaml
过滤:
  单字段: ?status=active
  多字段: ?status=active&role=admin
  
  操作符:
    等于: ?age=25
    大于: ?age[gt]=25
    小于: ?age[lt]=30
    包含: ?tags[in]=tag1,tag2
    范围: ?price[gte]=10&price[lte]=100

搜索:
  全文搜索: ?q=关键词
  字段搜索: ?name[like]=test

排序:
  单字段: ?sort=createdAt&order=desc
  多字段: ?sort=status,createdAt&order=asc,desc
```

### 批量操作

```yaml
批量创建:
  POST /api/users/batch
  Body: { "items": [...] }

批量更新:
  PATCH /api/users/batch
  Body: { "ids": [...], "updates": {...} }

批量删除:
  DELETE /api/users/batch
  Body: { "ids": [...] }

响应:
  {
    "success": true,
    "data": {
      "successful": 10,
      "failed": 2,
      "errors": [
        { "id": "123", "error": "..." }
      ]
    }
  }
```

### 错误处理

```yaml
统一错误格式:
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "输入验证失败",
      "details": {
        "email": ["邮箱格式不正确"],
        "age": ["年龄必须大于0"]
      },
      "timestamp": "2025-11-20T10:00:00Z",
      "path": "/api/users",
      "requestId": "abc123"
    }
  }

错误码规范:
  格式: UPPER_SNAKE_CASE
  
  示例:
    USER_NOT_FOUND
    VALIDATION_ERROR
    UNAUTHORIZED
    PERMISSION_DENIED
    INTERNAL_ERROR
```

---

## ⚙️ 性能优化

### 缓存

```yaml
响应头:
  Cache-Control: public, max-age=3600
  ETag: "33a64df551425fcc55e4d42a148795d9"
  Last-Modified: Wed, 20 Nov 2025 10:00:00 GMT

条件请求:
  If-None-Match: "33a64df551425fcc55e4d42a148795d9"
  If-Modified-Since: Wed, 20 Nov 2025 10:00:00 GMT

响应:
  304 Not Modified (使用缓存)
  200 OK (返回新数据)
```

### 限流

```yaml
响应头:
  X-RateLimit-Limit: 1000
  X-RateLimit-Remaining: 999
  X-RateLimit-Reset: 1640000000

超限响应:
  429 Too Many Requests
  Retry-After: 3600
```

### 压缩

```yaml
请求头:
  Accept-Encoding: gzip, deflate

响应头:
  Content-Encoding: gzip
```

---

**文件创建**: 2025-11-20  
**最后更新**: 2025-11-20  
**状态**: ✅ 完整

