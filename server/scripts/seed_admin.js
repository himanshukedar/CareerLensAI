const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careerlens');
        console.log('✅ MongoDB Connected for seeding');

        const email = 'revantbajpai@gmail.com';
        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            console.log('⚠️ Admin already exists. Updating password...');
            const salt = await bcrypt.genSalt(10);
            existingAdmin.password = await bcrypt.hash('8520', salt);
            existingAdmin.name = 'Dhruva';
            await existingAdmin.save();
            console.log('✅ Admin updated successfully');
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('8520', salt);

            const newAdmin = new Admin({
                name: 'Dhruva',
                email: email,
                password: hashedPassword,
                role: 'admin'
            });

            await newAdmin.save();
            console.log('✅ Admin account created successfully');
        }

        mongoose.connection.close();
    } catch (err) {
        console.error('❌ Error seeding admin:', err.message);
        process.exit(1);
    }
};

seedAdmin();
