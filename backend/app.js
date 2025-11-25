require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const grainCalculatorRoute = require('./routes/grainCalculator');


var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// API routes
app.use(cors());
const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);
app.use('/api', grainCalculatorRoute);

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  // Serve React app static files
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  // Serve React app for all non-API routes (must be last)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
} else {
  // In development, serve backend routes
  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use(express.static(path.join(__dirname, 'public')));
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));

module.exports = app;
