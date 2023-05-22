const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../utils/constanst');

const checkUserId = (user, res) => {
  if (user) {
    return res.send(user);
  }
  return res
    .status(NOT_FOUND)
    .send({ message: 'Такого id не существует' });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Что-то пошло не так на сервере' });
    });
};

const createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(CREATED).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Данные переданы некорретно.',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Что-то пошло не так на сервере' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => checkUserId(user, res))
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Такого id не существует' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
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
        return res.status(BAD_REQUEST).send({
          message: 'Данные переданы некорретно.',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
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
        return res.status(BAD_REQUEST).send({
          message: 'Данные переданы некорретно.',
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Что-то пошло не так на сервере' });
    });
};

const me = (req, res) => {
  const { userId } = req.params;
  User.findOne({ userId })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Такого id не существует' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Что-то пошло не так на сервере' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  getUsers, createUser, getUserById, editProfile, updateAvatar, login, me,

};
