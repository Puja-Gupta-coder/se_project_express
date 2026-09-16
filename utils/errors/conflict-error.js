const AppError = require("./app-error");
const { CONFLICT_ERROR_CODE } = require("./error-codes");

class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, CONFLICT_ERROR_CODE);
  }
}

module.exports = ConflictError;
