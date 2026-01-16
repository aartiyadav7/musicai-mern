require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@musicai.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      
      // Update existing user to admin
      existingAdmin.isAdmin = true;
      await existingAdmin.save();
      console.log('✅ Updated existing user to admin');
    } else {
      // Create new admin user
      const admin = new User({
        username: 'admin',
        email: 'admin@musicai.com',
        password: 'admin123',  // Change this to a secure password
        isAdmin: true,
        preferences: {
          favoriteGenres: [],
          favoriteArtists: [],
          mood: 'happy'
        }
      });

      await admin.save();
      console.log('✅ Admin user created successfully');
    }

    console.log('\n📧 Admin Credentials:');
    console.log('   Email: admin@musicai.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
