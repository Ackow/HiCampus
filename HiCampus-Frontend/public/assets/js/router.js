// 路由管理器
class Router {
    constructor() {
        this.routes = new Map();
        this.currentPath = '';
        this.mainContent = document.querySelector('.content-container');
        console.log('Router initialized, mainContent:', this.mainContent);
    }

    // 注册路由
    register(path, component) {
        this.routes.set(path, component);
    }

    // 初始化路由
    init() {
        console.log('Router init called');

        // 监听hash变化
        window.addEventListener('hashchange', () => {
            this.handleRoute(window.location.hash);
        });

        // 根据当前hash显示对应内容
        if (this.mainContent) {
            console.log('Initializing with current hash content');
            const currentHash = window.location.hash || '#home';
            this.handleRoute(currentHash);
        }

        // 为所有导航链接添加点击事件
        const navLinks = document.querySelectorAll('.sidebar-menu a');
        console.log('Found nav links:', navLinks.length);

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // 获取被点击的链接元素
                const clickedLink = e.target.closest('a');
                if (clickedLink) {
                    const path = clickedLink.getAttribute('href');
                    
                    // 如果是发布页面，直接跳转
                    if (path.includes('publish.html')) {
                        window.location.href = path;
                        return;
                    }
                    
                    // 其他页面通过路由处理
                    if (path) {
                        this.navigate(path);
                    }
                }
            });
        });
    }

    // 加载HTML内容
    async loadHTMLContent(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            // 创建一个临时div来解析HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            // 获取content-container中的内容
            const content = tempDiv.querySelector('.content-container');
            return content ? content.innerHTML : '';
        } catch (error) {
            console.error('Error loading HTML:', error);
            return '<div class="error">页面加载失败</div>';
        }
    }

    // 处理路由变化
    async handleRoute(path) {
        console.log('Handling route:', path);
        this.currentPath = path;
        
        // 更新活动链接状态
        const navLinks = document.querySelectorAll('.sidebar-menu a');
        navLinks.forEach(link => {
            link.classList.remove('select');
            if (link.getAttribute('href') === path) {
                link.classList.add('select');
            }
        });

        // 更新内容
        if (this.mainContent) {
            console.log('Updating content');
            // 根据hash加载对应内容
            switch(path) {
                case '#home':
                case '':
                    const homeContent = await this.loadHTMLContent('../../src/pages/home.html');
                    this.mainContent.innerHTML = homeContent;
                    break;
                case '#message':
                    const messageContent = await this.loadHTMLContent('../../src/pages/message.html');
                    this.mainContent.innerHTML = messageContent;
                    break;
                case '#profile':
                    const profileContent = await this.loadHTMLContent('../../src/pages/profile.html');
                    this.mainContent.innerHTML = profileContent;
                    break;
                case '#edit-profile':
                    const profileEditContent = await this.loadHTMLContent('../../src/pages/edit-profile.html');
                    this.mainContent.innerHTML = profileEditContent;
                    break;
                default:
                    this.mainContent.innerHTML = '<div class="error">页面不存在</div>';
            }
        } else {
            console.error('Main content container not found!');
        }
    }

    // 导航到新路由
    navigate(path) {
        console.log('Navigating to:', path);
        window.location.hash = path;
    }
}

// 创建路由实例
const router = new Router();

// 当 DOM 加载完成后初始化路由
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing router');
    router.init();
});