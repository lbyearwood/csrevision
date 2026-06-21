# Troubleshooting

This is the central error log for development, build, server, browser-control, QA and tooling issues.

## Logging Standard

- Add or update an entry whenever a new error is discovered.
- Include the symptom, cause, affected command or workflow, working solution, and any remaining limitation.
- Revise older entries when a later diagnosis replaces them.
- Do not leave contradictory advice behind.
- If a workaround is temporary, say what would count as the proper fix.

## Empty `.git` Directory Means Workspace Is Not A Git Checkout

Confirmed on 2026-06-21.

Symptoms:

- `git rev-parse --show-toplevel` fails with:

```text
fatal: not a git repository (or any of the parent directories): .git
```

- A `.git/` directory exists in the workspace, but it is empty.
- `git remote -v` also fails with the same message.

Cause:

- The workspace contains project files and an empty `.git/` directory, but it is not a valid Git repository clone.
- Git cannot create local branches, inspect remotes or commit from this workspace state.

Working solution:

1. Do not run `git init` in this workspace and assume it is the production repo.
2. Use a proper clone of `https://github.com/lbyearwood/csrevision.git`.
3. Switch to the Astro rebuild branch before uploading:

```powershell
git clone https://github.com/lbyearwood/csrevision.git
cd csrevision
git switch astro-site
```

4. Copy or apply the Astro rebuild changes onto `astro-site`.
5. Push only to `astro-site` unless the user explicitly approves replacing the live site.

Notes:

- The remote `astro-site` branch was created from `main` on 2026-06-21.
- The branch was created through a temporary clone because this workspace was not a valid Git checkout.
- Keep the live GitHub Pages setup on `main` untouched until launch approval.

## Git Add Fails On Very Long Old Planning Paths

Confirmed on 2026-06-21.

Symptoms:

- Force-adding the whole old `app/` folder fails with:

```text
Filename too long
fatal: adding files failed
```

- The failing path is inside:

```text
app/planning & quality assurance/
```

Cause:

- The old planning archive contains deeply nested Windows paths.
- Including those files in the shared branch may also make cloning harder for Laptop Codex on Windows.

Working solution:

1. Upload the old site material needed for migration: `app/courses/`, `app/assets/`, `app/data/`, root old-site HTML/CSS/JS files, `app/read me.md` and `app/slide-wire-frames.pdf`.
2. Do not upload the nested `app/.git/` directory.
3. Leave `app/planning & quality assurance/` out of the shared branch unless the user explicitly asks for that archive.
4. If that archive is ever required, either shorten paths before committing or enable long path support and test a fresh Windows clone.

Limitation:

- Laptop Codex can continue lesson migration from the uploaded old site reference, but it will not have the excluded planning archive unless it is added later.

## Vite/esbuild Dependency Optimisation Fails

Confirmed on 2026-06-20.

Symptoms:

- `npm.cmd run dev -- --host 127.0.0.1 --port 4321` briefly reports Astro ready, then exits.
- Vite/esbuild reports dependency optimisation errors.
- Errors can mention missing or unreadable dependency files such as `aria-query`, `axobject-query` or Astro dev toolbar helper files.
- Referenced files may physically exist in `node_modules`.

Cause:

- The project was running from a OneDrive-managed path.
- OneDrive delayed or blocked dependency file access during Vite/esbuild optimisation.

Solution:

- Move the project out of OneDrive.
- Current working path:

```powershell
C:\Users\Max\Documents\Development\csrevision
```

Verification:

```powershell
cd C:\Users\Max\Documents\Development\csrevision\astro-site
npm.cmd run build
npm.cmd run dev -- --host 127.0.0.1 --port 4321
```

Known result after the move:

- `npm.cmd run build` passed.
- The dev server served `/`, `/gcse/` and `/dev-dashboard/` with HTTP `200`.

## Astro Dev Server Started By Codex Does Not Stay Running

Symptoms:

