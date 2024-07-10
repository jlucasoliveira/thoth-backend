import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import {
  getCurrentScope,
  setContext,
  setExtra,
  setUser,
  captureException,
} from '@sentry/node';
import { catchError, tap, throwError } from 'rxjs';
import { redactObject } from '@/utils/redact';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();

    setUser(request.user);
    setContext('headers', redactObject(request.headers));
    setContext('payload', redactObject(request.body));

    return next.handle().pipe(
      tap(() => getCurrentScope().clear()),
      catchError((error) => {
        setExtra('response', redactObject(error.response));

        const scope = getCurrentScope();

        scope.setFingerprint([
          request.method,
          request.url,
          (error?.status
            ? error.status
            : HttpStatus.INTERNAL_SERVER_ERROR
          ).toString(),
        ]);

        captureException(error, scope);

        return throwError(() => error);
      }),
    );
  }
}
