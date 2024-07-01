import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseBooleanPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        const booleanString = Reflect.getMetadata(
          'isBooleanString',
          metadata.metatype?.prototype,
          key,
        );
        if (booleanString) {
          if (value[key] === '1' || value[key] === 'true') value[key] = true;
          if (value[key] === '0' || value[key] === 'false') value[key] = false;
        }
      }
    }
    return value;
  }
}
