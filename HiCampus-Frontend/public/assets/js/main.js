// 组件管理器
class ComponentManager {
    constructor() {
        this.components = new Map();
        this.pageComponents = {
            'registerAndLogin': ['auth'],
            'index': ['auth', 'search', 'profile','editProfile'],
        };
    }

    // 注册组件
    register(name, component) {
        this.components.set(name, component);
    }

    // 添加组件到页面
    addComponentToPage(pageName, componentName) {
        if (!this.pageComponents[pageName]) {
            this.pageComponents[pageName] = [];
        }
        if (!this.pageComponents[pageName].includes(componentName)) {
            this.pageComponents[pageName].push(componentName);
        }
    }

    // 初始化组件
    initialize() {
        // 获取当前页面名称
        const currentPage = this.getCurrentPage();
        console.log('当前页面:', currentPage);

        // 获取当前页面需要的组件
        const pageComponents = this.pageComponents[currentPage] || [];
        console.log('页面组件:', pageComponents);

        // 初始化组件
        pageComponents.forEach(componentName => {
            const component = this.components.get(componentName);
            if (component) {
                console.log(`初始化组件: ${componentName}`);
                component.init();
            }
        });
    }

    // 获取当前页面名称
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('registerAndLogin.html')) {
            return 'registerAndLogin';
        }
        else if (path.includes('index.html') || path === '/' || path === '/index.html') {
            return 'index';
        }
        return 'index'; // 默认返回首页
    }
}

// 创建组件管理器实例
const componentManager = new ComponentManager();

// 导入组件
import SearchComponent from './search.js';
import AuthComponent from './auth.js';
import ProfileComponent from './profile.js';
import EditProfileComponent from './edit-profile.js';

// 注册组件
componentManager.register('search', SearchComponent);
componentManager.register('auth', AuthComponent);
componentManager.register('profile', ProfileComponent);
componentManager.register('editProfile', EditProfileComponent);

// 当 DOM 加载完成后初始化所有组件
document.addEventListener('DOMContentLoaded', () => {
    componentManager.initialize();
    checkAuthStatus();
});

// 检查用户登录状态
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    if (token && userInfo) {
        // 更新用户信息显示
        const userAvatar = document.querySelector('.user-avatar');
        const userNickname = document.querySelector('.user-nickname');
        
        if (userAvatar && userNickname) {
            userAvatar.src = userInfo.avatar || 'http://localhost:3000/uploads/avatars/default-avatar.png';
            userNickname.textContent = userInfo.nickname;
        }
    }
} 