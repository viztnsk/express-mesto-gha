const { celebrate, Joi } = require('celebrate');
const { LINK_EXP } = require('../utils/utils');

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const registerValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(LINK_EXP),
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(LINK_EXP),
  }),
});

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(LINK_EXP),
  }),
});

const userIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
});
const cardIdValidation = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
});

module.exports = {
  loginValidation,
  registerValidation,
  updateUserValidation,
  updateAvatarValidation,
  createCardValidation,
  userIdValidation,
  cardIdValidation,
};
