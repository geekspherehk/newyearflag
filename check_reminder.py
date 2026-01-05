#!/usr/bin/env python3
"""
Flag进度检查提醒脚本
可以设置为定时任务，定期检查需要关注的flags
"""

import sys
import os
from datetime import datetime, timedelta
from main import FlagManager

def check_and_remind():
    """检查并发送提醒"""
    manager = FlagManager()
    
    print(f"🔍 检查时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    
    # 获取月度提醒
    monthly_reminders = manager.get_monthly_reminders()
    
    # 获取即将到期的flags（30天内）
    today = datetime.now()
    upcoming_deadlines = []
    
    for flag in manager.flags:
        if flag["status"] in ["进行中", "未开始"]:
            try:
                target_date = datetime.strptime(flag["target_date"], "%Y-%m-%d")
                days_until_deadline = (target_date - today).days
                
                if 0 <= days_until_deadline <= 30:
                    upcoming_deadlines.append((flag, days_until_deadline))
            except ValueError:
                continue
    
    # 获取最近完成的flags
    recently_completed = []
    for flag in manager.flags:
        if flag["status"] == "已完成" and flag["check_history"]:
            last_update = datetime.strptime(flag["check_history"][-1]["date"], "%Y-%m-%d %H:%M:%S")
            if (today - last_update).days <= 7:  # 最近7天内完成的
                recently_completed.append(flag)
    
    # 显示结果
    if monthly_reminders:
        print(f"📢 有 {len(monthly_reminders)} 个flags需要检查进度：")
        for flag in monthly_reminders:
            print(f"\n🎯 {flag['title']}")
            print(f"   当前进度: {flag['progress']}%")
            print(f"   目标日期: {flag['target_date']}")
            if flag['check_history']:
                last_check = flag['check_history'][-1]['date']
                print(f"   上次检查: {last_check}")
            print(f"   💡 建议: 是时候更新这个flag的进度了！")
    else:
        print("✅ 暂无需要检查的flags")
    
    if upcoming_deadlines:
        print(f"\n⏰ 有 {len(upcoming_deadlines)} 个flags即将到期：")
        for flag, days_left in sorted(upcoming_deadlines, key=lambda x: x[1]):
            print(f"\n🎯 {flag['title']}")
            print(f"   剩余时间: {days_left} 天")
            print(f"   当前进度: {flag['progress']}%")
            print(f"   目标日期: {flag['target_date']}")
            if days_left <= 7:
                print(f"   ⚠️  紧急: 时间所剩无几！")
            elif days_left <= 14:
                print(f"   ⚡ 提醒: 时间紧迫，需要加速！")
            else:
                print(f"   💪 加油: 还有时间，继续努力！")
    
    if recently_completed:
        print(f"\n🎉 最近完成 {len(recently_completed)} 个flags：")
        for flag in recently_completed:
            print(f"   ✅ {flag['title']}")
            if flag['check_history']:
                completed_date = flag['check_history'][-1]['date']
                print(f"      完成时间: {completed_date}")
    
    # 显示总体统计
    stats = manager.get_statistics()
    print(f"\n📊 总体情况：")
    print(f"   总flags数: {stats['total']}")
    print(f"   完成率: {stats['completion_rate']:.1f}%")
    print(f"   平均可行性: {stats['avg_feasibility']}/100")
    
    # 提供建议
    if stats['completion_rate'] < 30 and stats['total'] > 0:
        print(f"\n💡 建议: 完成率较低，建议重新审视目标的可行性")
    elif stats['completion_rate'] > 80:
        print(f"\n🌟 太棒了! 你的目标完成率很高！")
    
    if upcoming_deadlines and any(days <= 7 for _, days in upcoming_deadlines):
        print(f"\n🚨 警告: 有flags即将到期，请立即处理！")
    
    return len(monthly_reminders) + len(upcoming_deadlines)

def generate_report():
    """生成详细的进度报告"""
    manager = FlagManager()
    today = datetime.now()
    
    filename = f"flag_report_{today.strftime('%Y%m%d_%H%M%S')}.txt"
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(f"年度Flag进度报告\n")
        f.write(f"生成时间: {today.strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write("=" * 50 + "\n\n")
        
        # 总体统计
        stats = manager.get_statistics()
        f.write(f"总体统计:\n")
        f.write(f"  总flags数: {stats['total']}\n")
        f.write(f"  已完成: {stats['completed']}\n")
        f.write(f"  进行中: {stats['in_progress']}\n")
        f.write(f"  未开始: {stats['not_started']}\n")
        f.write(f"  完成率: {stats['completion_rate']:.1f}%\n")
        f.write(f"  平均可行性评分: {stats['avg_feasibility']}/100\n\n")
        
        # 按状态分类
        for status in ["已完成", "进行中", "未开始"]:
            flags = manager.list_flags(status=status)
            if flags:
                f.write(f"{status}的flags ({len(flags)}个):\n")
                for flag in flags:
                    f.write(f"  🎯 {flag['title']}\n")
                    f.write(f"     描述: {flag['description']}\n")
                    f.write(f"     进度: {flag['progress']}%\n")
                    f.write(f"     目标日期: {flag['target_date']}\n")
                    f.write(f"     可行性: {flag['feasibility_score']}/100\n\n")
        
        # 需要关注的flags
        monthly_reminders = manager.get_monthly_reminders()
        if monthly_reminders:
            f.write(f"需要检查的flags ({len(monthly_reminders)}个):\n")
            for flag in monthly_reminders:
                f.write(f"  🔔 {flag['title']} - 进度: {flag['progress']}%\n")
        
        print(f"📄 详细报告已生成: {filename}")
        return filename

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--report":
        generate_report()
    else:
        check_and_remind()