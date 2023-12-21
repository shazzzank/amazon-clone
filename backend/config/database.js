const mongoose = require('mongoose');

const connectDatabase = () =>{
	mongoose.connect(process.env.DB_URI).then(conn=> console.log(`MongoDB is connected with HOST: ${conn.connection.host}`));
}

module.exports = connectDatabase;