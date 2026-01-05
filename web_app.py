#!/usr/bin/env python3
"""
年度Flag管理工具 - Web界面
基于Flask的Web应用
支持离线模式，使用客户端JavaScript
"""

from flask import Flask, send_from_directory
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'

@app.route('/')
def index():
    """主页 - 返回静态HTML文件"""
    return send_from_directory('.', 'index.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    """提供静态文件服务"""
    return send_from_directory('static', filename)

if __name__ == '__main__':
    print("年度Flag管理工具 - Web界面")
    print("支持离线模式，数据存储在浏览器本地")
    print("访问地址: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
