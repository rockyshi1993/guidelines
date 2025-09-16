# Junie Profile（chatAI）

## 关键目录与入口
- 前端页面：src\pages\index\index.js
- 服务端路由：src\routes\api\chat\*.js（/api/chat、/api/chat/replicate、/api/chat/flight）
- 包清单：package.json（ndsk 框架）

## 运行与构建（Windows/PowerShell）
- 安装：`npm ci`
- 开发：`npm run dev`
- 构建：`npm run build`
- 启动：`npm start`

## 测试命令（临时）
- 暂无专用测试脚本；建议补充 `npm test`，引入契约测试。

## 运行时范围与依赖
- Node 18.x/20.x（LTS）
- 关键依赖：@ndsk/ndsk、replicate、react-markdown、ssekify

## 安全与配置
- 凭据通过环境变量注入：OPENAI_API_KEY、REPLICATE_API_TOKEN
- 严禁硬编码密钥；日志/注释去敏；保留 error cause

## 文档联动
- README：公共 API/默认值/示例变更时更新
- CHANGELOG：每次对外可见变更都更新 [Unreleased]
- STATUS：能力矩阵/路线图更新时同步

## 例外与覆盖
- 暂无对通用规则的例外；如需例外，请补充此处条目、理由与影响面。