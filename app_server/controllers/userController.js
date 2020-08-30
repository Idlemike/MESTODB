const userModel = require('../models/usersModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/*USERS*/
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(userModel.find(), req.query).filter().sort().limitFields()
    .paginate();
  const users = await features.query;
  res.status(200).json({
    status: 'success',
    data: {
      data: users,
    },
    results: users.length,
  });
});

/*USERS ID*/

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.patchUser = catchAsync(async (req, res, next) => {
  const { name, about } = req.body;
  const user = await userModel.findByIdAndUpdate(req.user._id, { name: name, about: about }, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.patchUserAvatar = catchAsync(async (req, res, next) => {
  const { avatar } = req.body;
  const user = await userModel.findByIdAndUpdate(req.user._id, { avatar: avatar }, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