- The dev server starts and reports ready in `astro-site/astro-dev.out.log`.
- The log may show one or two successful requests, for example `[200] /dev-dashboard/`.
- A later browser refresh or route probe fails with `Unable to connect to the remote server`.
- `netstat -ano | Select-String ':4321'` shows no persistent `LISTENING` process.
- No Vite/esbuild error appears in the log.
- The in-app browser may already be open at `http://127.0.0.1:4321/dev-dashboard/`, but the page stops loading because the server process has exited.

Observed failed launch paths:

- `Start-Process -FilePath npm.cmd ...` can fail with the duplicate `Path` / `PATH` environment error.
- `Start-Process -UseNewEnvironment` may still hit the same duplicate-key error in the Codex-hosted PowerShell environment.
- A hidden `cmd /k` launch via `WScript.Shell.Run(...)` can pass immediate `200` probes and then disappear after the tool call ends.
- In this host, .NET `ProcessStartInfo.Environment` / `EnvironmentVariables` cleanup attempts may be unavailable or null, so do not rely on them as a universal fix.

Likely cause:

- Codex-launched background processes are not reliably owned by a normal user terminal and may be cleaned up when the tool call finishes.
- The Windows process environment can contain both `Path` and `PATH`, which breaks some PowerShell process-launch paths.

Working solution for a persistent server:

