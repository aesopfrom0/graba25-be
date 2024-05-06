import { createParamDecorator, ExecutionContext, ParseUUIDPipe } from '@nestjs/common';

export const RequestId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return new ParseUUIDPipe().transform(request.headers['request-id'], { type: 'custom' });
});
