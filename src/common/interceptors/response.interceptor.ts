import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        // If already an envelope, do not double-wrap
        if (
          data &&
          typeof data === 'object' &&
          (data.status === 'success' || data.status === 'error')
        ) {
          return data;
        }

        const statusCode = response?.statusCode ?? 200;

        // TODO: attach requestId or timing info to meta if needed
        return {
          status: 'success',
          code: statusCode,
          data: data === undefined ? null : data,
          meta: {},
        };
      }),
    );
  }
}
