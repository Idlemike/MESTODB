const express = require('express');
const { celebrate, Joi } = require('celebrate');
const joiObjectId = require('joi-objectid');
const {
  getAllUsers,
  getUser,
  patchUser,
  patchUserAvatar,
} = require('../controllers/userController');

const router = express.Router();
Joi.objectId = joiObjectId(Joi);

router.route('/').get(getAllUsers);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.objectId(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    about: Joi.string().required(),
  }),
}), patchUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), patchUserAvatar);

module.exports = router;
