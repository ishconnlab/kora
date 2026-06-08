const Customer = require('../models/Customer');
const Vehicle = require('../models/Vehicle');
const Promotion = require('../models/Promotion');
const PromotionVehicle = require('../models/PromotionVehicle');

exports.getReport = async (req, res, next) => {
  try {
    const { search } = req.query;

    const matchStage = {};
    if (search) {
      const term = search;
      matchStage.$or = [
        { customerName: { $regex: term, $options: 'i' } },
        { vehicleBrand: { $regex: term, $options: 'i' } },
        { vehicleModel: { $regex: term, $options: 'i' } },
        { promotionTitle: { $regex: term, $options: 'i' } },
      ];
    }

    const pipeline = [
      {
        $lookup: {
          from: 'vehicles',
          localField: 'vehicleId',
          foreignField: '_id',
          as: 'vehicle',
        },
      },
      { $unwind: { path: '$vehicle', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'promotions',
          localField: 'promotionId',
          foreignField: '_id',
          as: 'promotion',
        },
      },
      { $unwind: { path: '$promotion', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'customers',
          localField: 'vehicle.customerId',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          customerName: {
            $cond: [
              { $and: ['$customer.firstName', '$customer.lastName'] },
              { $concat: ['$customer.firstName', ' ', '$customer.lastName'] },
              'N/A',
            ],
          },
          vehicleBrand: { $ifNull: ['$vehicle.brand', 'N/A'] },
          vehicleModel: { $ifNull: ['$vehicle.model', 'N/A'] },
          vehiclePlate: { $ifNull: ['$vehicle.plateNumber', 'N/A'] },
          promotionTitle: { $ifNull: ['$promotion.title', 'No promotions available'] },
          discountType: { $ifNull: ['$promotion.discountType', ''] },
          discountValue: { $ifNull: ['$promotion.discountValue', 0] },
          performance: { $ifNull: ['$performance', 0] },
        },
      },
    ];

    if (search && matchStage.$or) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push({ $sort: { _id: -1 } });

    const reports = await PromotionVehicle.aggregate(pipeline);

    return res.json({ reports });
  } catch (error) {
    next(error);
  }
};
