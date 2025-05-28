const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const authenticateToken = require('../middleware/auth');

// 获取文章列表
router.get('/articles', articleController.getArticles);

// 创建文章
router.post('/articles', authenticateToken, articleController.createArticle);

module.exports = router;