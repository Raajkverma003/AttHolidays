const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  starCategory: {
    type: Number,
    enum: [3, 4, 5],
    required: true
  },
  travelType: {
    type: String,
    enum: ['standard', 'custom', 'group'],
    default: 'standard'
  },
  inclusions: {
    airportPickup: { type: Boolean, default: false },
    breakfast: { type: Boolean, default: false },
    dinnerBuffet: { type: Boolean, default: false },
    visaServices: { type: Boolean, default: false }
  },
  amenities: {
    wifi: { type: Boolean, default: false },
    pool: { type: Boolean, default: false },
    gym: { type: Boolean, default: false },
    bar: { type: Boolean, default: false }
  },
  activities: {
    type: [String],
    default: []
  },
  touristPlaces: {
    type: [String],
    default: []
  },
  itinerary: [{
    day: { type: Number, required: true },
    title: { type: String, required: true },
    details: { type: String, required: true }
  }],
  importantDetails: {
    type: String
  },
  images: {
    type: [String],
    default: []
  },
  ratings: {
    average: { type: Number, default: 5 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    username: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  isLastMinute: {
    type: Boolean,
    default: false
  },
  lastMinutePrice: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Package', PackageSchema);
