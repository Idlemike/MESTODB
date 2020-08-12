const userModel = require('../models/usersModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');

/*USERS*/
exports.getAllUsers = catchAsync(async (req, res) => {
  const features = new APIFeatures(userModel.find(), req.query).filter().sort().limitFields()
    .paginate();
  const users = await features.query;
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      data: users,
    },
  });
});

/*USERS ID*/

exports.getUser = catchAsync(async (req, res) => {
  const user = await userModel.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      user,
    },
  });
});

exports.postUser = catchAsync(async (req, res) => {
  // console.log(req.body);
  const user = await userModel.create(req.body);
  res.status(201).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      user: user,
    },
  });
});

exports.patchUser = catchAsync(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      user,
    },
  });
});

exports.patchUserAvatar = catchAsync(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      user,
    },
  });
});
