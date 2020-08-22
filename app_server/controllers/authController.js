const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => jwt.sign({ id }, 'my-ultra-secure-secret', {
  expiresIn: '90d',
});

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    about: req.body.about,
    avatar: req.body.avatar,
    role: req.body.role,
  });

  const token = signToken(newUser._id);
  res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
    .end();
/*  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });*/
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // 3) If everything ok, send token to client
  const token = signToken(user._id);
  res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
    .end();
  /* res.status(200).json({
    status: 'success',
    token,
  });*/
});
