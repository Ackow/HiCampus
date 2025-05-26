document.addEventListener('DOMContentLoaded', () => {
    const searchTriggerButton = document.getElementById('searchTriggerButton');
    const searchInputWrapper = document.querySelector('.search-input-wrapper');
    const searchInput = document.querySelector('.search-input');
    const searchArea = document.querySelector('.search-area');
    
    // 点击搜索按钮时的处理
    searchTriggerButton.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // 获取按钮位置
        const buttonRect = searchTriggerButton.getBoundingClientRect();
        const searchAreaRect = searchArea.getBoundingClientRect();
        
        // 设置搜索框的初始位置
        searchInputWrapper.style.position = 'absolute';
        searchInputWrapper.style.left = `${buttonRect.left - searchAreaRect.left}px`;
        searchInputWrapper.style.width = `${buttonRect.width}px`;
        
        // 触发重排以应用初始位置
        searchInputWrapper.offsetHeight;
        
        // 展开搜索框
        searchInputWrapper.classList.add('active');
        searchInputWrapper.style.left = '0';
        searchInputWrapper.style.width = '100%';
        
        // 隐藏搜索按钮
        searchTriggerButton.classList.add('hidden');
        
        // 延迟聚焦，等待动画完成
        setTimeout(() => {
            searchInput.focus();
        }, 300);
    });
    
    // 点击其他地方时关闭搜索框
    document.addEventListener('click', (e) => {
        if (!searchInputWrapper.contains(e.target) && e.target !== searchTriggerButton) {
            // 获取按钮位置
            const buttonRect = searchTriggerButton.getBoundingClientRect();
            const searchAreaRect = searchArea.getBoundingClientRect();
            
            // 收起搜索框
            searchInputWrapper.classList.remove('active');
            searchInputWrapper.style.left = `${buttonRect.left - searchAreaRect.left}px`;
            searchInputWrapper.style.width = `${buttonRect.width}px`;
            
            // 显示搜索按钮
            searchTriggerButton.classList.remove('hidden');
        }
    });
    
    // 阻止搜索框内部点击事件冒泡
    searchInputWrapper.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // 处理搜索框的键盘事件
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // 获取按钮位置
            const buttonRect = searchTriggerButton.getBoundingClientRect();
            const searchAreaRect = searchArea.getBoundingClientRect();
            
            // 收起搜索框
            searchInputWrapper.classList.remove('active');
            searchInputWrapper.style.left = `${buttonRect.left - searchAreaRect.left}px`;
            searchInputWrapper.style.width = `${buttonRect.width}px`;
            
            // 显示搜索按钮
            searchTriggerButton.classList.remove('hidden');
        }
    });
}); 