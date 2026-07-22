const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  console.error(err.stack);
  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
