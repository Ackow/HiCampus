const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const uploadController = require('../controllers/uploadController');
const articleController = require('../controllers/articleController');
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

// 更新用户信息路由
router.put('/user/update', authenticateToken, userController.updateUserInfo);

// 图片上传路由
router.post('/upload/image', authenticateToken, upload.single('image'), uploadController.uploadImage);

module.exports = router; 