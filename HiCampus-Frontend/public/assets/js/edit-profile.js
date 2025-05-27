// 编辑个人信息组件
const EditProfileComponent = {
    // 组件名称
    name: 'editProfile',

    init() {
        console.log('初始化个人资料修改页面组件');
        // 监听 hash 变化
        window.addEventListener('hashchange', this.onHashChange.bind(this));
        // 首次加载时也要判断
        this.onHashChange();
    },

    // hash 路由变化时的处理
    onHashChange() {
        if (window.location.hash === '#edit-profile') {
            this.updateUserInfo();
            setTimeout(() => {
                this.loadUserInfo();
                this.bindEvents();
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

    bindEvents() {
        console.log('绑定事件');
        const editAvatarBtn = document.querySelector('.edit-avatar-btn');
        const saveBtn = document.querySelector('.save-btn');
        const cancelBtn = document.querySelector('.cancel-btn');
        const backBtn = document.querySelector('.back-btn');


        if (editAvatarBtn) {
            editAvatarBtn.addEventListener('click', this.handleAvatarUpload.bind(this));
        }
        if (saveBtn) {
            saveBtn.addEventListener('click', this.handleSaveProfile.bind(this));
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', this.handleCancelEdit.bind(this));
        }
        if (backBtn) {
            backBtn.addEventListener('click', () => history.back());
        }
    },

    loadUserInfo() {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            // 填充表单数据
            const nicknameInput = document.querySelector('.nickname');
            const ageInput = document.querySelector('.age');
            
            if (nicknameInput) nicknameInput.value = userInfo.nickname;
            if (ageInput) ageInput.value = userInfo.age;
            
            const genderInputs = document.querySelectorAll('input[name="gender"]');
            genderInputs.forEach(input => {
                if ((userInfo.gender === 'male' && input.value === 'male') || 
                    (userInfo.gender === 'female' && input.value === 'female')) {
                    input.checked = true;
                }
            });
            const avatar = document.querySelector('.profile-edit-avatar');
            if (avatar) {
                avatar.src = userInfo.avatar || 'http://localhost:3000/uploads/avatars/default-avatar.png';
            }
        }
    },

    handleAvatarUpload() {
        console.log('上传头像');

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

                try {
                    const formData = new FormData();
                    formData.append('avatar', file);

                    const response = await fetch('http://localhost:3000/api/upload/avatar', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: formData
                    });

                    const result = await response.json();

                    if (response.ok) {
                        // 更新本地存储中的用户信息
                        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                        userInfo.avatar = result.avatar;
                        localStorage.setItem('userInfo', JSON.stringify(userInfo));

                        // 更新头像显示
                        const avatar = document.querySelector('.profile-edit-avatar');
                        if (avatar) {
                            avatar.src = result.avatar;
                        }

                        alert('头像上传成功');
                    } else {
                        alert(result.message || '头像上传失败');
                    }
                } catch (error) {
                    console.error('头像上传错误:', error);
                    alert('头像上传失败，请稍后重试');
                }
            }
        };
        input.click();
    },

    handleSaveProfile() {
        const nickname = document.querySelector('input[type="text"]').value;
        const age = document.querySelector('input[type="number"]').value;
        const password = document.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = document.querySelectorAll('input[type="password"]')[1].value;
        const gender = document.querySelector('input[name="gender"]:checked')?.value;

        // 表单验证
        if (!nickname) {
            alert('请输入昵称');
            return;
        }

        if (password && password !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }

        // 构建更新数据
        const updateData = {
            nickname,
            age: parseInt(age) || null,
            gender,
            avatar: document.querySelector('.profile-avatar').src
        };

        if (password) {
            updateData.password = password;
        }

        // TODO: 调用后端 API 更新用户信息
        // 这里先模拟更新成功
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const updatedUserInfo = { ...userInfo, ...updateData };
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        
        alert('保存成功');
        history.back();
    },

    handleCancelEdit() {
        if (confirm('确定要取消编辑吗？未保存的更改将会丢失。')) {
            history.back();
        }
    }
};

export default EditProfileComponent; 