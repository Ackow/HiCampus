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
            setTimeout(() => {
                this.loadUserInfo();
                this.bindEvents();
            }, 100);
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
                avatar.src = userInfo.avatar || 'http://localhost:3000/uploads/avatars/default-avatar.jpg';
            }
        }
    },

    async handleAvatarUpload() {
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

                    const response = await fetch('http://localhost:3000/api/users/avatar', {
                        method: 'POST',
                        body: formData,
                        credentials: 'include'
                    });

                    if (!response.ok) {
                        throw new Error('上传失败');
                    }

                    const data = await response.json();
                    const avatarUrl = `http://localhost:3000/uploads/avatars/${data.filename}`;
                    
                    // 更新头像显示
                    const avatarPreview = document.querySelector('.avatar-preview');
                    if (avatarPreview) {
                        avatarPreview.src = avatarUrl;
                        avatarPreview.onerror = function() {
                            this.onerror = null;
                            this.src = 'http://localhost:3000/uploads/avatars/default-avatar.jpg';
                        };
                    }

                    // 更新用户信息
                    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                    userInfo.avatar = avatarUrl;
                    localStorage.setItem('userInfo', JSON.stringify(userInfo));

                    showMessage('头像上传成功');
                } catch (error) {
                    console.error('头像上传失败:', error);
                    showMessage('头像上传失败，请重试', 'error');
                }
            }
        };
        input.click();
    },

    async handleSaveProfile() {
        const nickname = document.querySelector('.nickname').value;
        const age = document.querySelector('.age').value;
        const password = document.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = document.querySelectorAll('input[type="password"]')[1].value;
        const gender = document.querySelector('input[name="gender"]:checked')?.value;

        // console.log(nickname,age,password,confirmPassword,gender);

        // 表单验证
        if (!nickname) {
            alert('请输入昵称');
            return;
        }

        if (nickname.length > 6) {
            alert('昵称长度不能超过6位');
            return;
        }

        if (age.length > 2) {
            alert('年龄必须在1-99岁之间');
            return;
        }

        if (password && password !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        // 构建更新数据，只包含发生变化的字段
        const updateData = {
            id: userInfo.id
        };

        // 检查每个字段是否有变化，有变化才添加到updateData中
        if (nickname && nickname !== userInfo.nickname) {
            updateData.nickname = nickname;
        }
        if (age && parseInt(age) !== userInfo.age) {
            updateData.age = parseInt(age);
        }
        if (gender && gender !== userInfo.gender) {
            updateData.gender = gender;
        }
        if (password) {
            updateData.password = password;
        }

        // 如果没有需要更新的字段，提示用户
        if (Object.keys(updateData).length <= 1) { // 只有id字段
            alert('没有检测到任何修改');
            return;
        }

        console.log('更新的数据:', updateData);

        // 调用后端 API 更新用户信息
        try {
            const response = await fetch('http://localhost:3000/api/user/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updateData)
            });

            const result = await response.json();

            if (response.ok) {
                // 更新本地存储中的用户信息
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const updatedUserInfo = { ...userInfo, ...result };
                localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
                
                alert('保存成功');
                history.back();
            } else {
                alert(result.message || '更新失败，请稍后重试');
            }
        } catch (error) {
            console.error('更新用户信息出错:', error);
            alert('更新失败，请检查网络连接后重试');
        }
    },

    handleCancelEdit() {
        if (confirm('确定要取消编辑吗？未保存的更改将会丢失。')) {
            history.back();
        }
    }
};

export default EditProfileComponent; 