const AppError = require("./app-error");
const { FORBIDDEN_ERROR_CODE } = require("./error-codes");

class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, FORBIDDEN_ERROR_CODE);
  }
}

module.exports = ForbiddenError;
