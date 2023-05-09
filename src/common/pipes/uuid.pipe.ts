import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isUUID } from 'class-validator';

@Injectable()
export class ValidateUUID implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (isUUID(value)) {
      return value;
    }
    throw new BadRequestException('Invalid UUID');
  }
}
