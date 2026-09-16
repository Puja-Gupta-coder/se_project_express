const errorCodes = require("./errors/error-codes");
const AppError = require("./errors/app-error");
const BadRequestError = require("./errors/bad-request-error");
const UnauthorizedError = require("./errors/unauthorized-error");
const ConflictError = require("./errors/conflict-error");
const ForbiddenError = require("./errors/forbidden-error");
const NotFoundError = require("./errors/not-found-error");

module.exports = {
  ...errorCodes,
  AppError,
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
};
