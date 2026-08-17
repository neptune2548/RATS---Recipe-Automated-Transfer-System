@echo off
TITLE RATS SECS/GEM Python Backend Server
echo ==============================================================================
echo                 RATS SECS/GEM PROTOCOL ENGINE BACKEND                        
echo ==============================================================================
echo.
echo Starting Python FastAPI RATS Server on http://localhost:8080 ...
echo.

cd /d "%~dp0client-rats"
python main.py

pause
