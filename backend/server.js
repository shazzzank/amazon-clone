const dotenv = require('dotenv');
const app = require('./app');
const connectDatabase = require('./config/database');

//setting up config file
if(process.env.NODE_ENV !== 'PRODUCTION'){
	dotenv.config({path: 'backend/config/config.env'});
}

//connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, ()=>{
	console.log(`Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});

process.on('uncaughtException', err=>{
	console.log(`Error: ${err.stack}`);
	console.log('Shutting down due to uncaught exception.');
	process.exit(1);
});

process.on('unhandledRejection', err=>{
	console.log(`Error: ${err.stack}`);
	console.log('Shutting down the server due to unhandled promise rejection.');
	server.close(()=>{
		process.exit(1);
	});
});