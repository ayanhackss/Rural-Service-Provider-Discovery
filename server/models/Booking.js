const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true }, // e.g. '10:00'
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: { type: String }, // optional message from resident
    completionOtp: {
      type: String,
      default: () => Math.floor(1000 + Math.random() * 9000).toString(),
    },
    cancellationReason: { type: String, trim: true },
    cancelledBy: {
      type: String,
      enum: ['resident', 'provider', 'admin'],
    },
    // In-app notification flags
    providerNotified: { type: Boolean, default: false },
    residentNotified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

bookingSchema.index({ residentId: 1, date: -1 });
bookingSchema.index({ providerId: 1, date: -1 });
bookingSchema.index({ serviceId: 1, date: 1, timeSlot: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
