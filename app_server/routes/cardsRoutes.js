const express = require('express');
const { celebrate, Joi } = require('celebrate');
const joiObjectId = require('joi-objectid');
const {
  aliasLast,
  getCards,
  getCard,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cardsController');
const auth = require('../middlewares/auth');

const router = express.Router();
Joi.objectId = joiObjectId(Joi);

router.route('/last-5').get(aliasLast, getCards);

router.route('/').get(getCards);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.objectId(),
  }),
}), getCard);

router.put('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.objectId(),
  }),
}), likeCard);

router.delete('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.objectId(),
  }),
}), dislikeCard);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(new RegExp('^(https?|HTTPS?):\\/\\/(www.|WWW.)?((([a-zA-Z0-9-]{1,63}\\.){1,256}[a-zA-Z]{2,6})|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d{2,5})?([-a-zA-Z0-9_\\/.]{0,256}#?)?$')),
  }),
}), postCard);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.objectId(),
  }),
}), auth.restrictTo, deleteCard);

module.exports = router;
