param(
  [Parameter(Mandatory = $true)]
  [string]$PostgresPassword,

  [string]$PostgresUser = "postgres",
  [string]$HostName = "127.0.0.1",
  [int]$Port = 5432,
  [string]$PsqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $PsqlPath)) {
  throw "psql not found at $PsqlPath. Update -PsqlPath."
}

$env:PGPASSWORD = $PostgresPassword

function Ensure-Database([string]$DbName) {
  $exists = & $PsqlPath -U $PostgresUser -h $HostName -p $Port -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DbName'"
  if ($exists -match "1") {
    Write-Host "Database already exists: $DbName"
    return
  }
  Write-Host "Creating database: $DbName"
  & $PsqlPath -U $PostgresUser -h $HostName -p $Port -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE $DbName"
}

Write-Host "Creating databases splendor_school and splendor_ngo..."
Ensure-Database "splendor_school"
Ensure-Database "splendor_ngo"

$schoolUrl = "postgresql://${PostgresUser}:${PostgresPassword}@${HostName}:${Port}/splendor_school?schema=public"
$ngoUrl = "postgresql://${PostgresUser}:${PostgresPassword}@${HostName}:${Port}/splendor_ngo?schema=public"

function Set-EnvDatabaseUrl([string]$Path, [string]$Url) {
  if (-not (Test-Path $Path)) { throw "Missing env file: $Path" }
  $content = Get-Content $Path -Raw
  if ($content -match 'DATABASE_URL=') {
    $content = $content -replace 'DATABASE_URL=".*"', "DATABASE_URL=`"$Url`""
  } else {
    $content = "DATABASE_URL=`"$Url`"`n" + $content
  }
  Set-Content -Path $Path -Value $content -NoNewline
}

Set-EnvDatabaseUrl "apps/school/.env" $schoolUrl
Set-EnvDatabaseUrl "apps/ngo/.env" $ngoUrl

Write-Host "Updated apps/school/.env and apps/ngo/.env"
Write-Host "Running prisma db push + seed..."

Push-Location apps/school
npx prisma generate
npx prisma db push
npm run db:seed
Pop-Location

# Stop anything locking the NGO Prisma engine DLL (common on Windows)
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 1

Push-Location apps/ngo
npx prisma generate
npx prisma db push
npm run db:seed
Pop-Location

Write-Host "PostgreSQL setup complete."
Write-Host "Start apps with: npm run dev:school   and   npm run dev:ngo"
