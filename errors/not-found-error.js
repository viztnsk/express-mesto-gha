class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.message = 'Результат не найден';
  }
}

module.exports = NotFoundError;
