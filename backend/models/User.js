const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: '', trim: true },
    password: { type: String, required: function() { return !this.googleId; } },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    googleId: { type: String, default: null },
    avatar: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    emailChanges: [{ changedAt: { type: Date, default: Date.now }, oldEmail: String }]
}, { timestamps: true });

// Never return password in JSON
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);
