require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Service = require('./models/Service');
const bcrypt = require('bcryptjs');

const URI = process.env.MONGO_URI;

const seedReal = async () => {
  try {
    await mongoose.connect(URI);
    console.log('Connected to DB');

    console.log('Cleaning up all previous test providers and their services...');
    const existingProviders = await User.find({ role: 'provider' });
    const providerIds = existingProviders.map(p => p._id);
    
    await Service.deleteMany({ providerId: { $in: providerIds } });
    await User.deleteMany({ role: 'provider' });

    console.log('Inserting real-world Bettiah providers...');
    const passwordHash = await bcrypt.hash('password123', 12);

    const providersData = [
      {
        name: 'Jyoti Electric Repairing Center',
        email: 'jyoti.electric@bettiah.local',
        phone: '9876540001',
        passwordHash,
        role: 'provider',
        isApproved: true,
        location: { village: 'Jamadar Tola, Bettiah', pinCode: '845438' },
        averageRating: 4.8,
        totalBookings: 145
      },
      {
        name: 'Sonakshi All In One Electric Service',
        email: 'sonakshi.electric@bettiah.local',
        phone: '9876540002',
        passwordHash,
        role: 'provider',
        isApproved: true,
        location: { village: 'Dolbagh, Bettiah', pinCode: '845438' },
        averageRating: 4.5,
        totalBookings: 89
      },
      {
        name: 'Champaran Plumber',
        email: 'champaran.plumber@bettiah.local',
        phone: '7532951419',
        passwordHash,
        role: 'provider',
        isApproved: true,
        location: { village: 'Daraul, Bettiah', pinCode: '845438' },
        averageRating: 4.7,
        totalBookings: 112
      },
      {
        name: 'Jamshed Alam Plumbing Contractor',
        email: 'jamshed.plumbing@bettiah.local',
        phone: '9876540004',
        passwordHash,
        role: 'provider',
        isApproved: true,
        location: { village: 'Mohammad Nager Gali, Bettiah', pinCode: '845438' },
        averageRating: 4.6,
        totalBookings: 67
      },
      {
        name: 'Sinha Multispeciality Hospital',
        email: 'contact@smhbettiah.com',
        phone: '9876540005',
        passwordHash,
        role: 'provider',
        isApproved: true,
        location: { village: 'Uttarwari Pokhara, Bettiah', pinCode: '845438' },
        averageRating: 4.9,
        totalBookings: 340
      },
      {
        name: 'Vedant Neuro and Maternity Hospital',
        email: 'info@vedanthospital.local',
        phone: '9876540006',
        passwordHash,
        role: 'provider',
        isApproved: true,
        location: { village: 'NH-28, Bettiah', pinCode: '845438' },
        averageRating: 4.8,
        totalBookings: 215
      }
    ];

    const insertedProviders = await User.insertMany(providersData);

    const servicesData = [
      {
        providerId: insertedProviders[0]._id, // Jyoti Electric
        title: 'Appliance Repair & House Wiring',
        category: 'Electrician',
        description: 'Authorized center for fan, motor, and pump repair. Full house wiring services available in Jamadar Tola and surrounding Bettiah areas.',
        priceRange: { min: 300, max: 1500 },
        averageRating: 4.8,
        totalReviews: 45,
        availability: [
          { day: 'Monday', slots: ['09:00', '11:00', '14:00', '16:00'] },
          { day: 'Tuesday', slots: ['09:00', '11:00', '14:00', '16:00'] },
          { day: 'Wednesday', slots: ['09:00', '11:00', '14:00', '16:00'] },
          { day: 'Thursday', slots: ['09:00', '11:00', '14:00', '16:00'] },
          { day: 'Friday', slots: ['09:00', '11:00', '14:00', '16:00'] },
          { day: 'Saturday', slots: ['09:00', '11:00', '14:00', '16:00'] }
        ]
      },
      {
        providerId: insertedProviders[1]._id, // Sonakshi Electric
        title: 'Emergency Electrical Repairs',
        category: 'Electrician',
        description: 'Fast response electrical services near Bettiah Check Post. Fixing short circuits, inverter installation, and switchboard repairs.',
        priceRange: { min: 200, max: 1000 },
        averageRating: 4.5,
        totalReviews: 28,
        availability: [
          { day: 'Monday', slots: ['10:00', '13:00', '15:00', '18:00'] },
          { day: 'Wednesday', slots: ['10:00', '13:00', '15:00', '18:00'] },
          { day: 'Friday', slots: ['10:00', '13:00', '15:00', '18:00'] },
          { day: 'Sunday', slots: ['10:00', '13:00', '15:00', '18:00'] }
        ]
      },
      {
        providerId: insertedProviders[2]._id, // Champaran Plumber
        title: 'Professional Pipe Fitting & Drain Cleaning',
        category: 'Plumber',
        description: 'Serving Daraul and Bettiah city. Water tank installation, PVC pipe leakages, and bathroom fittings. Quality work guaranteed.',
        priceRange: { min: 400, max: 2500 },
        averageRating: 4.7,
        totalReviews: 52,
        availability: [
          { day: 'Tuesday', slots: ['08:00', '10:00', '14:00', '16:00'] },
          { day: 'Thursday', slots: ['08:00', '10:00', '14:00', '16:00'] },
          { day: 'Saturday', slots: ['08:00', '10:00', '14:00', '16:00'] }
        ]
      },
      {
        providerId: insertedProviders[3]._id, // Jamshed Alam
        title: 'Contract Plumbing & Repair Work',
        category: 'Plumber',
        description: 'Licensed contractor based in Mohammad Nager Gali. Available for new house plumbing layout, sewer line clearing, and tap repairs.',
        priceRange: { min: 500, max: 5000 },
        averageRating: 4.6,
        totalReviews: 31,
        availability: [
          { day: 'Monday', slots: ['09:00', '12:00', '15:00'] },
          { day: 'Wednesday', slots: ['09:00', '12:00', '15:00'] },
          { day: 'Friday', slots: ['09:00', '12:00', '15:00'] }
        ]
      },
      {
        providerId: insertedProviders[4]._id, // Sinha Hospital
        title: 'Specialist Consultation & Outpatient Care',
        category: 'Doctor',
        description: 'Consultations for Cardiology, Orthopaedics, and General Medicine. Book an appointment to avoid wait times at Uttarwari Pokhara.',
        priceRange: { min: 500, max: 800 },
        averageRating: 4.9,
        totalReviews: 120,
        availability: [
          { day: 'Monday', slots: ['10:00', '10:30', '11:00', '11:30', '17:00', '17:30'] },
          { day: 'Tuesday', slots: ['10:00', '10:30', '11:00', '11:30', '17:00', '17:30'] },
          { day: 'Wednesday', slots: ['10:00', '10:30', '11:00', '11:30', '17:00', '17:30'] },
          { day: 'Thursday', slots: ['10:00', '10:30', '11:00', '11:30', '17:00', '17:30'] },
          { day: 'Friday', slots: ['10:00', '10:30', '11:00', '11:30', '17:00', '17:30'] }
        ]
      },
      {
        providerId: insertedProviders[5]._id, // Vedant Hospital
        title: 'Maternity & Gynecology Consultation',
        category: 'Doctor',
        description: 'Expert maternal care, routine checkups, and neuro consultations. Located on NH-28 Bettiah for easy access.',
        priceRange: { min: 400, max: 700 },
        averageRating: 4.8,
        totalReviews: 85,
        availability: [
          { day: 'Monday', slots: ['11:00', '12:00', '16:00', '17:00'] },
          { day: 'Wednesday', slots: ['11:00', '12:00', '16:00', '17:00'] },
          { day: 'Friday', slots: ['11:00', '12:00', '16:00', '17:00'] },
          { day: 'Saturday', slots: ['11:00', '12:00', '13:00'] }
        ]
      }
    ];

    await Service.insertMany(servicesData);

    console.log('Real data seed successful! Added 6 real businesses and services in Bettiah.');
    process.exit(0);
  } catch (error) {
    console.error('Real data seed failed:', error);
    process.exit(1);
  }
};

seedReal();
