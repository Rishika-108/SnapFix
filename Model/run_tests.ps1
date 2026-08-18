if (Test-Path "..\.venv\Scripts\Activate.ps1") {
    . "..\.venv\Scripts\Activate.ps1"
} elseif (Test-Path ".\.venv\Scripts\Activate.ps1") {
    . ".\.venv\Scripts\Activate.ps1"
} else {
    Write-Host "Warning: .venv not found. Tests may fail if dependencies are missing."
}
python -m pytest --verbose
