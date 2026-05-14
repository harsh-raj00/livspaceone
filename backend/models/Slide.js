const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    img: { type: String, required: true },
    buttonText: { type: String, default: 'Explore →' },
    buttonLink: { type: String, default: '#' },
    galleryImages: [{ type: String }],
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Slide', slideSchema);
