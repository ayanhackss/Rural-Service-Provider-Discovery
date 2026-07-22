require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Service = require('./models/Service');
const bcrypt = require('bcryptjs');

const URI = process.env.MONGO_URI;

const seed = async () => {
  try {
    await mongoose.connect(URI);
    console.log('Connected to DB');

    // Cleanup previous failed seed attempt
    const emails = [
      'ramesh.agri@example.com',
      'suresh.elec@example.com',
      'amit.tutor@example.com',
      'manoj.plumber@example.com'
    ];
    await User.deleteMany({ email: { $in: emails } });
    console.log('Cleaned up old test users.');

    // Create a password hash for all seed users ('password123')
    const passwordHash = await bcrypt.hash('password123', 12);

    const providersData = [
      {
        name: 'Ramesh Kumar',
        email: 'ramesh.agri@example.com',
        phone: '9876543210',
        passwordHash,
        role: 'provider',
        isApproved: true,
        location: { village: 'Bettiah', pinCode: '845438' },
        averageRating: 4.8,
        totalBookings: 12
      },
      {
        name: 'Suresh Electric',
        email: 'suresh.elec@example.com',
        phone: '9876543211',
        passwordHash,
        role: 'provider',
        isApproved: true,
        location: { village: 'Bagaha', pinCode: '845101' },
        averageRating: 4.5,
        totalBookings: 34
      },
      {
        name: 'Amit Sir Tutorials',
        email: 'amit.tutor@example.com',
        phone: '9876543212',
        passwordHash,
        role: 'provider',
        isApproved: true,
        location: { village: 'Narkatiaganj', pinCode: '845455' },
        averageRating: 5.0,
        totalBookings: 8
      },
      {
        name: 'Manoj Pipes & Fittings',
        email: 'manoj.plumber@example.com',
        phone: '9876543213',
        passwordHash,
        role: 'provider',
        isApproved: true,
        location: { village: 'Ramnagar', pinCode: '845106' },
        averageRating: 4.2,
        totalBookings: 45
      }
    ];

    console.log('Inserting providers...');
    const insertedProviders = await User.insertMany(providersData);

    await Service.deleteMany({ providerId: { $in: insertedProviders.map(p => p._id) } });

    const servicesData = [
      {
        providerId: insertedProviders[0]._id,
        title: 'Tractor and Harvester Rental',
        category: 'Agricultural',
        description: 'Provide John Deere tractor and harvester for seasonal farming. Comes with an experienced driver. Rate is per hour of field work.',
        priceRange: { min: 800, max: 1500 },
        averageRating: 4.8,
        totalReviews: 5,
        availability: [
          { day: 'Monday', slots: ['06:00', '08:00', '10:00'] },
          { day: 'Tuesday', slots: ['06:00', '08:00', '10:00'] },
          { day: 'Wednesday', slots: ['06:00', '08:00', '10:00'] },
        ]
      },
      {
        providerId: insertedProviders[1]._id,
        title: 'Home Wiring & Appliance Repair',
        category: 'Electrician',
        description: 'Expert in fixing ceiling fans, water pumps, motor rewinding, and general home electrical faults.',
        priceRange: { min: 200, max: 800 },
        averageRating: 4.5,
        totalReviews: 12,
        availability: [
          { day: 'Monday', slots: ['09:00', '11:00', '14:00'] },
          { day: 'Tuesday', slots: ['09:00', '11:00', '14:00'] },
          { day: 'Wednesday', slots: ['09:00', '11:00', '14:00'] },
        ]
      },
      {
        providerId: insertedProviders[2]._id,
        title: 'Class 8-10 Mathematics & Science',
        category: 'Tutor',
        description: 'Home tuition for state board students. Focus on basic concepts, algebra, and physics. Guaranteed improvement.',
        priceRange: { min: 500, max: 1500 },
        averageRating: 5.0,
        totalReviews: 4,
        availability: [
          { day: 'Monday', slots: ['16:00', '17:00', '18:00'] },
          { day: 'Wednesday', slots: ['16:00', '17:00', '18:00'] },
          { day: 'Friday', slots: ['16:00', '17:00', '18:00'] },
        ]
      },
      {
        providerId: insertedProviders[3]._id,
        title: 'Borewell & Motor Pump Repair',
        category: 'Plumber',
        description: 'Specialist in fixing deep borewell pumps, PVC pipe leakages, and overhead tank installations.',
        priceRange: { min: 300, max: 2500 },
        averageRating: 4.2,
        totalReviews: 18,
        availability: [
          { day: 'Tuesday', slots: ['08:00', '10:00', '12:00'] },
          { day: 'Thursday', slots: ['08:00', '10:00', '12:00'] },
          { day: 'Saturday', slots: ['08:00', '10:00', '12:00'] },
        ]
      }
    ];

    console.log('Inserting services...');
    await Service.insertMany(servicesData);

    console.log('Seed successful! Added 4 providers and 4 services in West Champaran, Bihar.');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
