const express = require('express');
const AppError = require('./app_server/utils/appError');
const globalErrorHandler = require('./app_server/controllers/errorController');
const userRouter = require('./app_server/routes/userRoutes');
const cardsRouter = require('./app_server/routes/cardsRoutes');

const app = express();

// 1) MIDDLEWARES

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '5f34222e8be9ce6a5c3021d0', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
