const mongoose = require('mongoose');
const validateURL = require('../utils/validateURL');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name must have a name'],
    minlength: 2,
    maxlength: 30,
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
});

module.exports = mongoose.model('user', userSchema);
