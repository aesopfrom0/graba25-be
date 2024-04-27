import { Logger } from '@nestjs/common';

export class CustomLogger extends Logger {
  log(message: any, context?: string) {
    const customMessage = `${message}`;
    context ? super.log(customMessage, context) : super.log(customMessage);
  }

  error(message: any, trace?: string) {
    const customMessage = ` ${message}`;
    super.error(customMessage, trace);
  }

  debug(message: any) {
    const customMessage = `${message}`;
    super.debug(customMessage);
  }
}
