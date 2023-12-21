const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');

// Create new review => /api/v1/review
exports.createProductReview = catchAsyncErrors(async(req, res, next)=>{
	const {rating, comment, productId} = req.body;
	const review = {
		user: req.user._id,
		name: req.user.name,
		rating: Number(rating),
		comment
	};
	const product = await Product.findById(productId);
	const isReviewed = product.reviews.find(
		r=>r.user.toString() === req.user._id.toString()
	);
	if(isReviewed){
		product.reviews.forEach(review=>{
			if(review.user.toString() === req.user._id.toString()){
				review.comment = comment;
				review.rating = rating;
			}
		});
	}
	else{
		product.reviews.push(review);
		product.numOfReviews = product.reviews.length;
	}
	product.ratings = product.reviews.reduce((acc, item)=>
		item.rating + acc, 0) / product.reviews.length;
	await product.save({validateBeforeSave: false});
	res.status(200).json({
		success: true
	});
});

// Delete product => /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async(req, res, next)=>{
	const product = await Product.findById(req.params.id);
	//Deleting images associated with the product
	for(let i=0; i<product.images.length; i++){
		const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
	}
	const find = await Product.deleteOne({_id:req.params.id});
	if(find.deletedCount > 0){
		res.status(200).json({
			success: true,
			message: 'Product is deleted'
		});
	}
	else{
		next(new ErrorHandler('Product not found', 404));
	}
});

// Delete product review => /api/v1/reviews
exports.deleteReview = catchAsyncErrors(async(req, res, next)=>{
	const product = await Product.findById(req.query.productId);
	const reviews = product.reviews.filter(r=>r._id.toString() !== req.query.id.toString());
	const numOfReviews = reviews.length;
	const ratings = product.reviews.reduce((acc, item)=>item.rating + acc, 0) / reviews.length;
	await Product.findByIdAndUpdate(req.query.productId, {
		reviews,
		ratings,
		numOfReviews
	}, {
		new: true,
		runValidators: true,
		userFindAndModify: false
	});
	res.status(200).json({
		success: true
	})
});

// Get single product => /api/v1/product/:id
exports.getProduct = catchAsyncErrors(async(req, res, next)=>{
	const id = req.params.id;
	const product = await Product.findById(id);
	if(product){
		res.status(200).json({
			success: true,
			product
		});
	}
	else next(new ErrorHandler('Product not found', 404));
});

// Get all product => /api/v1/products?keyword=apple
exports.getProducts = catchAsyncErrors(async(req, res, next)=>{
	const resultPerPage = 4;
	const productsCount = await Product.countDocuments();
	let apiFeatures = new APIFeatures(Product.find(), req.query)
		.search()
		.filter()
	let products = await apiFeatures.query.clone();
	let filteredProductsCount = products.length;
	apiFeatures = apiFeatures.pagination(resultPerPage);
	products = await apiFeatures.query;
	res.status(200).json({
		success: true,
		productsCount,
		resultPerPage,
		filteredProductsCount,
		products
	});
});

// Get all product (admin) => /api/v1/admin/products?keyword=apple
exports.getAdminProducts = catchAsyncErrors(async(req, res, next)=>{
	const products = await Product.find();
	res.status(200).json({
		success: true,
		products
	});
});

// Get product reviews => /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async(req, res,next)=>{
	const product = await Product.findById(req.query.id);
	res.status(200).json({
		success: true,
		reviews: product.reviews
	});
});

// Create new product => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async(req, res, next)=>{
	let images = [];
	if(typeof req.body.images === 'string'){
		images.push(req.body.images);
	}
	else{
		images = req.body.images;
	}
	let imagesLinks = [];
	for(let i=0; i<images.length; i++){
		const result = await cloudinary.v2.uploader.upload(images[i], {
			folder: 'products'
		});
		imagesLinks.push({
			public_id: result.public_id,
			url: result.secure_url
		})
	}
	req.body.images = imagesLinks;
	req.body.user = req.user.id;
	const product = await Product.create(req.body);
	res.status(201).json({
		success: true,
		product
	});
});

// Update product => /api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors(async(req, res, next)=>{
	const id = req.params.id;
	let images = [];
	let product = await Product.findById(id);

	if(typeof req.body.images === 'string'){
		images.push(req.body.images);
	}
	else{
		images = req.body.images;
	}
	if(images !== undefined){
		//Deleting images associated with the product
		for(let i=0; i<product.images.length; i++){
			const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
		}
		let imagesLinks = [];
		for(let i=0; i<images.length; i++){
			const result = await cloudinary.v2.uploader.upload(images[i], {
				folder: 'products'
			});
			imagesLinks.push({
				public_id: result.public_id,
				url: result.secure_url
			})
		}
		req.body.images = imagesLinks;
	}

	if(product){
		product = await Product.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
			useFindAndModify: false
		})
		res.status(200).json({
			success: true,
			product
		});
	}
	else next(new ErrorHandler('Product not found', 404));
});