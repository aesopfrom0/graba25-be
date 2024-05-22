import { ErrorCode } from '@graba25-be/shared/exceptions/error-code';

export class CommonResponseDto<T> {
  body?: T;
  meta!: {
    responseCode: number;
    message?: string;
    timestamp: number;
  };
  error?: {
    message: string;
    errorCode: ErrorCode;
    timestamp: number;
    trackingEventId: string;
  };
}
