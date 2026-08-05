const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  console.error(err.stack);
  
  const message = status >= 500 && process.env.NODE_ENV === 'production'
    ? 'Internal Server Error'
    : err.message || 'Internal Server Error';

  res.status(status).json({ message });
};

module.exports = errorHandler;
