const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminEmail = 'ayanhacks@gmail.com';
    const existing = await User.findOne({ email: adminEmail });

    if (!existing) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Ayan Hussain',
        email: adminEmail,
        passwordHash,
        role: 'admin',
        isApproved: true,
      });
      console.log('Default admin account created: ayanhacks@gmail.com');
    }
  } catch (err) {
    console.error('Admin seed error:', err.message);
  }
};

module.exports = seedAdmin;
