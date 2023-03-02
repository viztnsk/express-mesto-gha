const User = require('../models/users');
const { userResFormat } = require('../utils/utils');
const {
  BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, STATUS_OK,
} = require('../utils/constants');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(STATUS_OK).send(users))
  .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла непредвиденная ошибка.' }));

const getUserById = (req, res) => User.findById(req.user._id)
  .then(((user) => {
    if (!user) {
      res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      return;
    }
    res.status(STATUS_OK).send(userResFormat(user));
  }))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла непредвиденная ошибка.' });
  });

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(STATUS_OK).send(userResFormat(user));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(BAD_REQUEST).send({ message: 'Возникла непредвиденная ошибка.' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotValidId');
    })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.status(STATUS_OK).send(userResFormat(user));
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла непредвиденная ошибка.' }));
};
const updateAvatar = (req, res) => {
  const avatar = req.body;
  User.findByIdAndUpdate(req.user._id, avatar, { new: true, runValidators: true })
    .populate(['name', 'about'])
    .orFail(() => {
      throw new Error('NotValidId');
    })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
        return;
      }
      res.status(STATUS_OK).send(userResFormat(user));
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла непредвиденная ошибка.' }));
};

module.exports = {
  getUsers, getUserById, createUser, updateUser, updateAvatar,
};
