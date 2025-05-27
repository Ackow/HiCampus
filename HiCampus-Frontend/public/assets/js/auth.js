// 配置
const API_URL = 'http://localhost:3000/api';

// 认证组件
const AuthComponent = {
    // 组件名称
    name: 'auth',

    // DOM 元素
    elements: {
        loginForm: null,
        registerForm: null,
        showRegister: null,
        showLogin: null,
        passwordToggles: null,
        authButtons: null,
        userProfile: null,
        authButton: null
    },

    // 初始化
    init() {
        console.log('初始化认证组件');
        
        // 获取DOM元素
        this.elements = {
            loginForm: document.getElementById('loginForm'),
            registerForm: document.getElementById('registerForm'),
            showRegister: document.getElementById('showRegister'),
            showLogin: document.getElementById('showLogin'),
            passwordToggles: document.querySelectorAll('.password-toggle'),
            authButtons: document.getElementById('authButtons'),
            userProfile: document.getElementById('userProfile'),
            authButton: document.querySelector('.auth-button')
        };

        // 检查登录状态
        this.checkLoginStatus();

        // 绑定事件
        this.bindEvents();
    },

    // 检查登录状态
    checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.updateUI(isLoggedIn);
    },

    // 更新UI显示
    updateUI(isLoggedIn) {
        if (this.elements.authButtons && this.elements.userProfile) {
            if (isLoggedIn) {
                this.elements.authButtons.style.display = 'none';
                this.elements.userProfile.style.display = 'flex';
                
                // 获取用户信息并更新显示
                const userInfo = JSON.parse(localStorage.getItem('user'));
                if (userInfo) {
                    const userAvatar = this.elements.userProfile.querySelector('.user-avatar');
                    const userNickname = this.elements.userProfile.querySelector('.user-nickname');
                    
                    // 更新头像
                    if (userAvatar) {
                        // 使用服务器返回的完整URL，如果没有则使用默认头像
                        userAvatar.src = userInfo.avatar || 'http://localhost:3000/uploads/avatars/default-avatar.png';
                        userAvatar.alt = `${userInfo.nickname || '用户'}的头像`;
                    }
                    
                    // 更新昵称
                    if (userNickname) {
                        userNickname.textContent = userInfo.nickname || userInfo.username || '加载中...';
                    }
                }
            } else {
                this.elements.authButtons.style.display = 'flex';
                this.elements.userProfile.style.display = 'none';
            }
        }
    },

    // 上传头像
    async uploadAvatar(file) {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await fetch(`${API_URL}/upload/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                // 更新本地存储中的用户信息
                const userInfo = JSON.parse(localStorage.getItem('user'));
                userInfo.avatar = result.avatar;
                localStorage.setItem('user', JSON.stringify(userInfo));

                // 更新UI显示
                this.updateUI(true);

                return { success: true, message: '头像上传成功' };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            console.error('头像上传错误:', error);
            return { success: false, message: '头像上传失败，请稍后重试' };
        }
    },

    // 绑定事件
    bindEvents() {
        // 登录/注册表单切换
        if (this.elements.showRegister) {
            this.elements.showRegister.addEventListener('click', () => {
                this.elements.loginForm.style.display = 'none';
                this.elements.registerForm.style.display = 'block';
            });
        }

        if (this.elements.showLogin) {
            this.elements.showLogin.addEventListener('click', () => {
                this.elements.registerForm.style.display = 'none';
                this.elements.loginForm.style.display = 'block';
            });
        }

        // 密码显示切换
        if (this.elements.passwordToggles) {
            this.elements.passwordToggles.forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const targetId = toggle.getAttribute('data-target');
                    const passwordInput = toggle.parentElement.querySelector(`input[name="${targetId}"]`);
                    
                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        toggle.innerHTML = `
                            <svg width="24" height="24" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                <line x1="1" y1="1" x2="23" y2="23"/>
                            </svg>
                        `;
                    } else {
                        passwordInput.type = 'password';
                        toggle.innerHTML = `
                            <svg width="24" height="24" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        `;
                    }
                });
            });
        }

        // 登录表单提交
        if (this.elements.loginForm) {
            this.elements.loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(this.elements.loginForm);
                const data = {
                    username: formData.get('username'),
                    password: formData.get('password')
                };

                try {
                    const response = await fetch(`${API_URL}/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    const result = await response.json();

                    if (response.ok) {
                        // 保存token和用户信息
                        localStorage.setItem('token', result.token);
                        localStorage.setItem('user', JSON.stringify(result.user));
                        localStorage.setItem('isLoggedIn', 'true');
                        
                        // 更新UI
                        this.updateUI(true);
                        
                        // 跳转到首页
                        window.location.href = '/public/index.html';
                    } else {
                        alert(result.message);
                    }
                } catch (error) {
                    console.error('登录错误:', error);
                    alert('登录失败，请稍后重试');
                }
            });
        }

        // 注册表单提交
        if (this.elements.registerForm) {
            this.elements.registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(this.elements.registerForm);
                const password = formData.get('password');
                const confirmPassword = formData.get('confirmPassword');

                // 验证密码是否匹配
                if (password !== confirmPassword) {
                    alert('两次输入的密码不一致');
                    return;
                }

                const data = {
                    username: formData.get('username'),
                    password: password,
                    nickname: formData.get('nickname')
                };

                try {
                    const response = await fetch(`${API_URL}/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    const result = await response.json();

                    if (response.ok) {
                        // 注册成功后显示登录表单
                        this.elements.registerForm.style.display = 'none';
                        this.elements.loginForm.style.display = 'block';
                        alert('注册成功，请登录');
                    } else {
                        alert(result.message);
                    }
                } catch (error) {
                    console.error('注册错误:', error);
                    alert('注册失败，请稍后重试');
                }
            });
        }

        // 导航栏登录按钮点击
        if (this.elements.authButton) {
            this.elements.authButton.addEventListener('click', () => {
                // 检查当前页面路径
                const currentPath = window.location.pathname;
                if (!currentPath.includes('registerAndLogin.html')) {
                    // 使用相对路径
                    const basePath = window.location.pathname.includes('/public/') ? '../' : '';
                    window.location.href = `${basePath}src/pages/registerAndLogin.html`;
                }
            });
        }

        // 退出登录按钮
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                // 清除本地存储的登录状态
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                // 更新UI显示
                this.updateUI(false);
                
                // 重定向到首页
                window.location.href = '/public/index.html';
            });
        }

        // 头像点击事件（用于上传新头像）
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', (e) => {
                e.preventDefault();
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                
                input.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        // 验证文件大小（5MB限制）
                        if (file.size > 5 * 1024 * 1024) {
                            alert('图片大小不能超过5MB');
                            return;
                        }

                        // 验证文件类型
                        if (!file.type.startsWith('image/')) {
                            alert('请选择图片文件');
                            return;
                        }

                        const result = await this.uploadAvatar(file);
                        if (result.success) {
                            alert(result.message);
                        } else {
                            alert(result.message);
                        }
                    }
                };

                input.click();
            });
        }
    }
};

// 导出组件
export default AuthComponent;