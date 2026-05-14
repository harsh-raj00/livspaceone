const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: Number, default: 5.0 },
    exp: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    verified: { type: Boolean, default: false },
    status: { type: String, enum: ['Available', 'Busy', 'Offline'], default: 'Offline' },
    img: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Worker', workerSchema);
