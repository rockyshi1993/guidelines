# 使用说明 - [项目规范]

## 快速参考
- 📖 [完整规范文档](../guidelines/README.md) - 详细的项目规范（20个章节）
- 📁 [项目配置](../guidelines/profiles/) - 各项目的特定配置
- 🤖 [MCP 调用规则](../guidelines/mcp-rule.md) - AI 助手调用外部模型的规范

## 关键提示
1. **编码风格**: 4空格缩进，LF行尾，UTF-8编码，行宽≤100
2. **输入校验**: 进行严格的参数验证，使用合适的校验方案
3. **日志规范**: 仅输出形状/字段集合，不含敏感数据
4. **文档联动**: 修改 API 时必须同步更新 README.md 和 CHANGELOG.md
5. **测试覆盖**: 新增功能需提供测试用例和 examples/ 示例

## 强制检查清单
- [ ] 新增功能必须有测试用例（test/ 目录）
- [ ] 核心 API 变更必须更新 README + CHANGELOG
- [ ] Bug 修复需要使用分析模板记录
- [ ] 测试覆盖率 ≥60%（核心 API ≥70%）
- [ ] 提交前运行 npm test / npm run lint

## AI 自动规范检查
当检测到以下操作时，必须读取完整规范：
- 修改 API 接口 → 读取 [第3.1章](../guidelines/README.md#31-功能添加完整流程四要素代码-测试-示例-文档)（功能添加完整流程）
- Bug 修复 → 读取 [Bug 分析模板](../guidelines/templates/bug-fix-analysis-template.md)
- 新增测试 → 读取 [第7章](../guidelines/README.md#7-测试与质量)（测试与质量）
- 大规模编辑 → 读取 [第20章](../guidelines/README.md#20-大规模文件编辑策略ai-辅助开发)（大规模文件编辑策略）
