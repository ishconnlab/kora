const authMiddleware = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized. Please login.' });
  }
  next();
};

const adminMiddleware = (req, res, next) => {
  if (!req.session || (req.session.role !== 'admin' && req.session.role !== 'Admin')) {
    return res.status(403).json({ message: 'Forbidden. Admin access required.' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
