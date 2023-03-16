/* eslint-disable no-shadow */
const Card = require('../models/cards');
const cardResFormat = require('../utils/utils');
const {
  STATUS_OK,
} = require('../utils/constants');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/auth-error');

const getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(STATUS_OK).send(cards))
    .catch(next);
};
const createCard = (req, res, next) => {
  Card.create({ name: req.body.name, link: req.body.link, owner: req.user._id })
    .then((card) => {
      res.status(STATUS_OK).send(cardResFormat(card));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError();
      }
      next();
    });
};
const deleteCard = (res, req, next) => {
  const { _id } = req.params._id;
  Card.findById(_id)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((card) => {
      const currentUser = req.user._id;
      const cardOwner = card.owner._id.toString();
      if (cardOwner === currentUser) {
        return Card.findByIdAndRemove(req.params._id).then((card) => {
          res.status(STATUS_OK).send(cardResFormat(card));
        });
      }
      throw new UnauthorizedError();
    })
    .catch(() => {
      next();
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((card) => {
      res.status(STATUS_OK).send(cardResFormat(card));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError();
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
      throw new NotFoundError();
    })
    .then((card) => {
      res.status(STATUS_OK).send(cardResFormat(card));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError();
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
