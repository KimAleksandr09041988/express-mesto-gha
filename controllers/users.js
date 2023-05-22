const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../customErrors/BadRequest');
const NotFound = require('../customErrors/NotFound');
const RepeatsEmailError = require('../customErrors/RepeatsEmailError');

const { NODE_ENV, JWT_SECRET } = process.env;

const checkUserId = (user, res) => {
  if (user) {
    return res.send(user).status(200);
  }
  throw new NotFound('пользователь не найден');
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      const userNoPassword = user.toObject();
      delete userNoPassword.password;
      res.send(userNoPassword).status(201);
    })
    .catch((err) => {
      if (err.code === 11000) {
        const error = new RepeatsEmailError('Пользователь с таким email зарегистрирован');
        next(error);
      } else {
        const error = new BadRequest('не корректные данные');
        next(error);
      }
      next(err);
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => checkUserId(user, res))
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new BadRequest('Некорректный id');
        next(error);
      } else {
        next(err);
      }
    });
};

const editProfile = (req, res, next) => {
  const owner = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    owner,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => checkUserId(user, res))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const erros = new BadRequest('Некорректный данные');
        next(erros);
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const owner = req.user._id;
  const avatar = req.body;

  User.findByIdAndUpdate(owner, avatar, { new: true, runValidators: true })
    .then((user) => checkUserId(user, res))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const erros = new BadRequest('Некорректный данные');
        next(erros);
      } else {
        next(err);
      }
    });
};

const dataUser = (req, res, next) => {
  const { userId } = req.user._id;
  User.findById({ userId })
    .then((user) => checkUserId(user, res))
    .catch(next);
};

const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  getUsers, createUser, getUserById, editProfile, updateAvatar, login, dataUser,
};
