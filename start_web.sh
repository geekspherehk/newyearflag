#!/bin/bash

echo "========================================"
echo "   年度Flag管理工具 - Web界面启动器"
echo "========================================"
echo ""

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "[错误] 未检测到Python3，请先安装Python 3.7或更高版本"
    exit 1
fi

echo "[信息] Python版本:"
python3 --version
echo ""

# 检查依赖是否安装
echo "[信息] 检查依赖..."
if ! python3 -c "import flask" &> /dev/null; then
    echo "[信息] 正在安装依赖..."
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "[错误] 依赖安装失败"
        exit 1
    fi
    echo "[成功] 依赖安装完成"
else
    echo "[成功] 依赖已安装"
fi
echo ""

# 启动Web应用
echo "[信息] 正在启动Web应用..."
echo ""
echo "========================================"
echo "   Web应用已启动！"
echo "   访问地址: http://127.0.0.1:5000"
echo "   按 Ctrl+C 停止服务"
echo "========================================"
echo ""

python3 web_app.py
