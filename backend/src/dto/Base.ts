import { REQUEST_CONTEXT } from '@tokens';
import { Expose } from 'class-transformer';

export class BaseDto {
  @Expose()
  [REQUEST_CONTEXT]: RequestContext;
}
