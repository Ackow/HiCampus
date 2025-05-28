const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
}, {
    timestamps: true // 这会自动添加 createdAt 和 updatedAt 字段
});

// 创建索引以提高查询性能
imageSchema.index({ article: 1 });

const Image = mongoose.model('Image', imageSchema);

module.exports = Image; 