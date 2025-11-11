/**
 * P1 优化验证脚本
 * 
 * 验证项：
 * 1. 场景0行数减少 ≥ 60%（从约 324 行减少到约 80-100 行）
 * 2. 存在"场景0详细实施指南"章节
 * 3. 场景 0.5 完整性检查
 * 4. YAML 中有 scene_0_5 定义
 */

const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// 验证结果
const results = {
    passed: [],
    failed: [],
    warnings: []
};

// 文件路径
const copilotInstructionsPath = path.join(__dirname, '../../.github/copilot-instructions.md');
const decisionTreePath = path.join(__dirname, '../decision-tree.yaml');

/**
 * 验证1: 场景0行数减少 ≥ 60%
 */
function verifyScene0Simplification() {
    log('\n📋 验证1: 场景0行数减少', 'cyan');

    const content = fs.readFileSync(copilotInstructionsPath, 'utf8');
    const lines = content.split('\n');

    // 查找场景0的起始和结束位置
    let scene0Start = -1;
    let scene0End = -1;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('### 场景 0: 项目规范强制检查')) {
            scene0Start = i;
        }
        if (scene0Start !== -1 && lines[i].includes('### 场景 0.1:')) {
            scene0End = i;
            break;
        }
    }

    if (scene0Start === -1 || scene0End === -1) {
        results.failed.push('未找到场景0的起始或结束位置');
        log('  ❌ 未找到场景0的起始或结束位置', 'red');
        return false;
    }

    const scene0Lines = scene0End - scene0Start;
    const originalLines = 324; // P0 时的行数
    const reductionPercentage = ((originalLines - scene0Lines) / originalLines * 100).toFixed(1);

    log(`  场景0位置: ${scene0Start + 1} - ${scene0End + 1}`, 'blue');
    log(`  场景0行数: ${scene0Lines} 行`, 'blue');
    log(`  原始行数: ${originalLines} 行`, 'blue');
    log(`  减少比例: ${reductionPercentage}%`, 'blue');

    if (scene0Lines <= 100 && parseFloat(reductionPercentage) >= 60) {
        results.passed.push(`场景0简化成功：${scene0Lines} 行（减少 ${reductionPercentage}%）`);
        log(`  ✅ 场景0简化成功：${scene0Lines} 行（减少 ${reductionPercentage}%）`, 'green');
        return true;
    } else {
        results.failed.push(`场景0行数不符合要求：${scene0Lines} 行（减少 ${reductionPercentage}%，需要 ≥60%）`);
        log(`  ❌ 场景0行数不符合要求：${scene0Lines} 行（减少 ${reductionPercentage}%，需要 ≥60%）`, 'red');
        return false;
    }
}

/**
 * 验证2: 存在"场景0详细实施指南"章节
 */
function verifyDetailedGuideExists() {
    log('\n📋 验证2: 场景0详细实施指南章节存在性', 'cyan');

    const content = fs.readFileSync(copilotInstructionsPath, 'utf8');

    const hasDetailedGuide = content.includes('## 📖 场景0详细实施指南（参考手册）');
    const hasStep1 = content.includes('### STEP 1 详解: 项目识别策略');
    const hasStep2 = content.includes('### STEP 2 详解: Profile智能提取');
    const hasStep3 = content.includes('### STEP 3 详解: 提取强制规范清单');
    const hasStep4 = content.includes('### STEP 4 详解: 冲突检查规则');
    const hasStep5 = content.includes('### STEP 5 详解: 自我检查问题');
    const hasStep6 = content.includes('### STEP 6 详解: 输出格式规范');

    if (hasDetailedGuide && hasStep1 && hasStep2 && hasStep3 && hasStep4 && hasStep5 && hasStep6) {
        results.passed.push('场景0详细实施指南章节完整（包含 STEP 1-6）');
        log('  ✅ 场景0详细实施指南章节完整（包含 STEP 1-6）', 'green');
        return true;
    } else {
        const missing = [];
        if (!hasDetailedGuide) missing.push('主章节标题');
        if (!hasStep1) missing.push('STEP 1');
        if (!hasStep2) missing.push('STEP 2');
        if (!hasStep3) missing.push('STEP 3');
        if (!hasStep4) missing.push('STEP 4');
        if (!hasStep5) missing.push('STEP 5');
        if (!hasStep6) missing.push('STEP 6');

        results.failed.push(`场景0详细实施指南不完整，缺少: ${missing.join(', ')}`);
        log(`  ❌ 场景0详细实施指南不完整，缺少: ${missing.join(', ')}`, 'red');
        return false;
    }
}

/**
 * 验证3: 场景 0.5 完整性检查
 */
