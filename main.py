#!/usr/bin/env python3
"""
年度Flag管理工具
用于管理个人新年目标，提供可行性评估和进度跟踪
"""

import json
import os
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import uuid

class FlagManager:
    def __init__(self, data_file: str = "flags.json"):
        """初始化Flag管理器"""
        self.data_file = data_file
        self.flags = self.load_flags()
    
    def load_flags(self) -> List[Dict]:
        """从文件加载flags数据"""
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                return []
        return []
    
    def save_flags(self) -> None:
        """保存flags数据到文件"""
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(self.flags, f, ensure_ascii=False, indent=2)
    
    def add_flag(self, title: str, description: str, target_date: str, category: str = "其他") -> Dict:
        """添加新的flag"""
        flag = {
            "id": str(uuid.uuid4()),
            "title": title,
            "description": description,
            "category": category,
            "target_date": target_date,
            "created_date": datetime.now().strftime("%Y-%m-%d"),
            "progress": 0,
            "status": "进行中",
            "check_history": [],
            "feasibility_score": None,
            "feasibility_reason": ""
        }
        
        # 进行可行性评估
        feasibility = self.assess_feasibility(flag)
        flag["feasibility_score"] = feasibility["score"]
        flag["feasibility_reason"] = feasibility["reason"]
        
        self.flags.append(flag)
        self.save_flags()
        return flag
    
    def assess_feasibility(self, flag: Dict) -> Dict:
        """评估flag的可行性"""
        score = 100
        reasons = []
        
        # 评估时间合理性
        try:
            target_date = datetime.strptime(flag["target_date"], "%Y-%m-%d")
            today = datetime.now()
            days_until_target = (target_date - today).days
            
            if days_until_target < 30:
                score -= 30
                reasons.append("目标时间过短（少于30天）")
            elif days_until_target < 90:
                score -= 10
                reasons.append("目标时间较短（少于3个月）")
            elif days_until_target > 365:
                score -= 5
                reasons.append("目标时间过长（超过1年）")
        except ValueError:
            score -= 20
            reasons.append("日期格式不正确")
        
        # 评估描述的具体性
        if len(flag["description"]) < 20:
            score -= 15
            reasons.append("描述过于简单，缺乏具体性")
        elif len(flag["description"]) < 50:
            score -= 5
            reasons.append("描述可以更具体一些")
        
        # 评估标题的明确性
        if len(flag["title"]) < 5:
            score -= 10
            reasons.append("标题过于简短")
        
        # 评估是否包含可量化指标
        description_lower = flag["description"].lower()
        if any(word in description_lower for word in ["每天", "每周", "每月", "次", "小时", "分钟"]):
            score += 5
        else:
            score -= 5
            reasons.append("缺乏可量化的指标")
        
        return {
            "score": max(0, min(100, score)),
            "reason": "；".join(reasons) if reasons else "目标设定合理，可行性较高"
        }
    
    def update_progress(self, flag_id: str, progress: int, notes: str = "") -> bool:
        """更新flag进度"""
        for flag in self.flags:
            if flag["id"] == flag_id:
                flag["progress"] = max(0, min(100, progress))
                
                # 添加检查记录
                check_record = {
                    "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "progress": progress,
                    "notes": notes
                }
                flag["check_history"].append(check_record)
                
                # 更新状态
                if progress >= 100:
                    flag["status"] = "已完成"
                elif progress > 0:
                    flag["status"] = "进行中"
                else:
                    flag["status"] = "未开始"
                
                self.save_flags()
                return True
        return False
    
    def get_monthly_reminders(self) -> List[Dict]:
        """获取月度提醒的flags"""
        reminders = []
        today = datetime.now()
        
        for flag in self.flags:
            if flag["status"] in ["进行中", "未开始"]:
                # 检查是否需要月度提醒
                if flag["check_history"]:
                    last_check = datetime.strptime(flag["check_history"][-1]["date"], "%Y-%m-%d %H:%M:%S")
                    days_since_last_check = (today - last_check).days
                    
                    if days_since_last_check >= 30:
                        reminders.append(flag)
                else:
                    # 如果从未检查过，创建时间超过30天也需要提醒
                    created_date = datetime.strptime(flag["created_date"], "%Y-%m-%d")
                    days_since_created = (today - created_date).days
                    
                    if days_since_created >= 30:
                        reminders.append(flag)
        
        return reminders
    
    def list_flags(self, category: Optional[str] = None, status: Optional[str] = None) -> List[Dict]:
        """列出flags，支持按分类和状态筛选"""
        result = self.flags
        
        if category:
            result = [f for f in result if f["category"] == category]
        
        if status:
            result = [f for f in result if f["status"] == status]
        
        return sorted(result, key=lambda x: x["created_date"], reverse=True)
    
    def delete_flag(self, flag_id: str) -> bool:
        """删除flag"""
        for i, flag in enumerate(self.flags):
            if flag["id"] == flag_id:
                del self.flags[i]
                self.save_flags()
                return True
        return False
    
    def get_statistics(self) -> Dict:
        """获取统计信息"""
        total = len(self.flags)
        completed = len([f for f in self.flags if f["status"] == "已完成"])
        in_progress = len([f for f in self.flags if f["status"] == "进行中"])
        not_started = len([f for f in self.flags if f["status"] == "未开始"])
        
        avg_feasibility = 0
        if total > 0:
            scores = [f["feasibility_score"] for f in self.flags if f["feasibility_score"] is not None]
            if scores:
                avg_feasibility = sum(scores) / len(scores)
        
        return {
            "total": total,
            "completed": completed,
            "in_progress": in_progress,
            "not_started": not_started,
            "completion_rate": (completed / total * 100) if total > 0 else 0,
            "avg_feasibility": round(avg_feasibility, 1)
        }