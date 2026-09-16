const AppError = require("./app-error");
const { UNAUTHORIZED_ERROR_CODE } = require("./error-codes");

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, UNAUTHORIZED_ERROR_CODE);
  }
}

module.exports = UnauthorizedError;
