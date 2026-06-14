const router = require('express').Router();
const { createOrder } = require('../controllers/ordersController');

router.post('/', createOrder);

module.exports = router;
