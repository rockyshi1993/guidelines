#!/usr/bin/env node
/**
 * 规范一致性验证脚本 (Node.js 版本)
 * 用途: 自动检查 guidelines 规范的完整性和一致性
 * 版本: v1.0
 * 更新: 2025-01-29
 * 
 * 使用方法:
 *   node validate-specs.js                # 检查模式
 *   node validate-specs.js --fix          # 修复模式
 *   node validate-specs.js --verbose      # 详细输出
 *   node validate-specs.js --report       # 生成报告文件
 */

const fs = require('fs');
const path = require('path');

// 错误计数器
let errorCount = 0;
let warningCount = 0;
let fixCount = 0;

// 命令行参数
const args = process.argv.slice(2);
const mode = args.includes('--fix') ? 'fix' : 'check';
const verbose = args.includes('--verbose');
const generateReport = args.includes('--report');

// 颜色输出
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m'
};

function colorOutput(message, type = 'info') {
    const prefix = {
        success: '✅',
        error: '❌',
        warning: '⚠️ ',
        info: 'ℹ️ '
    }[type];

    const color = {
        success: colors.green,
        error: colors.red,
        warning: colors.yellow,
        info: colors.cyan
    }[type];

    console.log(`${color}${prefix} ${message}${colors.reset}`);
}

function addError(message) {
    errorCount++;
    colorOutput(message, 'error');
}

function addWarning(message) {
    warningCount++;
    colorOutput(message, 'warning');
}

function addFix(message) {
    fixCount++;
    colorOutput(message, 'success');
}

// =============================================================================
// 检查 1: Profile 文件结构完整性
// =============================================================================

