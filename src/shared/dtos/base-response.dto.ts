export class BaseResponseDto<T> {
  ok!: boolean;
  body?: T;
  error?: any;
}
