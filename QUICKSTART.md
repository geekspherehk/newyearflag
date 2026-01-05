# 年度Flag管理工具 - 快速开始

一个支持离线使用的Flag管理工具，可用于Web和移动端。

## 功能特点

- ✅ 完全离线使用，无需网络连接
- ✅ 数据存储在本地，隐私安全
- ✅ 支持Web和移动端
- ✅ 多平台支持（Windows、Linux、Mac、Android）
- ✅ 进度跟踪和提醒功能
- ✅ 统计分析和可行性评估

## 快速开始

### Web版本

1. **安装依赖**
   ```bash
   pip install -r requirements.txt
   ```

2. **启动Web服务**
   ```bash
   python web_app.py
   ```

3. **访问应用**
   打开浏览器访问 http://localhost:5000

### 命令行版本

```bash
python cli.py
```

### 移动端版本

#### 方式1：使用在线构建（推荐）

1. **推送到GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

2. **自动构建**
   - 推送代码后，GitHub Actions会自动构建APK
   - 访问仓库的"Actions"页面下载APK

3. **手动构建**
   - 在GitHub仓库的Actions页面
   - 选择"Build Android APK"工作流
   - 点击"Run workflow"

详细说明请查看 [ONLINE_BUILD_GUIDE.md](ONLINE_BUILD_GUIDE.md)

#### 方式2：本地构建

需要安装Android Studio和JDK，详见 [ANDROID_BUILD_GUIDE.md](ANDROID_BUILD_GUIDE.md)

## 文档

- [ONLINE_BUILD_GUIDE.md](ONLINE_BUILD_GUIDE.md) - 在线构建APK指南
- [ANDROID_BUILD_GUIDE.md](ANDROID_BUILD_GUIDE.md) - Android应用构建完整指南
- [README.md](README.md) - 项目完整文档

## 项目结构

```
NewYearFlag/
├── www/                      # Web应用资源（移动端）
│   ├── index.html
│   └── static/
│       ├── style.css
│       └── js/
│           ├── flag-manager.js
│           └── app.js
├── android/                  # Android项目（Capacitor生成）
├── .github/workflows/        # GitHub Actions配置
│   └── build-android.yml
├── web_app.py               # Web服务器
├── cli.py                   # 命令行界面
├── main.py                  # 核心逻辑
├── requirements.txt         # Python依赖
├── package.json             # Node.js依赖
└── capacitor.config.json    # Capacitor配置
```

## 技术栈

- **后端**：Python + Flask
- **前端**：HTML + CSS + JavaScript
- **移动端**：Capacitor + Android
- **数据存储**：localStorage（客户端）

## 离线使用

应用支持完全离线使用：

- 所有数据存储在浏览器本地
- 无需服务器连接
- 所有功能均可离线使用

## 许可证

MIT License
