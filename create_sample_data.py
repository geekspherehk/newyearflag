#!/usr/bin/env python3
"""
创建示例数据，用于演示年度Flag管理工具的功能
"""

import json
from datetime import datetime, timedelta
import uuid

def create_sample_data():
    """创建示例数据"""
    sample_flags = [
        {
            "id": str(uuid.uuid4()),
            "title": "学习Python编程",
            "description": "每天学习1小时，完成3个项目，获得相关证书。包括基础语法、面向对象、Web开发等内容",
            "category": "学习成长",
            "target_date": "2024-12-31",
            "created_date": "2024-01-01",
            "progress": 75,
            "status": "进行中",
            "check_history": [
                {
                    "date": "2024-01-15 10:30:00",
                    "progress": 20,
                    "notes": "完成基础语法学习"
                },
                {
                    "date": "2024-02-15 14:20:00",
                    "progress": 45,
                    "notes": "完成面向对象编程学习"
                },
                {
                    "date": "2024-03-15 16:45:00",
                    "progress": 75,
                    "notes": "完成Web开发项目"
                }
            ],
            "feasibility_score": 85,
            "feasibility_reason": "目标设定合理，可行性较高"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "减重10公斤",
            "description": "每周运动4次，每次1小时，控制饮食热量，记录体重变化。目标是从75公斤减到65公斤",
            "category": "健康生活",
            "target_date": "2024-06-30",
            "created_date": "2024-01-01",
            "progress": 60,
            "status": "进行中",
            "check_history": [
                {
                    "date": "2024-01-31 08:15:00",
                    "progress": 25,
                    "notes": "减重2.5公斤，体重72.5公斤"
                },
                {
                    "date": "2024-02-29 07:30:00",
                    "progress": 50,
                    "notes": "减重5公斤，体重70公斤"
                },
                {
                    "date": "2024-03-31 09:00:00",
                    "progress": 60,
                    "notes": "减重6公斤，体重69公斤"
                }
            ],
            "feasibility_score": 78,
            "feasibility_reason": "目标基本合理，建议微调"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "通过英语六级考试",
            "description": "每天背诵50个单词，每周做2套真题，参加模拟考试。目标是获得550分以上",
            "category": "学习成长",
            "target_date": "2024-06-15",
            "created_date": "2024-01-01",
            "progress": 100,
            "status": "已完成",
            "check_history": [
                {
                    "date": "2024-02-01 20:00:00",
                    "progress": 30,
                    "notes": "词汇量达到4000，开始做真题"
                },
                {
                    "date": "2024-03-01 19:30:00",
                    "progress": 60,
                    "notes": "真题平均分达到480分"
                },
                {
                    "date": "2024-04-15 21:00:00",
                    "progress": 85,
                    "notes": "模拟考试520分"
                },
                {
                    "date": "2024-06-20 12:00:00",
                    "progress": 100,
                    "notes": "考试通过，总分568分！"
                }
            ],
            "feasibility_score": 82,
            "feasibility_reason": "目标设定合理，可行性较高"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "存钱买相机",
            "description": "每月存2000元，学习摄影技巧，研究相机型号。目标是购买一台专业单反相机",
            "category": "消费计划",
            "target_date": "2024-08-31",
            "created_date": "2024-01-01",
            "progress": 80,
            "status": "进行中",
            "check_history": [
                {
                    "date": "2024-02-01 10:00:00",
                    "progress": 25,
                    "notes": "已存4000元"
                },
                {
                    "date": "2024-04-01 11:00:00",
                    "progress": 50,
                    "notes": "已存8000元"
                },
                {
                    "date": "2024-06-01 15:30:00",
                    "progress": 75,
                    "notes": "已存12000元"
                },
                {
                    "date": "2024-07-01 16:00:00",
                    "progress": 80,
                    "notes": "已存12800元，快够了"
                }
            ],
            "feasibility_score": 88,
            "feasibility_reason": "目标设定合理，可行性较高"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "学习弹吉他",
            "description": "练习指法",
            "category": "兴趣爱好",
            "target_date": "2024-05-01",
            "created_date": "2024-01-15",
            "progress": 0,
            "status": "未开始",
            "check_history": [],
            "feasibility_score": 35,
            "feasibility_reason": "目标时间过短（少于30天）；描述过于简单，缺乏具体性；缺乏可量化的指标"
        },
        {
            "id": str(uuid.uuid4()),
            "title": "读完20本书",
            "description": "每月读2本书，写读书笔记，分享读书心得。涵盖小说、历史、科技等不同类型",
            "category": "学习成长",
            "target_date": "2024-12-31",
            "created_date": "2024-01-01",
            "progress": 45,
            "status": "进行中",
            "check_history": [
                {
                    "date": "2024-02-28 22:00:00",
                    "progress": 20,
                    "notes": "已读完4本书"
                },
                {
                    "date": "2024-04-30 21:00:00",
                    "progress": 40,
                    "notes": "已读完8本书"
                },
                {
                    "date": "2024-05-31 20:00:00",
                    "progress": 45,
                    "notes": "已读完9本书"
                }
            ],
            "feasibility_score": 75,
            "feasibility_reason": "目标基本合理，建议微调"
        }
    ]
    
    # 保存到文件
    with open('flags.json', 'w', encoding='utf-8') as f:
        json.dump(sample_flags, f, ensure_ascii=False, indent=2)
    
    print("✅ 示例数据已创建！")
    print(f"📊 共创建了 {len(sample_flags)} 个示例flags")
    print("\n现在你可以运行以下命令来体验工具：")
    print("  python cli.py list              # 查看所有flags")
    print("  python cli.py stats             # 查看统计信息")
    print("  python cli.py reminders         # 查看月度提醒")
    print("  python launcher.py               # 启动菜单界面")
    print("  python web_app.py               # 启动Web界面")

if __name__ == "__main__":
    create_sample_data()