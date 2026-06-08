const Vehicle = require('../models/Vehicle');
const Customer = require('../models/Customer');
const Promotion = require('../models/Promotion');

exports.getDashboard = async (req, res, next) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalPromotions = await Promotion.countDocuments();
    const activePromotions = await Promotion.countDocuments({ status: 'Active' });

    const recentPromotions = await Promotion.find()
      .populate('userId', 'username')
      .sort({ _id: -1 })
      .limit(5);

    const recentVehicles = await Vehicle.find()
      .populate('userId', 'username')
      .sort({ _id: -1 })
      .limit(5);

    return res.json({
      stats: {
        totalVehicles,
        totalCustomers,
        totalPromotions,
        activePromotions,
      },
      recentPromotions,
      recentVehicles,
    });
  } catch (error) {
    next(error);
  }
};
