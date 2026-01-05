# Android应用构建指南

## 概述

本指南将帮助你将年度Flag管理工具打包为Android应用。应用使用Capacitor框架，将Web应用封装为原生Android应用。

## 前置要求

### 必需工具

1. **Android Studio**
   - 下载地址：https://developer.android.com/studio
   - 安装后需要配置Android SDK
   - 确保安装了以下SDK组件：
     - Android SDK Platform-Tools
     - Android SDK Build-Tools
     - Android 13.0 (API 33) 或更高版本

2. **Java Development Kit (JDK)**
   - 推荐使用 JDK 11 或 JDK 17
   - 下载地址：https://www.oracle.com/java/technologies/downloads/

3. **Node.js 和 npm**
   - 项目已包含，确保版本 >= 14

### 环境变量配置

确保以下环境变量已正确设置：

```bash
# Android SDK路径
ANDROID_HOME=C:\Users\你的用户名\AppData\Local\Android\Sdk

# Java路径
JAVA_HOME=C:\Program Files\Java\jdk-17

# 添加到PATH
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

## 构建步骤

### 方法一：使用Android Studio（推荐）

1. **打开Android项目**
   ```bash
   npx cap open android
   ```

2. **在Android Studio中**
   - 等待Gradle同步完成（首次可能需要几分钟）
   - 点击菜单：Build → Build Bundle(s) / APK(s) → Build APK(s)
   - 构建完成后，点击通知中的"locate"查看APK文件位置

3. **安装APK**
   - 将APK文件传输到Android设备
   - 在设备上安装APK

### 方法二：使用命令行构建

1. **进入Android项目目录**
   ```bash
   cd android
   ```

2. **构建Debug版本APK**
   ```bash
   .\gradlew assembleDebug
   ```

3. **构建Release版本APK**
   ```bash
   .\gradlew assembleRelease
   ```

4. **APK文件位置**
   - Debug版本：`android\app\build\outputs\apk\debug\app-debug.apk`
   - Release版本：`android\app\build\outputs\apk\release\app-release.apk`

## 签名Release版本APK

### 生成签名密钥

1. **使用keytool生成密钥库**
   ```bash
   keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **配置签名**
   
   在 `android/app/build.gradle` 中添加：

   ```gradle
   android {
       signingConfigs {
           release {
               storeFile file("my-release-key.keystore")
               storePassword "你的密钥库密码"
               keyAlias "my-key-alias"
               keyPassword "你的密钥密码"
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
               minifyEnabled true
               proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

3. **构建签名后的Release APK**
   ```bash
   .\gradlew assembleRelease
   ```

## 应用配置

### 修改应用信息

编辑 `capacitor.config.json`：

```json
{
  "appId": "com.newyearflag.app",
  "appName": "年度Flag管理",
  "webDir": "www",
  "server": {
    "url": "http://127.0.0.1:5000",
    "cleartext": true
  }
}
```

### 修改应用图标

1. 准备应用图标（推荐尺寸：512x512 PNG）
2. 使用在线工具生成各尺寸图标：https://icon.kitchen/
3. 替换 `android/app/src/main/res/mipmap-*` 目录下的图标文件

### 修改应用名称

编辑 `android/app/src/main/res/values/strings.xml`：

```xml
<resources>
    <string name="app_name">年度Flag管理</string>
</resources>
```

## 测试应用

### 在模拟器中测试

1. **启动Android模拟器**
   - 在Android Studio中点击Device Manager
   - 创建或选择一个虚拟设备
   - 启动模拟器

2. **运行应用**
   ```bash
   npx cap run android
   ```

### 在真机上测试

1. **启用开发者选项**
   - 设置 → 关于手机 → 连续点击"版本号"7次

2. **启用USB调试**
   - 设置 → 开发者选项 → USB调试

3. **连接设备并运行**
   ```bash
   npx cap run android
   ```

## 离线功能说明

本应用支持完全离线使用：

- **数据存储**：所有数据存储在浏览器本地（localStorage）
- **无需服务器**：应用启动后无需网络连接
- **功能完整**：所有功能（添加、编辑、删除、统计）均可离线使用

### 注意事项

- 数据存储在设备本地，卸载应用会丢失数据
- 建议定期截图或记录重要数据
- 如需数据备份，可考虑导出localStorage数据

## 常见问题

### 1. Gradle同步失败

**问题**：Android Studio中Gradle同步失败

**解决方案**：
- 检查网络连接
- 尝试使用VPN
- 在 `gradle.properties` 中添加国内镜像源

### 2. 构建失败：SDK版本不匹配

**问题**：构建时提示SDK版本不匹配

**解决方案**：
- 打开SDK Manager
- 安装所需的SDK版本
- 更新 `build.gradle` 中的 `compileSdkVersion`

### 3. 应用无法启动

**问题**：安装后应用无法启动

**解决方案**：
- 检查 `capacitor.config.json` 配置
- 确保Web资源已正确同步：`npx cap sync android`
- 查看logcat日志：`adb logcat`

### 4. 网络请求被阻止

**问题**：应用无法访问网络

**解决方案**：
- 在 `AndroidManifest.xml` 中添加网络权限
- 确保服务器地址配置正确
- 检查防火墙设置

## 发布到应用商店

### 准备发布

1. **生成签名APK或AAB**
   ```bash
   .\gradlew bundleRelease
   ```

2. **准备应用商店资料**
   - 应用图标（512x512）
   - 应用截图（至少2张）
   - 应用描述
   - 隐私政策
   - 内容评级问卷

### 上传到Google Play

1. 登录 [Google Play Console](https://play.google.com/console)
2. 创建新应用
3. 填写应用信息
4. 上传AAB或APK文件
5. 提交审核

## 技术支持

如遇到问题，请检查：

1. [Capacitor官方文档](https://capacitorjs.com/docs)
2. [Android开发者文档](https://developer.android.com/docs)
3. 项目GitHub Issues

## 更新应用

### 更新Web内容

1. 修改 `www` 目录下的文件
2. 同步到Android项目：
   ```bash
   npx cap sync android
   ```
3. 重新构建APK

### 更新Capacitor版本

```bash
npm install @capacitor/android@latest
npm install @capacitor/cli@latest
npx cap sync android
```

## 性能优化建议

1. **压缩资源**
   - 压缩图片资源
   - 压缩JavaScript和CSS文件

2. **启用代码混淆**
   - 在 `build.gradle` 中启用 `minifyEnabled true`

3. **优化启动时间**
   - 减少初始加载的资源
   - 使用懒加载

## 许可证

MIT License
