const cardRouter = require('express').Router();
const {
  getCards, deleteCard, putDislike, putLike, createCard,
} = require('../controllers/cards');
const { validateCardForm, validateCardIds } = require('../middlewares/errors');

cardRouter.get('/', getCards);
cardRouter.post('/', validateCardForm, createCard);
cardRouter.delete('/:cardId', validateCardIds, deleteCard);
cardRouter.put('/:cardId/likes', validateCardIds, putLike);
cardRouter.delete('/:cardId/likes', validateCardIds, putDislike);

module.exports = cardRouter;
