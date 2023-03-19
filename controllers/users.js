const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { userResFormat } = require('../utils/utils');
const {
  STATUS_OK,
} = require('../utils/constants');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(STATUS_OK).send(users))
  .catch(next);

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then(((user) => {
      res.status(STATUS_OK).send(userResFormat(user));
      console.log(userResFormat(user));
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => res.send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(STATUS_OK).send(userResFormat(user));
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError());
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => {
      res.status(STATUS_OK).send(userResFormat(user));
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};
const updateAvatar = (req, res, next) => {
  const avatar = req.body;
  User.findByIdAndUpdate(req.user._id, avatar, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError();
    })
    .then((user) => {
      res.status(STATUS_OK).send(userResFormat(user));
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  User.findUserByCredentials(req.body.email, req.body.password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.status(STATUS_OK).send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers, getUser, getUserById, createUser, updateUser, updateAvatar, login,
};
