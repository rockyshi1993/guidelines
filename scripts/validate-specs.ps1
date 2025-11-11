#!/usr/bin/env pwsh
# 规范一致性验证脚本
# 用途: 自动检查 guidelines 规范的完整性和一致性
# 版本: v1.0
# 更新: 2025-01-29

<#
.SYNOPSIS
    验证 guidelines 规范文件的一致性

.DESCRIPTION
    检查以下内容:
    1. Profile 文件结构完整性
    2. copilot-instructions.md 引用正确性
    3. 场景触发器完整性
    4. Markdown 链接有效性
    5. MCP 配置规范性

.PARAMETER Mode
    运行模式: check (检查) 或 fix (自动修复)

.PARAMETER Verbose
    显示详细输出

.EXAMPLE
    .\validate-specs.ps1
    # 默认检查模式

.EXAMPLE
    .\validate-specs.ps1 -Mode fix
    # 自动修复模式

.EXAMPLE
    .\validate-specs.ps1 -Verbose
    # 详细输出模式
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("check", "fix")]
    [string]$Mode = "check",
    
    [Parameter(Mandatory=$false)]
    [switch]$Verbose
)

# 错误计数器
$script:ErrorCount = 0
$script:WarningCount = 0
$script:FixCount = 0

# 颜色输出函数
function Write-ColorOutput {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Message,
        
        [Parameter(Mandatory=$false)]
        [ValidateSet("Success", "Error", "Warning", "Info")]
        [string]$Type = "Info"
    )
    
    $color = switch ($Type) {
        "Success" { "Green" }
        "Error" { "Red" }
        "Warning" { "Yellow" }
        "Info" { "Cyan" }
    }
    
    $prefix = switch ($Type) {
        "Success" { "✅" }
        "Error" { "❌" }
        "Warning" { "⚠️ " }
        "Info" { "ℹ️ " }
    }
    
    Write-Host "$prefix $Message" -ForegroundColor $color
}

# 递增错误计数
function Add-Error {
    param([string]$Message)
    $script:ErrorCount++
    Write-ColorOutput $Message -Type Error
}

# 递增警告计数
function Add-Warning {
    param([string]$Message)
    $script:WarningCount++
    Write-ColorOutput $Message -Type Warning
}

# 递增修复计数
function Add-Fix {
    param([string]$Message)
    $script:FixCount++
    Write-ColorOutput $Message -Type Success
}

# =============================================================================
# 检查 1: Profile 文件结构完整性
# =============================================================================

function Test-ProfileStructure {
    Write-ColorOutput "`n═══ 检查 1: Profile 文件结构完整性 ═══" -Type Info
    
    $profilesDir = ".\profiles"
    
    if (-not (Test-Path $profilesDir)) {
        Add-Error "profiles/ 目录不存在"
        return
    }
    
    $profileFiles = Get-ChildItem -Path $profilesDir -Filter "*.md" | Where-Object { $_.Name -ne "TEMPLATE-EXAMPLE.md" }
    
    if ($profileFiles.Count -eq 0) {
        Add-Warning "未找到任何 Profile 文件"
        return
    }
    
    Write-ColorOutput "找到 $($profileFiles.Count) 个 Profile 文件" -Type Info
    
    # 必需章节列表
    $requiredSections = @(
        "## 关键目录与运行时",
        "## 本地与 CI 命令",
        "## 文档与版本"
    )
    
    # 可选但重要的章节
    $importantSections = @(
        "## MCP 配置",
        "## 架构规范",
        "## 测试框架",
        "## 例外与覆盖"
    )
    
    foreach ($file in $profileFiles) {
        Write-ColorOutput "`n检查文件: $($file.Name)" -Type Info
        
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        
        # 检查必需章节
        foreach ($section in $requiredSections) {
            if ($content -notmatch [regex]::Escape($section)) {
                Add-Error "  缺少必需章节: $section"
            } elseif ($Verbose) {
                Write-ColorOutput "  ✓ 包含: $section" -Type Success
            }
        }
        
        # 检查重要章节（警告）
        foreach ($section in $importantSections) {
            if ($content -notmatch [regex]::Escape($section)) {
                if ($section -eq "## MCP 配置") {
                    Add-Warning "  建议添加章节: $section（如果项目需要数据库操作）"
                } else {
                    Add-Warning "  建议添加章节: $section"
                }
            } elseif ($Verbose) {
                Write-ColorOutput "  ✓ 包含: $section" -Type Success
            }
        }
        
        # 检查 MCP 配置格式（如果存在）
        if ($content -match "## MCP 配置") {
            $mcpSection = $content -match "(?s)## MCP 配置.*?(?=##|\z)"
            
            if ($content -notmatch "允许的 MCP 服务器:") {
                Add-Error "  MCP 配置缺少必填字段: 允许的 MCP 服务器"
            }
            
            if ($content -notmatch "数据库(/资源)?:") {
                Add-Error "  MCP 配置缺少必填字段: 数据库/资源"
            }
            
            if ($content -notmatch "用途:") {
                Add-Warning "  MCP 配置缺少推荐字段: 用途"
            }
        }
    }
}