function verifyScene05Completeness() {
    log('\n📋 验证3: 场景 0.5 完整性检查', 'cyan');

    const content = fs.readFileSync(copilotInstructionsPath, 'utf8');

    // 检查场景 0.5 是否存在
    const hasScene05 = content.includes('### 场景 0.5:');

    if (!hasScene05) {
        results.warnings.push('场景 0.5 尚未实施（P1-2 待完成）');
        log('  ⚠️  场景 0.5 尚未实施（P1-2 待完成）', 'yellow');
        return false;
    }

    // 检查场景 0.5 的关键内容
    const hasTriggerCondition = content.includes('触发条件') && content.includes('文件创建/修改后');
    const hasCheckItems = content.includes('实时检查') || content.includes('Profile 规范对照');

    if (hasTriggerCondition && hasCheckItems) {
        results.passed.push('场景 0.5 已实施且内容完整');
        log('  ✅ 场景 0.5 已实施且内容完整', 'green');
        return true;
    } else {
        results.warnings.push('场景 0.5 存在但内容不完整');
        log('  ⚠️  场景 0.5 存在但内容不完整', 'yellow');
        return false;
    }
}

/**
 * 验证4: YAML 中有 scene_0_5 定义
 */
function verifyYamlScene05Definition() {
    log('\n📋 验证4: YAML 中 scene_0_5 定义', 'cyan');

    if (!fs.existsSync(decisionTreePath)) {
        results.warnings.push('decision-tree.yaml 文件不存在');
        log('  ⚠️  decision-tree.yaml 文件不存在', 'yellow');
        return false;
    }

    const content = fs.readFileSync(decisionTreePath, 'utf8');

    const hasScene05Definition = content.includes('scene_0_5:') || content.includes('scene_05:');

    if (hasScene05Definition) {
        results.passed.push('YAML 中已定义 scene_0_5');
        log('  ✅ YAML 中已定义 scene_0_5', 'green');
        return true;
    } else {
        results.warnings.push('YAML 中尚未定义 scene_0_5（P1-2 待完成）');
        log('  ⚠️  YAML 中尚未定义 scene_0_5（P1-2 待完成）', 'yellow');
        return false;
    }
}

/**
 * 验证5: 检查交叉引用链接
 */
function verifyCrossReferences() {
    log('\n📋 验证5: 交叉引用链接检查', 'cyan');

    const content = fs.readFileSync(copilotInstructionsPath, 'utf8');

    // 检查主场景0是否有"详见"链接
    const hasDetailedGuideLink = content.includes('详见: 场景0详细实施指南');

    if (hasDetailedGuideLink) {
        results.passed.push('场景0包含交叉引用链接');
        log('  ✅ 场景0包含交叉引用链接', 'green');
        return true;
    } else {
        results.failed.push('场景0缺少交叉引用链接');
        log('  ❌ 场景0缺少交叉引用链接', 'red');
        return false;
    }
}

/**
 * 主验证函数
 */
function runVerification() {
    log('═══════════════════════════════════════════════', 'cyan');
    log('          P1 优化实施验证', 'cyan');
    log('═══════════════════════════════════════════════', 'cyan');

    // 执行所有验证
    verifyScene0Simplification();
    verifyDetailedGuideExists();
    verifyScene05Completeness();
    verifyYamlScene05Definition();
    verifyCrossReferences();

    // 输出总结
    log('\n═══════════════════════════════════════════════', 'cyan');
    log('          验证结果总结', 'cyan');
    log('═══════════════════════════════════════════════', 'cyan');

    log(`\n✅ 通过: ${results.passed.length}`, 'green');
    results.passed.forEach(item => log(`  - ${item}`, 'green'));

    log(`\n❌ 失败: ${results.failed.length}`, 'red');
    results.failed.forEach(item => log(`  - ${item}`, 'red'));

    log(`\n⚠️  警告: ${results.warnings.length}`, 'yellow');
    results.warnings.forEach(item => log(`  - ${item}`, 'yellow'));

    // 计算总分
    const totalChecks = results.passed.length + results.failed.length;
    const score = totalChecks > 0 ? (results.passed.length / totalChecks * 100).toFixed(1) : 0;

    log(`\n📊 总分: ${score}% (${results.passed.length}/${totalChecks})`, score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red');

    // 最终判断
    if (results.failed.length === 0) {
        log('\n🎉 P1 优化验证通过！', 'green');
        return 0;
    } else {
        log('\n⚠️  P1 优化验证未完全通过，请查看失败项', 'yellow');
        return 1;
    }
}

// 执行验证
const exitCode = runVerification();
process.exit(exitCode);
