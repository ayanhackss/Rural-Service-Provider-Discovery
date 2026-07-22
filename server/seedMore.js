require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Service = require('./models/Service');
const bcrypt = require('bcryptjs');

const URI = process.env.MONGO_URI;

const seedMore = async () => {
  try {
    await mongoose.connect(URI);
    console.log('Connected to DB');

    const emails = [
      'dr.sharma@example.com',
      'ram.carpenter@example.com',
      'sita.tailor@example.com',
      'mohan.mason@example.com',
      'hari.painter@example.com',
      'gita.cleaner@example.com'
    ];
    await User.deleteMany({ email: { $in: emails } });
    console.log('Cleaned up old test users.');

    const passwordHash = await bcrypt.hash('password123', 12);

    const providersData = [
      {
        name: 'Dr. R.K. Sharma',
        email: 'dr.sharma@example.com',
        phone: '9876543301',
        passwordHash,
        role: 'provider',
        isApproved: true,
        location: { village: 'Chanpatia', pinCode: '845449' },
        averageRating: 4.9,
        totalBookings: 85
      },
      {
        name: 'Ram Kripal Woodworks',
        email: 'ram.carpenter@example.com',
        phone: '9876543302',
        passwordHash,
        role: 'provider',
        isApproved: true,
        location: { village: 'Lauriya', pinCode: '845453' },
        averageRating: 4.6,
        totalBookings: 22
      },
      {
        name: 'Sita Silai Kendra',
        email: 'sita.tailor@example.com',
        phone: '9876543303',
        passwordHash,
        role: 'provider',
        isApproved: true,
        location: { village: 'Majhaulia', pinCode: '845454' },
        averageRating: 4.7,
        totalBookings: 56
      },
      {
        name: 'Mohan Builders & Masons',
        email: 'mohan.mason@example.com',
        phone: '9876543304',
        passwordHash,
        role: 'provider',
        isApproved: true,
        location: { village: 'Shikarpur', pinCode: '845455' },
        averageRating: 4.3,
        totalBookings: 18
      },
      {
        name: 'Hari Painting Services',
        email: 'hari.painter@example.com',
        phone: '9876543305',
        passwordHash,
        role: 'provider',
        isApproved: true,
        location: { village: 'Bettiah', pinCode: '845438' },
        averageRating: 4.8,
        totalBookings: 39
      },
      {
        name: 'Gita Deep Cleaning',
        email: 'gita.cleaner@example.com',
        phone: '9876543306',
        passwordHash,
        role: 'provider',
        isApproved: true,
        location: { village: 'Bagaha', pinCode: '845101' },
        averageRating: 4.4,
        totalBookings: 15
      }
    ];

    console.log('Inserting more providers...');
    const insertedProviders = await User.insertMany(providersData);

    await Service.deleteMany({ providerId: { $in: insertedProviders.map(p => p._id) } });

    const servicesData = [
      {
        providerId: insertedProviders[0]._id, // Dr. Sharma
        title: 'General Physician & Home Visit',
        category: 'Doctor',
        description: 'MBBS doctor available for basic checkups, fever, BP monitoring, and emergency first aid at home.',
        priceRange: { min: 200, max: 500 },
        averageRating: 4.9,
        totalReviews: 24,
        availability: [
          { day: 'Monday', slots: ['08:00', '09:00', '17:00', '18:00'] },
          { day: 'Tuesday', slots: ['08:00', '09:00', '17:00', '18:00'] },
          { day: 'Wednesday', slots: ['08:00', '09:00', '17:00', '18:00'] },
          { day: 'Thursday', slots: ['08:00', '09:00', '17:00', '18:00'] },
          { day: 'Friday', slots: ['08:00', '09:00', '17:00', '18:00'] }
        ]
      },
      {
        providerId: insertedProviders[1]._id, // Ram Carpenter
        title: 'Furniture Repair & Door Installation',
        category: 'Carpenter',
        description: 'Specialist in making customized wooden beds, repairing broken chairs, and installing new doors and windows.',
        priceRange: { min: 300, max: 2000 },
        averageRating: 4.6,
        totalReviews: 8,
        availability: [
          { day: 'Monday', slots: ['09:00', '11:00', '14:00', '16:00'] },
          { day: 'Tuesday', slots: ['09:00', '11:00', '14:00', '16:00'] },
          { day: 'Thursday', slots: ['09:00', '11:00', '14:00', '16:00'] },
          { day: 'Saturday', slots: ['09:00', '11:00', '14:00', '16:00'] }
        ]
      },
      {
        providerId: insertedProviders[2]._id, // Sita Tailor
        title: 'Stitching, Alteration & Embroidery',
        category: 'Tailor',
        description: 'Expert tailoring for women and children. Custom dresses, blouses, suit stitching, and minor alterations.',
        priceRange: { min: 50, max: 800 },
        averageRating: 4.7,
        totalReviews: 19,
        availability: [
          { day: 'Monday', slots: ['10:00', '12:00', '15:00', '17:00'] },
          { day: 'Wednesday', slots: ['10:00', '12:00', '15:00', '17:00'] },
          { day: 'Friday', slots: ['10:00', '12:00', '15:00', '17:00'] }
        ]
      },
      {
        providerId: insertedProviders[3]._id, // Mohan Mason
        title: 'Brickwork, Plaster & Wall Repair',
        category: 'Mason',
        description: 'Experienced in bricklaying, wall plastering, concrete flooring, and roof repairs.',
        priceRange: { min: 500, max: 1200 },
        averageRating: 4.3,
        totalReviews: 5,
        availability: [
          { day: 'Tuesday', slots: ['08:00', '13:00'] },
          { day: 'Thursday', slots: ['08:00', '13:00'] },
          { day: 'Saturday', slots: ['08:00', '13:00'] }
        ]
      },
      {
        providerId: insertedProviders[4]._id, // Hari Painter
        title: 'Whitewash & Wall Painting',
        category: 'Painter',
        description: 'Professional whitewashing, distemper, enamel painting for doors/windows, and exterior wall painting.',
        priceRange: { min: 400, max: 5000 },
        averageRating: 4.8,
        totalReviews: 14,
        availability: [
          { day: 'Monday', slots: ['08:00', '09:00'] },
          { day: 'Tuesday', slots: ['08:00', '09:00'] },
          { day: 'Wednesday', slots: ['08:00', '09:00'] },
          { day: 'Friday', slots: ['08:00', '09:00'] }
        ]
      },
      {
        providerId: insertedProviders[5]._id, // Gita Cleaner
        title: 'Deep Home Cleaning & Organizing',
        category: 'Cleaner',
        description: 'Thorough cleaning of rooms, kitchen, and bathrooms. Includes sweeping, mopping, dusting, and organizing spaces.',
        priceRange: { min: 300, max: 900 },
        averageRating: 4.4,
        totalReviews: 7,
        availability: [
          { day: 'Sunday', slots: ['09:00', '11:00', '14:00', '16:00'] },
          { day: 'Saturday', slots: ['09:00', '11:00', '14:00', '16:00'] }
        ]
      }
    ];

    console.log('Inserting more services...');
    await Service.insertMany(servicesData);

    console.log('Seed more successful! Added 6 providers and 6 services.');
    process.exit(0);
  } catch (error) {
    console.error('Seed more failed:', error);
    process.exit(1);
  }
};

seedMore();
