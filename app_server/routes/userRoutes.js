const express = require('express');
const {
  getAllUsers,
} = require('../controllers/userController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(auth.protect, getAllUsers);

module.exports = router;
