const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Service = require('../models/Service');
const bcrypt = require('bcryptjs');

const patnaProvidersData = [
  {
    provider: {
      name: 'Kisan Agro Machinery Works',
      email: 'kisan.agro.bihta@patna.local',
      phone: '9835012301',
      role: 'provider',
      isApproved: true,
      isSuspended: false,
      location: { village: 'Bihta', pinCode: '801103' },
      bio: 'Expert tractor repair, harvester servicing, and agricultural pump maintenance serving Bihta and adjoining rural farming belts.',
      averageRating: 4.8,
      totalBookings: 142
    },
    service: {
      title: 'Tractor, Thresher & Agricultural Pump Repair',
      category: 'Agricultural',
      description: 'On-field breakdown assistance, engine overhauling, hydraulic system maintenance, and submersible agricultural pump repairs across Bihta rural zone.',
      priceRange: { min: 400, max: 2500 },
      photos: [
        'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80'
      ],
      availability: [
        { day: 'Monday', slots: ['08:00', '10:00', '14:00', '16:00'] },
        { day: 'Tuesday', slots: ['08:00', '10:00', '14:00', '16:00'] },
        { day: 'Wednesday', slots: ['08:00', '10:00', '14:00', '16:00'] },
        { day: 'Thursday', slots: ['08:00', '10:00', '14:00', '16:00'] },
        { day: 'Friday', slots: ['08:00', '10:00', '14:00', '16:00'] },
        { day: 'Saturday', slots: ['08:00', '10:00', '12:00'] }
      ],
      averageRating: 4.8,
      totalReviews: 29
    }
  },
  {
    provider: {
      name: 'Aryan Electrical & Submersible Works',
      email: 'aryan.elec.bihta@patna.local',
      phone: '9835012302',
      role: 'provider',
      isApproved: true,
      isSuspended: false,
      location: { village: 'Painal, Bihta', pinCode: '801111' },
      bio: 'Certified wireman and submersible motor rewinding specialist with 12+ years of experience in domestic and agricultural wiring.',
      averageRating: 4.7,
      totalBookings: 98
    },
    service: {
      title: 'Home Wiring & Boring Motor Rewinding',
      category: 'Electrician',
      description: 'Complete home electrical wiring, single/three-phase motor winding, inverter installation, and starter panel troubleshooting.',
      priceRange: { min: 250, max: 1800 },
      photos: [
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'
      ],
      availability: [
        { day: 'Monday', slots: ['09:00', '11:00', '14:00', '17:00'] },
        { day: 'Tuesday', slots: ['09:00', '11:00', '14:00', '17:00'] },
        { day: 'Wednesday', slots: ['09:00', '11:00', '14:00', '17:00'] },
        { day: 'Thursday', slots: ['09:00', '11:00', '14:00', '17:00'] },
        { day: 'Friday', slots: ['09:00', '11:00', '14:00', '17:00'] },
        { day: 'Saturday', slots: ['09:00', '11:00', '14:00'] }
      ],
      averageRating: 4.7,
      totalReviews: 21
    }
  },
  {
    provider: {
      name: 'Danapur Express Plumbing Services',
      email: 'danapur.plumber@patna.local',
      phone: '9835012303',
      role: 'provider',
      isApproved: true,
      isSuspended: false,
      location: { village: 'Danapur Cantt', pinCode: '801503' },
      bio: 'Prompt plumbing and sanitary solutions for residential homes, schools, and local village commercial units.',
      averageRating: 4.6,
      totalBookings: 115
    },
    service: {
      title: 'Water Pipe Fitting, Leakage Repair & Sanitary Setup',
      category: 'Plumber',
      description: 'CPVC/UPVC pipe installation, overhead water tank connection, bathroom fittings, tap leak repair, and drainage clearance.',
      priceRange: { min: 200, max: 1500 },
      photos: [
        'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80'
      ],
      availability: [
        { day: 'Monday', slots: ['08:30', '10:30', '13:30', '16:00'] },
        { day: 'Tuesday', slots: ['08:30', '10:30', '13:30', '16:00'] },
        { day: 'Wednesday', slots: ['08:30', '10:30', '13:30', '16:00'] },
        { day: 'Thursday', slots: ['08:30', '10:30', '13:30', '16:00'] },
        { day: 'Friday', slots: ['08:30', '10:30', '13:30', '16:00'] },
        { day: 'Sunday', slots: ['09:00', '12:00', '15:00'] }
      ],
      averageRating: 4.6,
      totalReviews: 24
    }
  },
  {
    provider: {
      name: 'Gupta Timber & Carpentry Works',
      email: 'gupta.carpenter.khagaul@patna.local',
      phone: '9835012304',
      role: 'provider',
      isApproved: true,
      isSuspended: false,
      location: { village: 'Khagaul', pinCode: '801105' },
      bio: 'Handcrafted wooden doors, windows, beds, grain storage boxes, and modern modular repair works.',
      averageRating: 4.9,
      totalBookings: 84
    },
    service: {
      title: 'Custom Wooden Furniture, Doors & Structural Woodwork',
      category: 'Carpenter',
      description: 'Solid wood furniture manufacturing, door-window frame fitting, lock installations, and repair of farm wooden tools.',
      priceRange: { min: 350, max: 3200 },
      photos: [
        'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&auto=format&fit=crop&q=80'
      ],
      availability: [
        { day: 'Monday', slots: ['09:00', '11:00', '14:00', '16:00'] },
        { day: 'Tuesday', slots: ['09:00', '11:00', '14:00', '16:00'] },
        { day: 'Wednesday', slots: ['09:00', '11:00', '14:00', '16:00'] },
        { day: 'Thursday', slots: ['09:00', '11:00', '14:00', '16:00'] },
        { day: 'Friday', slots: ['09:00', '11:00', '14:00', '16:00'] },
        { day: 'Saturday', slots: ['09:00', '12:00'] }
      ],
      averageRating: 4.9,
      totalReviews: 19
    }
  },
  {
    provider: {
      name: 'Dr. Alok Ranjan Rural Clinic',
      email: 'dr.alok.clinic@patna.local',
      phone: '9835012305',
      role: 'provider',
      isApproved: true,
      isSuspended: false,
      location: { village: 'Phulwari Sharif', pinCode: '801505' },
      bio: 'MBBS General Practitioner offering primary medical care, seasonal fever treatment, pediatric health consultations, and diabetic checkups.',
      averageRating: 4.9,
      totalBookings: 280
    },
    service: {
      title: 'General Health Checkup & Primary Rural Consultation',
      category: 'Doctor',
      description: 'Comprehensive general health examination, blood pressure & sugar monitoring, seasonal illness care, and child wellness advice.',
      priceRange: { min: 200, max: 500 },
      photos: [
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80'
      ],
      availability: [
        { day: 'Monday', slots: ['09:00', '10:00', '11:00', '17:00', '18:00'] },
        { day: 'Tuesday', slots: ['09:00', '10:00', '11:00', '17:00', '18:00'] },
        { day: 'Wednesday', slots: ['09:00', '10:00', '11:00', '17:00', '18:00'] },
        { day: 'Thursday', slots: ['09:00', '10:00', '11:00', '17:00', '18:00'] },
        { day: 'Friday', slots: ['09:00', '10:00', '11:00', '17:00', '18:00'] },
        { day: 'Saturday', slots: ['09:00', '11:00', '17:00'] }
      ],
      averageRating: 4.9,
      totalReviews: 65
    }
  },
  {
    provider: {
      name: 'Modern Two-Wheeler & Auto Garage',
      email: 'modern.garage.phulwari@patna.local',
      phone: '9835012306',
      role: 'provider',
      isApproved: true,
      isSuspended: false,
      location: { village: 'Phulwari Sharif', pinCode: '801505' },
      bio: 'Trusted motorcycle, scooter, and e-rickshaw servicing workshop with genuine parts and mobile puncture assistance.',
      averageRating: 4.5,
      totalBookings: 160
    },
    service: {
      title: 'Bike, Scooter & E-Rickshaw Maintenance & Servicing',
      category: 'Mechanic',
      description: 'Engine tuning, oil change, brake shoe replacement, chain adjustment, electrical wiring diagnostics, and roadside breakdown support.',
      priceRange: { min: 150, max: 1200 },
      photos: [
        'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80'
      ],
      availability: [
        { day: 'Monday', slots: ['09:00', '11:00', '14:00', '16:00'] },
        { day: 'Tuesday', slots: ['09:00', '11:00', '14:00', '16:00'] },
        { day: 'Wednesday', slots: ['09:00', '11:00', '14:00', '16:00'] },
        { day: 'Thursday', slots: ['09:00', '11:00', '14:00', '16:00'] },
        { day: 'Friday', slots: ['09:00', '11:00', '14:00', '16:00'] },
        { day: 'Saturday', slots: ['09:00', '11:00', '14:00', '17:00'] }
      ],
      averageRating: 4.5,
      totalReviews: 32
    }
  },
  {
    provider: {
      name: 'Star Ladies & Gents Tailors',
      email: 'star.tailor.phulwari@patna.local',
      phone: '9835012307',
      role: 'provider',
      isApproved: true,
      isSuspended: false,
      location: { village: 'Phulwari Sharif', pinCode: '801505' },
      bio: 'Specialist in custom stitching for festive attire, blouses, kurtas, school uniforms, and alteration services.',
      averageRating: 4.7,
      totalBookings: 110
    },
    service: {
      title: 'Custom Stitching, Designer Blouses & School Uniforms',
      category: 'Tailor',
      description: 'High-precision stitching of kurtas, shirts, trousers, designer blouses, lehengas, and school uniforms with fast delivery.',
      priceRange: { min: 120, max: 1500 },
      photos: [
        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80'
      ],
      availability: [
        { day: 'Monday', slots: ['10:00', '12:00', '15:00', '18:00'] },
        { day: 'Tuesday', slots: ['10:00', '12:00', '15:00', '18:00'] },
        { day: 'Wednesday', slots: ['10:00', '12:00', '15:00', '18:00'] },
        { day: 'Thursday', slots: ['10:00', '12:00', '15:00', '18:00'] },
        { day: 'Friday', slots: ['10:00', '12:00', '15:00', '18:00'] },
        { day: 'Saturday', slots: ['10:00', '13:00', '16:00'] }
      ],
      averageRating: 4.7,
      totalReviews: 22
    }
  },
  {
    provider: {
      name: 'Maa Durga Masonry & Construction',
      email: 'durga.mason.fatuha@patna.local',
      phone: '9835012308',
      role: 'provider',
      isApproved: true,
      isSuspended: false,
      location: { village: 'Fatuha', pinCode: '803201' },
      bio: 'Master Raj Mistri with experienced team for house construction, boundary walls, plastering, and tile fitting.',
      averageRating: 4.8,
      totalBookings: 72
    },
    service: {
      title: 'House Construction, Brickwork, Plaster & Floor Tiles',
      category: 'Mason',
      description: 'End-to-end masonry works: foundation laying, brick alignment, roof casting, fine plastering, and bathroom/kitchen tile fixing.',
      priceRange: { min: 500, max: 4500 },
      photos: [
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80'
      ],
      availability: [
        { day: 'Monday', slots: ['08:00', '10:00', '13:00', '16:00'] },
        { day: 'Tuesday', slots: ['08:00', '10:00', '13:00', '16:00'] },
        { day: 'Wednesday', slots: ['08:00', '10:00', '13:00', '16:00'] },
        { day: 'Thursday', slots: ['08:00', '10:00', '13:00', '16:00'] },
        { day: 'Friday', slots: ['08:00', '10:00', '13:00', '16:00'] },
        { day: 'Saturday', slots: ['08:00', '11:00'] }
      ],
      averageRating: 4.8,
      totalReviews: 18
    }
  },
  {
    provider: {
      name: 'Verma House Painting & Waterproofing',
      email: 'verma.painter.masaurhi@patna.local',
      phone: '9835012309',
      role: 'provider',
      isApproved: true,
      isSuspended: false,
      location: { village: 'Masaurhi', pinCode: '804452' },
      bio: 'Interior and exterior wall painting, lime wash, wall putty, damp proofing, and roof waterproofing services.',
      averageRating: 4.6,
      totalBookings: 88
    },
    service: {
      title: 'Interior/Exterior Wall Painting, Putty & Waterproofing',
      category: 'Painter',
      description: 'Professional painting with roller finish, primer coat, wall putty smoothening, and Dr. Fixit roof leak waterproofing treatments.',
      priceRange: { min: 400, max: 3500 },
      photos: [
        'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80'
      ],
      availability: [
        { day: 'Monday', slots: ['08:30', '11:00', '14:00', '16:30'] },
        { day: 'Tuesday', slots: ['08:30', '11:00', '14:00', '16:30'] },
        { day: 'Wednesday', slots: ['08:30', '11:00', '14:00', '16:30'] },
        { day: 'Thursday', slots: ['08:30', '11:00', '14:00', '16:30'] },
        { day: 'Friday', slots: ['08:30', '11:00', '14:00', '16:30'] },
        { day: 'Saturday', slots: ['09:00', '13:00'] }
      ],
      averageRating: 4.6,
      totalReviews: 15
    }
  },
  {
    provider: {
      name: 'Gyanodaya Math & Science Tutorials',
      email: 'gyanodaya.tutor.masaurhi@patna.local',
      phone: '9835012310',
      role: 'provider',
      isApproved: true,
      isSuspended: false,
      location: { village: 'Masaurhi', pinCode: '804452' },
      bio: 'Experienced educator (M.Sc B.Ed) providing dedicated offline and home tutoring in Mathematics and Science for Class 6 to 10 BSEB/CBSE students.',
      averageRating: 5.0,
      totalBookings: 64
    },
    service: {
      title: 'Class 6-10 Maths & Science Home Tuition & Batch Coaching',
      category: 'Tutor',
      description: 'Concept-focused teaching, regular test series, doubt clearing sessions, and board exam preparation in Hindi and English medium.',
      priceRange: { min: 300, max: 1200 },
      photos: [
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80'
      ],
      availability: [
        { day: 'Monday', slots: ['07:00', '08:30', '16:00', '17:30'] },
        { day: 'Tuesday', slots: ['07:00', '08:30', '16:00', '17:30'] },
        { day: 'Wednesday', slots: ['07:00', '08:30', '16:00', '17:30'] },
        { day: 'Thursday', slots: ['07:00', '08:30', '16:00', '17:30'] },
        { day: 'Friday', slots: ['07:00', '08:30', '16:00', '17:30'] },
        { day: 'Sunday', slots: ['08:00', '10:00', '11:30'] }
      ],
      averageRating: 5.0,
      totalReviews: 28
    }
  },
  {
    provider: {
      name: 'Shri Ram Solar & Power Solutions',
      email: 'shriram.solar.maner@patna.local',
      phone: '9835012311',
      role: 'provider',
      isApproved: true,
      isSuspended: false,
      location: { village: 'Maner', pinCode: '801108' },
      bio: 'Rooftop solar panel installation, tubular battery maintenance, and solar water pump services for rural homes and farms.',
      averageRating: 4.8,
      totalBookings: 92
    },
    service: {
      title: 'Solar Panel Setup, Inverter Battery & Solar Pump Installation',
      category: 'Electrician',
      description: 'Turnkey solar rooftop setup (1kW to 5kW), solar inverter repairs, battery acid checkup, and high-efficiency solar pump wiring.',
      priceRange: { min: 500, max: 4000 },
      photos: [
        'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80'
      ],
      availability: [
        { day: 'Monday', slots: ['09:00', '11:30', '14:30', '17:00'] },
        { day: 'Tuesday', slots: ['09:00', '11:30', '14:30', '17:00'] },
        { day: 'Wednesday', slots: ['09:00', '11:30', '14:30', '17:00'] },
        { day: 'Thursday', slots: ['09:00', '11:30', '14:30', '17:00'] },
        { day: 'Friday', slots: ['09:00', '11:30', '14:30', '17:00'] },
        { day: 'Saturday', slots: ['09:00', '12:00', '15:00'] }
      ],
      averageRating: 4.8,
      totalReviews: 23
    }
  },
  {
    provider: {
      name: 'Sparkle Tank & House Cleaning Services',
      email: 'sparkle.clean.sampatchak@patna.local',
      phone: '9835012312',
      role: 'provider',
      isApproved: true,
      isSuspended: false,
      location: { village: 'Sampatchak', pinCode: '800007' },
      bio: 'High-pressure mechanized water tank cleaning, septic tank suction, and post-construction deep home cleaning.',
      averageRating: 4.7,
      totalBookings: 130
    },
    service: {
      title: 'Mechanized Water Tank & Deep Home Cleaning',
      category: 'Cleaner',
      description: '6-stage hygienic water tank cleaning with UV disinfection, sludge dewatering, bathroom scrubbing, and septic evacuation services.',
      priceRange: { min: 350, max: 2200 },
      photos: [
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80'
      ],
      availability: [
        { day: 'Monday', slots: ['08:00', '10:30', '13:30', '16:00'] },
        { day: 'Tuesday', slots: ['08:00', '10:30', '13:30', '16:00'] },
        { day: 'Wednesday', slots: ['08:00', '10:30', '13:30', '16:00'] },
        { day: 'Thursday', slots: ['08:00', '10:30', '13:30', '16:00'] },
        { day: 'Friday', slots: ['08:00', '10:30', '13:30', '16:00'] },
        { day: 'Sunday', slots: ['08:00', '11:00', '14:00'] }
      ],
      averageRating: 4.7,
      totalReviews: 31
    }
  },
  {
    provider: {
      name: 'Ganga Agro Crop Protection & Fertilizer Support',
      email: 'ganga.agro.fatuha@patna.local',
      phone: '9835012313',
      role: 'provider',
      isApproved: true,
      isSuspended: false,
      location: { village: 'Fatuha', pinCode: '803201' },
      bio: 'Agricultural advisory, organic bio-fertilizer supply, mechanized battery sprayers, and soil health testing assistance.',
      averageRating: 4.9,
      totalBookings: 155
    },
    service: {
      title: 'Crop Spraying, Organic Fertilizer & Soil Testing Advice',
      category: 'Agricultural',
      description: 'Power spraying for paddy and wheat crops, customized organic manure recommendation, and certified soil fertility testing.',
      priceRange: { min: 250, max: 1800 },
      photos: [
        'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=80'
      ],
      availability: [
        { day: 'Monday', slots: ['07:30', '09:30', '14:00', '16:30'] },
        { day: 'Tuesday', slots: ['07:30', '09:30', '14:00', '16:30'] },
        { day: 'Wednesday', slots: ['07:30', '09:30', '14:00', '16:30'] },
        { day: 'Thursday', slots: ['07:30', '09:30', '14:00', '16:30'] },
        { day: 'Friday', slots: ['07:30', '09:30', '14:00', '16:30'] },
        { day: 'Saturday', slots: ['07:30', '10:00'] }
      ],
      averageRating: 4.9,
      totalReviews: 37
    }
  },
  {
    provider: {
      name: 'QuickFix AC & Refrigerator Service',
      email: 'quickfix.cooling.danapur@patna.local',
      phone: '9835012314',
      role: 'provider',
      isApproved: true,
      isSuspended: false,
      location: { village: 'Danapur', pinCode: '801503' },
      bio: 'Fast doorstep repairs for refrigerators, split/window ACs, washing machines, and microwave ovens.',
      averageRating: 4.6,
      totalBookings: 104
    },
    service: {
      title: 'AC Gas Refill, Fridge Cooling Repair & Appliance Care',
      category: 'Other',
      description: 'Compressor troubleshooting, gas charging (R32/R410), PCB board repair, jet pump AC washing, and washing machine drum repair.',
      priceRange: { min: 300, max: 2400 },
      photos: [
        'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80'
      ],
      availability: [
        { day: 'Monday', slots: ['09:30', '11:30', '14:30', '17:00'] },
        { day: 'Tuesday', slots: ['09:30', '11:30', '14:30', '17:00'] },
        { day: 'Wednesday', slots: ['09:30', '11:30', '14:30', '17:00'] },
        { day: 'Thursday', slots: ['09:30', '11:30', '14:30', '17:00'] },
        { day: 'Friday', slots: ['09:30', '11:30', '14:30', '17:00'] },
        { day: 'Saturday', slots: ['09:30', '12:30', '15:30'] }
      ],
      averageRating: 4.6,
      totalReviews: 26
    }
  },
  {
    provider: {
      name: 'Bakhtiyarpur Wood Craft & Modern Joinery',
      email: 'bakhtiyarpur.wood@patna.local',
      phone: '9835012315',
      role: 'provider',
      isApproved: true,
      isSuspended: false,
      location: { village: 'Bakhtiyarpur', pinCode: '803212' },
      bio: 'Custom wooden storage, farm sheds woodwork, bed repairs, and durable plywood almirah crafting.',
      averageRating: 4.8,
      totalBookings: 79
    },
    service: {
      title: 'Wooden Beds, Almirahs & Agricultural Shed Timberwork',
      category: 'Carpenter',
      description: 'Affordable and sturdy wood craftsmanship for rural households: double beds, dining tables, grain storage cabinets, and roofing rafters.',
      priceRange: { min: 300, max: 2800 },
      photos: [
        'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab00f?w=800&auto=format&fit=crop&q=80'
      ],
      availability: [
        { day: 'Monday', slots: ['09:00', '11:00', '14:00', '16:30'] },
        { day: 'Tuesday', slots: ['09:00', '11:00', '14:00', '16:30'] },
        { day: 'Wednesday', slots: ['09:00', '11:00', '14:00', '16:30'] },
        { day: 'Thursday', slots: ['09:00', '11:00', '14:00', '16:30'] },
        { day: 'Friday', slots: ['09:00', '11:00', '14:00', '16:30'] },
        { day: 'Saturday', slots: ['09:00', '12:00'] }
      ],
      averageRating: 4.8,
      totalReviews: 17
    }
  },
  {
    provider: {
      name: 'Shanti Rural Health & Nursing Center',
      email: 'shanti.health.maner@patna.local',
      phone: '9835012316',
      role: 'provider',
      isApproved: true,
      isSuspended: false,
      location: { village: 'Maner', pinCode: '801108' },
      bio: '24/7 basic emergency first-aid, wound dressing, nebulization, maternal health consultation, and vaccination support.',
      averageRating: 4.9,
      totalBookings: 210
    },
    service: {
      title: 'First-Aid, Wound Dressing, Injections & Maternal Care',
      category: 'Doctor',
      description: 'Sterilized wound care, IV fluid administration, infant vaccination guidance, and elderly patient home health visits.',
      priceRange: { min: 150, max: 600 },
      photos: [
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80'
      ],
      availability: [
        { day: 'Monday', slots: ['08:00', '10:00', '12:00', '16:00', '18:00'] },
        { day: 'Tuesday', slots: ['08:00', '10:00', '12:00', '16:00', '18:00'] },
        { day: 'Wednesday', slots: ['08:00', '10:00', '12:00', '16:00', '18:00'] },
        { day: 'Thursday', slots: ['08:00', '10:00', '12:00', '16:00', '18:00'] },
        { day: 'Friday', slots: ['08:00', '10:00', '12:00', '16:00', '18:00'] },
        { day: 'Saturday', slots: ['08:00', '11:00', '16:00'] },
        { day: 'Sunday', slots: ['09:00', '12:00'] }
      ],
      averageRating: 4.9,
      totalReviews: 48
    }
  },
  {
    provider: {
      name: 'Naubatpur Tractor & Harvester Rental',
      email: 'naubatpur.agri@patna.local',
      phone: '9835012317',
      role: 'provider',
      isApproved: true,
      isSuspended: false,
      location: { village: 'Naubatpur', pinCode: '801109' },
      bio: 'Mechanized farming equipment rental including 50HP tractors, rotavators, seed drills, and paddy harvesters with operators.',
      averageRating: 4.8,
      totalBookings: 175
    },
    service: {
      title: 'Tractor Ploughing, Rotavator & Paddy Harvesting Rental',
      category: 'Agricultural',
      description: 'Hourly and acre-based mechanized land preparation, laser leveling, rotavator tilling, and harvest cutting across Naubatpur block.',
      priceRange: { min: 600, max: 3500 },
      photos: [
        'https://images.unsplash.com/photo-1589876735515-62024db5d41f?w=800&auto=format&fit=crop&q=80'
      ],
      availability: [
        { day: 'Monday', slots: ['06:30', '09:00', '13:00', '16:00'] },
        { day: 'Tuesday', slots: ['06:30', '09:00', '13:00', '16:00'] },
        { day: 'Wednesday', slots: ['06:30', '09:00', '13:00', '16:00'] },
        { day: 'Thursday', slots: ['06:30', '09:00', '13:00', '16:00'] },
        { day: 'Friday', slots: ['06:30', '09:00', '13:00', '16:00'] },
        { day: 'Saturday', slots: ['06:30', '10:00'] }
      ],
      averageRating: 4.8,
      totalReviews: 41
    }
  },
  {
    provider: {
      name: 'Punpun Plumbing & Boring Solutions',
      email: 'punpun.plumbing@patna.local',
      phone: '9835012318',
      role: 'provider',
      isApproved: true,
      isSuspended: false,
      location: { village: 'Punpun', pinCode: '804453' },
      bio: 'Deep borewell pipeline installation, hand pump repairs, and domestic pipeline leak detection specialists.',
      averageRating: 4.7,
      totalBookings: 93
    },
    service: {
      title: 'Deep Borewell Pipe Setup, Hand Pump & Valve Repair',
      category: 'Plumber',
      description: 'Submersible drop-pipe assembly, brass foot valve replacement, hand pump washer repair, and bathroom plumbing installations.',
      priceRange: { min: 250, max: 1900 },
      photos: [
        'https://images.unsplash.com/photo-1542013936693-884638332954?w=800&auto=format&fit=crop&q=80'
      ],
      availability: [
        { day: 'Monday', slots: ['08:30', '11:00', '14:00', '16:30'] },
        { day: 'Tuesday', slots: ['08:30', '11:00', '14:00', '16:30'] },
        { day: 'Wednesday', slots: ['08:30', '11:00', '14:00', '16:30'] },
        { day: 'Thursday', slots: ['08:30', '11:00', '14:00', '16:30'] },
        { day: 'Friday', slots: ['08:30', '11:00', '14:00', '16:30'] },
        { day: 'Saturday', slots: ['08:30', '12:00'] }
      ],
      averageRating: 4.7,
      totalReviews: 19
    }
  }
];

