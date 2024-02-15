export const ErrorMiddleware = (err, req, res, next) => {
  err.messsage = err.message || "Internal Server Error";

  return res.status(500).json({
    success: false,
    message: err.message,
  });
};
