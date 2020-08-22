const express = require('express');
const {
  getAllUsers,
  getUser,
  patchUser,
  patchUserAvatar,
  /*  checkID,*/
} = require('../controllers/userController');
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.post('/signin', authController.login);

router.route('/').get(auth.protect, getAllUsers);

router.route('/:id').get(auth.protect, getUser);

router.route('/me').patch(auth.protect, patchUser);

router.route('/me/avatar').patch(auth.protect, patchUserAvatar);

module.exports = router;
