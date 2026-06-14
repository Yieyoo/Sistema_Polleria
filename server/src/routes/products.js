const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
const {
  getCategories,
  getProducts,
  getAllProducts,
  toggleProductAvailability,
} = require('../controllers/productsController');

// Públicas
router.get('/categories', getCategories);
router.get('/',           getProducts);

// Admin
router.get('/admin/all',             requireAuth, getAllProducts);
router.patch('/:id/toggle',          requireAuth, toggleProductAvailability);

module.exports = router;
