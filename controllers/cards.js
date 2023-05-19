const Card = require('../models/card');
const {
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/constanst');

const checkCardId = (card, res) => {
  if (card) {
    return res.send(card);
  }
  return res.status(NOT_FOUND).send({ message: 'Карточки с таким id не существует' });
};

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Что-то пошло не так на сервере' });
    });
};

const createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      res.send(newCard);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(NOT_FOUND).send({
          message: 'Данные переданы некорретно.',

        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Что-то пошло не так на сервере' });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.deleteOne({ _id: cardId })
    .then((card) => {
      if (card.deletedCount === 0) {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Карточки с таким id не существует' });
      }
      return res.send({ message: 'Карточка удалена' });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(NOT_FOUND).send({ message: 'Такого id не существует' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Что-то пошло не так на сервере' });
    });
};

const putDislike = (req, res) => {
  const owner = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: owner } },
    { new: true, runValidators: true },
  )
    .then((card) => checkCardId(card, res))
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(NOT_FOUND).send({ message: 'Некорректный _id' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Что-то пошло не так на сервере' });
    });
};

const putLike = (req, res) => {
  const owner = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: owner } },
    { new: true, runValidators: true },
  )
    .then((card) => checkCardId(card, res))
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(NOT_FOUND).send({ message: 'Такого id не существует' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Что-то пошло не так на сервере' });
    });
};

module.exports = {
  getCards, deleteCard, putDislike, putLike, createCard,
};
