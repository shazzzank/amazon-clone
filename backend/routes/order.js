const express = require('express');
const router = express.Router();
const {
	allOrders,
	deleteOrder,
	getSingleOrder,
	myOrders,
	newOrder,
	updateOrder
} = require('../controllers/orderController');
const {
	authorizeRoles,
	isAuthenticatedUser
} = require('../middlewares/auth');

router.route('/admin/orders').get(
	isAuthenticatedUser,
	authorizeRoles('admin'),
	allOrders
);
router.route('/admin/order/:id').put(
	isAuthenticatedUser,
	authorizeRoles('admin'),
	updateOrder
);
router.route('/admin/order/:id').delete(
	isAuthenticatedUser,
	authorizeRoles('admin'),
	deleteOrder
);
router.route('/order/:id').get(
	isAuthenticatedUser,
	getSingleOrder
);
router.route('/orders/me').get(
	isAuthenticatedUser,
	myOrders
);
router.route('/order/new').post(
	isAuthenticatedUser,
	newOrder
);

module.exports = router;