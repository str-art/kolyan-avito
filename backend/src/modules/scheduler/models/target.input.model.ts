import { Exclude, Expose } from 'class-transformer';

export class TargetInput {
  @Expose({ toClassOnly: true })
  @Exclude({ toPlainOnly: true })
  payload: SchedulePayload;
}