async function seedPatna() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing!');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas');

    const passwordHash = await bcrypt.hash('password123', 12);
    let addedCount = 0;

    for (const item of patnaProvidersData) {
      const email = item.provider.email;
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          ...item.provider,
          passwordHash
        });
        console.log(`Created provider user: ${user.name} (${user.location.village}, ${user.location.pinCode})`);
      } else {
        // Update user fields
        user.name = item.provider.name;
        user.phone = item.provider.phone;
        user.location = item.provider.location;
        user.bio = item.provider.bio;
        user.isApproved = true;
        user.isSuspended = false;
        user.passwordHash = passwordHash;
        await user.save();
        console.log(`Updated provider user: ${user.name}`);
      }

      // Check if service exists for this provider
      let service = await Service.findOne({ providerId: user._id });
      if (!service) {
        service = await Service.create({
          ...item.service,
          providerId: user._id
        });
        console.log(`  -> Created service: "${service.title}" [${service.category}]`);
        addedCount++;
      } else {
        service.title = item.service.title;
        service.category = item.service.category;
        service.description = item.service.description;
        service.priceRange = item.service.priceRange;
        service.photos = item.service.photos;
        service.availability = item.service.availability;
        service.isActive = true;
        await service.save();
        console.log(`  -> Updated service: "${service.title}" [${service.category}]`);
      }
    }

    console.log(`\nSuccessfully seeded ${patnaProvidersData.length} Patna service providers and services!`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding Patna providers:', err);
    process.exit(1);
  }
}

seedPatna();
