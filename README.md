Performance tips for VS Code

This project includes a recommended workspace configuration to improve VS Code performance.

Files added:
- `.vscode/settings.json` — excludes `node_modules`, `.git`, `dist` from watchers/search and disables some noisy features.
- `.vscode/extensions.json` — recommends useful extensions and marks some heavy ones as unwanted.
- `scripts/disable-vscode-extensions.ps1` — PowerShell script to disable common heavy extensions locally (run at your own risk).

How to use
1. Restart VS Code after pulling these files.
2. Run the PowerShell script to disable heavy extensions (if you want):

```powershell
cd d:\Users\Khrystyna\Code\UGCCH
powershell -ExecutionPolicy Bypass -File .\scripts\disable-vscode-extensions.ps1
```

3. Open the repository in VS Code. If any extensions are missing you use, re-enable them via Extensions panel.

If you'd like, I can tailor the settings further for a faster iteration experience (e.g. disable built-in git in workspace).