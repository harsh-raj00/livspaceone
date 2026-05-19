const mongoose = require('mongoose');

const runLocalSeed = async () => {
    try {
        console.log('Connecting to local MongoDB: mongodb://127.0.0.1:27017/livspaceone ...');
        await mongoose.connect('mongodb://127.0.0.1:27017/livspaceone', {
            serverSelectionTimeoutMS: 3000
        });
        console.log('✅ Connected to local MongoDB!');
        console.log('Starting seed process...');
        require('./seed_memory');
    } catch (err) {
        console.warn('⚠️ Local MongoDB not running or failed to seed:', err.message);
        process.exit(0);
    }
};

runLocalSeed();
