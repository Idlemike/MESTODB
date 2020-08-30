const mongoose = require('mongoose');
// const userModel = require('./usersModel');
const validateURL = require('../utils/validateURL');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A card must have a name'],
    maxlength: [30, 'A tour name must have less or equal then 30 characters'],
    minlength: [2, 'A tour name must have more or equal then 2 characters'],
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'An owner is required'],
  },
  link: {
    type: String,
    trim: true,
    lowercase: true,
    validate: [validateURL, (props) => `${props.value} is not a valid url`],
    required: [true, 'A link is necessary'],
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// QUERY MIDDLEWARE
cardSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});
cardSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'owner',
    select: '-__v -passwordChangedAt',
  }).populate({
    path: 'likes',
    select: 'name',
  });
  next();
});
cardSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  // console.log(docs);
  next();
});

module.exports = mongoose.model('card', cardSchema);
