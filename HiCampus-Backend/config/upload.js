const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const avatarDir = 'uploads/avatars';
const imageDir = 'uploads/images';

[avatarDir, imageDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// 配置存储
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 根据请求路径判断是头像还是文章图片
        const isAvatar = req.path.includes('avatar');
        const uploadPath = isAvatar ? avatarDir : imageDir;
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // 生成唯一文件名：时间戳 + 随机数 + .jpg
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '.jpg');
    }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
    // 只允许图片文件
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('只允许上传图片文件！'), false);
    }
};

// 创建 multer 实例
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 限制5MB
    }
});

module.exports = upload; 