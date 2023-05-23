const Card = require('../models/card');
const BadRequest = require('../customErrors/BadRequest');
const NotFound = require('../customErrors/NotFound');
const Forbidden = require('../customErrors/Forbidden');

const getCards = (req, res, next) => {
  Card.find()
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { _id } = req.user_id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      res.send(newCard);
    })
    .then((newCard) => {
      res.status(201).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new BadRequest('Не корректные данные');
        next(error);
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;
  const idUser = req.user._id;
  Card.findById(id)
    .then((cardFind) => {
      if (!cardFind) {
        const err = new NotFound('карточка с таким id не найдена');
        next(err);
        return;
      }
      const idOwner = cardFind.owner.toString();
      if (idOwner === idUser) {
        cardFind.deleteOne()
          .then((card) => {
            res.send(card);
          }).catch((err) => {
            next(err);
          });
      } else {
        const err = new Forbidden('нельзя удалить чужую карточку');
        next(err);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new NotFound('Не корректные данные');
        next(error);
      } else {
        next(err);
      }
    });
};

const putDislike = (req, res, next) => {
  const { cardId } = req.params;
  const id = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: id } }, // убрать _id из массива
    { new: true },
  ).populate(['owner'])
    .then((card) => {
      if (card) {
        res.send(card);
        return;
      }
      throw new NotFound('карточка с таким id не найдена');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequest('Карточки с такий id не найденo');
        next(error);
      } else {
        next(err);
      }
    });
};

const putLike = (req, res, next) => {
  const { cardId } = req.params;
  const id = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).populate(['owner'])
    .then((card) => {
      if (card) {
        res.send(card);
        return;
      }
      throw new NotFound('карточка с таким id не найдена');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequest('не корректные данные');
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards, deleteCard, putDislike, putLike, createCard,
};
