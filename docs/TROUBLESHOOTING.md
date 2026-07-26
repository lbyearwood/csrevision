# Troubleshooting

Last updated: 2026-07-26

Use this when local development commands fail in ways that are specific to this Windows/Codex setup.

## PowerShell `Path` / `PATH` Duplicate Key Error

### Symptom

PowerShell commands that enumerate environment variables or launch background processes may fail with errors like:

```text
Start-Process : Item has already been added. Key in dictionary: 'Path'  Key being added: 'PATH'
```

or:

```text
Get-ChildItem : An item with the same key has already been added.
```

This has shown up when starting Vite with `Start-Process`.

### Cause

The current process can contain both `Path` and `PATH`. Windows environment variables are case-insensitive, but .NET/PowerShell can treat those two names as duplicate dictionary keys when launching a child process or enumerating `Env:`.

On this machine the persisted user and machine environment variables only contain `Path`, so the duplicate appears to be injected into the current Codex/PowerShell process rather than stored permanently in Windows settings.

### Confirm

Use this safer check instead of `Get-ChildItem Env:`:

```powershell
[Environment]::GetEnvironmentVariables().Keys | Where-Object { $_ -match '^path$' }
```

If both are present, output looks like:

```text
Path
PATH
```

### Fix For Current PowerShell Process

Normalize the process environment before running `Start-Process` or other commands that launch background servers:

```powershell
$envs = [Environment]::GetEnvironmentVariables()
$pathValue = [string]$envs['Path']

[Environment]::SetEnvironmentVariable('PATH', $null, 'Process')
[Environment]::SetEnvironmentVariable('Path', $pathValue, 'Process')
```

Confirm only one key remains:

```powershell
[Environment]::GetEnvironmentVariables().Keys | Where-Object { $_ -match '^path$' }
```

Expected:

```text
Path
```

Then retry the background launch:

```powershell
Start-Process -FilePath npm.cmd -ArgumentList 'run','dev','--','--port','5173' -WindowStyle Hidden
```

### Workaround

If `Start-Process` is still unreliable, run the dev server directly in the current terminal:

```powershell
npm.cmd run dev -- --port 5173
```

## PowerShell Blocks `npm.ps1` Or `npx.ps1`

### Symptom

PowerShell reports that running scripts is disabled or refuses to run `npm` / `npx`.

### Fix

Use the Windows command shims:

```powershell
npm.cmd install
npm.cmd run dev
npx.cmd supabase start
```

## Vite Port Already In Use

### Symptom

Vite cannot start on `5173`, or the browser shows a different app.

### Check

```powershell
try { (Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:5173/' -TimeoutSec 3).StatusCode } catch { $_.Exception.Message }
```

If it returns `200`, something is already serving on that port.

### Fix

Use another port:

```powershell
npm.cmd run dev -- --port 5174
```

or stop the existing process if it belongs to this project.

## Stale `site-dev.pid`

### Symptom

`site-dev.pid` exists, but `http://127.0.0.1:5173/` does not respond.

### Cause

The PID file can remain after the dev server has exited.

### Fix

Treat the PID as advisory. Check the URL first, then start Vite again if needed:

```powershell
try { (Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:5173/' -TimeoutSec 3).StatusCode } catch { $_.Exception.Message }
npm.cmd run dev -- --port 5173
```

## Local Supabase Is Not Running

### Symptom

The app shows a local Supabase connection issue, sign-in fails unexpectedly, or Edge Functions return network errors.

### Check

```powershell
npx.cmd supabase status -o json
```

### Fix

Start Docker Desktop, wait for Docker Engine, then run:

```powershell
npx.cmd supabase start
```

If the local database is stale, reset from migrations and seed:

```powershell
npx.cmd supabase db reset --local
```

See `docs/SUPABASE_SETUP.md` for the full local backend runbook.
