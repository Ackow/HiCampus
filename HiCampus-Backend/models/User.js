const mongoose = require('mongoose');

// 创建计数器模型
const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', CounterSchema);

const userSchema = new mongoose.Schema({
    uid: { type: String, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nickname: { type: String, required: true },
    avatar: { type: String, default: 'default-avatar.png' },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female'] },
    createdAt: { type: Date, default: Date.now }
});

// 在保存用户之前生成uid
userSchema.pre('save', async function(next) {
    if (!this.uid) {
        const counter = await Counter.findByIdAndUpdate(
            'userId',
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.uid = counter.seq.toString().padStart(12, '0');
    }
    next();
});

module.exports = mongoose.model('User', userSchema); 