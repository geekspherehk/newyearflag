#!/bin/bash

echo "========================================"
echo "   年度Flag管理工具 - 一键安装脚本"
echo "========================================"
echo ""

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "[错误] 未检测到Python3，请先安装Python 3.7或更高版本"
    echo ""
    echo "Ubuntu/Debian:"
    echo "  sudo apt update"
    echo "  sudo apt install python3 python3-pip"
    echo ""
    echo "macOS (使用Homebrew):"
    echo "  brew install python3"
    echo ""
    exit 1
fi

echo "[成功] 检测到Python3"
python3 --version
echo ""

# 升级pip
echo "[信息] 正在升级pip..."
python3 -m pip install --upgrade pip --user
if [ $? -ne 0 ]; then
    echo "[警告] pip升级失败，但可能不影响使用"
else
    echo "[成功] pip升级完成"
fi
echo ""

# 安装依赖
echo "[信息] 正在安装依赖包..."
pip3 install -r requirements.txt --user
if [ $? -ne 0 ]; then
    echo "[错误] 依赖安装失败"
    echo ""
    echo "尝试使用国内镜像源安装..."
    pip3 install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple --user
    if [ $? -ne 0 ]; then
        echo "[错误] 依赖安装失败，请检查网络连接"
        exit 1
    fi
fi
echo "[成功] 依赖安装完成"
echo ""

# 验证安装
echo "[信息] 验证安装..."
python3 -c "import flask; print('Flask版本:', flask.__version__)"
if [ $? -ne 0 ]; then
    echo "[错误] Flask验证失败"
    exit 1
fi
echo ""

# 添加执行权限
echo "[信息] 添加脚本执行权限..."
chmod +x start_web.sh start_cli.sh start_mobile.sh 2>/dev/null
echo "[成功] 权限设置完成"
echo ""

echo "========================================"
echo "   安装完成！"
echo "========================================"
echo ""
echo "现在可以运行以下启动脚本："
echo "  - Web界面: ./start_web.sh"
echo "  - CLI界面: ./start_cli.sh"
echo "  - 移动端服务: ./start_mobile.sh"
echo ""
echo "详细使用说明请查看 README.md"
echo ""
