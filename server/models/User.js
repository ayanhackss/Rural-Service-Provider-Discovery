const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['provider', 'resident', 'admin'], required: true },
    phone: { type: String, trim: true },
    // Location — both village name and PIN code
    location: {
      village: { type: String, trim: true },
      pinCode: { type: String, trim: true },
    },
    bio: { type: String, trim: true },
    // Provider-specific fields
    isApproved: { type: Boolean, default: false },   // admin must approve providers
    isSuspended: { type: Boolean, default: false },
    // Provider profile summary (computed / cached)
    averageRating: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    // Resident favourites
    favourites: [{ type: require('mongoose').Schema.Types.ObjectId, ref: 'Service' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
