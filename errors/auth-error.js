class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.message = 'Требуется авторизация';
  }
}

module.exports = UnauthorizedError;
