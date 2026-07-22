const express = require('express');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// POST /api/reviews — resident posts a review (gated: booking must be completed)
router.post('/', verifyToken, requireRole('resident'), async (req, res, next) => {
  try {
    const { bookingId, rating, comment } = req.body;
    if (!bookingId || !rating) {
      return res.status(400).json({ message: 'bookingId and rating are required' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review a completed booking' });
    }
    if (booking.residentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your booking' });
    }

    // One review per booking (unique index on bookingId)
    const review = await Review.create({
      bookingId,
      serviceId: booking.serviceId,
      providerId: booking.providerId,
      residentId: req.user._id,
      rating: Number(rating),
      comment,
    });

    // Recompute service average rating
    const allReviews = await Review.find({ serviceId: booking.serviceId });
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await Service.findByIdAndUpdate(booking.serviceId, {
      averageRating: Math.round(avg * 10) / 10,
      totalReviews: allReviews.length,
    });

    // Recompute provider average rating
    const providerReviews = await Review.find({ providerId: booking.providerId });
    const provAvg = providerReviews.reduce((s, r) => s + r.rating, 0) / providerReviews.length;
    await User.findByIdAndUpdate(booking.providerId, {
      averageRating: Math.round(provAvg * 10) / 10,
    });

    res.status(201).json({ review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You have already reviewed this booking' });
    }
    next(err);
  }
});

// GET /api/reviews/service/:id — all reviews for a service
router.get('/service/:id', async (req, res, next) => {
  try {
    const reviews = await Review.find({ serviceId: req.params.id })
      .populate('residentId', 'name')
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    next(err);
  }
});

// GET /api/reviews/can-review/:bookingId — check eligibility
router.get('/can-review/:bookingId', verifyToken, requireRole('resident'), async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking || booking.residentId.toString() !== req.user._id.toString()) {
      return res.json({ canReview: false });
    }
    const alreadyReviewed = await Review.findOne({ bookingId: req.params.bookingId });
    res.json({
      canReview: booking.status === 'completed' && !alreadyReviewed,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
