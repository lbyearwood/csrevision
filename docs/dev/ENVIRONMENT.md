# Environment

This document explains how to run the CS Revision Astro rebuild locally.

## Workspace

Current local workspace:

```powershell
C:\Users\Max\Documents\Development\csrevision
```

Do not run this project from OneDrive or another cloud-sync-managed folder. The previous Vite/esbuild dependency optimisation failures were caused by running the project inside OneDrive.

## Requirements

- Windows PowerShell
- Node.js `>=22.12.0`
- npm
- Installed dependencies in `astro-site/node_modules`

## Commands

Run these from `astro-site/`:

```powershell
npm.cmd run build
npm.cmd run dev -- --host 127.0.0.1 --port 4321
npm.cmd run preview -- --host 127.0.0.1 --port 4321
```

Standard development URL:

```text
http://127.0.0.1:4321/
```

## Start The Dev Server

Preferred Codex launcher:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File C:\Users\Max\Documents\Development\csrevision\astro-site\start-dev-server.ps1
```

Manual foreground server:

```powershell
cd C:\Users\Max\Documents\Development\csrevision\astro-site
npm.cmd run dev -- --host 127.0.0.1 --port 4321
```

If starting a persistent background process from Codex, store the PID in:

```text
astro-site/astro-dev-server.pid
```

## Verify The Server

Check these routes return `200`:

```text
http://127.0.0.1:4321/
http://127.0.0.1:4321/gcse/
http://127.0.0.1:4321/dev-dashboard/
```

## Known Windows Issue

PowerShell `Start-Process` can fail when both `Path` and `PATH` exist in the process environment.

Use this before `Start-Process` if needed:

```powershell
$pathValue = $env:Path
if ([string]::IsNullOrWhiteSpace($pathValue)) { $pathValue = $env:PATH }
[System.Environment]::SetEnvironmentVariable('PATH', $null, 'Process')
[System.Environment]::SetEnvironmentVariable('Path', $pathValue, 'Process')
```
