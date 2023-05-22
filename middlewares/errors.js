/* eslint-disable no-useless-escape */
// eslint-disable-next-line import/no-extraneous-dependencies
const { Joi, celebrate } = require('celebrate');
const { regularAvatar, regularLink } = require('../utils/constanst');

module.exports.handleErrors = (err, _, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Проблема на сервере, что-то сломалось :('
      : message,
  });
  next();
};

module.exports.validateSignup = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regularAvatar),
    about: Joi.string().min(2).max(30),
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validateIds = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

module.exports.validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.validateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regularAvatar),
  }),
});

// CARDS

module.exports.validateCardIds = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
});

module.exports.validateCardForm = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).pattern(regularLink),
  }).unknown(true),
});
