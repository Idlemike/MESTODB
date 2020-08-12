//const path = require('path');
const userModel = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
/*USERS*/
exports.getAllUsers = catchAsync(async (req, res) => {
  const allUsersSchedule = await userModel.find();
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: allUsersSchedule.length,
    data: {
      allUsersSchedule,
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
  const newUser = await userModel.create(req.body);
  res.status(201).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      user: newUser,
    },
  });
});

exports.patchUser = catchAsync(async (req, res) => {
  const newUser = await userModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      newUser,
    },
  });
});

exports.patchUserAvatar = catchAsync(async (req, res) => {
  const newUser = await userModel.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      newUser,
    },
  });
});
