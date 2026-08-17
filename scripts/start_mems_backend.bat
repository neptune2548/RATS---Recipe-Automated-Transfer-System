@echo off
TITLE MEMS FastAPI Backend Server
echo ==============================================================================
echo                 MEMS MACHINE EFFICIENCY MONITOR BACKEND                        
echo ==============================================================================
echo.
echo Starting Python FastAPI MEMS Server on http://localhost:8000 ...
echo.

cd /d "%~dp0arc-system\client-mems"
python server.py

pause
