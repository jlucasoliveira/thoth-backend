import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadGatewayException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { catchError, throwError } from 'rxjs';

interface DBError extends Error {
  offset: number;
  errorNum: number;
  code: string;
}

@Injectable()
export class DatabaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof QueryFailedError) {
          if ((error as QueryFailedError & DBError).code == 'ORA-02292') {
            error = new BadGatewayException(
              'Erro de integridade. A operação não pode ser finalizada.',
              error,
            );
          }
        }
        return throwError(() => error);
      }),
    );
  }
}
