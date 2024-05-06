import { CommonResponseDto } from '@graba25-be/shared/dtos/common-response.dto';
import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          body: data,
          meta: {
            responseCode: 0,
            timestamp: Date.now(),
          },
        } as CommonResponseDto<typeof data>;
      }),
    );
  }
}