function testProfileStructure() {
    colorOutput('\n═══ 检查 1: Profile 文件结构完整性 ═══', 'info');

    const profilesDir = path.join(__dirname, '..', 'profiles');

    if (!fs.existsSync(profilesDir)) {
        addError('profiles/ 目录不存在');
        return;
    }

    const files = fs.readdirSync(profilesDir)
        .filter(f => f.endsWith('.md') && f !== 'TEMPLATE-EXAMPLE.md');

    if (files.length === 0) {
        addWarning('未找到任何 Profile 文件');
        return;
    }

    colorOutput(`找到 ${files.length} 个 Profile 文件`, 'info');

    // 必需章节列表
    const requiredSections = [
        '## 关键目录与运行时',
        '## 本地与 CI 命令',
        '## 文档与版本'
    ];

    // 可选但重要的章节
    const importantSections = [
        '## MCP 配置',
        '## 架构规范',
        '## 测试框架',
        '## 例外与覆盖'
    ];

    files.forEach(file => {
        colorOutput(`\n检查文件: ${file}`, 'info');

        const filePath = path.join(profilesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // 检查必需章节
        requiredSections.forEach(section => {
            if (!content.includes(section)) {
                addError(`  缺少必需章节: ${section}`);
            } else if (verbose) {
                colorOutput(`  ✓ 包含: ${section}`, 'success');
            }
        });

        // 检查重要章节（警告）
        importantSections.forEach(section => {
            if (!content.includes(section)) {
                if (section === '## MCP 配置') {
                    addWarning(`  建议添加章节: ${section}（如果项目需要数据库操作）`);
                } else {
                    addWarning(`  建议添加章节: ${section}`);
                }
            } else if (verbose) {
                colorOutput(`  ✓ 包含: ${section}`, 'success');
            }
        });

        // 检查 MCP 配置格式（如果存在）
        if (content.includes('## MCP 配置')) {
            if (!content.includes('允许的 MCP 服务器:')) {
                addError('  MCP 配置缺少必填字段: 允许的 MCP 服务器');
            }

            if (!content.match(/数据库(\/资源)?:/)) {
                addError('  MCP 配置缺少必填字段: 数据库/资源');
            }

            if (!content.includes('用途:')) {
                addWarning('  MCP 配置缺少推荐字段: 用途');
            }
        }
    });
}

// =============================================================================
// 检查 2: copilot-instructions.md 引用正确性
// =============================================================================

function testInstructionsReferences() {
    colorOutput('\n═══ 检查 2: copilot-instructions.md 引用正确性 ═══', 'info');

    const instructionsFile = path.join(__dirname, '..', '..', '.github', 'copilot-instructions.md');

    if (!fs.existsSync(instructionsFile)) {
        addError('copilot-instructions.md 不存在');
        return;
    }

    const content = fs.readFileSync(instructionsFile, 'utf-8');

    // 检查 Profile 路径引用
    const profileReferences = content.match(/guidelines\/profiles\/<([^>]+)>\.md/g) || [];

    colorOutput(`找到 ${profileReferences.length} 处 Profile 路径引用`, 'info');

    if (verbose) {
        profileReferences.forEach(ref => {
            const placeholder = ref.match(/<([^>]+)>/)[1];
            colorOutput(`  ✓ 引用占位符: <${placeholder}>`, 'info');
        });
    }

    // 检查 guidelines/v2.md 引用
    const guidelinesReferences = content.match(/guidelines\/guidelines\/v2\.md(#\d+)?/g) || [];

    colorOutput(`找到 ${guidelinesReferences.length} 处 guidelines/v2.md 引用`, 'info');

    if (verbose) {
        guidelinesReferences.forEach(ref => {
            colorOutput(`  ✓ 引用: ${ref}`, 'info');
        });
    }

    // 检查场景引用完整性
    const requiredScenes = [
        '场景 0', '场景 0.1', '场景 0.5',
        '场景 A', '场景 B', '场景 C',
        '场景 D', '场景 E', '场景 F', '场景 G'
    ];

    requiredScenes.forEach(scene => {
        if (!content.includes(scene)) {
            addError(`缺少场景定义: ${scene}`);
        } else if (verbose) {
            colorOutput(`  ✓ 包含场景: ${scene}`, 'success');
        }
    });
}

// =============================================================================
// 检查 3: 场景触发器完整性
// =============================================================================

function testSceneTriggers() {
    colorOutput('\n═══ 检查 3: 场景触发器完整性 ═══', 'info');

    const instructionsFile = path.join(__dirname, '..', '..', '.github', 'copilot-instructions.md');

    if (!fs.existsSync(instructionsFile)) {
        addError('copilot-instructions.md 不存在');
        return;
    }

    const content = fs.readFileSync(instructionsFile, 'utf-8');

    // 必需的触发器组件
    const requiredComponents = {
        '场景 0': ['**触发条件**', '**强制执行顺序**', 'STEP 1', 'STEP 2', 'STEP 3', 'STEP 4', 'STEP 5', 'STEP 6'],
        '场景 A': ['**触发条件**', '**强制执行顺序**'],
        '场景 B': ['**触发条件**', '**强制执行顺序**'],
        '场景 C': ['**触发条件**', '**强制执行顺序**'],
        '场景 D': ['**触发条件**', '**强制检查项**'],
        '场景 E': ['**触发条件**', '**决策规则**']
    };

    Object.keys(requiredComponents).forEach(scene => {
        const sceneMatch = content.match(new RegExp(`### ${scene.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?(?=###|$)`));

        if (!sceneMatch) {
            addError(`未找到场景定义: ${scene}`);
            return;
        }

        const sceneContent = sceneMatch[0];

        requiredComponents[scene].forEach(component => {
            if (!sceneContent.includes(component)) {
                addError(`${scene} 缺少组件: ${component}`);
            } else if (verbose) {
                colorOutput(`  ✓ ${scene} 包含: ${component}`, 'success');
            }
        });
    });
}

// =============================================================================
// 检查 4: Markdown 链接有效性
// =============================================================================

function testMarkdownLinks() {
    colorOutput('\n═══ 检查 4: Markdown 链接有效性 ═══', 'info');

    const rootDir = path.join(__dirname, '..');
    const markdownFiles = [];

    // 递归查找 Markdown 文件
    function findMarkdownFiles(dir) {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
                findMarkdownFiles(filePath);
            } else if (file.endsWith('.md')) {
                markdownFiles.push(filePath);
            }
        });
    }

    findMarkdownFiles(rootDir);

    colorOutput(`找到 ${markdownFiles.length} 个 Markdown 文件`, 'info');

    let brokenLinks = 0;

    markdownFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');

        // 查找文件链接 [text](path)
        const links = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];

        links.forEach(link => {
            const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (!match) return;

            const linkPath = match[2];

            // 跳过外部链接
            if (linkPath.match(/^https?:\/\//)) return;

            // 跳过锚点链接
            if (linkPath.startsWith('#')) return;

            // 移除锚点部分
            const cleanPath = linkPath.replace(/#.*$/, '');

            // 解析相对路径
            const basePath = path.dirname(file);
            const fullPath = path.resolve(basePath, cleanPath);

            if (!fs.existsSync(fullPath)) {
                addWarning(`  断开的链接: ${linkPath} (在 ${path.basename(file)})`);
                brokenLinks++;
            } else if (verbose) {
                colorOutput(`  ✓ 有效链接: ${linkPath}`, 'success');
            }
        });
    });

    if (brokenLinks === 0) {
        colorOutput('所有文件链接有效', 'success');
    }
}

// =============================================================================
// 检查 5: MCP 配置规范性
// =============================================================================

