const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const validateURL = require('../utils/validateURL');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name must have a name'],
    minlength: [2, 'Please provide a name'],
    maxlength: [30, 'Please provide a name'],
  },
  about: {
    type: String,
    required: [true, ' A description is necessary'],
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    trim: true,
    lowercase: true,
    validate: [validateURL, (props) => `${props.value} is not a valid url`],
    required: [true, 'An avatar is necessary'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Please provide a password'],
    select: false,
  },
  passwordChangedAt: Date,
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
