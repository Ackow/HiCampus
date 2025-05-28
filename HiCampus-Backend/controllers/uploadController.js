// 图片上传控制器
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: '没有上传文件' });
        }

        // 构建图片URL
        const imageUrl = `http://localhost:3000/uploads/images/${req.file.filename}`;
        
        res.json({
            message: '图片上传成功',
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error('图片上传错误:', error);
        res.status(500).json({ message: '图片上传失败' });
    }
};

module.exports = {
    uploadImage
}; 