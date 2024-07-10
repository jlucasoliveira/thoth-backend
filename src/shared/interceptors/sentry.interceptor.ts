import {
  CallHandler,
  ExecutionContext,
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
import { redact } from '@/utils/redact';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();

    setUser(request.user);
    setContext('headers', redact(request.headers));
    setContext('payload', redact(request.body));

    return next.handle().pipe(
      tap(() => getCurrentScope().clear()),
      catchError((error) => {
        setExtra('response', redact(error.response));

        const scope = getCurrentScope();

        scope.setFingerprint([
          request.method,
          request.url,
          error.status.toString(),
        ]);

        captureException(error, scope);

        return throwError(() => error);
      }),
    );
  }
}
