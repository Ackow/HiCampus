// 侧边栏组件
const SidebarComponent = {
    init() {
        const sidebar = document.getElementById('sidebar');
        const sidebarTriggerButton = document.getElementById('sidebarTriggerButton');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        // 打开侧边栏
        function openSidebar() {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        }

        // 关闭侧边栏
        function closeSidebar() {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = ''; // 恢复背景滚动
        }

        // 事件监听
        sidebarTriggerButton.addEventListener('click', openSidebar);
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
};

export default SidebarComponent; 