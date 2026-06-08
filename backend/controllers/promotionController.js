const Promotion = require('../models/Promotion');

exports.getPromotions = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { discountType: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Promotion.countDocuments(query);
    const promotions = await Promotion.find(query)
      .populate('userId', 'username')
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.json({
      promotions,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getPromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.findById(req.params.id).populate('userId', 'username');
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    return res.json({ promotion });
  } catch (error) {
    next(error);
  }
};

exports.createPromotion = async (req, res, next) => {
  try {
    const { title, description, discountType, discountValue, startDate, endDate, status } = req.body;

    if (!title || !description || !discountType || discountValue === undefined || !startDate || !endDate) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const promotion = await Promotion.create({
      title,
      description,
      discountType,
      discountValue,
      startDate,
      endDate,
      status: status || 'Active',
      userId: req.session.userId,
    });

    const populated = await Promotion.findById(promotion._id).populate('userId', 'username');

    return res.status(201).json({ message: 'Promotion created successfully', promotion: populated });
  } catch (error) {
    next(error);
  }
};

exports.updatePromotion = async (req, res, next) => {
  try {
    const { title, description, discountType, discountValue, startDate, endDate, status } = req.body;

    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { title, description, discountType, discountValue, startDate, endDate, status },
      { new: true, runValidators: true }
    ).populate('userId', 'username');

    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    return res.json({ message: 'Promotion updated successfully', promotion });
  } catch (error) {
    next(error);
  }
};

exports.deletePromotion = async (req, res, next) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }

    await require('../models/PromotionVehicle').deleteMany({ promotionId: req.params.id });

    return res.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getAllPromotions = async (req, res, next) => {
  try {
    const promotions = await Promotion.find({ status: 'Active' }).populate('userId', 'username').sort({ _id: -1 });
    return res.json({ promotions });
  } catch (error) {
    next(error);
  }
};
