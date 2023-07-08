import { ScheduleGroupState } from '@aws-sdk/client-scheduler';
import { Exclude } from 'class-transformer';

export class ScheduleGroup {
  @Exclude({ toPlainOnly: true })
  Arn: string;

  @Exclude({ toPlainOnly: true })
  Name: string;

  @Exclude({ toPlainOnly: true })
  State: ScheduleGroupState;

  @Exclude({ toPlainOnly: true })
  CreationDate: Date;
}
