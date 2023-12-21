const dotenv = require('dotenv');
const {connect} = require('mongoose');
const Product = require('../models/product');
const products = require('../data/products');
const connectDatabase = require('../config/database');

dotenv.config();
connectDatabase();

const seedProducts = async()=>{
	try{
		await Product.deleteMany();
		console.log('Products are deleted');
		await Product.insertMany(products);
		console.log('All products are added.');
		process.exit(); 
	}
	catch(err){
		console.log(err.message);
		process.exit();
	}
}

seedProducts();