const { INTERNAL_SERVER_ERROR_CODE } = require("../utils/errors");

module.exports = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || INTERNAL_SERVER_ERROR_CODE;
  const message =
    statusCode === INTERNAL_SERVER_ERROR_CODE
      ? "An error has occurred on the server"
      : err.message || "An error has occurred on the server";

  res.status(statusCode).send({ message });
};
