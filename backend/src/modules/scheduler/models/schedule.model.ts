import { ScheduleState } from '@aws-sdk/client-scheduler';
import { Exclude, Expose, Type } from 'class-transformer';
import { ScheduleTarget } from './schedule.target.model';

export class Schedule {
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  Arn: string;

  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  Name: string;

  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  GroupName: string;

  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  State: ScheduleState;

  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  LastModificationDate: Date;

  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  @Type(() => ScheduleTarget)
  Target: ScheduleTarget;

  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  CreationDate: Date;

  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  ScheduleExpressionTimezone: string;

  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  SchedulesExpression: string;

  @Expose()
  get url() {
    return this.Target?.Input?.payload.url;
  }

  @Expose()
  get enabled() {
    return this.State === ScheduleState.ENABLED;
  }

  @Expose()
  get name() {
    return this.Name;
  }
}
