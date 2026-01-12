class App {
    constructor() {
        this.flagManager = new FlagManager();
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.loadPage('home');
    }

    setupNavigation() {
        document.querySelectorAll('.tab-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                this.loadPage(page);
            });
        });
    }

    setupEventListeners() {
        document.getElementById('add-flag-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddFlag();
        });

        document.getElementById('filter-status').addEventListener('change', () => {
            this.loadFlags();
        });

        document.getElementById('filter-category').addEventListener('change', () => {
            this.loadFlags();
        });

        document.getElementById('search-input').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        document.querySelector('.modal-close').addEventListener('click', () => {
            document.getElementById('modal').classList.remove('show');
        });

        document.querySelector('.log-modal-close').addEventListener('click', () => {
            document.getElementById('log-modal').classList.remove('show');
        });

        document.getElementById('add-log-btn').addEventListener('click', () => {
            this.addLog();
        });

        document.querySelector('.progress-modal-close').addEventListener('click', () => {
            document.getElementById('progress-modal').classList.remove('show');
        });

        document.getElementById('update-progress-btn').addEventListener('click', () => {
            this.updateProgress();
        });

        const progressSlider = document.getElementById('progress-slider');
        const progressInput = document.getElementById('progress-input');

        progressSlider.addEventListener('input', (e) => {
            progressInput.value = e.target.value;
        });

        progressInput.addEventListener('input', (e) => {
            progressSlider.value = e.target.value;
        });

        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('modal')) {
                document.getElementById('modal').classList.remove('show');
            }
            if (e.target === document.getElementById('log-modal')) {
                document.getElementById('log-modal').classList.remove('show');
            }
            if (e.target === document.getElementById('progress-modal')) {
                document.getElementById('progress-modal').classList.remove('show');
            }
        });
    }

    loadPage(pageName) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.querySelectorAll('.tab-item').forEach(item => {
            item.classList.remove('active');
        });

        const targetPage = document.getElementById(`page-${pageName}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        const activeTab = document.querySelector(`.tab-item[data-page="${pageName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        this.currentPage = pageName;

        const pageTitle = document.getElementById('page-title');
        const pageTitles = {
            'home': '🎯 Flag管理',
            'flags': '📋 Flag列表',
            'add': '➕ 添加Flag',
            'statistics': '📊 统计'
        };
        if (pageTitle) {
            pageTitle.textContent = pageTitles[pageName] || 'Flag管理';
        }

        switch (pageName) {
            case 'home':
                this.loadHomePage();
                break;
            case 'flags':
                this.loadFlags();
                break;
            case 'add':
                this.loadAddPage();
                break;
            case 'statistics':
                this.loadStatistics();
                break;
        }
    }

    loadHomePage() {
        const stats = this.flagManager.getStatistics();
        const flags = this.flagManager.listFlags().slice(0, 5);

        document.getElementById('stat-total').textContent = stats.total;
        document.getElementById('stat-completed').textContent = stats.completed;
        document.getElementById('stat-in-progress').textContent = stats.in_progress;

        document.getElementById('completion-bar').style.width = `${stats.completion_rate}%`;
        document.getElementById('completion-text').textContent = `${stats.completion_rate}%`;

        const recentFlagsContainer = document.getElementById('recent-flags');
        recentFlagsContainer.innerHTML = '';

        if (flags.length === 0) {
            recentFlagsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <p>还没有Flag，快去添加一个吧！</p>
                </div>
            `;
        } else {
            flags.forEach(flag => {
                const flagElement = this.createFlagElement(flag);
                recentFlagsContainer.appendChild(flagElement);
            });
        }
    }

    loadFlags() {
        const flags = this.flagManager.listFlags();
        const statusFilter = document.getElementById('filter-status').value;
        const categoryFilter = document.getElementById('filter-category').value;
        const searchTerm = document.getElementById('search-input').value.toLowerCase();

        let filteredFlags = flags.filter(flag => {
            if (statusFilter && flag.status !== statusFilter) return false;
            if (categoryFilter && flag.category !== categoryFilter) return false;
            if (searchTerm && 
                !flag.title.toLowerCase().includes(searchTerm) &&
                !flag.goal.toLowerCase().includes(searchTerm) &&
                !flag.task.toLowerCase().includes(searchTerm)) return false;
            return true;
        });

        const flagsContainer = document.getElementById('all-flags');
        flagsContainer.innerHTML = '';

        if (filteredFlags.length === 0) {
            flagsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <p>没有找到Flag</p>
                </div>
            `;
        } else {
            filteredFlags.forEach(flag => {
                const flagElement = this.createFlagElement(flag);
                flagsContainer.appendChild(flagElement);
            });
        }
    }

    loadAddPage() {
        document.getElementById('add-flag-form').reset();
    }

    loadStatistics() {
        const stats = this.flagManager.getStatistics();

        document.getElementById('stat-completion-rate').textContent = `${stats.completion_rate}%`;
        document.getElementById('stat-total-flags').textContent = stats.total;
    }

    handleAddFlag() {
        const name = document.getElementById('flag-name').value.trim();
        const category = document.getElementById('flag-category').value;
        const goal = document.getElementById('flag-goal').value.trim();
        const task = document.getElementById('flag-task').value.trim();
        const description = document.getElementById('flag-description').value.trim();
        const frequency = document.getElementById('flag-frequency').value;

        if (!name || !category || !goal || !task || !frequency) {
            this.shakeElement(document.getElementById('add-flag-form'));
            alert('请填写所有必填字段');
            return;
        }

        const flag = this.flagManager.addFlag({
            name,
            category,
            goal,
            task,
            description,
            frequency
        });

        if (flag) {
            this.showSuccessToast('Flag添加成功！');
            this.loadPage('home');
        } else {
            this.shakeElement(document.getElementById('add-flag-form'));
            alert('添加失败，请重试');
        }
    }

    shakeElement(element) {
        element.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    showSuccessToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast toast-success';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }

    handleSearch(searchTerm) {
        this.loadFlags();
    }

    createFlagElement(flag) {
        const element = document.createElement('div');
        element.className = 'flag-item';
        element.innerHTML = `
            <div class="flag-header">
                <span class="flag-title">${flag.title}</span>
                <span class="flag-status ${this.getStatusClass(flag.status)}">${flag.status}</span>
            </div>
            <span class="flag-category">${flag.category}</span>
            <div class="flag-goal">🎯 ${flag.goal || '暂无目标'}</div>
            <div class="flag-task">📋 ${flag.task || '暂无任务'}</div>
            ${flag.description ? `<div class="flag-description">${flag.description}</div>` : ''}
            <div class="flag-progress-container">
                <div class="flag-progress-bar">
                    <div class="flag-progress-fill" style="width: ${flag.progress}%"></div>
                </div>
                <span class="flag-progress-text">${flag.progress}%</span>
            </div>
            <div class="flag-footer">
                <span>${flag.frequency}</span>
            </div>
            <div class="flag-actions">
                <button class="btn btn-success btn-sm" onclick="app.completeFlag('${flag.id}')">完成</button>
                <button class="btn btn-primary btn-sm" onclick="app.showProgressModal('${flag.id}')">更新进度</button>
                <button class="btn btn-info btn-sm" onclick="app.showLogs('${flag.id}')">日志</button>
                <button class="btn btn-danger btn-sm" onclick="app.deleteFlag('${flag.id}')">删除</button>
            </div>
        `;
        return element;
    }

    getStatusClass(status) {
        switch (status) {
            case '已完成':
                return 'completed';
            case '进行中':
                return 'in-progress';
            case '未开始':
                return 'not-started';
            default:
                return '';
        }
    }

    completeFlag(id) {
        if (confirm('确定要完成这个Flag吗？')) {
            this.flagManager.updateFlagStatus(id, '已完成');
            this.showSuccessToast('Flag已完成！');
            this.loadPage(this.currentPage);
        }
    }

    showLogs(flagId) {
        const flag = this.flagManager.getFlag(flagId);
        if (!flag) return;

        document.getElementById('log-modal-title').textContent = `${flag.title} - 日志`;
        document.getElementById('log-modal').classList.add('show');
        document.getElementById('log-content').value = '';
        this.currentFlagId = flagId;
        this.loadLogs(flagId);
    }

    loadLogs(flagId) {
        const logs = this.flagManager.getLogs(flagId);
        const logList = document.getElementById('log-list');
        logList.innerHTML = '';

        if (logs.length === 0) {
            logList.innerHTML = '<div class="no-logs">暂无日志记录</div>';
            return;
        }

        logs.forEach(log => {
            const logElement = document.createElement('div');
            logElement.className = 'log-item';
            logElement.innerHTML = `
                <div class="log-header">
                    <span class="log-time">${log.timestamp}</span>
                    <button class="log-delete-btn" onclick="app.deleteLog('${flagId}', '${log.id}')">删除</button>
                </div>
                <div class="log-content">${log.content}</div>
            `;
            logList.appendChild(logElement);
        });
    }

    addLog() {
        const content = document.getElementById('log-content').value.trim();
        if (!content) {
            alert('请输入日志内容');
            return;
        }

        const log = this.flagManager.addLog(this.currentFlagId, content);
        if (log) {
            document.getElementById('log-content').value = '';
            this.loadLogs(this.currentFlagId);
            this.showSuccessToast('日志添加成功！');
        } else {
            alert('添加失败，请重试');
        }
    }

    deleteLog(flagId, logId) {
        if (confirm('确定要删除这条日志吗？')) {
            const success = this.flagManager.deleteLog(flagId, logId);
            if (success) {
                this.loadLogs(flagId);
                this.showSuccessToast('日志已删除');
            }
        }
    }

    showProgressModal(flagId) {
        const flag = this.flagManager.getFlag(flagId);
        if (!flag) return;

        document.getElementById('progress-modal-title').textContent = `${flag.title} - 更新进度`;
        document.getElementById('current-progress').textContent = `${flag.progress}%`;
        document.getElementById('progress-slider').value = flag.progress;
        document.getElementById('progress-input').value = flag.progress;
        document.getElementById('progress-notes').value = '';
        document.getElementById('progress-modal').classList.add('show');
        this.currentFlagId = flagId;
        this.loadProgressHistory(flagId);
    }

    loadProgressHistory(flagId) {
        const flag = this.flagManager.getFlag(flagId);
        if (!flag) return;

        const historyList = document.getElementById('progress-history-list');
        historyList.innerHTML = '';

        if (!flag.check_history || flag.check_history.length === 0) {
            historyList.innerHTML = '<div class="no-progress-history">暂无进度历史</div>';
            return;
        }

        const sortedHistory = [...flag.check_history].reverse();
        sortedHistory.forEach((record, index) => {
            const historyElement = document.createElement('div');
            historyElement.className = 'progress-history-item';
            historyElement.innerHTML = `
                <div class="progress-history-header">
                    <span class="progress-history-date">${record.date}</span>
                    <span class="progress-history-progress">${record.progress}%</span>
                </div>
                ${record.notes ? `<div class="progress-history-notes">${record.notes}</div>` : ''}
            `;
            historyList.appendChild(historyElement);
        });
    }

    updateProgress() {
        const progress = parseInt(document.getElementById('progress-input').value);
        const notes = document.getElementById('progress-notes').value.trim();

        if (isNaN(progress) || progress < 0 || progress > 100) {
            alert('请输入0-100之间的进度值');
            return;
        }

        const success = this.flagManager.updateProgress(this.currentFlagId, progress, notes);
        if (success) {
            document.getElementById('progress-modal').classList.remove('show');
            this.showSuccessToast('进度更新成功！');
            this.loadPage(this.currentPage);
        } else {
            alert('更新失败，请重试');
        }
    }

    deleteFlag(id) {
        if (confirm('确定要删除这个Flag吗？')) {
            this.flagManager.deleteFlag(id);
            this.showSuccessToast('Flag已删除');
            this.loadPage(this.currentPage);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});