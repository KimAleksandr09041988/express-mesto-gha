const cardRouter = require('express').Router();
const {
  getCards, deleteCard, putDislike, putLike, createCard,
} = require('../controllers/cards');

cardRouter.get(getCards);

cardRouter.post(createCard);

cardRouter.delete('/cards/:cardId', deleteCard);

cardRouter.put('/cards/:cardId/likes', putLike);

cardRouter.delete('/cards/:cardId/likes', putDislike);

module.exports = cardRouter;
