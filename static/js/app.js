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
        document.querySelectorAll('[data-page]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const page = element.getAttribute('data-page');
                this.loadPage(page);
            });
        });

        document.getElementById('navToggle').addEventListener('click', () => {
            document.getElementById('navMenu').classList.toggle('active');
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

        document.getElementById('view-reminders-btn').addEventListener('click', () => {
            this.loadPage('reminders');
        });

        document.querySelector('.modal-close').addEventListener('click', () => {
            document.getElementById('modal').style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('modal')) {
                document.getElementById('modal').style.display = 'none';
            }
        });
    }

    loadPage(pageName) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const targetPage = document.getElementById(`page-${pageName}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        const activeLink = document.querySelector(`[data-page="${pageName}"]`);
        if (activeLink && activeLink.classList.contains('nav-link')) {
            activeLink.classList.add('active');
        }

        document.getElementById('navMenu').classList.remove('active');

        this.currentPage = pageName;

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
            case 'reminders':
                this.loadReminders();
                break;
            case 'statistics':
                this.loadStatistics();
                break;
        }
    }

    loadHomePage() {
        const stats = this.flagManager.getStatistics();
        const flags = this.flagManager.listFlags().slice(0, 5);
        const reminders = this.flagManager.getMonthlyReminders();

        document.getElementById('stat-total').textContent = stats.total;
        document.getElementById('stat-completed').textContent = stats.completed;
        document.getElementById('stat-in-progress').textContent = stats.in_progress;
        document.getElementById('stat-not-started').textContent = stats.not_started;

        document.getElementById('completion-bar').style.width = `${stats.completion_rate}%`;
        document.getElementById('completion-text').textContent = `${stats.completion_rate}%`;

        document.getElementById('avg-feasibility').textContent = `${stats.avg_feasibility}/100`;
        document.getElementById('reminder-count').textContent = `${reminders.length} 个`;

        const viewRemindersBtn = document.getElementById('view-reminders-btn');
        if (reminders.length > 0) {
            viewRemindersBtn.style.display = 'inline-block';
        } else {
            viewRemindersBtn.style.display = 'none';
        }

        const recentFlagsContainer = document.getElementById('recent-flags');
        recentFlagsContainer.innerHTML = flags.map(flag => this.createFlagCard(flag)).join('');
    }

    loadFlags() {
        const statusFilter = document.getElementById('filter-status').value;
        const categoryFilter = document.getElementById('filter-category').value;

        const flags = this.flagManager.listFlags(
            categoryFilter || null,
            statusFilter || null
        );

        const categories = this.flagManager.getCategories();
        const categorySelect = document.getElementById('filter-category');
        categorySelect.innerHTML = '<option value="">所有分类</option>' +
            categories.map(cat => `<option value="${cat}" ${cat === categoryFilter ? 'selected' : ''}>${cat}</option>`).join('');

        const allFlagsContainer = document.getElementById('all-flags');
        allFlagsContainer.innerHTML = flags.map(flag => this.createFlagCard(flag)).join('');
    }

    loadAddPage() {
        document.getElementById('add-flag-form').reset();
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('target_date').min = today;
    }

    loadReminders() {
        const reminders = this.flagManager.getMonthlyReminders();
        const reminderFlagsContainer = document.getElementById('reminder-flags');

        if (reminders.length === 0) {
            reminderFlagsContainer.innerHTML = '<div class="empty-state"><p>🎉 太棒了！没有需要检查的Flag</p></div>';
        } else {
            reminderFlagsContainer.innerHTML = reminders.map(flag => this.createFlagCard(flag)).join('');
        }
    }

    loadStatistics() {
        const stats = this.flagManager.getStatistics();
        const flags = this.flagManager.listFlags();

        document.getElementById('stats-total').textContent = stats.total;
        document.getElementById('stats-completed').textContent = stats.completed;
        document.getElementById('stats-in-progress').textContent = stats.in_progress;
        document.getElementById('stats-not-started').textContent = stats.not_started;

        document.getElementById('stats-completion-bar').style.width = `${stats.completion_rate}%`;
        document.getElementById('stats-completion-text').textContent = `${stats.completion_rate}%`;

        document.getElementById('stats-avg-feasibility').textContent = `${stats.avg_feasibility}/100`;

        const categoryStats = {};
        flags.forEach(flag => {
            const category = flag.category;
            if (!categoryStats[category]) {
                categoryStats[category] = { total: 0, completed: 0 };
            }
            categoryStats[category].total++;
            if (flag.status === '已完成') {
                categoryStats[category].completed++;
            }
        });

        const categoryStatsContainer = document.getElementById('category-stats-list');
        categoryStatsContainer.innerHTML = Object.entries(categoryStats)
            .map(([category, data]) => `
                <div class="category-stat-card">
                    <h4>📁 ${category}</h4>
                    <div class="stat-row">
                        <span>总计: ${data.total}</span>
                        <span>已完成: ${data.completed}</span>
                        <span>完成率: ${Math.round((data.completed / data.total) * 100)}%</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${(data.completed / data.total) * 100}%"></div>
                    </div>
                </div>
            `).join('');
    }

    handleAddFlag() {
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const targetDate = document.getElementById('target_date').value;
        const category = document.getElementById('category').value.trim() || '其他';

        if (!title || !description || !targetDate) {
            alert('请填写所有必填字段');
            return;
        }

        const flag = this.flagManager.addFlag(title, description, targetDate, category);

        if (flag) {
            alert('Flag添加成功！');
            this.loadPage('flags');
        } else {
            alert('添加失败，请重试');
        }
    }

    handleSearch(query) {
        if (!query) {
            this.loadFlags();
            return;
        }

        const results = this.flagManager.search(query);
        const allFlagsContainer = document.getElementById('all-flags');
        allFlagsContainer.innerHTML = results.map(flag => this.createFlagCard(flag)).join('');
    }

    showFlagDetail(flagId) {
        const flag = this.flagManager.listFlags().find(f => f.id === flagId);
        if (!flag) return;

        const detailContent = document.getElementById('flag-detail-content');
        detailContent.innerHTML = `
            <div class="flag-detail-card">
                <div class="flag-header">
                    <h1>${flag.title}</h1>
                    <span class="flag-status status-${flag.status}">${flag.status}</span>
                </div>

                <div class="flag-meta">
                    <span>📅 目标日期: ${flag.target_date}</span>
                    <span>📁 分类: ${flag.category}</span>
                    <span>🎯 可行性: ${flag.feasibility_score}/100</span>
                </div>

                <div class="flag-section">
                    <h3>📝 描述</h3>
                    <p>${flag.description}</p>
                </div>

                <div class="flag-section">
                    <h3>📊 进度</h3>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${flag.progress}%">
                            <span class="progress-text">${flag.progress}%</span>
                        </div>
                    </div>
                </div>

                <div class="flag-section">
                    <h3>🎯 可行性评估</h3>
                    <p>${flag.feasibility_reason}</p>
                </div>

                <div class="flag-section">
                    <h3>📋 检查历史</h3>
                    ${flag.check_history.length > 0 ? `
                        <div class="check-history">
                            ${flag.check_history.map(record => `
                                <div class="check-record">
                                    <div class="record-date">${record.date}</div>
                                    <div class="record-progress">进度: ${record.progress}%</div>
                                    ${record.notes ? `<div class="record-notes">${record.notes}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : '<p>暂无检查记录</p>'}
                </div>

                <div class="flag-actions">
                    <button class="btn btn-primary" onclick="app.showUpdateModal('${flag.id}')">更新进度</button>
                    <button class="btn btn-danger" onclick="app.deleteFlag('${flag.id}')">删除Flag</button>
                </div>
            </div>
        `;

        this.loadPage('flag-detail');
    }

    showUpdateModal(flagId) {
        const flag = this.flagManager.listFlags().find(f => f.id === flagId);
        if (!flag) return;

        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <h2>更新进度 - ${flag.title}</h2>
            <form id="update-progress-form">
                <div class="form-group">
                    <label for="progress">进度 (%)</label>
                    <input type="number" id="progress" name="progress" min="0" max="100" value="${flag.progress}" required>
                </div>
                <div class="form-group">
                    <label for="notes">备注</label>
                    <textarea id="notes" name="notes" rows="3" placeholder="记录本次更新的具体情况..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">更新</button>
                    <button type="button" class="btn btn-secondary" onclick="document.getElementById('modal').style.display='none'">取消</button>
                </div>
            </form>
        `;

        document.getElementById('modal').style.display = 'block';

        document.getElementById('update-progress-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const progress = parseInt(document.getElementById('progress').value);
            const notes = document.getElementById('notes').value.trim();

            if (this.flagManager.updateProgress(flagId, progress, notes)) {
                alert('进度更新成功！');
                document.getElementById('modal').style.display = 'none';
                this.showFlagDetail(flagId);
            } else {
                alert('更新失败，请重试');
            }
        });
    }

    deleteFlag(flagId) {
        if (!confirm('确定要删除这个Flag吗？')) return;

        if (this.flagManager.deleteFlag(flagId)) {
            alert('Flag删除成功！');
            this.loadPage('flags');
        } else {
            alert('删除失败，请重试');
        }
    }

    createFlagCard(flag) {
        const statusClass = flag.status === '已完成' ? 'completed' :
                           flag.status === '进行中' ? 'in-progress' : 'not-started';

        return `
            <div class="flag-card">
                <div class="flag-header">
                    <h3>${flag.title}</h3>
                    <span class="flag-status status-${statusClass}">${flag.status}</span>
                </div>
                <p class="flag-description">${flag.description.substring(0, 100)}${flag.description.length > 100 ? '...' : ''}</p>
                <div class="flag-meta">
                    <span>📅 ${flag.target_date}</span>
                    <span>📊 ${flag.progress}%</span>
                    <span>🎯 ${flag.feasibility_score}/100</span>
                </div>
                <div class="flag-actions">
                    <button class="btn btn-sm btn-outline" onclick="app.showFlagDetail('${flag.id}')">查看详情</button>
                </div>
            </div>
        `;
    }
}

const app = new App();
