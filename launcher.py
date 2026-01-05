#!/usr/bin/env python3
"""
年度Flag管理工具 - 启动器
提供简单的菜单界面来选择使用哪种方式运行工具
"""

import sys
import os

def show_menu():
    """显示启动菜单"""
    print("\n" + "="*50)
    print("🎯 年度Flag管理工具")
    print("="*50)
    print("1. 命令行界面 (CLI)")
    print("2. Web界面")
    print("3. 进度检查提醒")
    print("4. 生成进度报告")
    print("5. 查看使用帮助")
    print("6. 退出")
    print("-"*50)

def run_cli():
    """运行命令行界面"""
    print("\n🚀 启动命令行界面...")
    os.system("python cli.py --help")
    print("\n💡 使用提示:")
    print("  python cli.py add '标题' '描述' '目标日期'")
    print("  python cli.py list")
    print("  python cli.py update ID 进度")
    print("  python cli.py stats")

def run_web():
    """运行Web界面"""
    print("\n🚀 启动Web界面...")
    print("💡 使用提示:")
    print("  Web界面将在浏览器中打开")
    print("  使用 Ctrl+C 停止服务器")
    os.system("python web_app.py")

def run_check():
    """运行进度检查"""
    print("\n🔍 运行进度检查...")
    os.system("python check_reminder.py")

def run_report():
    """生成进度报告"""
    print("\n📄 生成进度报告...")
    os.system("python check_reminder.py --report")

def show_help():
    """显示帮助信息"""
    print("\n📖 使用帮助:")
    print("""
年度Flag管理工具帮助你管理新年目标，提供以下功能：

🔹 命令行界面 (CLI)
   适合喜欢命令行操作的用户，功能完整
   使用: python cli.py [命令]

🔹 Web界面
   适合喜欢图形界面的用户，操作简单
   使用: python web_app.py

🔹 进度检查提醒
   定期检查flag进度，提供提醒和建议
   使用: python check_reminder.py

🔹 生成进度报告
   生成详细的进度报告文件
   使用: python check_reminder.py --report

🔹 快速开始:
   1. 添加flag: python cli.py add "学习目标" "具体描述" "2024-12-31"
   2. 查看列表: python cli.py list
   3. 更新进度: python cli.py update ID 50
   4. 查看统计: python cli.py stats

🔹 可行性评估:
   工具会自动评估flag的可行性，考虑因素包括：
   - 时间合理性
   - 描述具体性
   - 可量化指标
   - 目标明确性

🔹 月度提醒:
   自动提醒长时间未检查的flags
   提醒即将到期的flags
""")

def main():
    """主函数"""
    while True:
        show_menu()
        
        try:
            choice = input("\n请选择操作 (1-6): ").strip()
            
            if choice == '1':
                run_cli()
            elif choice == '2':
                run_web()
            elif choice == '3':
                run_check()
            elif choice == '4':
                run_report()
            elif choice == '5':
                show_help()
            elif choice == '6':
                print("\n👋 再见！祝你新年快乐，flag都能实现！")
                break
            else:
                print("\n❌ 无效选择，请输入1-6之间的数字")
                
        except KeyboardInterrupt:
            print("\n\n👋 再见！祝你新年快乐，flag都能实现！")
            break
        except Exception as e:
            print(f"\n❌ 发生错误: {str(e)}")
            print("💡 请重试或查看帮助信息")

if __name__ == "__main__":
    main()
