const express = require('express');
const BodyParser = require('body-parser');
const {
  celebrate, Joi, errors, Segments,
} = require('celebrate');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./app_server/utils/appError');
const globalErrorHandler = require('./app_server/controllers/errorController');
const userRouter = require('./app_server/routes/userRoutes');
const cardsRouter = require('./app_server/routes/cardsRoutes');
const { login, createUser } = require('./app_server/controllers/authController');
const { requestLogger, errorLogger } = require('./app_server/middlewares/logger');

const app = express();
app.use(BodyParser.json());

// 1) GLOBAL MIDDLEWARES
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
app.use(mongoSanitize());
// Data sanitation against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['name', 'createdAt'],
}));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.use(requestLogger); // подключаем логгер запросов

// SIGNUP. selebrate, Joi
app.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    role: Joi.string().default('user'),
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
    avatar: Joi.string().required().lowercase(),
  }),
}), createUser);

// SIGNIN. selebrate, Joi
app.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

// 3) ROUTES
app.use('/users', userRouter);
app.use('/cards', cardsRouter);

// app.post('/signin', login);
// app.post('/signup', createUser);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
