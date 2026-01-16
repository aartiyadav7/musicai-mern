require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const admin = await User.findOne({ email: 'admin@musicai.com' });
    
    if (admin) {
      console.log('Admin user found:');
      console.log('Email:', admin.email);
      console.log('isAdmin:', admin.isAdmin);
      
      if (!admin.isAdmin) {
        console.log('\n⚠️  Fixing: Setting isAdmin to true...');
        admin.isAdmin = true;
        await admin.save();
        console.log('✅ Admin flag set!');
      }
    } else {
      console.log('❌ No admin user found. Run: node createAdmin.js');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkAdmin();
