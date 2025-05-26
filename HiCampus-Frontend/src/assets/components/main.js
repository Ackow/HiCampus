// 组件管理器
class ComponentManager {
    constructor() {
        this.components = new Map();
        this.initialized = false;
    }

    // 注册组件
    register(name, component) {
        if (this.components.has(name)) {
            console.warn(`组件 ${name} 已经注册`);
            return;
        }
        this.components.set(name, component);
    }

    // 初始化所有组件
    initialize() {
        if (this.initialized) {
            console.warn('组件管理器已经初始化');
            return;
        }

        // 初始化每个组件
        this.components.forEach((component, name) => {
            try {
                component.init();
                console.log(`组件 ${name} 初始化成功`);
            } catch (error) {
                console.error(`组件 ${name} 初始化失败:`, error);
            }
        });

        this.initialized = true;
    }
}

// 创建组件管理器实例
const componentManager = new ComponentManager();

// 导入组件
import SidebarComponent from './sidebar.js';
import SearchComponent from './search.js';

// 注册组件
componentManager.register('sidebar', SidebarComponent);
componentManager.register('search', SearchComponent);

// 当 DOM 加载完成后初始化所有组件
document.addEventListener('DOMContentLoaded', () => {
    componentManager.initialize();
}); 