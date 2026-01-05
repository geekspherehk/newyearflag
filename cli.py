#!/usr/bin/env python3
"""
年度Flag管理工具 - 命令行界面
"""

import argparse
import sys
from datetime import datetime
from main import FlagManager

def print_flag(flag):
    """格式化打印flag信息"""
    print(f"\n🎯 {flag['title']}")
    print(f"   ID: {flag['id'][:8]}...")
    print(f"   描述: {flag['description']}")
    print(f"   分类: {flag['category']}")
    print(f"   目标日期: {flag['target_date']}")
    print(f"   进度: {flag['progress']}%")
    print(f"   状态: {flag['status']}")
    print(f"   可行性评分: {flag['feasibility_score']}/100")
    print(f"   可行性分析: {flag['feasibility_reason']}")
    print(f"   创建时间: {flag['created_date']}")
    
    if flag['check_history']:
        print(f"   最近检查: {flag['check_history'][-1]['date']}")

def add_flag(manager, args):
    """添加新flag"""
    flag = manager.add_flag(
        title=args.title,
        description=args.description,
        target_date=args.target_date,
        category=args.category or "其他"
    )
    print("✅ Flag添加成功！")
    print_flag(flag)

def list_flags(manager, args):
    """列出flags"""
    flags = manager.list_flags(category=args.category, status=args.status)
    
    if not flags:
        print("📭 暂无flags")
        return
    
    print(f"\n📋 共有 {len(flags)} 个flags:")
    
    for flag in flags:
        status_icon = {
            "未开始": "⏳",
            "进行中": "🔄",
            "已完成": "✅"
        }.get(flag['status'], "❓")
        
        print(f"\n{status_icon} {flag['title']} ({flag['progress']}%)")
        print(f"   ID: {flag['id'][:8]}... | 状态: {flag['status']} | 目标: {flag['target_date']}")
        print(f"   可行性: {flag['feasibility_score']}/100 | 分类: {flag['category']}")

def update_progress(manager, args):
    """更新进度"""
    success = manager.update_progress(args.flag_id, args.progress, args.notes or "")
    if success:
        print("✅ 进度更新成功！")
        # 显示更新后的flag
        flags = manager.list_flags()
        for flag in flags:
            if flag['id'].startswith(args.flag_id):
                print_flag(flag)
                break
    else:
        print("❌ 未找到对应的flag，请检查ID是否正确")

def show_reminders(manager, args):
    """显示月度提醒"""
    reminders = manager.get_monthly_reminders()
    
    if not reminders:
        print("📅 暂无需要检查的flags")
        return
    
    print(f"\n🔔 有 {len(reminders)} 个flags需要检查进度：")
    for flag in reminders:
        print_flag(flag)
        print(f"   💡 建议：是时候检查这个flag的进度了！")

def show_stats(manager, args):
    """显示统计信息"""
    stats = manager.get_statistics()
    
    print(f"\n📊 Flag统计信息：")
    print(f"   总数量: {stats['total']}")
    print(f"   已完成: {stats['completed']}")
    print(f"   进行中: {stats['in_progress']}")
    print(f"   未开始: {stats['not_started']}")
    print(f"   完成率: {stats['completion_rate']:.1f}%")
    print(f"   平均可行性评分: {stats['avg_feasibility']}/100")

def delete_flag(manager, args):
    """删除flag"""
    success = manager.delete_flag(args.flag_id)
    if success:
        print("✅ Flag删除成功！")
    else:
        print("❌ 未找到对应的flag，请检查ID是否正确")

def main():
    parser = argparse.ArgumentParser(description="年度Flag管理工具")
    subparsers = parser.add_subparsers(dest='command', help='可用命令')
    
    # 添加flag命令
    add_parser = subparsers.add_parser('add', help='添加新flag')
    add_parser.add_argument('title', help='flag标题')
    add_parser.add_argument('description', help='flag描述')
    add_parser.add_argument('target_date', help='目标日期 (格式: YYYY-MM-DD)')
    add_parser.add_argument('--category', help='分类 (默认: 其他)')
    
    # 列出flags命令
    list_parser = subparsers.add_parser('list', help='列出flags')
    list_parser.add_argument('--category', help='按分类筛选')
    list_parser.add_argument('--status', help='按状态筛选 (未开始/进行中/已完成)')
    
    # 更新进度命令
    update_parser = subparsers.add_parser('update', help='更新flag进度')
    update_parser.add_argument('flag_id', help='flag ID (前8位即可)')
    update_parser.add_argument('progress', type=int, help='进度 (0-100)')
    update_parser.add_argument('--notes', help='备注信息')
    
    # 月度提醒命令
    reminder_parser = subparsers.add_parser('reminders', help='显示月度提醒')
    
    # 统计命令
    stats_parser = subparsers.add_parser('stats', help='显示统计信息')
    
    # 删除命令
    delete_parser = subparsers.add_parser('delete', help='删除flag')
    delete_parser.add_argument('flag_id', help='flag ID (前8位即可)')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    manager = FlagManager()
    
    # 执行对应命令
    if args.command == 'add':
        add_flag(manager, args)
    elif args.command == 'list':
        list_flags(manager, args)
    elif args.command == 'update':
        update_progress(manager, args)
    elif args.command == 'reminders':
        show_reminders(manager, args)
    elif args.command == 'stats':
        show_stats(manager, args)
    elif args.command == 'delete':
        delete_flag(manager, args)

if __name__ == "__main__":
    main()