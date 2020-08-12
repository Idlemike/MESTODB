const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.properties.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleCantFindErrorDB = () => {
  const message = `Can't find on this server!`;
  return new AppError(message, 404);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      //status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.message.startsWith('Cast')) {
      const error = handleCastErrorDB(err);
      sendErrorProd(error, res);
    } else if (err.code === 11000) {
      const error = handleDuplicateFieldsDB(err);
      sendErrorProd(error, res);
    } else if (err.message.startsWith('Validation')) {
      const error = handleValidationErrorDB(err);
      sendErrorProd(error, res);
    } else if (err.message.startsWith('card')) {
      const error = handleValidationErrorDB(err);
      sendErrorProd(error, res);
    } else if (err.message.startsWith('user')) {
      const error = handleValidationErrorDB(err);
      sendErrorProd(error, res);
    } else if (err.message.startsWith("Can't")) {
      const error = handleCantFindErrorDB(err);
      sendErrorProd(error, res);
    }
  }
};
