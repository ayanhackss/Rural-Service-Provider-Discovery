const express = require('express');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/bookings — resident creates booking
router.post('/', verifyToken, requireRole('resident'), async (req, res, next) => {
  try {
    const { serviceId, date, timeSlot, notes } = req.body;

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ message: 'Service not found or inactive' });
    }

    // Check slot is not already booked on that date
    const conflict = await Booking.findOne({
      serviceId,
      date: new Date(date),
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });
    if (conflict) {
      return res.status(409).json({ message: 'This time slot is already booked' });
    }

    const booking = await Booking.create({
      serviceId,
      providerId: service.providerId,
      residentId: req.user._id,
      date: new Date(date),
      timeSlot,
      notes,
    });

    res.status(201).json({ booking });
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings/mine — resident's bookings
router.get('/mine', verifyToken, requireRole('resident'), async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { residentId: req.user._id };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('serviceId', 'title category')
      .populate('providerId', 'name location phone')
      .sort({ date: -1 });

    // Mark resident notifications as seen
    await Booking.updateMany(
      { residentId: req.user._id, residentNotified: true },
      { residentNotified: false }
    );

    res.json({ bookings });
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings/provider — provider's incoming bookings
router.get('/provider', verifyToken, requireRole('provider'), async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { providerId: req.user._id };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .select('-completionOtp') // Security: Keep OTP hidden from provider until entered
      .populate('serviceId', 'title category')
      .populate('residentId', 'name phone location')
      .sort({ date: -1 });

    // Mark provider notifications as seen
    await Booking.updateMany(
      { providerId: req.user._id, providerNotified: true },
      { providerNotified: false }
    );

    res.json({ bookings });
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings/notifications — unread notification count
router.get('/notifications', verifyToken, async (req, res, next) => {
  try {
    let count = 0;
    if (req.user.role === 'provider') {
      count = await Booking.countDocuments({ providerId: req.user._id, providerNotified: true });
    } else if (req.user.role === 'resident') {
      count = await Booking.countDocuments({ residentId: req.user._id, residentNotified: true });
    }
    res.json({ count });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/bookings/:id/status — update booking status
router.patch('/:id/status', verifyToken, async (req, res, next) => {
  try {
    const { status, otp, cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const isProvider = req.user.role === 'provider' && booking.providerId.toString() === req.user._id.toString();
    const isResident = req.user.role === 'resident' && booking.residentId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isProvider && !isResident && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Role-based state transitions
    const allowed = {
      provider: { pending: ['confirmed', 'cancelled'], confirmed: ['completed', 'cancelled'] },
      resident: { pending: ['cancelled'], confirmed: ['cancelled'] },
      admin: { pending: ['cancelled'], confirmed: ['cancelled', 'completed'], completed: [], cancelled: [] },
    };

    const role = isAdmin ? 'admin' : isProvider ? 'provider' : 'resident';
    const allowedNext = allowed[role][booking.status] || [];
    if (!allowedNext.includes(status)) {
      return res.status(400).json({ message: `Cannot move from ${booking.status} → ${status}` });
    }

    // Verify 4-digit OTP when completing job (required for provider)
    if (status === 'completed' && isProvider) {
      if (!otp) {
        return res.status(400).json({ message: 'Please provide the 4-digit Job Completion OTP given by the customer.' });
      }
      
      const enteredOtp = String(otp).trim();
      const expectedOtp = String(booking.completionOtp || '').trim();

      if (expectedOtp && enteredOtp !== expectedOtp) {
        return res.status(400).json({ message: 'Invalid 4-digit Completion OTP. Please check the code with the customer.' });
      }
    }

    // Handle cancellation reason and attribution
    if (status === 'cancelled') {
      booking.cancellationReason = (cancellationReason && cancellationReason.trim()) 
        ? cancellationReason.trim() 
        : `Cancelled by ${role}`;
      booking.cancelledBy = role;
    }

    booking.status = status;

    // Notify the other party
    if (isProvider) booking.residentNotified = true;
    if (isResident) booking.providerNotified = true;

    await booking.save();

    // Update total bookings on provider when completed
    if (status === 'completed') {
      await User.findByIdAndUpdate(booking.providerId, { $inc: { totalBookings: 1 } });
    }

    res.json({ booking });
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings/service/:serviceId — booked slots for calendar
router.get('/service/:serviceId', async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      serviceId: req.params.serviceId,
      status: { $in: ['pending', 'confirmed'] },
    }).select('date timeSlot status');
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
