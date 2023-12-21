const cloudinary = require('cloudinary');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const path = require('path');
const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');
const payment = require('./routes/payment');
const errorMiddleware = require('./middlewares/errors');
const app = express();
          
//setting up config file
if(process.env.NODE_ENV !== 'PRODUCTION'){
  dotenv.config();
}

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(fileUpload());
app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', order);
app.use('/api/v1', payment);

if(process.env.NODE_ENV === 'PRODUCTION'){
  app.use(express.static(path.join(__dirname, './frontend/build')));
  app.use('*', (req, res)=>{
    res.sendFile(path.join(__dirname, './frontend/build/index.html'));
  });
} 
app.use(errorMiddleware);

module.exports = app;