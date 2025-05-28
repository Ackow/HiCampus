const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    content: {
        type: String,
        required: true
    },
    likeCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true // 这会自动添加 createdAt 和 updatedAt 字段
});

// 创建索引以提高查询性能
articleSchema.index({ creator: 1, createdAt: -1 });
articleSchema.index({ title: 'text', content: 'text' }); // 用于全文搜索

const Article = mongoose.model('Article', articleSchema);

module.exports = Article; 