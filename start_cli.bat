@echo off
chcp 65001 >nul
echo ========================================
echo    年度Flag管理工具 - CLI界面启动器
echo ========================================
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Python，请先安装Python 3.7或更高版本
    echo 下载地址: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [信息] Python版本:
python --version
echo.

REM 启动CLI应用
echo [信息] 正在启动CLI应用...
echo.
python cli.py

pause
