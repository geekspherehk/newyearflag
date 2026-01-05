# 在线构建APK指南

本指南介绍如何使用在线服务构建Android APK，无需在本地安装JDK和Android SDK。

## 推荐的在线构建服务

### 1. GitHub Actions（推荐，免费）

GitHub Actions提供免费的CI/CD服务，可以自动构建Android应用。

#### 前置要求
- GitHub账号
- 项目代码在GitHub仓库中

#### 配置步骤

1. **创建GitHub工作流文件**
   
   在项目根目录创建 `.github/workflows/build-android.yml`：

```yaml
name: Build Android APK

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: |
        npm install

    - name: Sync Capacitor
      run: |
        npx cap sync android

    - name: Build Debug APK
      run: |
        cd android
        chmod +x gradlew
        ./gradlew assembleDebug

    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-debug
        path: android/app/build/outputs/apk/debug/app-debug.apk

    - name: Build Release APK
      if: github.event_name == 'workflow_dispatch'
      run: |
        cd android
        ./gradlew assembleRelease

    - name: Upload Release APK
      if: github.event_name == 'workflow_dispatch'
      uses: actions/upload-artifact@v3
      with:
        name: app-release
        path: android/app/build/outputs/apk/release/app-release.apk
```

2. **推送到GitHub**
   
   ```bash
   git add .
   git commit -m "Add GitHub Actions workflow"
   git push
   ```

3. **触发构建**
   
   - 自动触发：推送到main/master分支时自动构建
   - 手动触发：在GitHub仓库的Actions页面，选择"Build Android APK"工作流，点击"Run workflow"

4. **下载APK**
   
   - 构建完成后，在Actions页面找到对应的工作流运行记录
   - 点击进入，在底部的Artifacts部分下载APK文件

### 2. AppCenter（微软，免费）

#### 前置要求
- Microsoft账号
- GitHub或Azure DevOps账号

#### 配置步骤

1. **访问AppCenter**
   
   打开 https://appcenter.ms 并登录

2. **创建新应用**
   
   - 点击"Add new app"
   - 填写应用信息：
     - App name: 年度Flag管理
     - OS: Android
     - Platform: React Native / Cordova / Capacitor

3. **连接代码仓库**
   
   - 选择"Connect to repo"
   - 选择GitHub
   - 授权AppCenter访问你的GitHub仓库
   - 选择你的项目仓库

4. **配置构建**
   
   - Branch: 选择main或master
   - Build configuration: 选择Gradle
   - Gradle command: `./gradlew assembleDebug`
   - Build variant: debug

5. **开始构建**
   
   - 点击"Save and build"
   - 等待构建完成（通常2-5分钟）

6. **下载APK**
   
   - 构建完成后，在Build页面下载APK文件

### 3. Codemagic（免费额度）

#### 前置要求
- GitHub、GitLab或Bitbucket账号

#### 配置步骤

1. **访问Codemagic**
   
   打开 https://codemagic.io 并注册账号

2. **创建新应用**
   
   - 点击"Add new app"
   - 选择代码托管平台（GitHub）
   - 选择你的仓库

3. **配置构建**
   
   - Workflow: Android App
   - Build type: Debug
   - Build tools: Gradle

4. **添加构建脚本**
   
   在Codemagic的配置中添加：

```yaml
workflows:
  android-workflow:
    name: Android Workflow
    max_build_duration: 60
    instance_type: mac_mini
    environment:
      vars:
        JAVA_HOME: /Library/Java/JavaVirtualMachines/adoptopenjdk-11.jdk/Contents/Home
    scripts:
      - name: Install dependencies
        script: |
          npm install
      - name: Sync Capacitor
        script: |
          npx cap sync android
      - name: Build Debug APK
        script: |
          cd android
          ./gradlew assembleDebug
    artifacts:
      - android/app/build/outputs/apk/debug/*.apk
```

5. **开始构建**
   
   - 点击"Start new build"
   - 等待构建完成

