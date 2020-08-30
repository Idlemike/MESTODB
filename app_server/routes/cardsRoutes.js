const express = require('express');
const {
  aliasLast,
  getCards,
  postCard,
  deleteCard,
  likeCard,
  getCard,
  dislikeCard,
} = require('../controllers/cardsController');
const auth = require('../middlewares/auth');

const router = express.Router();
router.route('/:id/likes').put(auth.protect, likeCard);

router.route('/:id/likes').delete(auth.protect, dislikeCard);

router.route('/last-5').get(auth.protect, aliasLast, getCards);

router.route('/').get(auth.protect, getCards);

router.route('/').post(auth.protect, postCard);

router.route('/:id').delete(auth.protect,
  auth.restrictTo, deleteCard);

router.route('/:id').get(auth.protect, getCard);

module.exports = router;