# =============================================================================
# 检查 2: copilot-instructions.md 引用正确性
# =============================================================================

function Test-InstructionsReferences {
    Write-ColorOutput "`n═══ 检查 2: copilot-instructions.md 引用正确性 ═══" -Type Info
    
    $instructionsFile = ".\.github\copilot-instructions.md"
    
    if (-not (Test-Path $instructionsFile)) {
        Add-Error "copilot-instructions.md 不存在"
        return
    }
    
    $content = Get-Content -Path $instructionsFile -Raw -Encoding UTF8
    
    # 检查 Profile 路径引用
    $profileReferences = [regex]::Matches($content, 'guidelines/profiles/<([^>]+)>\.md')
    
    Write-ColorOutput "找到 $($profileReferences.Count) 处 Profile 路径引用" -Type Info
    
    foreach ($match in $profileReferences) {
        $placeholder = $match.Groups[1].Value
        if ($Verbose) {
            Write-ColorOutput "  ✓ 引用占位符: <$placeholder>" -Type Info
        }
    }
    
    # 检查 guidelines/v2.md 引用
    $guidelinesReferences = [regex]::Matches($content, 'guidelines/guidelines/v2\.md(#\d+)?')
    
    Write-ColorOutput "找到 $($guidelinesReferences.Count) 处 guidelines/v2.md 引用" -Type Info
    
    foreach ($match in $guidelinesReferences) {
        $ref = $match.Value
        if ($Verbose) {
            Write-ColorOutput "  ✓ 引用: $ref" -Type Info
        }
    }
    
    # 检查场景引用完整性
    $requiredScenes = @("场景 0", "场景 0.1", "场景 0.5", "场景 A", "场景 B", "场景 C", "场景 D", "场景 E", "场景 F", "场景 G")
    
    foreach ($scene in $requiredScenes) {
        if ($content -notmatch [regex]::Escape($scene)) {
            Add-Error "缺少场景定义: $scene"
        } elseif ($Verbose) {
            Write-ColorOutput "  ✓ 包含场景: $scene" -Type Success
        }
    }
}

# =============================================================================
# 检查 3: 场景触发器完整性
# =============================================================================

function Test-SceneTriggers {
    Write-ColorOutput "`n═══ 检查 3: 场景触发器完整性 ═══" -Type Info
    
    $instructionsFile = ".\.github\copilot-instructions.md"
    
    if (-not (Test-Path $instructionsFile)) {
        Add-Error "copilot-instructions.md 不存在"
        return
    }
    
    $content = Get-Content -Path $instructionsFile -Raw -Encoding UTF8
    
    # 必需的触发器组件
    $requiredComponents = @{
        "场景 0" = @("**触发条件**", "**强制执行顺序**", "STEP 1", "STEP 2", "STEP 3", "STEP 4", "STEP 5", "STEP 6")
        "场景 A" = @("**触发条件**", "**强制执行顺序**")
        "场景 B" = @("**触发条件**", "**强制执行顺序**")
        "场景 C" = @("**触发条件**", "**强制执行顺序**")
        "场景 D" = @("**触发条件**", "**强制检查项**")
        "场景 E" = @("**触发条件**", "**决策规则**")
    }
    
    foreach ($scene in $requiredComponents.Keys) {
        $sceneMatch = $content -match "(?s)### $([regex]::Escape($scene)).*?(?=###|\z)"
        
        if (-not $sceneMatch) {
            Add-Error "未找到场景定义: $scene"
            continue
        }
        
        $sceneContent = $matches[0]
        
        foreach ($component in $requiredComponents[$scene]) {
            if ($sceneContent -notmatch [regex]::Escape($component)) {
                Add-Error "$scene 缺少组件: $component"
            } elseif ($Verbose) {
                Write-ColorOutput "  ✓ $scene 包含: $component" -Type Success
            }
        }
    }
}

# =============================================================================
# 检查 4: Markdown 链接有效性
# =============================================================================

function Test-MarkdownLinks {
    Write-ColorOutput "`n═══ 检查 4: Markdown 链接有效性 ═══" -Type Info
    
    $markdownFiles = Get-ChildItem -Path "." -Recurse -Filter "*.md" | Where-Object { $_.FullName -notmatch "node_modules" }
    
    Write-ColorOutput "找到 $($markdownFiles.Count) 个 Markdown 文件" -Type Info
    
    $brokenLinks = 0
    
    foreach ($file in $markdownFiles) {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        
        # 查找文件链接 [text](path)
        $links = [regex]::Matches($content, '\[([^\]]+)\]\(([^)]+)\)')
        
        foreach ($link in $links) {
            $linkPath = $link.Groups[2].Value
            
            # 跳过外部链接
            if ($linkPath -match "^https?://") {
                continue
            }
            
            # 跳过锚点链接
            if ($linkPath -match "^#") {
                continue
            }
            
            # 移除锚点部分
            $cleanPath = $linkPath -replace "#.*$", ""
            
            # 解析相对路径
            $basePath = Split-Path -Parent $file.FullName
            $fullPath = Join-Path $basePath $cleanPath
            $fullPath = [System.IO.Path]::GetFullPath($fullPath)
            
            if (-not (Test-Path $fullPath)) {
                Add-Warning "  断开的链接: $linkPath (在 $($file.Name))"
                $brokenLinks++
            } elseif ($Verbose) {
                Write-ColorOutput "  ✓ 有效链接: $linkPath" -Type Success
            }
        }
    }
    
    if ($brokenLinks -eq 0) {
        Write-ColorOutput "所有文件链接有效" -Type Success
    }
}

