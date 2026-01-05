# 项目结构说明

```
NewYearFlag/
├── 核心程序文件
│   ├── main.py              # 核心功能模块（Flag管理器）
│   ├── cli.py               # 命令行界面
│   ├── web_app.py           # Web应用（Flask）
│   └── check_reminder.py    # 进度检查提醒脚本
│
├── 启动脚本（Windows）
│   ├── start_web.bat        # 启动Web界面
│   ├── start_cli.bat        # 启动CLI界面
│   ├── start_mobile.bat     # 启动移动端服务
│   └── install.bat          # 一键安装脚本
│
├── 启动脚本（Linux/Mac）
│   ├── start_web.sh         # 启动Web界面
│   ├── start_cli.sh         # 启动CLI界面
│   ├── start_mobile.sh      # 启动移动端服务
│   └── install.sh           # 一键安装脚本
│
├── Web界面文件
│   ├── templates/            # HTML模板目录
│   │   ├── base.html        # 基础模板
│   │   ├── index.html       # 首页
│   │   ├── flags.html       # Flag列表页
│   │   ├── add_flag.html    # 添加Flag页
│   │   ├── flag_detail.html # Flag详情页
│   │   ├── reminders.html   # 提醒页
│   │   └── statistics.html  # 统计页
│   │
│   └── static/              # 静态资源目录
│       └── style.css        # 样式文件
│
├── 数据文件
│   └── flags.json           # Flag数据存储（自动创建）
│
├── 工具脚本
│   ├── launcher.py          # 启动器菜单
│   └── create_sample_data.py # 创建示例数据
│
├── 配置文件
│   └── requirements.txt     # Python依赖列表
│
└── 文档文件
    ├── README.md            # 完整使用说明
    ├── QUICKSTART.md        # 快速开始指南
    ├── 项目总结.md          # 项目总结
    ├── PROJECT_STRUCTURE.md # 本文件
    ├── MOBILE_QUICKSTART.md # 移动端快速开始指南
    └── ANDROID_BUILD_GUIDE.md # Android打包指南
```

---

## 📂 文件分类说明

### 1. 核心程序文件
这些文件包含了应用的主要功能逻辑：

- **main.py**: FlagManager类，提供所有核心功能（添加、更新、删除、统计等）
- **cli.py**: 命令行界面，提供命令行操作方式
- **web_app.py**: Web应用，使用Flask创建网页应用
- **check_reminder.py**: 独立的提醒脚本，可以定期运行检查进度

### 2. 启动脚本
这些脚本用于启动不同的界面：

**Windows (.bat)**:
- 双击即可运行，自动检查环境和依赖
- 首次运行会自动安装依赖
- 提供友好的中文提示

**Linux/Mac (.sh)**:
- 需要执行权限（chmod +x）
- 使用./运行
- 同样支持自动安装依赖

### 3. Web界面文件
Web应用的前端文件：

**templates/**: HTML模板文件
- base.html: 所有页面的基础模板
- 其他页面继承自base.html

**static/**: 静态资源文件
- style.css: 所有页面的样式表

### 4. 数据文件
- **flags.json**: 存储所有Flag数据，JSON格式
  - 首次运行时自动创建
  - 包含所有Flag的详细信息
  - 建议定期备份

### 5. 工具脚本
辅助工具：

- **launcher.py**: 提供菜单选择不同界面
- **create_sample_data.py**: 创建示例数据用于测试

### 6. 配置文件
- **requirements.txt**: Python依赖包列表
  - flask==3.1.2
  - 可通过pip安装

### 7. 文档文件
使用说明和文档：

- **README.md**: 完整的安装和使用指南
- **QUICKSTART.md**: 快速开始指南
- **项目总结.md**: 项目功能总结
- **PROJECT_STRUCTURE.md**: 本文件，项目结构说明

---

## 🔧 扩展开发

### 添加新功能
1. 在main.py中添加新的方法到FlagManager类
2. 在相应的界面文件（cli.py/web_app.py）中调用新方法
3. 如果是Web界面，需要在templates/中添加对应的HTML模板

### 修改样式
- 编辑 static/style.css 文件
- 修改后刷新浏览器即可看到效果

### 更改端口
编辑 web_app.py 最后一行：
```python
app.run(debug=True, host='0.0.0.0', port=5000)  # 修改端口号
```

### 添加新的依赖
1. 在 requirements.txt 中添加依赖
2. 运行 pip install -r requirements.txt 安装

---

## 📊 数据流程

```
用户操作
    ↓
界面层（CLI/Web/移动端）
    ↓
业务逻辑层（main.py - FlagManager）
    ↓
数据存储层（flags.json）
```

---

## 🎯 核心功能模块

### FlagManager类（main.py）
- `add_flag()` - 添加Flag
- `update_progress()` - 更新进度
- `delete_flag()` - 删除Flag
- `list_flags()` - 列出Flag
- `get_statistics()` - 获取统计
- `get_monthly_reminders()` - 获取提醒
- `assess_feasibility()` - 可行性评估

---

## 🚀 部署建议

### 本地使用
直接运行启动脚本即可

### 局域网访问
1. 确保防火墙允许端口5000
2. 其他设备访问 http://<服务器IP>:5000

### 生产环境
建议使用生产级WSGI服务器：
- Gunicorn（Linux）
- Waitress（Windows）
- uWSGI

---

## 📝 注意事项

1. **不要手动编辑 flags.json**，除非你了解JSON格式
2. **定期备份 flags.json** 文件
3. **Python版本** 需要 3.7 或更高
4. **端口冲突**：如果5000端口被占用，需要修改web_app.py
5. **数据安全**：flags.json包含个人数据，注意保护

---

## 🎓 学习资源

- Python官方文档: https://docs.python.org/
- Flask官方文档: https://flask.palletsprojects.com/
- Capacitor文档: https://capacitorjs.com/docs

---

如有问题，请查看 README.md 中的常见问题部分。
