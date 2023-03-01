const User = require('../models/users');
const { userResFormat } = require('../utils/utils');
const {
  BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, STATUS_OK,
} = require('../utils/constants');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(STATUS_OK).send(users))
  .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: err.message }));

const getUserById = (req, res) => User.findById(req.user._id)
  .then(((user) => {
    if (!user) {
      res.status(NOT_FOUND).send('Пользователь по указанному _id не найден.');
      return;
    }
    res.status(STATUS_OK).send(userResFormat(user));
  }))
  .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: err.message }));

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(STATUS_OK).send(userResFormat(user));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send('Переданы некорректные данные при создании карточки.');
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
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
        res.status(NOT_FOUND).send('Пользователь с указанным _id не найден.');
        return;
      }
      res.status(STATUS_OK).send(userResFormat(user));
    })
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: err.message }));
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
        res.status(NOT_FOUND).send('Пользователь с указанным _id не найден.');
        return;
      }
      res.status(STATUS_OK).send(userResFormat(user));
    })
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: err.message }));
};

module.exports = {
  getUsers, getUserById, createUser, updateUser, updateAvatar,
};
