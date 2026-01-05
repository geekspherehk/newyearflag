# 移动端快速使用指南

## 🚀 最简单的使用方式（推荐）

### 无需打包，直接使用

1. **在电脑上启动Flask服务器**
   ```bash
   # Windows
   start_mobile.bat
   
   # Linux/Mac
   ./start_mobile.sh
   ```

2. **在手机浏览器访问**
   - 打开手机浏览器
   - 输入: `http://你的电脑IP:5000`
   - 例如: `http://192.168.1.100:5000`

3. **添加到主屏幕**
   - 在浏览器菜单中选择"添加到主屏幕"
   - 以后就可以像APP一样使用了

## 📱 查找你的电脑IP地址

### Windows
```bash
ipconfig
```
找到"IPv4 地址"，例如: `192.168.1.100`

### Mac
```bash
ifconfig
```
找到 `en0` 下的 `inet` 地址

### Linux
```bash
ip addr
```
找到 `wlan0` 或 `eth0` 下的 `inet` 地址

## ⚙️ 确保网络连接

- 手机和电脑必须连接同一个WiFi
- 或者手机通过USB连接电脑并共享网络

## 📦 如果需要打包成APK

详细步骤请查看: [ANDROID_BUILD_GUIDE.md](file:///c:/work/code/NewYearFlag/ANDROID_BUILD_GUIDE.md)

## 🎯 优势对比

| 方式 | 优点 | 缺点 |
|------|------|------|
| **浏览器访问** | 无需安装，简单快捷 | 需要浏览器 |
| **打包APK** | 像原生APP体验 | 需要打包，首次安装 |

## 💡 使用提示

1. **首次使用**: 建议先用浏览器访问测试
2. **日常使用**: 添加到主屏幕后体验更好
3. **网络要求**: 确保电脑和手机在同一网络
4. **服务器运行**: 使用前必须先启动Flask服务器

## 🐛 常见问题

### Q: 手机无法访问？
A: 检查：
- 电脑防火墙是否允许5000端口
- 手机和电脑是否在同一WiFi
- IP地址是否正确

### Q: 服务器启动失败？
A: 检查：
- Python是否已安装
- Flask依赖是否已安装
- 5000端口是否被占用

### Q: 想要离线使用？
A: 需要打包成APK，参考详细打包指南

## 📞 需要帮助？

- 查看详细文档: [ANDROID_BUILD_GUIDE.md](file:///c:/work/code/NewYearFlag/ANDROID_BUILD_GUIDE.md)
- 查看项目文档: [README.md](file:///c:/work/code/NewYearFlag/README.md)