const AppError = require("./app-error");
const { BAD_REQUEST_ERROR_CODE } = require("./error-codes");

class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, BAD_REQUEST_ERROR_CODE);
  }
}

module.exports = BadRequestError;
