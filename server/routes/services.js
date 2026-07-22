const express = require('express');
const Service = require('../models/Service');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/services — search + filter (public)
router.get('/', async (req, res, next) => {
  try {
    const { q, category, minRating, location, sort, page = 1, limit = 12 } = req.query;

    const filter = { isActive: true };

    // Only show services from approved, non-suspended providers
    const User = require('../models/User');
    const approvedProviders = await User.find({ role: 'provider', isApproved: true, isSuspended: false }).select('_id');
    filter.providerId = { $in: approvedProviders.map(u => u._id) };

    if (q) {
      filter.$text = { $search: q };
    }
    if (category) filter.category = category;
    if (minRating) filter.averageRating = { $gte: Number(minRating) };
    if (location) {
      // Match either village or PIN code
      const User = require('../models/User');
      const locationMatch = await User.find({
        role: 'provider',
        $or: [
          { 'location.village': { $regex: location, $options: 'i' } },
          { 'location.pinCode': location },
        ],
      }).select('_id');
      filter.providerId = {
        $in: locationMatch.map(u => u._id).filter(id =>
          filter.providerId.$in.some(aid => aid.toString() === id.toString())
        ),
      };
    }

    const sortMap = {
      rating: { averageRating: -1 },
      price:  { 'priceRange.min': 1 },
      newest: { createdAt: -1 },
    };
    const sortOrder = sortMap[sort] || { averageRating: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [services, total] = await Promise.all([
      Service.find(filter)
        .sort(sortOrder)
        .skip(skip)
        .limit(Number(limit))
        .populate('providerId', 'name location phone averageRating'),
      Service.countDocuments(filter),
    ]);

    res.json({ services, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// GET /api/services/stats — public stats for homepage
router.get('/stats', async (req, res, next) => {
  try {
    const User = require('../models/User');
    const Booking = require('../models/Booking');
    
    const [totalProviders, totalBookings, approvedProviders] = await Promise.all([
      User.countDocuments({ role: 'provider', isApproved: true, isSuspended: false }),
      Booking.countDocuments(),
      User.find({ role: 'provider', isApproved: true, isSuspended: false }).select('location.village'),
    ]);

    // Calculate unique villages
    const villages = new Set();
    approvedProviders.forEach(p => {
      if (p.location?.village) villages.add(p.location.village.toLowerCase().trim());
    });

    res.json({
      totalProviders,
      totalBookings,
      activeVillages: villages.size
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/services/:id — single service (public)
router.get('/:id', async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('providerId', 'name location phone averageRating totalBookings isApproved isSuspended');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ service });
  } catch (err) {
    next(err);
  }
});

// GET /api/services/provider/mine — provider's own listings
router.get('/provider/mine', verifyToken, requireRole('provider'), async (req, res, next) => {
  try {
    const services = await Service.find({ providerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ services });
  } catch (err) {
    next(err);
  }
});

// POST /api/services — create listing
router.post('/', verifyToken, requireRole('provider'), async (req, res, next) => {
  try {
    if (!req.user.isApproved) {
      return res.status(403).json({ message: 'Your account is pending admin approval.' });
    }
    const { title, category, description, priceRange, availability, photos } = req.body;
    const service = await Service.create({
      providerId: req.user._id,
      title, category, description, priceRange, availability, photos,
    });
    res.status(201).json({ service });
  } catch (err) {
    next(err);
  }
});

// PUT /api/services/:id — edit listing (owner only)
router.put('/:id', verifyToken, requireRole('provider'), async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your listing' });
    }
    const { title, category, description, priceRange, availability, photos, isActive } = req.body;
    Object.assign(service, { title, category, description, priceRange, availability, photos, isActive });
    await service.save();
    res.json({ service });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/services/:id — delete listing (owner only)
router.delete('/:id', verifyToken, requireRole('provider'), async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    if (service.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your listing' });
    }
    await service.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

// GET /api/services/categories/list — category list
router.get('/categories/list', (req, res) => {
  const { SERVICE_CATEGORIES } = require('../models/Service');
  res.json({ categories: SERVICE_CATEGORIES });
});

module.exports = router;
