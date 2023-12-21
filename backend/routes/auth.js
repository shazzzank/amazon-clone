const express = require('express');
const router = express.Router();
const {
	authorizeRoles,
	isAuthenticatedUser
} = require('../middlewares/auth');
const {
	allUsers,
	deleteUser,
	forgotPassword,
	getUserDetails,
	getUserProfile,
	loginUser,
	logoutUser,
	registerUser,
	resetPassword,
	updatePassword,
	updateProfile,
	updateUser
} = require('../controllers/authController');

router.route('/admin/users').get(
	isAuthenticatedUser,
	authorizeRoles('admin'),
	allUsers
);
router.route('/admin/user/:id').get(
	isAuthenticatedUser,
	authorizeRoles('admin'),
	getUserDetails
);
router.route('/admin/user/:id').put(
	isAuthenticatedUser,
	authorizeRoles('admin'),
	updateUser
);
router.route('/admin/user/:id').delete(
	isAuthenticatedUser,
	authorizeRoles('admin'),
	deleteUser
);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/me').get(
	isAuthenticatedUser,
	getUserProfile
);
router.route('/me/update').put(
	isAuthenticatedUser,
	updateProfile
);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/password/update').put(
	isAuthenticatedUser,
	updatePassword
);
router.route('/register').post(registerUser);

module.exports = router;