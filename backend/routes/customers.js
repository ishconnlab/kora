const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getAllCustomers,
} = require('../controllers/customerController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getCustomers);
router.get('/all', authMiddleware, getAllCustomers);
router.get('/:id', authMiddleware, getCustomer);
router.post('/', authMiddleware, createCustomer);
router.put('/:id', authMiddleware, updateCustomer);
router.delete('/:id', authMiddleware, deleteCustomer);

module.exports = router;
