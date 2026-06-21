const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const { auth, admin } = require('../middleware/auth');

// @route   GET api/packages
// @desc    Get all packages with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { price, starCategory, travelType, location, isLastMinute, wifi, pool, gym, bar } = req.query;
    let query = {};

    if (price) {
      query.price = { $lte: Number(price) };
    }
    if (starCategory) {
      query.starCategory = Number(starCategory);
    }
    if (travelType) {
      query.travelType = travelType;
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (isLastMinute === 'true') {
      query.isLastMinute = true;
    }
    if (wifi === 'true') {
      query['amenities.wifi'] = true;
    }
    if (pool === 'true') {
      query['amenities.pool'] = true;
    }
    if (gym === 'true') {
      query['amenities.gym'] = true;
    }
    if (bar === 'true') {
      query['amenities.bar'] = true;
    }

    const packages = await Package.find(query).sort({ createdAt: -1 });
    res.json(packages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching packages' });
  }
});

// @route   GET api/packages/:id
// @desc    Get package by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const pkg = await Package.findById(req.id || req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(pkg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching package details' });
  }
});

// @route   POST api/packages
// @desc    Create a new package
// @access  Private/Admin
router.post('/', auth, admin, async (req, res) => {
  try {
    const newPackage = new Package(req.body);
    const pkg = await newPackage.save();
    res.status(201).json(pkg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating package' });
  }
});

// @route   PUT api/packages/:id
// @desc    Update a package
// @access  Private/Admin
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(pkg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating package' });
  }
});

// @route   DELETE api/packages/:id
// @desc    Delete a package
// @access  Private/Admin
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json({ message: 'Package removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting package' });
  }
});

// @route   POST api/packages/:id/reviews
// @desc    Add review to package
// @access  Private
router.post('/:id/reviews', auth, async (req, res) => {
  const { rating, comment, username } = req.body;
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const newReview = {
      username: username || 'Anonymous User',
      rating: Number(rating),
      comment
    };

    pkg.reviews.push(newReview);
    pkg.ratings.count = pkg.reviews.length;
    
    const sum = pkg.reviews.reduce((acc, item) => acc + item.rating, 0);
    pkg.ratings.average = sum / pkg.reviews.length;

    await pkg.save();
    res.status(201).json(pkg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error adding review' });
  }
});

module.exports = router;
