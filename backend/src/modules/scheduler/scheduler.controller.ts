import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SchedulerService } from '@modules/scheduler/scheduler.service';
import { User } from '@/decorators/User';
import { SchedulerInterceptor } from './scheduler.interceptor';
import { AuthGuard } from '@modules/auth/auth.guard';
import { CreateScheduleDto, ToggleScheduleDto } from '@/dto/Schedule';
import { InjectContextToBody } from '@/decorators/InjectContextToValidators';
import { Schedule } from './models/schedule.model';
import { ScheduleState } from '@aws-sdk/client-scheduler';
import { FindSchedule } from '@/decorators/Schedule';
import { Schedules } from '@/decorators/Schedules';

const SCHEDULE_NAME_PARAM = 'name';
const SCHEDULE_NAME_PARAM_BIND = `:${SCHEDULE_NAME_PARAM}`;

@UseInterceptors(SchedulerInterceptor)
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@UsePipes(
  new ValidationPipe({
    enableDebugMessages: true,
    transform: true,
    whitelist: true,
  }),
)
@Controller('schedules')
export class SchedulerController {
  constructor(private schedulerService: SchedulerService) {}

  @Get()
  public async listSchedules(@Schedules() schedules: Schedule[]) {
    return schedules;
  }

  @Get(SCHEDULE_NAME_PARAM_BIND)
  public async getSchedule(
    @Param(SCHEDULE_NAME_PARAM) name: string,
    @User() user: User,
  ) {
    const schedule = await this.schedulerService.getSchedule(user, name);
    return schedule;
  }

  @InjectContextToBody()
  @Post()
  public async addSchedule(
    @Body() { link, name }: CreateScheduleDto,
    @User() user: User,
  ) {
    return this.schedulerService.addSchedule(user, link, name);
  }

  @InjectContextToBody()
  @Put(SCHEDULE_NAME_PARAM_BIND)
  public async toggleSchedule(
    @FindSchedule({
      paramName: SCHEDULE_NAME_PARAM,
      throwIfNotFound: true,
    })
    { schedule }: { schedule: Schedule },
    @Body()
    { enabled }: ToggleScheduleDto,
    @User() user: User,
  ) {
    if (schedule.enabled === enabled) {
      return schedule;
    }
    const newState = enabled ? ScheduleState.ENABLED : ScheduleState.DISABLED;

    await this.schedulerService.changeScheduleState(
      user,
      schedule.name,
      newState,
    );

    schedule.State = newState;
    return schedule;
  }

  @Delete(SCHEDULE_NAME_PARAM_BIND)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteSchedule(
    @FindSchedule({ paramName: SCHEDULE_NAME_PARAM, throwIfNotFound: true })
    schedule: Schedule,
    @User() user: User,
  ) {
    await this.schedulerService.deleteSchedule(schedule.Name, user);
  }
}
