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

// PATCH /api/admin/bookings/:id/cancel
router.patch('/bookings/:id/cancel', async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ booking });
  } catch (err) { next(err); }
});

// GET /api/admin/reviews — all reviews with optional delete
const Review = require('../models/Review');
router.get('/reviews', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [reviews, total] = await Promise.all([
      Review.find()
        .populate('residentId', 'name email')
        .populate('serviceId', 'title category')
        .skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      Review.countDocuments(),
    ]);
    res.json({ reviews, total });
  } catch (err) { next(err); }
});

router.delete('/reviews/:id', async (req, res, next) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) { next(err); }
});

// GET /api/admin/analytics
router.get('/analytics', async (req, res, next) => {
  try {
    const [byCategory, topProviders, recentBookings] = await Promise.all([
      Booking.aggregate([
        { $lookup: { from: 'services', localField: 'serviceId', foreignField: '_id', as: 'service' } },
        { $unwind: '$service' },
        { $group: { _id: '$service.category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      User.find({ role: 'provider', isApproved: true })
        .select('name averageRating totalBookings location')
        .sort({ totalBookings: -1 })
        .limit(5),
      Booking.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
    ]);
    res.json({ byCategory, topProviders, recentBookings });
  } catch (err) { next(err); }
});

// GET /api/admin/services — all services across providers with filters
router.get('/services', async (req, res, next) => {
  try {
    const { category, isActive, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [services, total] = await Promise.all([
      Service.find(filter)
        .populate('providerId', 'name email phone location isApproved isSuspended')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 }),
      Service.countDocuments(filter),
    ]);
    res.json({ services, total });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/services/:id/toggle — toggle service status
router.patch('/services/:id/toggle', async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).populate('providerId', 'name email');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ service });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/services/:id — delete service
router.delete('/services/:id', async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service successfully deleted' });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/users/:id/reset-password — admin reset user password
const bcrypt = require('bcryptjs');
router.patch('/users/:id/reset-password', async (req, res, next) => {
  try {
    const { newPassword = 'password123' } = req.body;
    const passwordHash = await bcrypt.hash(newPassword, 12);
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { passwordHash },
      { new: true }
    ).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `Password reset to "${newPassword}" successfully`, user });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/users/:id/role — change user role
router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['resident', 'provider', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/users/:id — delete user
router.delete('/users/:id', async (req, res, next) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own admin account' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Cleanup related services if provider
    if (user.role === 'provider') {
      await Service.deleteMany({ providerId: user._id });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/system/health — live DB & platform telemetry
const mongoose = require('mongoose');
router.get('/system/health', async (req, res, next) => {
  try {
    const startTime = Date.now();
    await mongoose.connection.db.admin().ping();
    const pingLatencyMs = Date.now() - startTime;

    const [userCount, serviceCount, bookingCount, reviewCount] = await Promise.all([
      User.countDocuments(),
      Service.countDocuments(),
      Booking.countDocuments(),
      Review.countDocuments(),
    ]);

    res.json({
      status: 'healthy',
      dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      dbName: mongoose.connection.name,
      pingLatencyMs,
      serverUptimeSec: Math.floor(process.uptime()),
      nodeVersion: process.version,
      counts: {
        users: userCount,
        services: serviceCount,
        bookings: bookingCount,
        reviews: reviewCount,
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/export/:type — export data as CSV/JSON
router.get('/export/:type', async (req, res, next) => {
  try {
    const { type } = req.params;
    let data = [];
    if (type === 'users') {
      data = await User.find().select('-passwordHash').lean();
    } else if (type === 'services') {
      data = await Service.find().populate('providerId', 'name email location').lean();
    } else if (type === 'bookings') {
      data = await Booking.find()
        .populate('serviceId', 'title category')
        .populate('providerId', 'name email phone')
        .populate('residentId', 'name email phone')
        .lean();
    } else if (type === 'reviews') {
      data = await Review.find().populate('residentId', 'name').populate('serviceId', 'title').lean();
    } else {
      return res.status(400).json({ message: 'Invalid export type. Use users, services, bookings, or reviews' });
    }

    res.json({ type, count: data.length, data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
