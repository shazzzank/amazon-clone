const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDatabase = () =>{
	mongoose.connect(process.env.DB_URI).then(conn=> console.log(`MongoDB is connected with HOST: ${conn.connection.host}`));
}

module.exports = connectDatabase;