const mongoose = require('mongoose');

// [PK] _id
const vehicleSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: [true, 'Plate number is required'],
    unique: true,
    trim: true,
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
  },
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    trim: true,
  },
  purchasePrice: {
    type: Number,
    required: [true, 'Purchase price is required'],
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Rented'],
    default: 'Available',
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // [FK]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // [FK]
  },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
