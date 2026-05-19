require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Worker = require('./models/Worker');
const Product = require('./models/Product');

const fs = require('fs');
const path = require('path');

const readData = (file) => {
    const filePath = path.join(__dirname, 'data', file);
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/livspaceone');
        console.log('MongoDB Connected for Seeding');

        // Clear existing data
        await User.deleteMany();
        await Worker.deleteMany();
        await Product.deleteMany();
        console.log('Cleared existing data.');

        // Seed Users
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);
        
        const users = [
            {
                name: 'Admin',
                email: 'admin@livspaceone.com',
                phone: '1234567890',
                password: adminPassword,
                role: 'admin'
            }
        ];
        // Add existing JSON users if any
        const jsonUsers = readData('users.json');
        for (let u of jsonUsers) {
            if (u.email === 'admin@livspaceone.com') continue;
            users.push({
                name: u.name,
                email: u.email,
                phone: u.phone,
                password: await bcrypt.hash(u.password, salt),
                role: 'user'
            });
        }
        await User.insertMany(users);
        console.log('Users seeded.');

        // Seed Workers
        let workers = readData('workers.json');
        if (workers.length === 0) {
            // fallback if JSON empty
            workers = [
                { name: 'Ramesh Singh', role: 'Electrician', price: '₹350/hr', rating: 4.8, exp: '5 Yrs', city: 'Delhi', phone: '9876543210', verified: true, status: 'Available', img: 'https://via.placeholder.com/150' },
                { name: 'Suresh Kumar', role: 'Plumber', price: '₹300/hr', rating: 4.5, exp: '3 Yrs', city: 'Delhi', phone: '9876543211', verified: false, status: 'Busy', img: 'https://via.placeholder.com/150' }
            ];
        }
        
        // Remove 'id' since Mongoose uses '_id'
        workers = workers.map(({ id, ...rest }) => rest);
        await Worker.insertMany(workers);
        console.log('Workers seeded.');

        // Seed Products
        let products = readData('products.json');
        if (products.length === 0) {
            products = [
                { name: 'Modular Switches', category: 'switches', price: 899, oldPrice: 1299, discount: '30% off', stock: 45, rating: 4.5, img: 'https://via.placeholder.com/300' }
            ];
        }
        products = products.map(({ id, ...rest }) => rest);
        await Product.insertMany(products);
        console.log('Products seeded.');

        console.log('Database Seeding Completed!');
        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedDatabase();
