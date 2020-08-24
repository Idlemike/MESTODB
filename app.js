const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitaze = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./app_server/utils/appError');
const globalErrorHandler = require('./app_server/controllers/errorController');
const userRouter = require('./app_server/routes/userRoutes');
const cardsRouter = require('./app_server/routes/cardsRoutes');
const { createUser, login } = require('./app_server/controllers/authController');

const app = express();

// 1) MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitation against No SQL query injection
app.use(mongoSanitaze());
// Data sanitation against XSS
app.use(xss());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

// 3) ROUTES
app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.post('/signin', login);
app.post('/signup', createUser);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
