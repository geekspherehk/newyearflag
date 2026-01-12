class FlagManager {
    constructor() {
        this.STORAGE_KEY = 'newyear_flags';
        this.flags = this.loadFlags();
    }

    loadFlags() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            const flags = data ? JSON.parse(data) : [];
            return this.migrateFlags(flags);
        } catch (error) {
            console.error('加载flags失败:', error);
            return [];
        }
    }

    migrateFlags(flags) {
        return flags.map(flag => ({
            ...flag,
            goal: flag.goal || '',
            task: flag.task || ''
        }));
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

    addFlag(data) {
        const flag = {
            id: this.generateId(),
            title: data.name || data.title,
            goal: data.goal || '',
            task: data.task || '',
            description: data.description || '',
            category: data.category || '其他',
            target_date: data.targetDate || this.formatDate(new Date()),
            created_date: this.formatDate(new Date()),
            progress: 0,
            status: '进行中',
            logs: [],
            frequency: data.frequency || 'daily'
        };

        this.flags.push(flag);
        this.saveFlags();
        return flag;
    }

    updateProgress(flagId, progress, notes = '') {
        const flag = this.flags.find(f => f.id === flagId);
        if (!flag) return false;

        flag.progress = Math.max(0, Math.min(100, progress));

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

    updateFlagStatus(flagId, status) {
        const flag = this.flags.find(f => f.id === flagId);
        if (!flag) return false;

        flag.status = status;
        if (status === '已完成') {
            flag.progress = 100;
        }
        this.saveFlags();
        return true;
    }

    getFlag(flagId) {
        return this.flags.find(f => f.id === flagId);
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

        return {
            total: total,
            completed: completed,
            in_progress: inProgress,
            not_started: notStarted,
            completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }

    addLog(flagId, content) {
        const flag = this.flags.find(f => f.id === flagId);
        if (!flag) return false;

        const log = {
            id: this.generateId(),
            content: content,
            timestamp: this.formatDateTime(new Date())
        };

        if (!flag.logs) {
            flag.logs = [];
        }
        flag.logs.push(log);
        this.saveFlags();
        return log;
    }

    getLogs(flagId) {
        const flag = this.flags.find(f => f.id === flagId);
        if (!flag || !flag.logs) {
            return [];
        }
        return flag.logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    deleteLog(flagId, logId) {
        const flag = this.flags.find(f => f.id === flagId);
        if (!flag || !flag.logs) return false;

        const index = flag.logs.findIndex(l => l.id === logId);
        if (index !== -1) {
            flag.logs.splice(index, 1);
            this.saveFlags();
            return true;
        }
        return false;
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

if (typeof window !== 'undefined') {
    window.FlagManager = FlagManager;
}
