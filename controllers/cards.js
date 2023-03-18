/* eslint-disable no-shadow */
const Card = require('../models/cards');
const { cardResFormat } = require('../utils/utils');
const {
  STATUS_OK,
} = require('../utils/constants');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
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
        next(new BadRequestError());
      }
      next(err);
    });
};
const deleteCard = (res, req, next) => {
  const { _id } = req.params.cardId;
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
      throw new ForbiddenError();
    })
    .catch((err) => {
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
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
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
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
        next(new BadRequestError());
      } else {
        next();
      }
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
