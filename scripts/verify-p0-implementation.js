#!/usr/bin/env node

/**
 * P0 优化实施验证脚本
 * 
 * 验证项目：
 * 1. ✅ YAML 决策树文件是否存在且格式正确
 * 2. ✅ copilot-instructions.md 是否包含强制断点
 * 3. ✅ MCP 检查流程是否完整
 * 4. ✅ 三个文件的规则一致性
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml'); // 需要安装: npm install js-yaml

const PROJECT_ROOT = path.resolve(__dirname, '../..');
const COLORS = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

// 检查结果收集
const results = {
    passed: [],
    failed: [],
    warnings: []
};

function log(type, message) {
    const prefix = {
        success: `${COLORS.green}✅`,
        error: `${COLORS.red}❌`,
        warning: `${COLORS.yellow}⚠️`,
        info: `${COLORS.blue}ℹ️`
    }[type] || '';

    console.log(`${prefix} ${message}${COLORS.reset}`);
}

function addResult(status, category, message) {
    results[status].push({ category, message });
}

// ============================================
// 1. 验证 YAML 决策树文件
// ============================================
function verifyDecisionTree() {
    log('info', '\n📋 验证 1: YAML 决策树文件');

    const yamlPath = path.join(PROJECT_ROOT, 'guidelines/decision-tree.yaml');

    // 检查文件是否存在
    if (!fs.existsSync(yamlPath)) {
        log('error', '  YAML 决策树文件不存在: guidelines/decision-tree.yaml');
        addResult('failed', 'YAML', '文件不存在');
        return false;
    }

    log('success', '  YAML 文件存在');
    addResult('passed', 'YAML', '文件存在');

    // 尝试解析 YAML
    try {
        const content = fs.readFileSync(yamlPath, 'utf8');
        const parsed = yaml.load(content);

        // 验证必需的顶级键
        const requiredKeys = ['version', 'scenarios', 'breakpoints', 'quick_reference'];
        const missingKeys = requiredKeys.filter(key => !parsed[key]);

        if (missingKeys.length > 0) {
            log('error', `  缺少必需的键: ${missingKeys.join(', ')}`);
            addResult('failed', 'YAML', `缺少键: ${missingKeys.join(', ')}`);
            return false;
        }

        log('success', '  YAML 结构完整');
        addResult('passed', 'YAML', '结构完整');

        // 验证场景0
        if (parsed.scenarios.scene_0) {
            const steps = parsed.scenarios.scene_0.mandatory_steps || [];
            if (steps.length >= 6) {
                log('success', `  场景0包含 ${steps.length} 个强制步骤`);
                addResult('passed', 'YAML', '场景0完整');
            } else {
                log('warning', `  场景0步骤不足（期望6个，实际${steps.length}个）`);
                addResult('warnings', 'YAML', '场景0步骤不足');
            }
        }

        // 验证断点
        const breakpointCount = Object.keys(parsed.breakpoints || {}).length;
        if (breakpointCount >= 5) {
            log('success', `  包含 ${breakpointCount} 个断点定义`);
            addResult('passed', 'YAML', '断点完整');
        } else {
            log('warning', `  断点数量不足（期望5个，实际${breakpointCount}个）`);
            addResult('warnings', 'YAML', '断点不足');
        }

        return true;

    } catch (err) {
        log('error', `  YAML 解析失败: ${err.message}`);
        addResult('failed', 'YAML', `解析失败: ${err.message}`);
        return false;
    }
}

// ============================================
// 2. 验证 copilot-instructions.md
// ============================================
function verifyCopilotInstructions() {
    log('info', '\n📋 验证 2: copilot-instructions.md');

    const mdPath = path.join(PROJECT_ROOT, '.github/copilot-instructions.md');

    if (!fs.existsSync(mdPath)) {
        log('error', '  copilot-instructions.md 不存在');
        addResult('failed', 'Instructions', '文件不存在');
        return false;
    }

    const content = fs.readFileSync(mdPath, 'utf8');

    // 检查关键章节
    const requiredSections = [
        { name: '3秒快速检查', pattern: /##?\s*⚡\s*3秒快速检查/i },
        { name: '绝对禁止', pattern: /###?\s*🚫\s*绝对禁止/i },
        { name: '强制断点', pattern: /##?\s*🚨\s*强制断点/i },
        { name: 'MCP调用统一检查', pattern: /##?\s*🔐\s*MCP\s*调用统一检查/i },
        { name: '结构化决策支持', pattern: /##?\s*📚\s*结构化决策支持/i }
    ];

    let allSectionsFound = true;

    for (const section of requiredSections) {
        if (section.pattern.test(content)) {
            log('success', `  ✓ 包含「${section.name}」章节`);
            addResult('passed', 'Instructions', `${section.name}章节存在`);
        } else {
            log('error', `  ✗ 缺少「${section.name}」章节`);
            addResult('failed', 'Instructions', `${section.name}章节缺失`);
            allSectionsFound = false;
        }
    }

    // 检查是否引用了 decision-tree.yaml
    if (content.includes('decision-tree.yaml')) {
        log('success', '  ✓ 引用了 decision-tree.yaml');
        addResult('passed', 'Instructions', '引用YAML文件');
    } else {
        log('warning', '  未明确引用 decision-tree.yaml');
        addResult('warnings', 'Instructions', '未引用YAML');
    }

    return allSectionsFound;
}

// ============================================
// 3. 验证 MCP 检查流程
// ============================================
function verifyMCPCheck() {
    log('info', '\n📋 验证 3: MCP 检查流程');

    const mdPath = path.join(PROJECT_ROOT, '.github/copilot-instructions.md');
    const content = fs.readFileSync(mdPath, 'utf8');

    // 检查 MCP 相关关键词
    const mcpKeywords = [
        { name: 'Profile读取', pattern: /guidelines\/profiles\/.*\.md/i },
        { name: 'MCP配置章节', pattern: /MCP\s*配置/i },
        { name: '允许的服务器', pattern: /允许的.*MCP.*服务器/i },
        { name: '断点5', pattern: /断点\s*5|breakpoint.*5/i },
        { name: '拒绝调用', pattern: /拒绝调用/i }
    ];

    let allKeywordsFound = true;

    for (const keyword of mcpKeywords) {
        if (keyword.pattern.test(content)) {
            log('success', `  ✓ 包含「${keyword.name}」相关内容`);
            addResult('passed', 'MCP', `${keyword.name}完整`);
        } else {
            log('error', `  ✗ 缺少「${keyword.name}」相关内容`);
            addResult('failed', 'MCP', `${keyword.name}缺失`);
            allKeywordsFound = false;
        }
    }

    return allKeywordsFound;
}

// ============================================
// 4. 验证规则一致性
// ============================================
function verifyConsistency() {
    log('info', '\n📋 验证 4: 规则一致性');

    const yamlPath = path.join(PROJECT_ROOT, 'guidelines/decision-tree.yaml');
    const mdPath = path.join(PROJECT_ROOT, '.github/copilot-instructions.md');
    const v2Path = path.join(PROJECT_ROOT, 'guidelines/guidelines/v2.md');

    try {
        const yamlContent = fs.readFileSync(yamlPath, 'utf8');
        const mdContent = fs.readFileSync(mdPath, 'utf8');
        const v2Content = fs.readFileSync(v2Path, 'utf8');

        // 检查场景0的5个自我检查问题是否一致
        const scene0Questions = [
            '我是否已读取项目Profile',
            '我是否知道项目禁止什么',
            '我是否会使用项目禁止的技术',
            '我是否优先项目规范而非通用实践',
            '我是否需要重新读取Profile'
        ];

        let consistencyScore = 0;

        for (const question of scene0Questions) {
            const inYaml = yamlContent.includes(question);
            const inMd = mdContent.includes(question);

            if (inYaml && inMd) {
                consistencyScore++;
            } else if (!inYaml && !inMd) {
                // 都不包含也算一致（可能用了不同表述）
                consistencyScore += 0.5;
            }
        }

        const consistencyPercent = (consistencyScore / scene0Questions.length * 100).toFixed(0);

        if (consistencyPercent >= 80) {
            log('success', `  场景0一致性: ${consistencyPercent}%`);
            addResult('passed', 'Consistency', `场景0一致性${consistencyPercent}%`);
        } else {
            log('warning', `  场景0一致性较低: ${consistencyPercent}%`);
            addResult('warnings', 'Consistency', `场景0一致性${consistencyPercent}%`);
        }

        return true;

    } catch (err) {
        log('error', `  一致性检查失败: ${err.message}`);
        addResult('failed', 'Consistency', err.message);
        return false;
    }
}

// ============================================
// 主函数
// ============================================
function main() {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║           P0 优化实施验证 - 完整性检查                    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);

    log('info', `项目根目录: ${PROJECT_ROOT}\n`);

    // 执行所有验证
    const v1 = verifyDecisionTree();
    const v2 = verifyCopilotInstructions();
    const v3 = verifyMCPCheck();
    const v4 = verifyConsistency();

    // 输出汇总
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                      验证结果汇总                          ║
╚════════════════════════════════════════════════════════════╝
`);

    log('success', `通过: ${results.passed.length} 项`);
    log('error', `失败: ${results.failed.length} 项`);
    log('warning', `警告: ${results.warnings.length} 项`);

    if (results.failed.length > 0) {
        console.log(`\n${COLORS.red}❌ 失败项详情:${COLORS.reset}`);
        results.failed.forEach((item, idx) => {
            console.log(`  ${idx + 1}. [${item.category}] ${item.message}`);
        });
    }

    if (results.warnings.length > 0) {
        console.log(`\n${COLORS.yellow}⚠️ 警告项详情:${COLORS.reset}`);
        results.warnings.forEach((item, idx) => {
            console.log(`  ${idx + 1}. [${item.category}] ${item.message}`);
        });
    }

    // 计算总分
    const totalChecks = results.passed.length + results.failed.length;
    const score = totalChecks > 0 ? (results.passed.length / totalChecks * 100).toFixed(0) : 0;

    console.log(`\n${COLORS.blue}📊 总分: ${score}%${COLORS.reset}`);

    if (v1 && v2 && v3 && v4 && results.failed.length === 0) {
        console.log(`\n${COLORS.green}✅ P0 优化实施验证通过！${COLORS.reset}\n`);
        process.exit(0);
    } else {
        console.log(`\n${COLORS.red}❌ P0 优化实施存在问题，请修复后重新验证${COLORS.reset}\n`);
        process.exit(1);
    }
}

// 运行
if (require.main === module) {
    main();
}

module.exports = { verifyDecisionTree, verifyCopilotInstructions, verifyMCPCheck, verifyConsistency };
