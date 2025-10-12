# 文档自检脚本 - 确保必需文件存在
# 用法: pwsh .github/ensure-project-docs.ps1 -mode check|fix

Param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("check","fix")]
    [string] $mode = "check"
)

$ErrorActionPreference = "Stop"

function Test-RequiredFile {
    param(
        [string] $Path,
        [string] $Description
    )

    if (Test-Path -LiteralPath $Path) {
        Write-Host "✓ $Description 存在" -ForegroundColor Green
        return $true
    } else {
        Write-Host "✗ $Description 缺失: $Path" -ForegroundColor Red
        return $false
    }
}

# 检查仓库根级文件
$repoRoot = Split-Path -Parent $PSScriptRoot
$allPass = $true

Write-Host "`n=== 检查仓库根级配置 ===" -ForegroundColor Cyan
$allPass = (Test-RequiredFile -Path "$repoRoot\.editorconfig" -Description ".editorconfig") -and $allPass
$allPass = (Test-RequiredFile -Path "$repoRoot\.gitattributes" -Description ".gitattributes") -and $allPass

# 检查 monSQLize 项目文档
Write-Host "`n=== 检查 monSQLize 项目文档 ===" -ForegroundColor Cyan
$projectRoot = "$repoRoot\monSQLize"

if (Test-Path $projectRoot) {
    $allPass = (Test-RequiredFile -Path "$projectRoot\README.md" -Description "README.md") -and $allPass
    $allPass = (Test-RequiredFile -Path "$projectRoot\CHANGELOG.md" -Description "CHANGELOG.md") -and $allPass
    $allPass = (Test-RequiredFile -Path "$projectRoot\STATUS.md" -Description "STATUS.md") -and $allPass
    $allPass = (Test-RequiredFile -Path "$projectRoot\package.json" -Description "package.json") -and $allPass
}

if ($mode -eq "check") {
    if ($allPass) {
        Write-Host "`n✓ 所有必需文件检查通过" -ForegroundColor Green
        exit 0
    } else {
        Write-Host "`n✗ 存在缺失文件，请使用 -mode fix 自动创建" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "`n修复模式暂未实现，请手动创建缺失文件" -ForegroundColor Yellow
}