function testMCPConfiguration() {
    colorOutput('\n═══ 检查 5: MCP 配置规范性 ═══', 'info');

    const profilesDir = path.join(__dirname, '..', 'profiles');

    if (!fs.existsSync(profilesDir)) return;

    const files = fs.readdirSync(profilesDir)
        .filter(f => f.endsWith('.md') && f !== 'TEMPLATE-EXAMPLE.md');

    files.forEach(file => {
        const filePath = path.join(profilesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // 检查是否有 MCP 配置
        if (content.includes('## MCP 配置')) {
            colorOutput(`\n检查 MCP 配置: ${file}`, 'info');

            // 检查服务器名称格式
            const serverMatch = content.match(/允许的 MCP 服务器:\s*`([^`]+)`/);
            if (serverMatch) {
                const serverName = serverMatch[1];

                // 验证服务器名称格式（应该是 mongodb-xxx 或类似）
                if (!serverName.match(/^[a-z]+-[a-z0-9]+$/)) {
                    addWarning(`  MCP 服务器名称可能不符合规范: ${serverName}（推荐格式: tool-project）`);
                } else if (verbose) {
                    colorOutput(`  ✓ MCP 服务器名称: ${serverName}`, 'success');
                }
            } else {
                addError('  MCP 服务器名称未用代码标记包裹');
            }

            // 检查数据库名称
            const dbMatch = content.match(/数据库(\/资源)?:\s*([^\s\r\n]+)/);
            if (dbMatch && verbose) {
                colorOutput(`  ✓ 数据库: ${dbMatch[2]}`, 'success');
            }

            // 检查用途说明
            const purposeMatch = content.match(/用途:\s*([^\r\n]+)/);
            if (purposeMatch) {
                const purpose = purposeMatch[1];
                if (purpose.length < 5) {
                    addWarning(`  用途说明过于简短: ${purpose}`);
                } else if (verbose) {
                    colorOutput(`  ✓ 用途: ${purpose}`, 'success');
                }
            }

            // 检查限制说明（可选）
            const restrictionsMatch = content.match(/限制:\s*([^\r\n]+)/);
            if (restrictionsMatch && verbose) {
                colorOutput(`  ✓ 限制: ${restrictionsMatch[1]}`, 'success');
            }
        }
    });
}

// =============================================================================
// 生成报告
// =============================================================================

function generateValidationReport() {
    const reportPath = path.join(__dirname, '..', 'validation-report.md');

    const report = `# 规范验证报告

**生成时间**: ${new Date().toISOString()}
**模式**: ${mode}

## 统计结果

- ✅ 成功: ${errorCount === 0 && warningCount === 0 ? '所有检查通过' : '部分检查失败'}
- ❌ 错误: ${errorCount}
- ⚠️  警告: ${warningCount}
${mode === 'fix' ? `- 🔧 修复: ${fixCount}` : ''}

## 检查项目

### 1. Profile 文件结构完整性
- 检查必需章节
- 检查重要章节
- 验证 MCP 配置格式

### 2. copilot-instructions.md 引用正确性
- 验证 Profile 路径引用
- 验证 guidelines/v2.md 引用
- 验证场景定义完整性

### 3. 场景触发器完整性
- 验证所有场景的触发条件
- 验证执行顺序定义
- 验证必需组件

### 4. Markdown 链接有效性
- 扫描所有 Markdown 文件
- 验证相对链接
- 检测断开的链接

### 5. MCP 配置规范性
- 验证服务器名称格式
- 验证必填字段
- 检查说明完整性

## 结论

${errorCount === 0 ? '✅ **验证通过** - 所有检查均通过' : `❌ **验证失败** - 发现 ${errorCount} 个错误`}

${warningCount > 0 ? `⚠️  **警告** - 发现 ${warningCount} 个警告` : ''}

---

*报告由 validate-specs.js 自动生成*
`;

    fs.writeFileSync(reportPath, report, 'utf-8');
    colorOutput(`\n✅ 报告已生成: ${reportPath}`, 'success');
}

// =============================================================================
// 主执行流程
// =============================================================================

function main() {
    colorOutput('═══════════════════════════════════════════════════', 'info');
    colorOutput('  规范一致性验证脚本 v1.0 (Node.js)', 'info');
    colorOutput(`  模式: ${mode}`, 'info');
    colorOutput('═══════════════════════════════════════════════════\n', 'info');

    // 执行所有检查
    testProfileStructure();
    testInstructionsReferences();
    testSceneTriggers();
    testMarkdownLinks();
    testMCPConfiguration();

    // 生成报告
    if (generateReport) {
        generateValidationReport();
    }

    // 输出总结
    colorOutput('\n═══════════════════════════════════════════════════', 'info');
    colorOutput('  验证完成', 'info');
    colorOutput('═══════════════════════════════════════════════════', 'info');

    console.log('\n统计结果:');
    console.log(`  ${errorCount === 0 ? colors.green : colors.red}错误: ${errorCount}${colors.reset}`);
    console.log(`  ${warningCount === 0 ? colors.green : colors.yellow}警告: ${warningCount}${colors.reset}`);

    if (mode === 'fix') {
        console.log(`  ${colors.green}修复: ${fixCount}${colors.reset}`);
    }

    console.log('');

    // 返回退出码
    if (errorCount > 0) {
        colorOutput(`验证失败 - 发现 ${errorCount} 个错误`, 'error');
        process.exit(1);
    } else if (warningCount > 0) {
        colorOutput(`验证通过（有警告） - 发现 ${warningCount} 个警告`, 'warning');
        process.exit(0);
    } else {
        colorOutput('验证通过 - 所有检查均通过', 'success');
        process.exit(0);
    }
}

// 执行主函数
main();
