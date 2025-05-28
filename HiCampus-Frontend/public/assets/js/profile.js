// 个人资料页面组件
const ProfileComponent = {
    // 组件名称
    name: 'profile',

    // 初始化组件
    init() {
        console.log('初始化个人资料页面组件');
        // 监听 hash 变化
        window.addEventListener('hashchange', this.onHashChange.bind(this));
        // 首次加载时也要判断
        this.onHashChange();
    },

    // hash 路由变化时的处理
    onHashChange() {
        if (window.location.hash === '#profile') {
            this.updateUserInfo();
            setTimeout(() => {
                this.renderProfileFromCache();
            }, 100);
        }
    },

    async updateUserInfo() {
        try {
            const response = await fetch('http://localhost:3000/api/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const result = await response.json();

            if (response.ok)     {
                localStorage.setItem('userInfo', JSON.stringify(result));
            } else {
                console.error('获取用户信息失败:', result.message);
            }
        } catch (error) {
            console.error('获取用户信息出错:', error);
        }
    },

    // 从localStorage读取并渲染用户信息
    renderProfileFromCache() {
        const userInfoStr = localStorage.getItem('userInfo');
        const isLoggedIn = localStorage.getItem('isLoggedIn');

        if (!isLoggedIn) {
            // 未登录，跳转到登录页
            const basePath = window.location.pathname.includes('/public/') ? '../' : '';
            window.location.href = `${basePath}src/pages/registerAndLogin.html`;
            return;
        } else {
            let userInfo;
            try {
                userInfo = JSON.parse(userInfoStr);
            } catch (e) {
                console.error('用户信息解析失败:', e);
                // 解析失败，清除缓存并跳转
                localStorage.removeItem('userInfo');
                const basePath = window.location.pathname.includes('/public/') ? '../' : '';
                window.location.href = `${basePath}src/pages/registerAndLogin.html`;
                return;
            }
            this.updateUI(userInfo);
        }
    },

    // 更新UI显示
    updateUI(user) {
        const avatar = document.querySelector('.profile-avatar');
        const nickname = document.querySelector('.profile-nickname');
        const uid = document.querySelector('.profile-uid');
        const age = document.querySelector('.profile-age');
        const gender = document.querySelector('.profile-gender');

        if (!avatar || !nickname || !uid || !age) {
            console.error('未找到必要的DOM元素');
            return;
        }
        avatar.src = user.avatar || 'http://localhost:3000/uploads/avatars/default-avatar.png';
        avatar.alt = `${user.nickname || '用户'}的头像`;
        nickname.textContent = user.nickname || user.username || '未设置昵称';
        uid.textContent = user.uid || '未获取到嗨号';
        age.textContent = user.age + '岁' || '未设置年龄';
        if (user.gender === 'male') {
           gender.src = '../../public/assets/images/男.svg';
        } else {
            gender.src = '../../public/assets/images/女.svg';
        }
        console.log('用户信息更新完成');
    }
};

export default ProfileComponent;
