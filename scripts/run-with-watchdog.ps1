[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$FilePath,

  [string]$Arguments = '',

  [ValidateRange(1, 3600)]
  [int]$TimeoutSeconds = 60,

  [ValidateRange(1, 300)]
  [int]$HeartbeatSeconds = 10,

  [string]$WorkingDirectory = (Get-Location).Path
)

$ErrorActionPreference = 'Stop'

$resolvedWorkingDirectory = (Resolve-Path -LiteralPath $WorkingDirectory).Path
$command = Get-Command $FilePath -ErrorAction Stop
$resolvedFilePath = $command.Source

$startInfo = New-Object System.Diagnostics.ProcessStartInfo
$startInfo.WorkingDirectory = $resolvedWorkingDirectory
$startInfo.UseShellExecute = $false
$startInfo.CreateNoWindow = $true
$startInfo.RedirectStandardOutput = $true
$startInfo.RedirectStandardError = $true

if ([IO.Path]::GetExtension($resolvedFilePath) -in @('.cmd', '.bat')) {
  $startInfo.FileName = $env:ComSpec
  $innerCommand = "`"$resolvedFilePath`""
  if ($Arguments) {
    $innerCommand += " $Arguments"
  }
  $startInfo.Arguments = "/d /s /c `"$innerCommand`""
} else {
  $startInfo.FileName = $resolvedFilePath
  $startInfo.Arguments = $Arguments
}

$process = New-Object System.Diagnostics.Process
$process.StartInfo = $startInfo
$stopwatch = [Diagnostics.Stopwatch]::StartNew()
$nextHeartbeat = $HeartbeatSeconds
$timedOut = $false

function Stop-WatchdogProcess {
  param([Diagnostics.Process]$TargetProcess)

  if (-not $TargetProcess -or $TargetProcess.HasExited) {
    return
  }

  $priorErrorAction = $ErrorActionPreference
  try {
    $ErrorActionPreference = 'SilentlyContinue'
    & taskkill.exe /PID $TargetProcess.Id /T /F 2>$null | Out-Null
  } finally {
    $ErrorActionPreference = $priorErrorAction
  }

  if (-not $TargetProcess.WaitForExit(2000)) {
    $TargetProcess.Kill()
    $TargetProcess.WaitForExit(2000) | Out-Null
  }
}

try {
  if (-not $process.Start()) {
    throw "Unable to start $resolvedFilePath"
  }

  $stdoutTask = $process.StandardOutput.ReadToEndAsync()
  $stderrTask = $process.StandardError.ReadToEndAsync()

  Write-Host "WATCHDOG_START pid=$($process.Id) timeout=${TimeoutSeconds}s command=$resolvedFilePath"

  while (-not $process.WaitForExit(250)) {
    $elapsedSeconds = [Math]::Floor($stopwatch.Elapsed.TotalSeconds)

    if ($elapsedSeconds -ge $nextHeartbeat) {
      Write-Host "WATCHDOG_PROGRESS pid=$($process.Id) elapsed=${elapsedSeconds}s"
      $nextHeartbeat += $HeartbeatSeconds
    }

    if ($stopwatch.Elapsed.TotalSeconds -ge $TimeoutSeconds) {
      $timedOut = $true
      [Console]::Error.WriteLine("WATCHDOG_TIMEOUT pid=$($process.Id) elapsed=${elapsedSeconds}s limit=${TimeoutSeconds}s")
      Stop-WatchdogProcess -TargetProcess $process
      break
    }
  }

  if (-not $process.HasExited) {
    $process.WaitForExit(5000) | Out-Null
  }

  $stdout = $stdoutTask.GetAwaiter().GetResult()
  $stderr = $stderrTask.GetAwaiter().GetResult()
  if ($stdout) {
    Write-Output $stdout.TrimEnd()
  }
  if ($stderr) {
    [Console]::Error.WriteLine($stderr.TrimEnd())
  }

  if ($timedOut) {
    exit 124
  }

  Write-Host "WATCHDOG_END pid=$($process.Id) elapsed=$([Math]::Round($stopwatch.Elapsed.TotalSeconds, 1))s exit=$($process.ExitCode)"
  exit $process.ExitCode
} finally {
  $stopwatch.Stop()
  if ($process -and -not $process.HasExited) {
    Stop-WatchdogProcess -TargetProcess $process
  }
  $process.Dispose()
}
