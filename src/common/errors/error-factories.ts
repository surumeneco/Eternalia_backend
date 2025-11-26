// #region Imports
import { HttpStatus } from '@nestjs/common';
import { AppError } from './app-errors';
import { ErrorCodeManager } from './error-code-manager';
// #endregion

const errorCodeManager = ErrorCodeManager.getInstance();

// #region Error Factories
/**
 * Factory functions for creating domain-specific errors with proper code formatting.
 * Centralizes error creation logic and ensures consistent error handling across services.
 */

/**
 * Create a NOT_FOUND error.
 * Example: throwNotFound('TIP', 'category', ['category'])
 */
export function throwNotFound(
  domain: string,
  itemName: string,
  fields?: string[],
  details?: any,
): never {
  const code = errorCodeManager.getFullErrorCode(domain, '001');
  const message = errorCodeManager.getMessage('001', itemName);
  throw new AppError(code, message, HttpStatus.NOT_FOUND, fields, details);
}

/**
 * Create an INVALID_FIELD error.
 * Example: throwInvalidField('TIP', 'category', ['category'])
 */
export function throwInvalidField(
  domain: string,
  fieldName: string,
  fields?: string[],
  details?: any,
): never {
  const code = errorCodeManager.getFullErrorCode(domain, '002');
  const message = errorCodeManager.getMessage('002', fieldName);
  throw new AppError(
    code,
    message,
    HttpStatus.BAD_REQUEST,
    fields || [fieldName],
    details,
  );
}

/**
 * Create a REQUIRED_FIELD error.
 * Example: throwRequiredField('TIP', 'category', ['category'])
 */
export function throwRequiredField(
  domain: string,
  fieldName: string,
  fields?: string[],
  details?: any,
): never {
  const code = errorCodeManager.getFullErrorCode(domain, '003');
  const message = errorCodeManager.getMessage('003', fieldName);
  throw new AppError(
    code,
    message,
    HttpStatus.BAD_REQUEST,
    fields || [fieldName],
    details,
  );
}

/**
 * Create an INVALID_FORMAT error.
 * Example: throwInvalidFormat('TIP', 'publicationDateTime', ['publicationDateTime'])
 */
export function throwInvalidFormat(
  domain: string,
  fieldName: string,
  fields?: string[],
  details?: any,
): never {
  const code = errorCodeManager.getFullErrorCode(domain, '004');
  const message = errorCodeManager.getMessage('004', fieldName);
  throw new AppError(
    code,
    message,
    HttpStatus.BAD_REQUEST,
    fields || [fieldName],
    details,
  );
}

/**
 * Create an INVALID_DATE_RANGE error.
 * Example: throwInvalidDateRange('TIP', ['publicationDateTime'])
 */
export function throwInvalidDateRange(
  domain: string,
  fields?: string[],
  details?: any,
): never {
  const code = errorCodeManager.getFullErrorCode(domain, '005');
  const message = errorCodeManager.getMessage('005');
  throw new AppError(code, message, HttpStatus.BAD_REQUEST, fields, details);
}

/**
 * Create an INVALID_PARAMETER error.
 * Example: throwInvalidParameter('TIP', 'filter', ['filter'])
 */
export function throwInvalidParameter(
  domain: string,
  paramName: string,
  fields?: string[],
  details?: any,
): never {
  const code = errorCodeManager.getFullErrorCode(domain, '006');
  const message = errorCodeManager.getMessage('006', paramName);
  throw new AppError(
    code,
    message,
    HttpStatus.BAD_REQUEST,
    fields || [paramName],
    details,
  );
}

/**
 * Create an ALREADY_EXISTS error.
 * Example: throwAlreadyExists('TIP', 'category', ['category'])
 */
export function throwAlreadyExists(
  domain: string,
  itemName: string,
  fields?: string[],
  details?: any,
): never {
  const code = errorCodeManager.getFullErrorCode(domain, '007');
  const message = errorCodeManager.getMessage('007', itemName);
  throw new AppError(code, message, HttpStatus.CONFLICT, fields, details);
}

/**
 * Create an OPERATION_FAILED error.
 * Example: throwOperationFailed('TIP', 'category registration', ['category'])
 */
export function throwOperationFailed(
  domain: string,
  operation: string,
  fields?: string[],
  details?: any,
): never {
  const code = errorCodeManager.getFullErrorCode(domain, '008');
  const message = errorCodeManager.getMessage('008', operation);
  throw new AppError(
    code,
    message,
    HttpStatus.INTERNAL_SERVER_ERROR,
    fields,
    details,
  );
}

/**
 * Create a custom error with full control.
 * Example: throwCustomError('TIP', '009', 'Custom message', 404, ['field'])
 */
export function throwCustomError(
  domain: string,
  errorCode: string,
  message: string,
  httpStatus: number = HttpStatus.BAD_REQUEST,
  fields?: string[],
  details?: any,
): never {
  const code = errorCodeManager.getFullErrorCode(domain, errorCode);
  throw new AppError(code, message, httpStatus, fields, details);
}

// #endregion

// #region Validation Errors (Generic - not domain-specific)
/**
 * Create a validation error with field information.
 * Example: throwValidationError('category', '002', ['category'])
 */
export function throwValidationError(
  fieldName: string,
  errorCode: string = '002',
  fields?: string[],
  details?: any,
): never {
  const code = errorCodeManager.getFullErrorCode('GENERAL', errorCode);
  const message = errorCodeManager.getMessage(errorCode, fieldName);
  throw new AppError(
    code,
    message,
    HttpStatus.BAD_REQUEST,
    fields || [fieldName],
    details,
  );
}
// #endregion
