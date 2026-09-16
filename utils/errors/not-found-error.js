const AppError = require("./app-error");
const { NOT_FOUND_ERROR_CODE } = require("./error-codes");

class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, NOT_FOUND_ERROR_CODE);
  }
}

module.exports = NotFoundError;
