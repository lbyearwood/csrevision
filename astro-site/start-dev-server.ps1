$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$Port = 4321
$HostName = "127.0.0.1"
$OutLog = Join-Path $ProjectRoot "astro-dev.out.log"
$ErrLog = Join-Path $ProjectRoot "astro-dev.err.log"
$PidFile = Join-Path $ProjectRoot "astro-dev-server.pid"

$pathValue = [Environment]::GetEnvironmentVariable("Path", "Process")
if ([string]::IsNullOrWhiteSpace($pathValue)) {
  $pathValue = [Environment]::GetEnvironmentVariable("PATH", "Process")
}

if (-not [string]::IsNullOrWhiteSpace($pathValue)) {
  [Environment]::SetEnvironmentVariable("PATH", $null, "Process")
  [Environment]::SetEnvironmentVariable("Path", $pathValue, "Process")
}

$existingListener = netstat -ano | Select-String ":$Port\s+.*LISTENING"
if ($existingListener) {
  Write-Host "Astro dev server appears to already be listening on http://$HostName`:$Port/"
  Write-Host $existingListener
  exit 0
}

Set-Content -Path $OutLog -Value ""
Set-Content -Path $ErrLog -Value ""

$node = (Get-Command node.exe -ErrorAction Stop).Source
$astroBin = Join-Path $ProjectRoot "node_modules\astro\bin\astro.mjs"
if (-not (Test-Path -LiteralPath $astroBin)) {
  throw "Astro executable not found at $astroBin. Run npm.cmd install from $ProjectRoot first."
}

$process = Start-Process `
  -FilePath $node `
  -ArgumentList @($astroBin, "dev", "--host", $HostName, "--port", $Port) `
  -WorkingDirectory $ProjectRoot `
  -RedirectStandardOutput $OutLog `
  -RedirectStandardError $ErrLog `
  -WindowStyle Hidden `
  -PassThru

$process.Id | Set-Content -Path $PidFile

for ($attempt = 1; $attempt -le 20; $attempt++) {
  Start-Sleep -Milliseconds 500
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri "http://$HostName`:$Port/dev-dashboard/" -TimeoutSec 2
    if ($response.StatusCode -eq 200) {
      Write-Host "Astro dev server running at http://$HostName`:$Port/dev-dashboard/"
      Write-Host "Launcher PID: $($process.Id)"
      exit 0
    }
  } catch {
    if ($attempt -eq 20) {
      Write-Host "Astro dev server did not respond before timeout."
      Write-Host "Launcher PID: $($process.Id)"
      Write-Host "Last stderr lines:"
      Get-Content $ErrLog -ErrorAction SilentlyContinue | Select-Object -Last 20
      exit 1
    }
  }
}
