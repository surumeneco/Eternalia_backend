// #region Imports
import { HttpStatus } from '@nestjs/common';
// #endregion

// #region AppError Class
/**
 * Application-specific error class.
 * Stores error code, message, affected fields, and implementation details.
 */
export class AppError extends Error {
  readonly code: string;
  readonly fields?: string[];
  readonly details?: any; // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly httpStatus: number;

  constructor(
    code: string,
    message: string,
    httpStatus: number = HttpStatus.BAD_REQUEST,
    fields?: string[],
    details?: any,
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.fields = fields;
    this.details = details;
    this.httpStatus = httpStatus;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
// #endregion

// #region Factory Functions
/**
 * Create an AppError with given parameters.
 */
export function createAppError(
  code: string,
  message: string,
  httpStatus: number = HttpStatus.BAD_REQUEST,
  fields?: string[],
  details?: any,
): AppError {
  return new AppError(code, message, httpStatus, fields, details);
}

/**
 * Create a validation error (400 Bad Request).
 */
export function createValidationError(
  code: string,
  message: string,
  fields?: string[],
  details?: any,
): AppError {
  return new AppError(code, message, HttpStatus.BAD_REQUEST, fields, details);
}

/**
 * Create a not-found error (404).
 */
export function createNotFoundError(
  code: string,
  message: string,
  fields?: string[],
  details?: any,
): AppError {
  return new AppError(code, message, HttpStatus.NOT_FOUND, fields, details);
}

/**
 * Create an internal error (500).
 */
export function createInternalError(
  code: string,
  message: string,
  details?: any,
): AppError {
  return new AppError(
    code,
    message,
    HttpStatus.INTERNAL_SERVER_ERROR,
    undefined,
    details,
  );
}
// #endregion
