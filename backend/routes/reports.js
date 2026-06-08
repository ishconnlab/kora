const express = require('express');
const router = express.Router();
const { getReport } = require('../controllers/reportController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getReport);

module.exports = router;
