const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');
const { auth, admin } = require('../middleware/auth');

// @route   GET api/bookings
// @desc    Get user bookings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('package')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
});

// @route   POST api/bookings
// @desc    Create a booking (standard or customized)
// @access  Private
router.post('/', auth, async (req, res) => {
  const { packageId, travelDate, isCustomized, customSelections, price } = req.body;
  try {
    const booking = new Booking({
      user: req.user.id,
      package: packageId,
      travelDate,
      isCustomized: !!isCustomized,
      customSelections,
      price
    });

    const savedBooking = await booking.save();
    
    // Add travel points if user has a kitty subscription active
    const user = await User.findById(req.user.id);
    if (user && user.kittySubscription.tier !== 'None') {
      // Award 10 points for every $100 spent
      const pointsEarned = Math.floor(price / 10);
      user.kittySubscription.points += pointsEarned;
      await user.save();
    }

    res.status(201).json(savedBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating booking' });
  }
});

// @route   POST api/bookings/kitty-subscribe
// @desc    Subscribe or upgrade Premium Travel Kitty
// @access  Private
router.post('/kitty-subscribe', auth, async (req, res) => {
  const { tier } = req.body; // 'None' | 'Bronze' | 'Silver' | 'Gold'
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set starting points based on tier subscription bonus
    let startingPoints = user.kittySubscription.points;
    if (tier === 'Bronze') startingPoints += 100;
    else if (tier === 'Silver') startingPoints += 250;
    else if (tier === 'Gold') startingPoints += 600;

    user.kittySubscription = {
      tier,
      points: startingPoints,
      lastPaymentDate: new Date()
    };

    await user.save();
    res.json({
      message: `Successfully subscribed to ${tier} Tier!`,
      kittySubscription: user.kittySubscription
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error setting subscription' });
  }
});

// @route   GET api/bookings/admin
// @desc    Get all bookings for CRM tracker (Admin only)
// @access  Private/Admin
router.get('/admin', auth, admin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email kittySubscription')
      .populate('package', 'title price location starCategory')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching CRM bookings' });
  }
});

// @route   PUT api/bookings/admin/:id
// @desc    Update booking status (Admin only)
// @access  Private/Admin
router.put('/admin/:id', auth, admin, async (req, res) => {
  const { status } = req.body;
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    )
    .populate('user', 'name email')
    .populate('package', 'title');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating booking status' });
  }
});

module.exports = router;
