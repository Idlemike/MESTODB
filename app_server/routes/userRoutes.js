const express = require('express');
const {
  getAllUsers,
  getUser,
  patchUser,
  patchUserAvatar,
  updateMe,
  deleteMe,
  /*  checkID,*/
} = require('../controllers/userController');
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.route('/').get(auth.protect, getAllUsers);
router.route('/:id').get(auth.protect, getUser);

router.route('/me').patch(auth.protect, patchUser);
router.route('/me/avatar').patch(auth.protect, patchUserAvatar);

router.route('/updateMyPassword').patch(auth.protect, authController.updatePassword);

router.route('/updateMe').patch(auth.protect, updateMe);
router.route('/deleteMe').delete(auth.protect, deleteMe);

module.exports = router;
