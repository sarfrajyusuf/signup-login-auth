const ErrorHandler = (err, req, res, next) => {
  if (err) {
    return res.status(500).send({
      status: 500,
      message: "internal server error",
    });
  } else {
    return next();
  }
};
module.exports = ErrorHandler;
