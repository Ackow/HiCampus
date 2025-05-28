// 发布文章组件
const PublishComponent = {
    name: 'publish',
    images: [], // 存储选择的图片

    init() {
        this.bindEvents();
    },

    bindEvents() {
        const uploadBox = document.getElementById('uploadBox');
        const imageInput = document.getElementById('imageInput');
        const publishBtn = document.querySelector('.publish-btn');

        if (uploadBox && imageInput) {
            uploadBox.addEventListener('click', () => {
                imageInput.click();
            });

            imageInput.addEventListener('change', this.handleImageSelect.bind(this));
        }

        if (publishBtn) {
            publishBtn.addEventListener('click', this.handlePublish.bind(this));
        }
    },

    handleImageSelect(event) {
        const files = event.target.files;
        if (!files) return;

        // 检查是否超过9张图片
        if (this.images.length + files.length > 9) {
            alert('最多只能上传9张图片');
            return;
        }

        // 处理每个选择的文件
        Array.from(files).forEach(file => {
            // 验证文件类型
            if (!file.type.startsWith('image/')) {
                alert('请选择图片文件');
                return;
            }

            // 验证文件大小（5MB限制）
            if (file.size > 5 * 1024 * 1024) {
                alert('图片大小不能超过5MB');
                return;
            }

            // 创建预览
            const reader = new FileReader();
            reader.onload = (e) => {
                this.images.push({
                    file: file,
                    preview: e.target.result
                });
                this.updateImagePreview();
            };
            reader.readAsDataURL(file);
        });

        // 清空input，允许重复选择同一文件
        event.target.value = '';
    },

    updateImagePreview() {
        const container = document.getElementById('imagePreviewContainer');
        const countDisplay = document.querySelector('.image-count');
        
        if (!container || !countDisplay) return;

        // 更新计数显示
        countDisplay.textContent = `(${this.images.length}/9)`;

        // 清空容器
        container.innerHTML = '';

        // 添加预览
        this.images.forEach((image, index) => {
            const placeholder = document.createElement('div');
            placeholder.className = 'uploaded-image-placeholder';
            
            const img = document.createElement('img');
            img.src = image.preview;
            img.className = 'uploaded-image';
            img.alt = '预览图片';

            const deleteBtn = document.createElement('img');
            deleteBtn.src = '../../public/assets/images/删除.svg';
            deleteBtn.className = 'delete-btn';
            deleteBtn.alt = '删除';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                this.removeImage(index);
            };

            placeholder.appendChild(img);
            placeholder.appendChild(deleteBtn);
            container.appendChild(placeholder);
        });
    },

    removeImage(index) {
        this.images.splice(index, 1);
        this.updateImagePreview();
    },

    // 上传图片到服务器
    async uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:3000/api/upload/image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('图片上传失败');
            }

            const data = await response.json();
            return data.imageUrl;
        } catch (error) {
            console.error('图片上传错误:', error);
            throw error;
        }
    },

    // 创建文章
    async createArticle(articleData) {
        try {
            const response = await fetch('http://localhost:3000/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(articleData)
            });

            if (!response.ok) {
                throw new Error('文章发布失败');
            }

            return await response.json();
        } catch (error) {
            console.error('文章发布错误:', error);
            throw error;
        }
    },

    async handlePublish() {
        const title = document.querySelector('.input-title').value.trim();
        const content = document.querySelector('.textarea-body').value.trim();
        const publishBtn = document.querySelector('.publish-btn');
        const originalText = publishBtn.textContent;

        // 表单验证
        if (!title) {
            alert('请输入文章标题');
            return;
        }

        if (!content) {
            alert('请输入文章内容');
            return;
        }

        // 从localStorage获取用户信息和token
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = localStorage.getItem('token');
        
        if (!userInfo || !userInfo.id || !token) {
            alert('请先登录');
            return;
        }

        try {
            //显示加载状态
            publishBtn.textContent = '发布中...';
            publishBtn.disabled = true;

            // 1. 先上传所有图片
            const uploadedImages = [];
            for (const image of this.images) {
                try {
                    const imageUrl = await this.uploadImage(image.file);
                    uploadedImages.push({ imageUrl });
                } catch (error) {
                    console.error('图片上传失败:', error);
                    throw new Error('图片上传失败，请重试');
                }
            }

            // 2. 创建文章数据
            const articleData = {
                title: title,
                content: content,
                images: uploadedImages
            };

            // 3. 发布文章
            const response = await fetch('http://localhost:3000/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(articleData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || '文章发布失败');
            }

            const result = await response.json();

            // 4. 发布成功
            alert('发布成功！');
            // 清空表单
            document.querySelector('.input-title').value = '';
            document.querySelector('.textarea-body').value = '';
            this.images = [];
            this.updateImagePreview();
            // 跳转到首页
            window.location.href = '/public/index.html#home';

        } catch (error) {
            console.error('发布错误:', error);
            alert('发布失败：' + error.message);
        } finally {
            // 恢复按钮状态
            publishBtn.textContent = originalText;
            publishBtn.disabled = false;
        }
    }
};

export default PublishComponent; 