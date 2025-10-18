# 自动化脚本模板

## 本地自检与初始化脚本（PowerShell 示例，幂等）

```powershell
Param(
    [Parameter(Mandatory=$false)] [ValidateSet("check","fix")] [string] $mode = "fix",
    [Parameter(Mandatory=$false)] [string[]] $projects = @(
        "D:\\Project\\vsse" # 示例：按需维护项目根路径清单
    )
)

function Ensure-File {
    param([string] $Path, [string] $Content)
    if (Test-Path -LiteralPath $Path) { return $false }
    if ($mode -eq "check") { throw "缺失文件: $Path" }
    $dir = Split-Path -Parent $Path
    if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    $lf = $Content -replace "\r\n?","\n"
    [System.IO.File]::WriteAllText($Path, $lf, [System.Text.Encoding]::UTF8)
    return $true
}

# 1) 仓库根风格文件
$repoRoot = (Get-Location).Path
$changed = $false
$changed = (Ensure-File -Path (Join-Path $repoRoot ".editorconfig") -Content @"
root = true

[*]
indent_style = space
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
"@) -or $changed
$changed = (Ensure-File -Path (Join-Path $repoRoot ".gitattributes") -Content "* text=auto eol=lf
") -or $changed

# 2) 各项目文档文件
$readme = @"# <项目名>

## 简介
一句话说明项目定位与核心能力。

## 支持矩阵
- OS: Windows/Ubuntu
- 运行时: <语言版本矩阵>

## 快速开始（PowerShell 示例）
"@
$changelog = @"# Changelog

所有显著变更将记录在此文件，遵循 Keep a Changelog 与 SemVer。

## [Unreleased]
- Added:
- Changed:
- Fixed:
- Deprecated:
- Removed:
- Performance:
- Security:
"@
$status = @"# 状态与路线图

- 计划中：
- 进行中：
- 已实现：

注：由"计划中→已实现"需同步 CHANGELOG 的 [Unreleased]。
"@

foreach ($p in $projects) {
    if (-not (Test-Path -LiteralPath $p)) { Write-Host "跳过不存在目录: $p"; continue }
    $changed = (Ensure-File -Path (Join-Path $p "README.md") -Content $readme) -or $changed
    $changed = (Ensure-File -Path (Join-Path $p "CHANGELOG.md") -Content $changelog) -or $changed
    $changed = (Ensure-File -Path (Join-Path $p "STATUS.md") -Content $status) -or $changed
}

if ($mode -eq "fix" -and $changed) { Write-Host "已创建缺失模板文件。" }
elseif ($mode -eq "check") { Write-Host "自检完成：未发现缺失文件。" }
```

## GitHub Actions（CI 自检与自动补齐 PR 示例）

```yaml
name: docs-ensure

on:
  pull_request:
  workflow_dispatch:
    inputs:
      autofix:
        description: "Auto-fix missing docs and open PR"
        required: false
        default: "false"

jobs:
  docs-check:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, ubuntu-latest]
    steps:
      - uses: actions/checkout@v4
      - name: Run docs check
        shell: pwsh
        run: |
          pwsh tools/ensure-project-docs.ps1 -mode check

  docs-fix-pr:
    if: ${{ github.event.inputs.autofix == 'true' && github.ref != 'refs/heads/main' }}
    runs-on: windows-latest
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - name: Auto fix missing docs
        shell: pwsh
        run: |
          pwsh tools/ensure-project-docs.ps1 -mode fix
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v6
        with:
          commit-message: "chore(docs): auto-create missing docs and style files"
          title: "chore(docs): auto-create missing docs and style files"
          body: |
            自动创建缺失的 README/CHANGELOG/STATUS 以及根级 .editorconfig/.gitattributes。
            - 统一缩进 4 空格、LF 行结尾。
          branch: chore/auto-create-docs
          base: ${{ github.ref_name }}
```