- Preferred Codex-side launcher:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File C:\Users\Max\Documents\Development\csrevision\astro-site\start-dev-server.ps1
```

- This script normalizes the Windows `Path` / `PATH` issue, writes logs to `astro-site/astro-dev.out.log` and `astro-site/astro-dev.err.log`, stores the launcher PID in `astro-site/astro-dev-server.pid`, and verifies `/dev-dashboard/`.
- Start it outside the sandbox when the server must remain available to the user's in-app browser after the Codex tool call returns.
- Alternative manual solution: start the dev server in a normal user-owned terminal and keep that terminal open:

```powershell
cd C:\Users\Max\Documents\Development\csrevision\astro-site
npm.cmd run dev -- --host 127.0.0.1 --port 4321
```

- If `Start-Process` is needed from PowerShell, first normalize `Path` / `PATH` as described in the next section.
- Do not claim the server is persistently running from Codex unless it is still reachable after the launch command has fully returned.
- Keep the PID in `astro-site/astro-dev-server.pid`.
- Re-check `/`, `/gcse/` and `/dev-dashboard/` after launch, and repeat the check after a short delay.

Verification:

```powershell
Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:4321/dev-dashboard/' -TimeoutSec 5
netstat -ano | Select-String ':4321'
```

Codex limitation:

- For short QA tasks, Codex can start and use the dev server inside a single command sequence.
- For user browsing, prefer a user-owned terminal because the server must remain alive after Codex tool execution ends.

## PowerShell Duplicate Path And PATH

Symptoms:

- `Start-Process` fails with:

```text
Item has already been added. Key in dictionary: 'Path' Key being added: 'PATH'
```

Solution:

```powershell
$pathValue = $env:Path
if ([string]::IsNullOrWhiteSpace($pathValue)) { $pathValue = $env:PATH }
[System.Environment]::SetEnvironmentVariable('PATH', $null, 'Process')
[System.Environment]::SetEnvironmentVariable('Path', $pathValue, 'Process')
```

## Edge Renders But Pointer Clicks Do Not Fire

Symptoms:

- Edge opens the local Astro site.
- The page renders.
- Screenshots, DOM checks or scroll checks may work.
- DevTools pointer clicks do not activate links or controls.
- A simple diagnostic page also fails to receive pointer clicks.

Meaning:

- Treat this as a browser-control or DevTools input-delivery problem, not proof of an Astro page bug.
- Do not claim physical click QA passed while this is happening.

Recovery:

1. Close and reopen the in-app browser.
2. Restart Codex if the Browser plugin cannot start.
3. Open a fresh Edge QA profile on a new debugging port.
4. Test a simple one-link diagnostic page.
5. If the diagnostic page also fails, record the failure here and report that physical interaction QA was not proven.

Known Browser plugin failure:

```text
CreateProcessAsUserW failed: 5
```

When this happens, the Browser plugin control layer is unavailable in the current session. Restart Codex before retrying.

## In-App Browser Connector Fails Before Bootstrap

Confirmed on 2026-06-20.

Symptoms:

- The Browser plugin is listed and the browser skill can be read.
- The JavaScript bridge fails before browser bootstrap completes.
- The tool error includes:

```text
codex/sandbox-state-meta: missing field `sandboxPolicy`
```

Meaning:

- Treat this as an in-app browser connector/tool-layer failure, not an app bug.
- Do not claim the Browser plugin was available for QA in that session.

Working fallback:

- Use the project-required Microsoft Edge QA path with remote debugging.
- Report that the in-app Browser invocation failed and Edge remote debugging was used instead.

## Edge Headless Screenshot Fails With GPU Process Error

Confirmed on 2026-06-20.

Symptoms:

- Running Microsoft Edge headless with `--screenshot` does not create the screenshot file.
- Edge logs GPU errors such as:

```text
GPU process isn't usable. Goodbye.
```

- Adding software rendering flags such as `--disable-gpu`, `--disable-gpu-compositing`, `--disable-gpu-sandbox` and `--use-gl=swiftshader` may still hang or time out.

Working solution:

- Use a normal Microsoft Edge instance with remote debugging instead of headless screenshots.
- Start Edge with a dedicated profile and remote debugging port:

```powershell
msedge.exe --remote-debugging-port=9227 --user-data-dir=%TEMP%\csrevision-edge-card-qa-profile --no-first-run --no-default-browser-check --new-window http://127.0.0.1:4321/dev-dashboard/
```

- Verify Edge is reachable:

```powershell
Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:9227/json/version'
```

- Use the DevTools endpoint to check page URL, title, DOM text or computed styles.

Limitations:

- This proves the page in Edge and can verify rendered DOM/computed styles.
- It does not prove pointer-click interaction unless actual clicks or control activation are dispatched and followed by a state check.
- It does not satisfy QAP/UI visual QA by itself unless a screenshot is successfully captured and reviewed.

## QAP Screenshot Review Is Required

Confirmed on 2026-06-20.

Symptoms:

- A UI task is validated through DOM checks, computed styles or route status only.
- A visual defect is missed because no screenshot was captured and reviewed.
- A screenshot attempt fails and the task is still marked complete.

Cause:

- DOM and computed-style checks prove that elements exist, but not that the UI looks good.
- Screenshot capture failures can lead to overconfidence if they are treated as optional.

Required workflow:

1. Capture a screenshot of the affected QAP/UI surface.
2. Review the screenshot against the user's request or reference image.
3. If the screenshot fails, try another method before completion:
   - in-app Browser screenshot,
   - Microsoft Edge remote-debugging screenshot,
   - Microsoft Edge headless screenshot,
   - Playwright screenshot,
   - visible Edge/manual screenshot supplied or inspected in the app.
4. Only mark visual QA as passed after a screenshot has been captured and reviewed.

Limitation:

- If every screenshot path fails, report visual QA as failed or blocked. Do not mark the QAP/UI task complete.

## Chrome Headless Screenshot Does Not Write File Or Does Not Scroll

Confirmed on 2026-06-21.

Symptoms:

- Direct Chrome or Edge headless screenshot commands print the target path but no PNG is created.
- `chrome.exe --version` may print `Opening in existing browser session.`
- Passing `--screenshot` and the file path as separate arguments fails with:

```text
Multiple targets are not supported in headless mode.
```

- `/#example` hash screenshots may still land on the first card slide when the page has tall slide canvases.

Working solution:

1. Launch Chrome through `Start-Process` with an isolated `--user-data-dir`.
2. Pass the screenshot target as a single argument: `--screenshot=C:\path\shot.png`.
3. If the required UI is below the first viewport, use Chrome DevTools Protocol to wait for `document.readyState === "complete"`, scroll the target section into view, then call `Page.captureScreenshot`.

Notes:

- Use the local Astro URL, for example `http://127.0.0.1:4321/dev-dashboard/cards/instruction-card/`.
- For card review pages, scroll to `document.getElementById("example")` before capturing the Example slide.
- Review the resulting PNG with `view_image`; do not accept a command that only prints a path without creating the file.
