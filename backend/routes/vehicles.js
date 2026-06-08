const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAllVehicles,
} = require('../controllers/vehicleController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getVehicles);
router.get('/all', authMiddleware, getAllVehicles);
router.get('/:id', authMiddleware, getVehicle);
router.post('/', authMiddleware, createVehicle);
router.put('/:id', authMiddleware, updateVehicle);
router.delete('/:id', authMiddleware, deleteVehicle);

module.exports = router;
