const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// 注册用户
exports.register = async (req, res) => {
    try {
        const { username, password, nickname } = req.body;

        // 检查用户是否已存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: '用户名已存在' });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 创建新用户
        const user = new User({
            username,
            password: hashedPassword,
            nickname,
            avatar: 'default-avatar.png',
            age: 0,
            gender: 'male'
        });

        await user.save();

        // 生成JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: '注册成功',
            token,
            user: {
                id: user._id,
                uid: user.uid,
                username: user.username,
                nickname: user.nickname,
                avatar: `http://localhost:3000/uploads/avatars/${user.avatar}`,
                age: user.age,
                gender: user.gender
            }
        });
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 用户登录
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 查找用户
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        // 验证密码
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: '用户名或密码错误' });
        }

        // 生成JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            message: '登录成功',
            token,
            user: {
                id: user._id,
                uid: user.uid,
                username: user.username,
                nickname: user.nickname,
                avatar: `http://localhost:3000/uploads/avatars/${user.avatar}`,
                age: user.age,
                gender: user.gender
            }
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 获取用户信息
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }
        res.json({
            id: user._id,
            uid: user.uid,
            username: user.username,
            nickname: user.nickname,
            avatar: `http://localhost:3000/uploads/avatars/${user.avatar}`,
            age: user.age,
            gender: user.gender,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error('获取用户信息错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 上传头像
exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: '请选择要上传的图片' });
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: '用户不存在' });
        }

        // 删除旧头像（如果不是默认头像）
        if (user.avatar !== 'default-avatar.png') {
            const oldAvatarPath = path.join(__dirname, '../uploads/avatars', user.avatar);
            if (fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            }
        }

        // 更新用户头像
        user.avatar = req.file.filename;
        await user.save();

        res.json({
            message: '头像上传成功',
            avatar: `http://localhost:3000/uploads/avatars/${req.file.filename}`
        });
    } catch (error) {
        console.error('头像上传错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
}; 