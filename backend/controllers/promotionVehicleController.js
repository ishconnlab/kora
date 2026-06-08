const PromotionVehicle = require('../models/PromotionVehicle');
const Promotion = require('../models/Promotion');
const Vehicle = require('../models/Vehicle');

exports.getPromotionVehicles = async (req, res, next) => {
  try {
    const { promotionId } = req.query;
    const query = {};
    if (promotionId) query.promotionId = promotionId;

    const data = await PromotionVehicle.find(query)
      .populate('promotionId')
      .populate('vehicleId')
      .sort({ _id: -1 });

    return res.json({ promotionVehicles: data });
  } catch (error) {
    next(error);
  }
};

exports.assignVehicle = async (req, res, next) => {
  try {
    const { promotionId, vehicleId } = req.body;

    if (!promotionId || !vehicleId) {
      return res.status(400).json({ message: 'Promotion ID and Vehicle ID are required' });
    }

    const existing = await PromotionVehicle.findOne({ promotionId, vehicleId });
    if (existing) {
      return res.status(400).json({ message: 'Vehicle already assigned to this promotion' });
    }

    const data = await PromotionVehicle.create({ promotionId, vehicleId });

    const populated = await PromotionVehicle.findById(data._id)
      .populate('promotionId')
      .populate('vehicleId');

    return res.status(201).json({ message: 'Vehicle assigned successfully', promotionVehicle: populated });
  } catch (error) {
    next(error);
  }
};

exports.removeVehicle = async (req, res, next) => {
  try {
    const data = await PromotionVehicle.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    return res.json({ message: 'Vehicle removed from promotion successfully' });
  } catch (error) {
    next(error);
  }
};

exports.updatePerformance = async (req, res, next) => {
  try {
    const { performance } = req.body;

    if (performance === undefined || performance < 0 || performance > 100) {
      return res.status(400).json({ message: 'Performance must be between 0 and 100' });
    }

    const data = await PromotionVehicle.findByIdAndUpdate(
      req.params.id,
      { performance },
      { new: true }
    )
      .populate('promotionId')
      .populate('vehicleId');

    if (!data) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    return res.json({ message: 'Performance updated successfully', promotionVehicle: data });
  } catch (error) {
    next(error);
  }
};

exports.getVehiclesByPromotion = async (req, res, next) => {
  try {
    const { promotionId } = req.params;

    const data = await PromotionVehicle.find({ promotionId })
      .populate('vehicleId')
      .populate('promotionId')
      .sort({ _id: -1 });

    return res.json({ promotionVehicles: data });
  } catch (error) {
    next(error);
  }
};
