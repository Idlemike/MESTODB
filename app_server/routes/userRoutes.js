const express = require('express');
const {
  getAllUsers,
/*  getUser,
  patchUser,
  patchUserAvatar,
  /!*  checkID,*!/*/
} = require('../controllers/userController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(auth.protect, getAllUsers);

/*router.route('/:id').get(auth.protect, getUser);

router.route('/me').patch(auth.protect, patchUser);

router.route('/me/avatar').patch(auth.protect, patchUserAvatar);*/

module.exports = router;
