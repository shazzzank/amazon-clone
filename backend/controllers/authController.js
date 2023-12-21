const crypto = require('crypto');
const cloudinary = require('cloudinary');
const User = require('../models/user');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

// Get all users => /api/v1/admin/users
exports.allUsers = catchAsyncErrors(async(req, res, next)=>{
	const users = await User.find();
	res.status(200).json({
		success: true,
		users
	});
});

// Delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async(req, res, next)=>{
	const find = await User.deleteOne({_id: req.params.id});
	const user = await User.findById(req.params.id);
	if(find.deletedCount === 1){
		// Remove avatar from cloudinary
		const image_id = user.avatar.public_id;
		await cloudinary.v2.uploader.destroy(image_id);
		res.status(200).json({
			success: true
		});
	}
	else{
		return next(new ErrorHandler(`User not found with id: ${req.params.id}`));
	}
});

// Forgot password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async(req, res, next)=>{
	const user = await User.findOne({email: req.body.email});
	if(user){
		// Get reset token
		const resetToken = user.getResetPasswordToken();
		await user.save({validateBeforeSave: false});
		// Create reset password url
		const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;
		const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;
		try{
			await sendEmail({
				email: user.email,
				subject: 'Ecommerce Password Recovery',
				message
			});
			res.status(200).json({
				success: true,
				message: `Email sent successfully to: ${user.email}`
			});
		}
		catch(err){
			user.getResetPasswordToken = undefined;
			user.getResetPasswordExpire = undefined;
			await user.save({validateBeforeSave: false});
			return next(new ErrorHandler(err.message, 500));
		}
	}
	else{
		return next(new ErrorHandler('User not found with this Email', 0));
	}
});

// Get user details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async(req, res, next)=>{
	const user = await User.findById(req.params.id);
	if(user){
		res.status(200).json({
			success: true,
			user
		})
	}
	else{
		return next(new ErrorHandler(`User not found with id: ${req.params.id}`));
	}
});

// Get currently logged in user details => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async(req, res, next)=>{
	const user = await User.findById(req.user.id);
	res.status(200).json({
		success: true,
		user
	});
});

// Login a user => /api/v1/login
exports.loginUser = catchAsyncErrors(async(req, res, next)=>{
	const {email, password} = req.body;
	if(!email || !password){
		return next(new ErrorHandler('Please enter email & password', 400));
	}
	const user = await User.findOne({email}).select('+password');
	if(user){
		const isPasswordMatched = await user.comparePassword(password);
		if(isPasswordMatched){
			sendToken(user, 200, res);
		}
		else{
			return next(new ErrorHandler('Invalid Email or Password', 401));
		}
	}
	else{
		return next(new ErrorHandler('Invalid Email or Password', 401));
	}
});

// Logout a user => /api/v1/logout
exports.logoutUser = catchAsyncErrors(async(req, res, next)=>{
	res.cookie('token', null, {
		expires: new Date(Date.now()),
		httpOnly: true
	});
	res.status(200).json({
		success: true,
		message: 'Logged out'
	});
});

// Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async(req, res, next)=>{
	const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
		folder: 'avatars',
		width: 150,
		crop: 'scale'
	});
	const {name, email, password} = req.body;
	const user = await User.create({
		name,
		email,
		password,
		avatar: {
			public_id: result.public_id,
			url: result.secure_url
		}
	});
	sendToken(user, 200, res);
});

// Reset password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async(req, res, next)=>{
	// Hash url token
	const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
	const user = await User.findOne({
		resetPasswordToken,
		resetPasswordExpire: {$gt: Date.now()}
	});
	if(user){
		if(req.body.password == req.body.confirmPassword){
			//Setup new password
			user.password = req.body.password;
			user.resetPasswordToken = undefined;
			user.resetPasswordExpire = undefined;
			await user.save();
			sendToken(user, 200, res);
		}
		else{
			return next(new ErrorHandler('Password does not match', 400));
		}
	}
	else{
		return next(new ErrorHandler('Password reset token is invalid or has been expired.', 400));
	}
});

// Update/change password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async(req, res, next)=>{
	const user = await User.findById(req.user.id).select('+password');
	// Check user's previous password
	const isMatched = await user.comparePassword(req.body.oldPassword);
	if(isMatched){
		user.password = req.body.password;
		await user.save();
		sendToken(user, 200, res);
	}
	else{
		return next(new ErrorHandler('Old password is incorrect', 400));
	}
});

// Update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncErrors(async(req, res, next)=>{
	const newUserData = {
		name: req.body.name,
		email: req.body.email
	};
	if(req.body.avatar !== ''){
		const user = await User.findById(req.user.id);
		const image_id = user.avatar.public_id;
		const res = await cloudinary.v2.uploader.destroy(image_id);
		const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
			folder: 'avatars',
			width: 150,
			crop: 'scale'
		});
		newUserData.avatar = {
			public_id: result.public_id,
			url: result.secure_url
		}
	}
	const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
		new: true,
		runValidators: true,
		useFindAndModify: false
	});
	res.status(200).json({
		success: true
	});
});

// Update user profile => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async(req, res, next)=>{
	const newUserData = {
		name: req.body.name,
		email: req.body.email,
		role: req.body.role
	};
	const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
		new: true,
		runValidators: true,
		useFindAndModify: false
	});
	res.status(200).json({
		success: true
	});
});