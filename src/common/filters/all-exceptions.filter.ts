// #region Imports
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { AppError } from '../errors/app-errors';
// #endregion

interface ErrorItem {
  code: string;
  message: string;
  fields?: string[];
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const requestId = response.locals?.requestId || 'unknown';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    const errorArray: ErrorItem[] = [];
    let details: any = null;

    // Handle AppError
    if (exception instanceof AppError) {
      status = exception.httpStatus;
      message = exception.message;
      errorArray.push({
        code: exception.code,
        message: exception.message,
        fields: exception.fields,
      });
      details = exception.details;
    }
    // Handle HttpException (including BadRequestException for validation)
    else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resp = exception.getResponse();

      if (typeof resp === 'string') {
        message = resp;
        errorArray.push({ code: 'HTTP_EXCEPTION', message: resp });
      } else if (typeof resp === 'object' && resp !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r: any = resp;
        message = r.message ?? exception.message;

        // Handle validation errors from class-validator (BadRequestException)
        if (Array.isArray(r.message)) {
          // ValidationPipe returns { message: [...] }
          // Transform to our error array format
          r.message.forEach((errMsg: any) => {
            const fieldName = errMsg.property || 'unknown';
            const constraints = errMsg.constraints || {};
            const constraintMessages = Object.values(constraints).join('; ');
            errorArray.push({
              code: 'ET-VALIDATION-9000',
              message: constraintMessages || 'Invalid field',
              fields: [fieldName],
            });
          });
        } else {
          // Single error message from HttpException
          errorArray.push({
            code: 'HTTP_EXCEPTION',
            message: message,
          });
        }
        details = r;
      }
    }
    // Handle generic Error
    else if (exception instanceof Error) {
      message = exception.message;
      errorArray.push({
        code: 'INTERNAL_ERROR',
        message: exception.message,
      });
      details = { name: exception.name };
    }

    // Ensure error array is not empty
    if (errorArray.length === 0) {
      errorArray.push({
        code: 'UNKNOWN_ERROR',
        message,
      });
    }

    // Log the error with requestId and details
    this.logger.error(
      `[${requestId}] Exception caught: ${message}`,
      {
        status,
        requestId,
        method: request?.method,
        path: request?.path,
        errorCodes: errorArray.map((e) => e.code),
        details,
      },
      exception instanceof Error ? exception.stack : '',
    );

    // Build response payload
    const payload = {
      status: 'error',
      message,
      code: status,
      error: errorArray,
      meta: {
        requestId,
      },
    };

    response.status(status).json(payload);
  }
}
// #endregion
