const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../customErrors/BadRequest');
const NotFound = require('../customErrors/NotFound');
const RepeatsEmailError = require('../customErrors/RepeatsEmailError');
const Unauthorized = require('../customErrors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

const checkUser = (user, res) => {
  if (user) {
    return res.send(user).status(200);
  }
  throw new NotFound('пользователь не найден');
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }).status(200))
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
    .then((user) => checkUser(user, res))
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
    .then((user) => checkUser(user, res))
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
    .then((user) => checkUser(user, res))
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
    .then((user) => checkUser(user, res))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
      }
      bcrypt.compare(password, user.password)
        // eslint-disable-next-line consistent-return
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
            { expiresIn: '7d' },
          );
          res.send({ token });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers, createUser, getUserById, editProfile, updateAvatar, login, dataUser,
};
