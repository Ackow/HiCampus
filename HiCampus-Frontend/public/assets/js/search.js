// 搜索组件
const SearchComponent = {
    // 组件名称
    name: 'search',

    // DOM 元素
    elements: {
        searchTriggerButton: null,
        searchInputWrapper: null,
        searchInput: null,
        searchArea: null
    },

    // 初始化
    init() {
        console.log('初始化搜索组件');
        
        // 获取DOM元素
        this.elements = {
            searchTriggerButton: document.getElementById('searchTriggerButton'),
            searchInputWrapper: document.querySelector('.search-input-wrapper'),
            searchInput: document.querySelector('.search-input'),
            searchArea: document.querySelector('.search-area')
        };

        // 绑定事件
        this.bindEvents();
    },

    // 绑定事件
    bindEvents() {
        // 点击搜索按钮时的处理
        this.elements.searchTriggerButton.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // 获取按钮位置
            const buttonRect = this.elements.searchTriggerButton.getBoundingClientRect();
            const searchAreaRect = this.elements.searchArea.getBoundingClientRect();
            
            // 设置搜索框的初始位置
            this.elements.searchInputWrapper.style.position = 'absolute';
            this.elements.searchInputWrapper.style.left = `${buttonRect.left - searchAreaRect.left}px`;
            this.elements.searchInputWrapper.style.width = `${buttonRect.width}px`;
            
            // 触发重排以应用初始位置
            this.elements.searchInputWrapper.offsetHeight;
            
            // 展开搜索框
            this.elements.searchInputWrapper.classList.add('active');
            this.elements.searchInputWrapper.style.left = '0';
            this.elements.searchInputWrapper.style.width = '100%';
            
            // 隐藏搜索按钮
            this.elements.searchTriggerButton.classList.add('hidden');
            
            // 延迟聚焦，等待动画完成
            setTimeout(() => {
                this.elements.searchInput.focus();
            }, 300);
        });
        
        // 点击其他地方时关闭搜索框
        document.addEventListener('click', (e) => {
            if (!this.elements.searchInputWrapper.contains(e.target) && e.target !== this.elements.searchTriggerButton) {
                this.closeSearch();
            }
        });
        
        // 阻止搜索框内部点击事件冒泡
        this.elements.searchInputWrapper.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // 处理搜索框的键盘事件
        this.elements.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSearch();
            }
        });
    },

    // 关闭搜索框
    closeSearch() {
        // 获取按钮位置
        const buttonRect = this.elements.searchTriggerButton.getBoundingClientRect();
        const searchAreaRect = this.elements.searchArea.getBoundingClientRect();
        
        // 收起搜索框
        this.elements.searchInputWrapper.classList.remove('active');
        this.elements.searchInputWrapper.style.left = `${buttonRect.left - searchAreaRect.left}px`;
        this.elements.searchInputWrapper.style.width = `${buttonRect.width}px`;
        
        // 显示搜索按钮
        this.elements.searchTriggerButton.classList.remove('hidden');
    }
};

export default SearchComponent; 