<#
  Disable a list of heavy/unneeded VS Code extensions for this user/machine.

  Usage: open PowerShell, cd to repository root and run:
    powershell -ExecutionPolicy Bypass -File .\scripts\disable-vscode-extensions.ps1

  NOTE: This script uses the `code` CLI. Make sure VS Code's "Install 'code' command in PATH"
  is enabled (Command Palette → 'Shell Command: Install 'code' command in PATH') or run the
  disable commands manually.
#>

$codeCmd = Get-Command code -ErrorAction SilentlyContinue
if (-not $codeCmd) {
  Write-Host "Error: 'code' CLI not found in PATH. Please install 'code' command or run the commands manually." -ForegroundColor Yellow
  exit 1
}

$extensions = @(
  'ms-vscode-remote.remote-containers',
  'ms-vscode-remote.remote-ssh',
  'ms-vscode-remote.remote-wsl',
  'ms-python.python',
  'ms-vscode.cpptools',
  'github.vscode-pull-request-github',
  'eamodio.gitlens'
)

# Build a single call to `code` with multiple --disable-extension arguments to avoid
# spawning a new VS Code window for every extension.
$args = @()
foreach ($ext in $extensions) {
  Write-Host "Queueing disable for: $ext"
  $args += '--disable-extension'
  $args += $ext
}

Write-Host "Running: code $($args -join ' ')"
& $codeCmd.Path @args

Write-Host "Done. Restart VS Code to apply changes." -ForegroundColor Green
