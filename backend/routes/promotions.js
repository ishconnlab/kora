const express = require('express');
const router = express.Router();
const {
  getPromotions,
  getPromotion,
  createPromotion,
  updatePromotion,
  deletePromotion,
  getAllPromotions,
} = require('../controllers/promotionController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getPromotions);
router.get('/all', authMiddleware, getAllPromotions);
router.get('/:id', authMiddleware, getPromotion);
router.post('/', authMiddleware, createPromotion);
router.put('/:id', authMiddleware, updatePromotion);
router.delete('/:id', authMiddleware, deletePromotion);

module.exports = router;
