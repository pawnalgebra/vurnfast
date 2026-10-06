param([ValidateSet('start','test','install','build')][string]$Action='start')
# MODULE: Select an already-installed modern Node without changing the global nvm selection.
$taskRoot=Split-Path -Parent $PSScriptRoot
$taskNode=(Get-Command node.exe -ErrorAction SilentlyContinue).Source
$taskNvmRoot=Join-Path $env:APPDATA 'nvm'
$taskCandidates=Get-ChildItem -LiteralPath $taskNvmRoot -Directory -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -match '^v\d+\.\d+\.\d+$' } |
  Sort-Object { [version]($_.Name.Substring(1)) } -Descending
foreach($taskCandidate in $taskCandidates){
  $taskExecutable=Join-Path $taskCandidate.FullName 'node.exe'
  if((Test-Path -LiteralPath $taskExecutable) -and [version]($taskCandidate.Name.Substring(1)) -ge [version]'20.19.0'){$taskNode=$taskExecutable;break}
}
if(-not $taskNode){throw 'Node >=20.19 diperlukan. Pasang Node 22+.'}
$taskVersion=(& $taskNode --version).Trim().TrimStart('v')
if([version]$taskVersion -lt [version]'20.19.0'){throw 'Node >=20.19 diperlukan. Pasang/aktifkan Node 22+.'}
$taskOriginalPath=$env:Path
Push-Location -LiteralPath $taskRoot
try {
  $env:Path=(Split-Path -Parent $taskNode)+';'+$env:Path
  if($Action -eq 'start'){& $taskNode server/index.js}
  elseif($Action -eq 'test'){& $taskNode tests/run.mjs}
  elseif($Action -eq 'install'){& (Join-Path (Split-Path -Parent $taskNode) 'npm.cmd') install --no-audit --no-fund}
  elseif($Action -eq 'build'){python scripts/build-knowledge.py;python scripts/build.py}
  if($LASTEXITCODE -ne 0){throw ('Workspace action gagal: '+$Action)}
}finally {$env:Path=$taskOriginalPath;Pop-Location}
