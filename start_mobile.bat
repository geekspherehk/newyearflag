@echo off
chcp 65001 >nul
echo ========================================
echo    年度Flag管理工具 - 移动端启动脚本
echo ========================================
echo.

cd /d "%~dp0"

echo [信息] 正在启动Flask服务器...
echo [信息] 服务器地址: http://127.0.0.1:5000
echo [信息] 请在手机上打开应用
echo.

python web_app.py

pause