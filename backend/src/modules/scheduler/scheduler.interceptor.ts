import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { SchedulerService } from '@modules/scheduler/scheduler.service';
import { Request } from 'express';

@Injectable()
export class SchedulerInterceptor implements NestInterceptor {
  constructor(private schedulerService: SchedulerService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const { userId, chatId } = request;
    const user = {
      id: userId,
      chatId,
    };
    await this.checkForGroup(user);

    request.schedules = await this.schedulerService.listSchedules(user);
    return next.handle();
  }

  private async checkForGroup(user: User) {
    const group = await this.schedulerService.getScheduleGroup(user);
    if (!group) {
      await this.schedulerService.createGroup(user);
    }
  }
}
