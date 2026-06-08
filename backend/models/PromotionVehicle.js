const mongoose = require('mongoose');

// [PK] _id
const promotionVehicleSchema = new mongoose.Schema({
  promotionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Promotion',
    required: true, // [FK]
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true, // [FK]
  },
  performance: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
});

module.exports = mongoose.model('PromotionVehicle', promotionVehicleSchema);
