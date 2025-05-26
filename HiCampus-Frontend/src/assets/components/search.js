// 搜索组件
const SearchComponent = {
    init() {
        const searchTriggerButton = document.getElementById('searchTriggerButton');
        const searchInputWrapper = document.querySelector('.search-input-wrapper');
        const searchInput = document.querySelector('.search-input');

        function toggleSearch() {
            searchInputWrapper.classList.toggle('active');
            searchTriggerButton.classList.toggle('hidden');
            if (searchInputWrapper.classList.contains('active')) {
                searchInput.focus();
            }
        }

        searchTriggerButton.addEventListener('click', toggleSearch);

        // 点击外部关闭搜索框
        document.addEventListener('click', (e) => {
            if (!searchInputWrapper.contains(e.target) && 
                !searchTriggerButton.contains(e.target) && 
                searchInputWrapper.classList.contains('active')) {
                toggleSearch();
            }
        });
    }
};

export default SearchComponent; 