const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const {
  login,
  getOrders,
  updateStatus,
  getDailySummary,
} = require('../controllers/adminController');

// Login (público)
router.post('/login', login);

// Pedidos (protegido)
router.get('/orders',           requireAuth, getOrders);
router.patch('/orders/:id',     requireAuth, updateStatus);
router.get('/summary',          requireAuth, getDailySummary);

module.exports = router;
