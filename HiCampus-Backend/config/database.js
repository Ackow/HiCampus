const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hicampus', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB连接成功');
    } catch (err) {
        console.error('MongoDB连接失败:', err);
        process.exit(1);
    }
};

module.exports = connectDB; 