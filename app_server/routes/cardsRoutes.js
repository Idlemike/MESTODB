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

const router = express.Router();
router.route('/:id/likes').put(likeCard);

router.route('/:id/likes').delete(dislikeCard);

router.route('/last-5').get(aliasLast, getCards);

router.route('/').get(getCards);

router.route('/').post(postCard);

router.route('/:id').delete(deleteCard);

router.route('/:id').get(getCard);

module.exports = router;
