const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@tutorhub.et' });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await Admin.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@tutorhub.et',
      password: 'admin123',
      role: 'super-admin',
      permissions: [
        'manage-users',
        'manage-courses',
        'manage-resources',
        'manage-payments',
        'verify-tutors'
      ]
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Email: admin@tutorhub.et');
    console.log('🔑 Password: admin123');
    console.log('\n⚠️  Please change the password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
