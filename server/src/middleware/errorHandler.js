export function errorHandler(err, req, res, _next) {
  console.error('❌ Error:', err.message);

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  const status = err.status || 500;
  const message = err.message || 'Внутренняя ошибка сервера';
  const code = err.code || 'INTERNAL_ERROR';

  res.status(status).json({
    error: message,
    code,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
