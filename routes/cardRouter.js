const cardRouter = require('express').Router();
const {
  getCards, deleteCard, putDislike, putLike, createCard,
} = require('../controllers/cards');

cardRouter.get(getCards);

cardRouter.post(createCard);

cardRouter.delete('/:cardId', deleteCard);

cardRouter.put('/:cardId/likes', putLike);

cardRouter.delete('/:cardId/likes', putDislike);

module.exports = cardRouter;
