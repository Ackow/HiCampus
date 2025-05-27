const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');
const upload = require('../config/upload');

// 注册路由
router.post('/register', userController.register);

// 登录路由
router.post('/login', userController.login);

// 获取用户信息路由
router.get('/user', authenticateToken, userController.getUserInfo);

// 上传头像路由
router.post('/upload/avatar', authenticateToken, upload.single('avatar'), userController.uploadAvatar);

module.exports = router; 