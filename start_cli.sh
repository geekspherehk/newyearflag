#!/bin/bash

echo "========================================"
echo "   年度Flag管理工具 - CLI界面启动器"
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

# 启动CLI应用
echo "[信息] 正在启动CLI应用..."
echo ""
python3 cli.py
