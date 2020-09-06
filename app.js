const express = require('express');
const BodyParser = require('body-parser');
const {
  celebrate, Joi, errors, Segments,
} = require('celebrate');
const joiObjectId = require('joi-objectid');
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
const {
  getUser,
  patchUser,
  patchUserAvatar,
} = require('./app_server/controllers/userController');
const {
  postCard,
  deleteCard,
  likeCard,
  getCard,
  dislikeCard,
} = require('./app_server/controllers/cardsController');
const auth = require('./app_server/middlewares/auth');

const app = express();
app.use(BodyParser.json());
// add joi-objectId to Joi
Joi.objectId = joiObjectId(Joi);

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

// test crash
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// SIGNUP. selebrate, Joi
app.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().alphanum().required().min(4)
      .max(30),
    about: Joi.string().required().min(2).max(30),
    role: Joi.string().default('user'),
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9@#$%&]{8,30}$')),
    avatar: Joi.string().required().lowercase().pattern(new RegExp('^(https?|HTTPS?):\\/\\/(www.|WWW.)?((([a-zA-Z0-9-]{1,63}\\.){1,256}[a-zA-Z]{2,6})|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d{2,5})?([-a-zA-Z0-9_\\/.]{0,256}#?)?$')),
  }),
}), createUser);

// SIGNIN. selebrate, Joi
app.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

// требуем поле авторизации для всех запросов, кроме signin signup
app.use(celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),
}));

// 3) ROUTES
// USERS
app.get('/users/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.objectId(),
  }),
}), auth.protect, getUser);

app.patch('/users/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    about: Joi.string().required(),
  }),
}), auth.protect, patchUser);

app.patch('/users/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), auth.protect, patchUserAvatar);

app.use('/users', userRouter);

// CARDS
app.put('/cards/:id/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.objectId(),
  }),
}), auth.protect, likeCard);

app.delete('/cards/:id/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.objectId(),
  }),
}), auth.protect, dislikeCard);

app.post('/cards', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(new RegExp('^(https?|HTTPS?):\\/\\/(www.|WWW.)?((([a-zA-Z0-9-]{1,63}\\.){1,256}[a-zA-Z]{2,6})|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d{2,5})?([-a-zA-Z0-9_\\/.]{0,256}#?)?$')),
  }),
}), auth.protect, postCard);

app.delete('/cards/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.objectId(),
  }),
}), auth.protect,
auth.restrictTo, deleteCard);

app.get('/cards/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.objectId(),
  }),
}), auth.protect, getCard);

app.use('/cards', cardsRouter);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
