const express = require('express');
const {
  getAllUsers,
  getUser,
  postUser,
  patchUser,
  patchUserAvatar,
  /*  checkID,*/
} = require('../controllers/userController');

const router = express.Router();

router.route('/').get(getAllUsers);

router.route('/:id').get(getUser);

router.route('/').post(postUser);

router.route('/me').patch(patchUser);

router.route('/me/avatar').patch(patchUserAvatar);

module.exports = router;
