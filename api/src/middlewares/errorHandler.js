const jsonErrorHandler = (err, req, res, next) => {
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => error.message);
    return res.status(400).json({ message: errors.join(', ') });
  }
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Некоректні дані' });
  }
  next(err);
};

module.exports = jsonErrorHandler;