import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResponse } from '../interfaces/api-response.interface';
import { API_RESPONSE_MESSAGE } from '../decorators/api-response.decorator';

interface DataWrapper<T> {
  data?: T;
  metadata?: unknown;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse<Response>();

    const statusCode = response.statusCode;

    const message =
      this.reflector.get<string>(API_RESPONSE_MESSAGE, context.getHandler()) ||
      'Request successful.';

    return next.handle().pipe(
      map((result: T | DataWrapper<T>) => {
        const isWrapper =
          result !== null && typeof result === 'object' && 'data' in result;

        const data: T = isWrapper ? (result.data as T) : (result as T);

        const metadata = isWrapper ? (result.metadata ?? {}) : {};

        let responseMessage = message;

        if (Array.isArray(data) && data.length === 0) {
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