6. **下载APK**
   
   - 构建完成后，在Build页面下载APK文件

### 4. Bitrise（免费额度）

#### 前置要求
- GitHub、GitLab或Bitbucket账号

#### 配置步骤

1. **访问Bitrise**
   
   打开 https://www.bitrise.io 并注册账号

2. **创建新应用**
   
   - 点击"Add new app"
   - 选择代码托管平台
   - 选择你的仓库

3. **配置工作流**
   
   - 选择"Android"模板
   - 添加以下步骤：
     - `Install npm packages`
     - `Run npm command` (命令: `npx cap sync android`)
     - `Gradle Runner` (任务: `assembleDebug`)

4. **开始构建**
   
   - 点击"Start a Build"
   - 等待构建完成

5. **下载APK**
   
   - 构建完成后，在Build页面下载APK文件

## 推荐方案对比

| 服务 | 免费额度 | 优点 | 缺点 | 推荐度 |
|------|---------|------|------|--------|
| GitHub Actions | 2000分钟/月 | 完全免费、集成好、自动化 | 需要GitHub账号 | ⭐⭐⭐⭐⭐ |
| AppCenter | 240分钟/月 | 简单易用、微软支持 | 免费额度较少 | ⭐⭐⭐⭐ |
| Codemagic | 100分钟/月 | 配置灵活、界面友好 | 免费额度较少 | ⭐⭐⭐ |
| Bitrise | 10分钟/月 | 功能强大 | 免费额度很少 | ⭐⭐ |

## 快速开始指南（推荐使用GitHub Actions）

### 步骤1：创建GitHub仓库（如果还没有）

```bash
# 初始化git仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 创建GitHub仓库后，添加远程地址
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送到GitHub
git push -u origin main
```

### 步骤2：创建工作流文件

在项目根目录创建 `.github/workflows/build-android.yml` 文件，内容见上方GitHub Actions配置。

### 步骤3：推送到GitHub

```bash
git add .github/workflows/build-android.yml
git commit -m "Add GitHub Actions workflow"
git push
```

### 步骤4：查看构建状态

1. 访问你的GitHub仓库
2. 点击"Actions"标签
3. 查看"Build Android APK"工作流的运行状态
4. 构建完成后，下载APK文件

## 常见问题

### Q1: 构建失败怎么办？

**A**: 检查以下几点：
- 确保package.json中的依赖正确
- 检查capacitor.config.json配置
- 查看构建日志中的错误信息
- 确保www目录包含所有必要的文件

### Q2: 如何构建Release版本？

**A**: 
- GitHub Actions：手动触发workflow_dispatch事件
- 其他服务：在配置中选择Release构建类型

### Q3: 构建需要多长时间？

**A**: 通常2-5分钟，具体取决于：
- 项目大小
- 构建服务的负载
- 网络速度

### Q4: 可以自动化构建吗？

**A**: 可以！配置GitHub Actions后，每次推送代码都会自动构建。

### Q5: 如何签名APK？

**A**: 
1. 生成签名密钥
2. 在构建配置中添加签名信息
3. 使用Release构建类型

详细步骤参考 [ANDROID_BUILD_GUIDE.md](ANDROID_BUILD_GUIDE.md) 中的签名部分。

## 下一步

构建完成后，你可以：

1. **在手机上安装APK**
   - 将APK文件传输到手机
   - 在手机上打开APK文件
   - 允许安装未知来源的应用
   - 完成安装

2. **测试应用**
   - 添加几个Flag
   - 测试所有功能
   - 验证离线功能

3. **分享APK**
   - 通过云盘分享
   - 通过邮件发送
   - 上传到应用商店

## 技术支持

如遇到问题，请参考：
- [GitHub Actions文档](https://docs.github.com/en/actions)
- [AppCenter文档](https://docs.microsoft.com/en-us/appcenter/)
- [Codemagic文档](https://docs.codemagic.io/)
- [Capacitor文档](https://capacitorjs.com/docs)

## 许可证

MIT License
