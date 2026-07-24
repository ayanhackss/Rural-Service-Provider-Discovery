const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken);

// ─── PROFILE (both resident & provider) ────────────────────────────────────

// GET /api/me/profile
router.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json({ user });
  } catch (err) { next(err); }
});

// PATCH /api/me/profile — update name, phone, location, password
router.patch('/profile', async (req, res, next) => {
  try {
    const { name, phone, location, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (location) user.location = { ...user.location, ...location };

    // Password change
    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Current password required' });
      const bcrypt = require('bcryptjs');
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) return res.status(401).json({ message: 'Current password incorrect' });
      user.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    await user.save();
    const { passwordHash: _, ...userData } = user.toObject();
    res.json({ user: userData });
  } catch (err) { next(err); }
});

// ─── RESIDENT FAVOURITES ───────────────────────────────────────────────────

// GET /api/me/favourites
router.get('/favourites', requireRole('resident'), async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('favourites');
    const services = await Service.find({ _id: { $in: user.favourites || [] } })
      .populate('providerId', 'name location averageRating');
    res.json({ services });
  } catch (err) { next(err); }
});

// POST /api/me/favourites/:serviceId — toggle
router.post('/favourites/:serviceId', requireRole('resident'), async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const id = req.params.serviceId;
    const favs = user.favourites || [];
    const idx = favs.findIndex(f => f.toString() === id);
    if (idx === -1) favs.push(id);
    else favs.splice(idx, 1);
    user.favourites = favs;
    await user.save();
    res.json({ isFavourite: idx === -1, count: favs.length });
  } catch (err) { next(err); }
});

// ─── RESIDENT MY REVIEWS ───────────────────────────────────────────────────

// GET /api/me/reviews
router.get('/reviews', requireRole('resident'), async (req, res, next) => {
  try {
    const reviews = await Review.find({ residentId: req.user._id })
      .populate('serviceId', 'title category')
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) { next(err); }
});

// ─── PROVIDER EARNINGS ─────────────────────────────────────────────────────

// GET /api/me/earnings
router.get('/earnings', requireRole('provider'), async (req, res, next) => {
  try {
    const bookings = await Booking.find({ providerId: req.user._id, status: 'completed' })
      .populate('serviceId', 'title priceRange');

    const total = bookings.reduce((sum, b) => {
      const avg = b.serviceId?.priceRange
        ? (b.serviceId.priceRange.min + b.serviceId.priceRange.max) / 2
        : 0;
      return sum + avg;
    }, 0);

    // Monthly breakdown (last 6 months)
    const monthly = {};
    bookings.forEach(b => {
      const key = new Date(b.date).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      monthly[key] = (monthly[key] || 0) + 1;
    });

    res.json({ total, completedCount: bookings.length, monthly, bookings });
  } catch (err) { next(err); }
});

// ─── PROVIDER REVIEWS RECEIVED ─────────────────────────────────────────────

// GET /api/me/provider-reviews
router.get('/provider-reviews', requireRole('provider'), async (req, res, next) => {
  try {
    const reviews = await Review.find({ providerId: req.user._id })
      .populate('residentId', 'name')
      .populate('serviceId', 'title')
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) { next(err); }
});

// ─── PROVIDER AVAILABILITY ─────────────────────────────────────────────────

// PATCH /api/me/availability/:serviceId
router.patch('/availability/:serviceId', requireRole('provider'), async (req, res, next) => {
  try {
    const { availability } = req.body;
    const service = await Service.findOne({ _id: req.params.serviceId, providerId: req.user._id });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    service.availability = availability;
    await service.save();
    res.json({ service });
  } catch (err) { next(err); }
});

module.exports = router;
