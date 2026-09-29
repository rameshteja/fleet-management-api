import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResponse } from '../interfaces/api-response.interface';
import { API_RESPONSE_MESSAGE } from '../decorators/api-response.decorator';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
  ) { }

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const response =
      context.switchToHttp().getResponse();

    const statusCode = response.statusCode;

    const message =
      this.reflector.get<string>(
        API_RESPONSE_MESSAGE,
        context.getHandler(),
      ) || 'Request successful.';

    return next.handle().pipe(
      map((result: any) => {
        const data = result?.data ?? result;

        const metadata = result?.metadata ?? {};

        let responseMessage = message;

        if (
          Array.isArray(data) &&
          data.length === 0
        ) {
          responseMessage = 'No records found.';
        }

        return {
          success: true,
          message: responseMessage,
          statusCode,
          data,
          metadata,
        };
      }),
    );
  }
}