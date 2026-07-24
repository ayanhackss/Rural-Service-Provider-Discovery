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

// Announcements — in-memory for now (stored in DB via a simple collection)
const announcementSchema = new (require('mongoose').Schema)(
  { title: String, body: String, createdBy: String },
  { timestamps: true }
);
const Announcement = require('mongoose').models.Announcement ||
  require('mongoose').model('Announcement', announcementSchema);

router.get('/announcements', async (req, res, next) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(20);
    res.json({ announcements });
  } catch (err) { next(err); }
});

router.post('/announcements', async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const a = await Announcement.create({ title, body, createdBy: req.user.name });
    res.status(201).json({ announcement: a });
  } catch (err) { next(err); }
});

router.delete('/announcements/:id', async (req, res, next) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
