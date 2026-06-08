const express = require('express');
const router = express.Router();
const {
  getPromotionVehicles,
  assignVehicle,
  removeVehicle,
  updatePerformance,
  getVehiclesByPromotion,
} = require('../controllers/promotionVehicleController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getPromotionVehicles);
router.get('/:promotionId', authMiddleware, getVehiclesByPromotion);
router.post('/', authMiddleware, assignVehicle);
router.delete('/:id', authMiddleware, removeVehicle);
router.put('/:id/performance', authMiddleware, updatePerformance);

module.exports = router;
