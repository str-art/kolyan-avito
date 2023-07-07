import { Exclude, Expose, Transform, plainToClass } from 'class-transformer';
import { TargetInput } from './target.input.model';

export class ScheduleTarget {
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  Arn: string;

  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const input = JSON.parse(value);
      return plainToClass(TargetInput, input);
    }
    return plainToClass(TargetInput, value);
  })
  Input: TargetInput;

  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  RoleArn: string;
}
