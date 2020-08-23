const userModel = require('../models/usersModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/*USERS*/
// Filter, only allowed fields can be chosen
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

// Update user's data
exports.updateMe = catchAsync(async (req, res, next) => {
// 1) Create error if user POSTs password data
  if (req.body.password) {
    return next(new AppError('This route is not for password updates.Please use /updateMyPassword.', 400));
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 3) Update user document
  const updatedUser = await userModel.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
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
