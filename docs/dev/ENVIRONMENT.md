# Environment

This document explains how to run the CS Revision Astro rebuild locally.

## Workspace

Use a normal local workspace outside OneDrive or another cloud-sync-managed folder. Current known workspaces include the PC and laptop clones.

```powershell
<repo>
```

Do not run this project from OneDrive or another cloud-sync-managed folder. The previous Vite/esbuild dependency optimisation failures were caused by running the project inside OneDrive.

## Requirements

- Windows PowerShell
- Node.js `>=22.12.0`
- npm
- Installed dependencies in `astro-site/node_modules`
- Test tooling installed from `astro-site/package.json`: Playwright (`@playwright/test`) and Vitest. A fresh Codex should normally get both by running `npm.cmd install` inside `astro-site/`.

## Fresh Clone Setup

Use this on another machine, including Laptop Codex:

```powershell
git clone https://github.com/lbyearwood/csrevision.git
cd csrevision
git switch astro-site
cd astro-site
npm.cmd install
npm.cmd run build
npm.cmd test
```

If a partial install is missing the test tooling, run this from `astro-site/`:

```powershell
npm.cmd install -D @playwright/test vitest
```

Do not commit `node_modules/`, `.astro/`, `dist/`, logs, PID files or `.env*` files.

## Commands

Run these from `astro-site/`:

```powershell
npm.cmd run build
npm.cmd run test:unit
npm.cmd run test:e2e
npm.cmd test
npm.cmd run dev -- --host 127.0.0.1 --port 4321
npm.cmd run preview -- --host 127.0.0.1 --port 4321
```

`npm.cmd run test:unit` runs Vitest. `npm.cmd run test:e2e` runs Playwright. `npm.cmd test` runs both.

Playwright is configured in `astro-site/playwright.config.ts` to use installed Microsoft Edge with `channel: "msedge"`. Do not run `npx playwright install` by default unless Edge is unavailable or the Playwright config changes.

Standard development URL:

```text
http://127.0.0.1:4321/
```

## Start The Dev Server

Preferred Codex launcher:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File <repo>\astro-site\start-dev-server.ps1
```

Manual foreground server:

```powershell
cd <repo>\astro-site
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
