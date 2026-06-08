const Customer = require('../models/Customer');

exports.getCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.json({
      customers,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id).populate('userId', 'username');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    return res.json({ customer });
  } catch (error) {
    next(error);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, status } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const customer = await Customer.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      status: status || 'Active',
      userId: req.session.userId,
    });

    const populated = await Customer.findById(customer._id).populate('userId', 'username');

    return res.status(201).json({ message: 'Customer created successfully', customer: populated });
  } catch (error) {
    next(error);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, status } = req.body;

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, phoneNumber, status },
      { new: true, runValidators: true }
    ).populate('userId', 'username');

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    return res.json({ message: 'Customer updated successfully', customer });
  } catch (error) {
    next(error);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    return res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find().populate('userId', 'username').sort({ createdAt: -1 });
    return res.json({ customers });
  } catch (error) {
    next(error);
  }
};
