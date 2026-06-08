const Vehicle = require('../models/Vehicle');

exports.getVehicles = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { plateNumber: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Vehicle.countDocuments(query);
    const vehicles = await Vehicle.find(query)
      .populate('userId', 'username')
      .populate('customerId', 'firstName lastName')
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.json({
      vehicles,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate('userId', 'username').populate('customerId', 'firstName lastName');
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    return res.json({ vehicle });
  } catch (error) {
    next(error);
  }
};

exports.createVehicle = async (req, res, next) => {
  try {
    const { plateNumber, brand, model, year, vehicleType, purchasePrice, status, customerId } = req.body;

    if (!plateNumber || !brand || !model || !year || !vehicleType || !purchasePrice) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const vehicle = await Vehicle.create({
      plateNumber,
      brand,
      model,
      year,
      vehicleType,
      purchasePrice,
      status: status || 'Available',
      customerId: customerId || undefined,
      userId: req.session.userId,
    });

    const populated = await Vehicle.findById(vehicle._id).populate('userId', 'username').populate('customerId', 'firstName lastName');

    return res.status(201).json({ message: 'Vehicle created successfully', vehicle: populated });
  } catch (error) {
    next(error);
  }
};

exports.updateVehicle = async (req, res, next) => {
  try {
    const { plateNumber, brand, model, year, vehicleType, purchasePrice, status, customerId } = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { plateNumber, brand, model, year, vehicleType, purchasePrice, status, customerId },
      { new: true, runValidators: true }
    ).populate('userId', 'username').populate('customerId', 'firstName lastName');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    return res.json({ message: 'Vehicle updated successfully', vehicle });
  } catch (error) {
    next(error);
  }
};

exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await require('../models/PromotionVehicle').deleteMany({ vehicleId: req.params.id });

    return res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ status: 'Available' }).populate('userId', 'username').populate('customerId', 'firstName lastName').sort({ _id: -1 });
    return res.json({ vehicles });
  } catch (error) {
    next(error);
  }
};
