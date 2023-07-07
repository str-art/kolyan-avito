import { Scheduler } from '@aws-sdk/client-scheduler';
import { Config } from '@modules/config/config.service';
import { Provider } from '@nestjs/common';
import { SCHEDULER } from '@/constants/tokens';

export const awsSdkProviders: Provider[] = [
  {
    provide: Scheduler,
    useFactory: () => new Scheduler(Config[SCHEDULER]),
  },
];
