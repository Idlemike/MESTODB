const express = require('express');
const {
  aliasLast,
  getCards,
} = require('../controllers/cardsController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.route('/last-5').get(auth.protect, aliasLast, getCards);

router.route('/').get(auth.protect, getCards);

module.exports = router;
