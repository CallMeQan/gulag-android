# Gulag Runner Mobile Application

Made in Tauri, React and Vite

## Architecture

-   Tauri & Rust as **backend**
-   React & Typescript as **frontend**

## Recommended IDE Setup

-   [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Development

- [Tauri Prerequisites](https://v2.tauri.app/start/prerequisites/)

```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Android\Android Studio\jbr", "User")
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LocalAppData\Android\Sdk", "User")
$VERSION = Get-ChildItem -Name "$env:LocalAppData\Android\Sdk\ndk"
[System.Environment]::SetEnvironmentVariable("NDK_HOME", "$env:LocalAppData\Android\Sdk\ndk\$VERSION", "User")
```

- PowerShell will not pick up the new environment variables until reboot or logout, However you can refresh the current session:

```powershell
[System.Environment]::GetEnvironmentVariables("User").GetEnumerator() | % { Set-Item -Path "Env:\$($_.key)" -Value $_.value }
```

- Run `npm install`
- Then `npm run tauri android dev` to start android in dev mode