# =============================================================================
# 检查 5: MCP 配置规范性
# =============================================================================

function Test-MCPConfiguration {
    Write-ColorOutput "`n═══ 检查 5: MCP 配置规范性 ═══" -Type Info
    
    $profilesDir = ".\profiles"
    
    if (-not (Test-Path $profilesDir)) {
        return
    }
    
    $profileFiles = Get-ChildItem -Path $profilesDir -Filter "*.md" | Where-Object { $_.Name -ne "TEMPLATE-EXAMPLE.md" }
    
    foreach ($file in $profileFiles) {
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        
        # 检查是否有 MCP 配置
        if ($content -match "## MCP 配置") {
            Write-ColorOutput "`n检查 MCP 配置: $($file.Name)" -Type Info
            
            # 检查服务器名称格式
            if ($content -match "允许的 MCP 服务器:\s*`([^`]+)`") {
                $serverName = $matches[1]
                
                # 验证服务器名称格式（应该是 mongodb-xxx 或类似）
                if ($serverName -notmatch "^[a-z]+-[a-z0-9]+$") {
                    Add-Warning "  MCP 服务器名称可能不符合规范: $serverName（推荐格式: tool-project）"
                } elseif ($Verbose) {
                    Write-ColorOutput "  ✓ MCP 服务器名称: $serverName" -Type Success
                }
            } else {
                Add-Error "  MCP 服务器名称未用代码标记包裹"
            }
            
            # 检查数据库名称
            if ($content -match "数据库(/资源)?:\s*([^\s\r\n]+)") {
                $dbName = $matches[2]
                if ($Verbose) {
                    Write-ColorOutput "  ✓ 数据库: $dbName" -Type Success
                }
            }
            
            # 检查用途说明
            if ($content -match "用途:\s*([^\r\n]+)") {
                $purpose = $matches[1]
                if ($purpose.Length -lt 5) {
                    Add-Warning "  用途说明过于简短: $purpose"
                } elseif ($Verbose) {
                    Write-ColorOutput "  ✓ 用途: $purpose" -Type Success
                }
            }
            
            # 检查限制说明（可选）
            if ($content -match "限制:\s*([^\r\n]+)") {
                $restrictions = $matches[1]
                if ($Verbose) {
                    Write-ColorOutput "  ✓ 限制: $restrictions" -Type Success
                }
            }
        }
    }
}

# =============================================================================
# 主执行流程
# =============================================================================

function Main {
    Write-ColorOutput "═══════════════════════════════════════════════════" -Type Info
    Write-ColorOutput "  规范一致性验证脚本 v1.0" -Type Info
    Write-ColorOutput "  模式: $Mode" -Type Info
    Write-ColorOutput "═══════════════════════════════════════════════════`n" -Type Info
    
    # 执行所有检查
    Test-ProfileStructure
    Test-InstructionsReferences
    Test-SceneTriggers
    Test-MarkdownLinks
    Test-MCPConfiguration
    
    # 输出总结
    Write-ColorOutput "`n═══════════════════════════════════════════════════" -Type Info
    Write-ColorOutput "  验证完成" -Type Info
    Write-ColorOutput "═══════════════════════════════════════════════════" -Type Info
    
    Write-Host ""
    Write-Host "统计结果:" -ForegroundColor Cyan
    Write-Host "  错误: $script:ErrorCount" -ForegroundColor $(if ($script:ErrorCount -eq 0) { "Green" } else { "Red" })
    Write-Host "  警告: $script:WarningCount" -ForegroundColor $(if ($script:WarningCount -eq 0) { "Green" } else { "Yellow" })
    
    if ($Mode -eq "fix") {
        Write-Host "  修复: $script:FixCount" -ForegroundColor Green
    }
    
    Write-Host ""
    
    # 返回退出码
    if ($script:ErrorCount -gt 0) {
        Write-ColorOutput "验证失败 - 发现 $script:ErrorCount 个错误" -Type Error
        exit 1
    } elseif ($script:WarningCount -gt 0) {
        Write-ColorOutput "验证通过（有警告） - 发现 $script:WarningCount 个警告" -Type Warning
        exit 0
    } else {
        Write-ColorOutput "验证通过 - 所有检查均通过" -Type Success
        exit 0
    }
}

# 执行主函数
Main
