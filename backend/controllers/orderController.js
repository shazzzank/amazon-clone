const Order = require('../models/order');
const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Get all orders => /api/v1/admin/orders
exports.allOrders = catchAsyncErrors(async(req, res, next)=>{
	const orders = await Order.find();
	let totalAmount = 0;
	orders.forEach(order=>{
		totalAmount += order.totalPrice;
	});
	res.status(200).json({
		success: true,
		totalAmount,
		orders
	});
});

// Delete order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async(req, res, next)=>{
	const order = await Order.deleteOne({_id: req.params.id});
	if(order.deletedCount > 0){
		res.status(200).json({
			success: true,
			message: 'Order is deleted'
		});
	}
	else{
		return next(new ErrorHandler(`No order found with the id: ${req.params.id}`, 404));
	}
});

// Get single order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async(req, res, next)=>{
	const order = await Order.findById(req.params.id).populate('user', 'name email');
	if(order){
		res.status(200).json({
			success: true,
			order
		});
	}
	else{
		return next(new ErrorHandler(`No order found with this id: ${req.params.id}`, 404));
	}
});

// Get logged in user orders => /api/v1/order/me
exports.myOrders = catchAsyncErrors(async(req, res, next)=>{
	const order = await Order.find({user: req.user.id});
	res.status(200).json({
		success: true,
		order
	});
});

// Create new order => /api/v1/order/new
exports.newOrder = catchAsyncErrors(async(req, res, next)=>{
	const {
		orderItems,
		shippingInfo,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		paymentInfo
	} = req.body;
	const order = await Order.create({
		orderItems,
		shippingInfo,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
		paymentInfo,
		paidAt: Date.now(),
		user: req.user._id
	});
	res.status(200).json({
		success: true,
		order
	});
});

// Update order => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async(req, res, next)=>{
	const order = await Order.findById(req.params.id);
	if(order.orderStatus !== 'Delivered'){
		(order.orderItems).forEach(async item=>{
			await updateStock(item.product, item.quantity);
		});
		order.orderStatus = req.body.status;
		order.deliveredAt = Date.now();
		await order.save();
		res.status(200).json({
			success: true
		});
	}
	else{
		return next(new ErrorHandler('Order already delivered', 400));
	}
});

async function updateStock(id, quantity){
	const product = await Product.findById(id);
	if(product){
		product.stock = product.stock - quantity;
		await product.save({validateBeforeSave: false});
	}
}

