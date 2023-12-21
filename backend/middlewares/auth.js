const User = require('../models/user');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');

// Check if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next)=>{
	const token = req.cookies.token;
	if(token){
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = await User.findById(decoded.id);
		next();
	}
	else{
		return next(new ErrorHandler('Login first to access this resource.', 401));
	}
});

// Handling user roles
exports.authorizeRoles = (...roles)=>{
	return (req, res, next)=>{
		if(roles.includes(req.user.role)){
			next();
		}
		else{
			return next(new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource.`, 403));
		}
	}
}