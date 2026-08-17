@echo off
chcp 65001 > nul
set MACHINE_ID=%1

set LOG_DIR=arc-system\section-manager\logs

if "%MACHINE_ID%"=="" (
    echo =========================================================
    echo Usage: watch_log.bat ^<MachineID^>
    echo Example: watch_log.bat WB83
    echo.
    echo Available logs:
    dir /b %LOG_DIR%\*.log
    echo =========================================================
    echo.
    set /p MACHINE_ID="Enter Machine ID (e.g. WB83): "
)

:: Remove # if user typed it
set MACHINE_ID=%MACHINE_ID:#=%

set LOG_FILE=%LOG_DIR%\%MACHINE_ID%.log

if not exist "%LOG_FILE%" (
    echo Log file "%LOG_FILE%" not found.
    pause
    exit /b 1
)

TITLE Watch Log - %MACHINE_ID%
echo Tailing %LOG_FILE% ... (Press Ctrl+C to stop)
powershell -Command "Get-Content -Path '%LOG_FILE%' -Encoding UTF8 -Wait -Tail 50"
