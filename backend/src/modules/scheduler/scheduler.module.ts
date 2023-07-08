import { AwsModule } from '@modules/aws/aws.module';
import { Module } from '@nestjs/common';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { SchedulerInterceptor } from './scheduler.interceptor';
import { AuthModule } from '@modules/auth/auth.module';
import { IsNameNotTaken } from './validators/is.name.taken';

@Module({
  imports: [AwsModule, AuthModule],
  controllers: [SchedulerController],
  providers: [SchedulerService, SchedulerInterceptor, IsNameNotTaken],
})
export class SchedulerModule {}
