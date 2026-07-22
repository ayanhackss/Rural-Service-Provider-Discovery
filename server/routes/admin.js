const express = require('express');
const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require auth + admin role
router.use(verifyToken, requireRole('admin'));

// GET /api/admin/stats
router.get('/stats', async (req, res, next) => {
  try {
    const [
      totalProviders, pendingProviders, totalResidents,
      totalServices, totalBookings, completedBookings,
    ] = await Promise.all([
      User.countDocuments({ role: 'provider' }),
      User.countDocuments({ role: 'provider', isApproved: false }),
      User.countDocuments({ role: 'resident' }),
      Service.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'completed' }),
    ]);

    res.json({
      totalProviders, pendingProviders, totalResidents,
      totalServices, totalBookings, completedBookings,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/users
router.get('/users', async (req, res, next) => {
  try {
    const { role, approved, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (approved !== undefined) filter.isApproved = approved === 'true';

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).select('-passwordHash').skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    res.json({ users, total });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/users/:id/approve — approve or reject provider
router.patch('/users/:id/approve', async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/users/:id/suspend — suspend / unsuspend
router.patch('/users/:id/suspend', async (req, res, next) => {
  try {
    const { isSuspended } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isSuspended },
      { new: true }
    ).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // If suspending a provider, deactivate their services
    if (isSuspended && user.role === 'provider') {
      await Service.updateMany({ providerId: user._id }, { isActive: false });
    }
    if (!isSuspended && user.role === 'provider') {
      await Service.updateMany({ providerId: user._id }, { isActive: true });
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/bookings
router.get('/bookings', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('serviceId', 'title category')
        .populate('providerId', 'name')
        .populate('residentId', 'name')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Booking.countDocuments(filter),
    ]);
    res.json({ bookings, total });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
