const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  travelDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'cancelled'],
    default: 'pending'
  },
  isCustomized: {
    type: Boolean,
    default: false
  },
  customSelections: {
    starCategory: { type: Number, enum: [3, 4, 5] },
    inclusions: {
      airportPickup: { type: Boolean, default: false },
      breakfast: { type: Boolean, default: false },
      dinnerBuffet: { type: Boolean, default: false },
      visaServices: { type: Boolean, default: false }
    },
    activities: { type: [String], default: [] }
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', BookingSchema);
