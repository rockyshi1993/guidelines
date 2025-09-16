# gRPC 项目 Profile（Junie 自定义）

本文件用于让 Junie 在 D:\\Project\\gRPC 下自动命中项目配置，并“指向当前方案（方案选型与目录组织）”。

## 目标与范围
- 在同一仓库下维护 gRPC 跨语言示例：Node（Egg.js）与 Python（FastAPI）。
- 共享 proto/hello.proto；Node 动态加载，Python 通过 grpcio-tools 生成。
- FastAPI 提供 HTTP → gRPC 的转调；可选扩展双向流与 Python 侧 gRPC 服务端。

## 关键目录与入口
- proto/hello.proto：统一的 gRPC 接口定义。
- node_server/：Egg.js 应用，负责启动 gRPC 服务端（50051）。
    - app.js：Egg 生命周期内启动/关闭 gRPC Server。
    - 依赖：@grpc/grpc-js、@grpc/proto-loader、egg。
- python_server/：FastAPI 应用，作为 gRPC 客户端（HTTP 8000 → gRPC 50051）。
    - main.py：提供 /call-grpc/{name}；使用 grpc.aio 调用 Node。
    - hello_pb2.py、hello_pb2_grpc.py：由 proto 生成。

当前仓库如未创建上述文件，请参考 README 的“落地步骤”进行初始化；本 Profile 先行指向“当前方案”。

## 运行时与工具链
- Node：18.x/20.x（LTS）
- Python：3.10/3.12
- 操作系统：开发默认 Windows（PowerShell）；CI 建议同时覆盖 Ubuntu（bash）。

## 安装与启动（Windows/PowerShell 优先）
1) Node（Egg.js）安装
```powershell
Set-Location D:\\Project\\gRPC\\node_server
npm ci
```
2) Python（FastAPI）安装
```powershell
Set-Location D:\\Project\\gRPC\\python_server
python -m venv .venv
. .venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
```
3) 生成 Python gRPC 代码（首次或 proto 变更后）
```powershell
Set-Location D:\\Project\\gRPC
python -m grpc_tools.protoc -I proto --python_out=python_server --grpc_python_out=python_server proto\\hello.proto
```
4) 启动顺序
- 先启动 Node（含 gRPC 50051）
```powershell
Set-Location D:\\Project\\gRPC\\node_server
npm run dev
```
- 再启动 Python（HTTP 8000）
```powershell
Set-Location D:\\Project\\gRPC\\python_server
. .venv\\Scripts\\Activate.ps1
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## 测试
- 访问 HTTP：`GET http://127.0.0.1:8000/call-grpc/Alice`，期望返回 `{"message":"Hello, Alice from Egg.js"}`。

## 构建/发布要点
- 变更 proto 后，需重新生成 Python 端 gRPC 代码（建议在 CI 中自动化）。
- 生产建议启用 TLS（Node: ServerCredentials.createSsl；Python: ssl_channel_credentials）。

## 与 README/CHANGELOG 的联动
- README：当公共 API/默认值/示例变更时更新（本项目主要为示例与指引）。
- CHANGELOG：对外可见变更（如目录与接口约定）建议记录在 [Unreleased] 下。

## 例外与覆盖（相对通用规范）
- 默认不将 Python 生成文件提交仓库，可选在 CI 生成；若选择入库，请在 README 标注。

## 快速落地清单（若仓库尚未创建代码）
- 创建以下文件与内容（摘要）：
    - proto/hello.proto：Greeter.SayHello、可选 Chat（双向流）。
    - node_server/app.js + 基本 Egg 脚手架（package.json、router/controller、config）。
    - python_server/main.py + requirements.txt。
- 具体示例与代码片段详见根级 README。
