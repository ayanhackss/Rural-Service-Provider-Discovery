const mongoose = require('mongoose');

const SERVICE_CATEGORIES = [
  'Plumber', 'Electrician', 'Carpenter', 'Tutor', 'Doctor',
  'Mechanic', 'Tailor', 'Mason', 'Painter', 'Agricultural',
  'Cleaner', 'Other',
];

const availabilitySlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  slots: [{ type: String }], // e.g. ['09:00', '10:00', '14:00']
}, { _id: false });

const serviceSchema = new mongoose.Schema(
  {
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, enum: SERVICE_CATEGORIES, required: true },
    description: { type: String, required: true },
    priceRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    availability: [availabilitySlotSchema],
    photos: [{ type: String }], // URLs
    isActive: { type: Boolean, default: true },
    // Aggregates — updated on each new review
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for keyword search
serviceSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Service', serviceSchema);
module.exports.SERVICE_CATEGORIES = SERVICE_CATEGORIES;
