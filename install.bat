@echo off
chcp 65001 >nul
echo ========================================
echo    年度Flag管理工具 - 一键安装脚本
echo ========================================
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Python，请先安装Python 3.7或更高版本
    echo 下载地址: https://www.python.org/downloads/
    echo.
    echo 安装提示: 运行Python安装程序时，请务必勾选 "Add Python to PATH"
    pause
    exit /b 1
)

echo [成功] 检测到Python
python --version
echo.

REM 升级pip
echo [信息] 正在升级pip...
python -m pip install --upgrade pip
if %errorlevel% neq 0 (
    echo [警告] pip升级失败，但可能不影响使用
) else (
    echo [成功] pip升级完成
)
echo.

REM 安装依赖
echo [信息] 正在安装依赖包...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [错误] 依赖安装失败
    echo.
    echo 尝试使用国内镜像源安装...
    pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败，请检查网络连接
        pause
        exit /b 1
    )
)
echo [成功] 依赖安装完成
echo.

REM 验证安装
echo [信息] 验证安装...
python -c "import flask; print('Flask版本:', flask.__version__)"
if %errorlevel% neq 0 (
    echo [错误] Flask验证失败
    pause
    exit /b 1
)
echo.

echo ========================================
echo    安装完成！
echo ========================================
echo.
echo 现在可以运行以下启动脚本：
echo   - Web界面: 双击 start_web.bat
echo   - CLI界面: 双击 start_cli.bat
echo   - 移动端服务: 双击 start_mobile.bat
echo.
echo 详细使用说明请查看 README.md
echo.
pause
