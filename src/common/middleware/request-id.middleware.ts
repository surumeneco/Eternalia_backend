// #region Imports
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
// #endregion

// #region Request ID Middleware
/**
 * Middleware to generate and attach a unique requestId to each incoming request.
 * Stores requestId in res.locals for use in handlers/filters/interceptors.
 * Sets X-Request-Id header in response.
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestIdMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = uuidv4();
    res.locals.requestId = requestId;

    // Set response header
    res.setHeader('X-Request-Id', requestId);

    // TODO: Optionally log request details here for tracing
    // this.logger.debug(`[${requestId}] ${req.method} ${req.path}`);

    next();
  }
}
// #endregion
