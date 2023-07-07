import { Module } from '@nestjs/common';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [SchedulerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
