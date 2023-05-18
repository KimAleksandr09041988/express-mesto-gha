const User = require('../models/user');

const checkUserId = (user, res) => {
  if (user) {
    return res.send(user);
  }
  return res
    .status(404)
    .send({ message: 'Такого id не существует' });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Что-то пошло не так на сервере' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => {
      res
        .status(201)
        .send(newUser);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Данные переданы некорретно.',
        });
      }
      return res
        .status(500)
        .send({ message: 'Что-то пошло не так на сервере' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => checkUserId(user, res))
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(400).send({ message: 'Такого id не существует' });
      }
      return res
        .status(500)
        .send({ message: 'Что-то пошло не так на сервере' });
    });
};

const editProfile = (req, res) => {
  const owner = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    owner,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => checkUserId(user, res))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Данные переданы некорретно.',
        });
      }
      return res
        .status(500)
        .send({ message: 'Что-то пошло не так на сервере' });
    });
};

const updateAvatar = (req, res) => {
  const owner = req.user._id;
  const avatar = req.body;

  User.findByIdAndUpdate(owner, avatar, { new: true, runValidators: true })
    .then((user) => checkUserId(user, res))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Данные переданы некорретно.',
        });
      }
      return res
        .status(500)
        .send({ message: 'Что-то пошло не так на сервере' });
    });
};

module.exports = {
  getUsers, createUser, getUserById, editProfile, updateAvatar,
};
