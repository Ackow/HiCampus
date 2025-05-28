// 文章列表组件
const ArticleListComponent = {
    name: 'articleList',
    currentPage: 1,
    isLoading: false,
    hasMore: true,
    lastScrollTop: 0,  // 添加上次滚动位置记录

    init() {
        this.bindEvents();
        setTimeout(() => {
            this.loadArticles();
        }, 100);
    },

    bindEvents() {
        // 监听滚动事件
        window.addEventListener('scroll', this.handleScroll.bind(this));
        // 监听hash变化
        window.addEventListener('hashchange', this.handleHashChange.bind(this));
    },

    handleHashChange() {
        console.log('hash变化:', window.location.hash);
        if (window.location.hash === '#home') {
            // 重置页码
            this.currentPage = 1;
            this.hasMore = true;
            // 清空容器
            const container = document.querySelector('.content-grid');
            if (container) {
                container.innerHTML = '';
            }
            // 重新加载文章
            setTimeout(() => {
                this.loadArticles();
            }, 100);
        }
    },

    async loadArticles(page = 1, limit = 8) {
        if (this.isLoading || !this.hasMore) return;

        try {
            console.log('加载文章');
            this.isLoading = true;
            this.showLoading();

            const response = await fetch(`http://localhost:3000/api/articles?page=${page}&limit=${limit}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            console.log('文章数据:', data);

            this.renderArticles(data.articles);
            this.hasMore = this.currentPage < data.totalPages;
            this.currentPage++;

        } catch (error) {
            console.error('加载文章失败:', error);
            this.showError('加载失败，请重试');
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    },

    renderArticles(articles) {
        const container = document.querySelector('.content-grid');
        if (!container) return;

        container.innerHTML = '';
        articles.forEach(article => {
            container.appendChild(this.createArticleElement(article));
        });
    },

    createArticleElement(article) {
        const div = document.createElement('div');
        div.className = 'content-card';
        
        // 处理文章图片URL
        const articleImageUrl = article.images && article.images.length > 0 
            ? `http://localhost:3000/uploads/images/${article.images[0]}` 
            : 'assets/images/logo.png';
        
        // 处理用户头像URL
        const avatarUrl = article.creator.avatar 
            ? `http://localhost:3000/uploads/avatars/${article.creator.avatar}`
            : 'http://localhost:3000/uploads/avatars/default-avatar.jpg';

        div.innerHTML = `
            <div class="card-image">
                <img src="${articleImageUrl}" 
                     alt="内容图片"
                     onerror="this.onerror=null; this.src='assets/images/logo.png';">
            </div>
            <div class="card-content">
                <h3 class="card-title">${article.title}</h3>
                <p class="card-description">${article.content}</p>
                <div class="card-footer">
                    <div class="user-info">
                        <img src="${avatarUrl}" 
                             alt="用户头像" 
                             class="user-avatar-small"
                             onerror="this.onerror=null; this.src='http://localhost:3000/uploads/avatars/default-avatar.jpg';">
                        <span class="username">${article.creator.nickname}</span>
                    </div>
                    <div class="interaction-info">
                        <span class="likes">❤️ ${article.likeCount || 0}</span>
                        <span class="comments">💬 ${article.commentCount || 0}</span>
                    </div>
                </div>
            </div>
        `;
        return div;
    },

    handleScroll() {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const clientHeight = document.documentElement.clientHeight;
        
        // 判断是否向下滚动
        const isScrollingDown = scrollTop > this.lastScrollTop;
        this.lastScrollTop = scrollTop;

        // 当滚动到距离底部100px时，且正在向下滚动时加载更多
        if (scrollHeight - scrollTop - clientHeight < 10 && isScrollingDown) {
            console.log('向下滚动到底部，加载更多');
            this.loadArticles();
        }
    },

    showLoading() {
        const loading = document.createElement('div');
        loading.className = 'loading-spinner';
        loading.innerHTML = '加载中...';
        document.querySelector('.content-container').appendChild(loading);
    },

    hideLoading() {
        const loading = document.querySelector('.loading-spinner');
        if (loading) {
            loading.remove();
        }
    },

    showError(message) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        document.querySelector('.content-container').appendChild(error);
        setTimeout(() => error.remove(), 3000);
    }
};

export default ArticleListComponent; 