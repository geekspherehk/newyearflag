@echo off
chcp 65001 >nul
echo ========================================
echo    年度Flag管理工具 - Web界面启动器
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

REM 检查依赖是否安装
echo [信息] 检查依赖...
pip show flask >nul 2>&1
if %errorlevel% neq 0 (
    echo [信息] 正在安装依赖...
    pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
    echo [成功] 依赖安装完成
) else (
    echo [成功] 依赖已安装
)
echo.

REM 启动Web应用
echo [信息] 正在启动Web应用...
echo.
echo ========================================
echo    Web应用已启动！
echo    访问地址: http://127.0.0.1:5000
echo    按 Ctrl+C 停止服务
echo ========================================
echo.

python web_app.py

pause
