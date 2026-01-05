class FlagManager {
    constructor() {
        this.STORAGE_KEY = 'newyear_flags';
        this.flags = this.loadFlags();
    }

    loadFlags() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('加载flags失败:', error);
            return [];
        }
    }

    saveFlags() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.flags));
            return true;
        } catch (error) {
            console.error('保存flags失败:', error);
            return false;
        }
    }

    generateId() {
        return 'flag_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    formatDateTime(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    addFlag(title, description, targetDate, category = '其他') {
        const flag = {
            id: this.generateId(),
            title: title,
            description: description,
            category: category,
            target_date: targetDate,
            created_date: this.formatDate(new Date()),
            progress: 0,
            status: '进行中',
            check_history: [],
            feasibility_score: null,
            feasibility_reason: ''
        };

        const feasibility = this.assessFeasibility(flag);
        flag.feasibility_score = feasibility.score;
        flag.feasibility_reason = feasibility.reason;

        this.flags.push(flag);
        this.saveFlags();
        return flag;
    }

    assessFeasibility(flag) {
        let score = 100;
        const reasons = [];

        const targetDate = new Date(flag.target_date);
        const today = new Date();
        const daysUntilTarget = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

        if (daysUntilTarget < 30) {
            score -= 30;
            reasons.push('目标时间过短（少于30天）');
        } else if (daysUntilTarget < 90) {
            score -= 10;
            reasons.push('目标时间较短（少于3个月）');
        } else if (daysUntilTarget > 365) {
            score -= 5;
            reasons.push('目标时间过长（超过1年）');
        }

        if (flag.description.length < 20) {
            score -= 15;
            reasons.push('描述过于简单，缺乏具体性');
        } else if (flag.description.length < 50) {
            score -= 5;
            reasons.push('描述可以更具体一些');
        }

        if (flag.title.length < 5) {
            score -= 10;
            reasons.push('标题过于简短');
        }

        const descriptionLower = flag.description.toLowerCase();
        if (['每天', '每周', '每月', '次', '小时', '分钟'].some(word => descriptionLower.includes(word))) {
            score += 5;
        } else {
            score -= 5;
            reasons.push('缺乏可量化的指标');
        }

        return {
            score: Math.max(0, Math.min(100, score)),
            reason: reasons.length > 0 ? reasons.join('；') : '目标设定合理，可行性较高'
        };
    }

    updateProgress(flagId, progress, notes = '') {
        const flag = this.flags.find(f => f.id === flagId);
        if (!flag) return false;

        flag.progress = Math.max(0, Math.min(100, progress));

        const checkRecord = {
            date: this.formatDateTime(new Date()),
            progress: progress,
            notes: notes
        };
        flag.check_history.push(checkRecord);

        if (progress >= 100) {
            flag.status = '已完成';
        } else if (progress > 0) {
            flag.status = '进行中';
        } else {
            flag.status = '未开始';
        }

        this.saveFlags();
        return true;
    }

    getMonthlyReminders() {
        const reminders = [];
        const today = new Date();

        this.flags.forEach(flag => {
            if (flag.status === '进行中' || flag.status === '未开始') {
                if (flag.check_history && flag.check_history.length > 0) {
                    const lastCheck = new Date(flag.check_history[flag.check_history.length - 1].date);
                    const daysSinceLastCheck = Math.ceil((today - lastCheck) / (1000 * 60 * 60 * 24));

                    if (daysSinceLastCheck >= 30) {
                        reminders.push(flag);
                    }
                } else {
                    const createdDate = new Date(flag.created_date);
                    const daysSinceCreated = Math.ceil((today - createdDate) / (1000 * 60 * 60 * 24));

                    if (daysSinceCreated >= 30) {
                        reminders.push(flag);
                    }
                }
            }
        });

        return reminders;
    }

    listFlags(category = null, status = null) {
        let result = [...this.flags];

        if (category) {
            result = result.filter(f => f.category === category);
        }

        if (status) {
            result = result.filter(f => f.status === status);
        }

        return result.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }

    deleteFlag(flagId) {
        const index = this.flags.findIndex(f => f.id === flagId);
        if (index !== -1) {
            this.flags.splice(index, 1);
            this.saveFlags();
            return true;
        }
        return false;
    }

    getStatistics() {
        const total = this.flags.length;
        const completed = this.flags.filter(f => f.status === '已完成').length;
        const inProgress = this.flags.filter(f => f.status === '进行中').length;
        const notStarted = this.flags.filter(f => f.status === '未开始').length;

        let avgFeasibility = 0;
        if (total > 0) {
            const scores = this.flags
                .filter(f => f.feasibility_score !== null)
                .map(f => f.feasibility_score);
            if (scores.length > 0) {
                avgFeasibility = scores.reduce((a, b) => a + b, 0) / scores.length;
            }
        }

        return {
            total: total,
            completed: completed,
            in_progress: inProgress,
            not_started: notStarted,
            completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
            avg_feasibility: Math.round(avgFeasibility * 10) / 10
        };
    }

    search(query) {
        const lowerQuery = query.toLowerCase();
        return this.flags.filter(flag =>
            flag.title.toLowerCase().includes(lowerQuery) ||
            flag.description.toLowerCase().includes(lowerQuery) ||
            flag.category.toLowerCase().includes(lowerQuery)
        );
    }

    getCategories() {
        const categories = new Set(this.flags.map(f => f.category));
        return Array.from(categories);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FlagManager;
}
