const Card = require('../models/cards');
const cardResFormat = require('../utils/utils');
const {
  BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, STATUS_OK,
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла непредвиденная ошибка.' }));
};
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(STATUS_OK).send(cardResFormat(card));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла непредвиденная ошибка.' });
    });
};
const deleteCard = (res, req) => {
  const { _id } = req.params._id;
  Card.findByIdAndRemove(_id)
    .orFail(() => {
      throw new Error('NotValidId');
    })
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.status(STATUS_OK).send(cardResFormat(card));
    })
    .catch((err) => {
      if (err.name === 'NotValidId') {
        res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла непредвиденная ошибка.' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new Error('NotValidId');
    })
    .then((card) => {
      res.status(STATUS_OK).send(cardResFormat(card));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
        return;
      } if (err.message === 'NotValidId') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла непредвиденная ошибка.' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new Error('NotValidId');
    })
    .then((card) => {
      res.status(STATUS_OK).send(cardResFormat(card));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
        return;
      } if (err.message === 'NotValidId') {
        res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Возникла непредвиденная ошибка.' });
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
