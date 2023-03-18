const NotFoundError = require('../errors/not-found-error');
const { INTERNAL_SERVER_ERROR } = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;
  res.status(statusCode).send({
    message: statusCode === INTERNAL_SERVER_ERROR
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
};

const wrongRouteHandler = (req, res, next) => {
  next(new NotFoundError('page'));
};

module.exports = { errorHandler, wrongRouteHandler };
