# 年度Flag管理工具 - 安装和使用指南

## 📋 目录
- [系统要求](#系统要求)
- [快速开始](#快速开始)
- [详细安装步骤](#详细安装步骤)
- [使用方法](#使用方法)
- [功能说明](#功能说明)
- [常见问题](#常见问题)

---

## 💻 系统要求

### 最低要求
- **操作系统**: Windows 7+, macOS 10.12+, 或 Linux
- **Python**: 3.7 或更高版本
- **内存**: 至少 512MB 可用内存
- **磁盘空间**: 至少 50MB 可用空间

### 推荐配置
- **Python**: 3.9 或更高版本
- **内存**: 1GB 或更多
- **浏览器**: Chrome, Firefox, Safari, 或 Edge 最新版本（用于Web界面）

---

## 🚀 快速开始

### Windows用户

1. **双击运行启动脚本**
   - Web界面: 双击 `start_web.bat`
   - CLI界面: 双击 `start_cli.bat`
   - 移动端: 双击 `start_mobile.bat`

2. **首次运行会自动安装依赖**

3. **打开浏览器访问**: http://127.0.0.1:5000

### Linux/Mac用户

1. **打开终端，进入项目目录**
   ```bash
   cd /path/to/NewYearFlag
   ```

2. **运行启动脚本**
   - Web界面: `./start_web.sh`
   - CLI界面: `./start_cli.sh`
   - 移动端: `./start_mobile.sh`

3. **打开浏览器访问**: http://127.0.0.1:5000

---

## 📦 详细安装步骤

### 步骤1: 安装Python

#### Windows
1. 访问 https://www.python.org/downloads/
2. 下载最新版本的Python安装程序
3. 运行安装程序，**重要**: 勾选 "Add Python to PATH"
4. 完成安装后，打开命令提示符，输入 `python --version` 验证安装

#### macOS
```bash
# 使用Homebrew安装
brew install python3

# 或从官网下载安装包
# https://www.python.org/downloads/macos/
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install python3 python3-pip
```

#### Linux (CentOS/RHEL)
```bash
sudo yum install python3 python3-pip
```

### 步骤2: 安装依赖

#### 自动安装（推荐）
- Windows: 运行 `start_web.bat`，会自动安装依赖
- Linux/Mac: 运行 `./start_web.sh`，会自动安装依赖

#### 手动安装
```bash
pip install -r requirements.txt
```

### 步骤3: 验证安装

```bash
# 检查Python版本
python --version

# 检查Flask是否安装
python -c "import flask; print(flask.__version__)"
```

---

## 🎮 使用方法

### 方式1: Web界面（推荐）

**启动方式**:
- Windows: 双击 `start_web.bat`
- Linux/Mac: 运行 `./start_web.sh`

**访问地址**: http://127.0.0.1:5000

**功能特点**:
- 🎨 现代化的用户界面
- 📱 响应式设计，支持移动设备
- 🖱️ 鼠标操作，简单直观
- 📊 实时进度显示和统计图表
- 🔔 智能提醒功能

### 方式2: 命令行界面（CLI）

**启动方式**:
- Windows: 双击 `start_cli.bat`
- Linux/Mac: 运行 `./start_cli.sh`

**常用命令**:
```bash
# 添加Flag
python cli.py add

# 列出所有Flag
python cli.py list

# 更新进度
python cli.py update

# 查看统计
python cli.py stats

# 查看帮助
python cli.py --help
```

**功能特点**:
- ⚡ 快速高效
- 🔧 适合高级用户
- 💻 无需图形界面
- 📝 支持脚本化操作

### 方式3: 移动端访问

**启动方式**:
- Windows: 双击 `start_mobile.bat`
- Linux/Mac: 运行 `./start_mobile.sh`

**访问方式**:
1. 确保手机和电脑在同一WiFi网络
2. 在手机浏览器访问: `http://<你的电脑IP>:5000`
3. 添加到主屏幕，像APP一样使用

**功能特点**:
- 📱 移动端优化界面
- 🌐 跨平台访问
- 📲 随时随地管理Flag
- 🔄 实时数据同步

详细移动端使用指南请查看: [MOBILE_QUICKSTART.md](file:///c:/work/code/NewYearFlag/MOBILE_QUICKSTART.md)

---

## ✨ 功能说明

### 核心功能

#### 1. Flag管理
- **添加Flag**: 创建新的年度目标
- **编辑Flag**: 修改Flag的详细信息
- **删除Flag**: 删除不需要的Flag
- **分类管理**: 按类别组织Flag

#### 2. 进度跟踪
- **进度更新**: 实时更新Flag完成进度（0-100%）
- **历史记录**: 记录每次进度更新的时间和备注
- **状态管理**: 自动更新Flag状态（未开始/进行中/已完成）

#### 3. 可行性评估
- **智能评分**: 自动评估Flag的可行性（0-100分）
- **详细分析**: 提供可行性分析和改进建议
- **时间评估**: 评估目标时间的合理性

#### 4. 提醒功能
- **月度提醒**: 自动提醒需要检查的Flag
- **进度跟踪**: 定期检查Flag进度
- **智能推送**: 根据Flag状态智能推送提醒

#### 5. 统计分析
- **总体统计**: 总Flag数、完成数、进行中、未开始
- **完成率**: 计算整体完成率
- **分类统计**: 按类别统计Flag数量和完成情况
- **可行性分析**: 平均可行性评分

### 数据存储

- **存储格式**: JSON格式
- **存储位置**: `flags.json`（自动创建）
- **数据备份**: 建议定期备份 `flags.json` 文件

---

## ❓ 常见问题

### Q1: 启动时提示"未检测到Python"

**解决方案**:
1. 确认Python已正确安装
2. 检查Python是否已添加到系统PATH
3. Windows用户: 重新安装Python，勾选"Add Python to PATH"
4. 验证安装: 打开命令提示符，输入 `python --version`

### Q2: 依赖安装失败

**解决方案**:
```bash
# 升级pip
python -m pip install --upgrade pip

# 使用国内镜像源安装
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

### Q3: Web界面无法访问

**检查清单**:
1. 确认Web服务已启动（查看终端输出）
2. 检查端口5000是否被占用
3. 尝试访问 http://127.0.0.1:5000 或 http://localhost:5000
4. 检查防火墙设置

### Q4: 数据丢失

**预防措施**:
1. 定期备份 `flags.json` 文件
2. 不要手动编辑 `flags.json` 文件
3. 使用应用提供的导出功能（如果有的话）

### Q5: 如何更换端口？

**修改方法**:
编辑 `web_app.py` 文件，找到最后一行：
```python
app.run(debug=True, host='0.0.0.0', port=5000)
```
将 `port=5000` 改为你想要的端口号，例如 `port=8080`

### Q6: 如何在其他设备上访问？

**修改方法**:
1. 确保防火墙允许端口5000的访问
2. 启动时使用 `0.0.0.0` 作为host（默认已配置）
3. 在其他设备上访问: `http://<你的IP地址>:5000`
4. 查看本机IP地址:
   - Windows: `ipconfig`
   - Linux/Mac: `ifconfig` 或 `ip addr`

### Q7: 如何卸载？

**卸载步骤**:
1. 停止运行中的应用
2. 删除项目文件夹
3. （可选）卸载Python依赖: `pip uninstall flask`

---

## 📞 技术支持

如遇到问题，请检查：
1. Python版本是否符合要求
2. 依赖是否正确安装
3. 文件权限是否正确
4. 端口是否被占用

---

## 📄 许可证

本工具仅供个人学习和使用。

---

## 🎉 祝你新年快乐，Flag都能实现！

如有任何问题或建议，欢迎反馈。
